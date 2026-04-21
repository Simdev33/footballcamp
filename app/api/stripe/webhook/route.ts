import { db } from "@/lib/db"
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe"
import { NextResponse } from "next/server"
import type Stripe from "stripe"

export const dynamic = "force-dynamic"
// We need the raw body for signature verification, so disable body parsing
// by always reading request.text() below.
export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET missing")
    return new NextResponse("Webhook not configured.", { status: 500 })
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return new NextResponse("Missing stripe-signature header.", { status: 400 })
  }

  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid signature"
    console.error("[stripe/webhook] Signature verification failed:", message)
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutFailed(session)
        break
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutExpired(session)
        break
      }
      default:
        // Unhandled event types — acknowledge to avoid Stripe retries.
        break
    }
  } catch (err) {
    console.error(`[stripe/webhook] Handler failed for ${event.type}:`, err)
    // Return 500 so Stripe retries.
    return new NextResponse("Handler failure.", { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Only act on paid sessions.
  if (session.payment_status !== "paid") return

  const applicationIds = parseApplicationIds(session)
  if (applicationIds.length === 0) {
    console.warn("[stripe/webhook] checkout.session.completed without applicationIds", session.id)
    return
  }

  const paymentMode = (session.metadata?.paymentMode as "full" | "deposit" | "remainder") || "full"
  const currency = (session.metadata?.currency as "HUF" | "EUR") || "HUF"
  const paidAmountTotal = session.amount_total ?? 0
  // For EUR the amount is in cents — normalize to human-visible EUR so our
  // DB "amount" fields stay in the same unit as Camp.priceEur.
  const paidAmount = currency === "EUR" ? Math.round(paidAmountTotal / 100) : paidAmountTotal

  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null

  const applications = await db.application.findMany({
    where: { id: { in: applicationIds } },
  })
  if (applications.length === 0) return

  // Split the paid amount evenly per application (Stripe doesn't break
  // line-items down by application after checkout; the planned per-app
  // amounts live in totalAmount / depositAmount).
  await db.$transaction(async (tx) => {
    for (const app of applications) {
      const remainderExpected = Math.max(0, app.totalAmount - app.depositAmount)
      const perAppExpected =
        paymentMode === "deposit"
          ? app.depositAmount
          : paymentMode === "remainder"
            ? remainderExpected
            : app.totalAmount
      const already =
        paymentMode === "deposit"
          ? app.depositPaidAmount
          : paymentMode === "remainder"
            ? app.remainderPaidAmount
            : app.depositPaidAmount + app.remainderPaidAmount
      if (already >= perAppExpected && perAppExpected > 0) {
        // Already settled for this mode — skip duplicate webhook delivery.
        continue
      }

      const now = new Date()
      const data: Parameters<typeof tx.application.update>[0]["data"] = {
        stripePaymentIntentId: paymentIntentId,
        stripeCustomerId: customerId,
      }

      if (paymentMode === "full" || !app.isInstallment) {
        data.paymentStatus = "FULLY_PAID"
        data.depositPaidAmount = app.depositAmount || perAppExpected
        data.remainderPaidAmount = Math.max(0, (app.totalAmount || perAppExpected) - (app.depositAmount || 0))
        data.depositPaidAt = app.depositPaidAt ?? now
        data.fullyPaidAt = now
      } else if (paymentMode === "remainder") {
        data.paymentStatus = "FULLY_PAID"
        data.remainderPaidAmount = perAppExpected
        data.fullyPaidAt = now
      } else {
        data.paymentStatus = "DEPOSIT_PAID"
        data.depositPaidAmount = perAppExpected
        data.depositPaidAt = now
      }

      await tx.application.update({ where: { id: app.id }, data })

      await tx.paymentEvent.create({
        data: {
          applicationId: app.id,
          type:
            paymentMode === "deposit"
              ? "deposit_paid"
              : paymentMode === "remainder"
                ? "remainder_paid"
                : "full_paid",
          amount: perAppExpected,
          currency,
          stripeId: session.id,
        },
      })
    }
  })

  void paidAmount // acknowledged via metadata split above
}

async function handleCheckoutFailed(session: Stripe.Checkout.Session) {
  const applicationIds = parseApplicationIds(session)
  if (applicationIds.length === 0) return
  await db.application.updateMany({
    where: { id: { in: applicationIds }, paymentStatus: "PENDING" },
    data: { paymentStatus: "FAILED" },
  })
  for (const id of applicationIds) {
    await db.paymentEvent.create({
      data: { applicationId: id, type: "failed", amount: 0, stripeId: session.id },
    })
  }
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const applicationIds = parseApplicationIds(session)
  if (applicationIds.length === 0) return
  await db.application.updateMany({
    where: { id: { in: applicationIds }, paymentStatus: "PENDING" },
    data: { paymentStatus: "EXPIRED" },
  })
}

function parseApplicationIds(session: Stripe.Checkout.Session): string[] {
  const raw = session.metadata?.applicationIds
  if (!raw) return []
  return raw.split(",").map((s) => s.trim()).filter(Boolean)
}
