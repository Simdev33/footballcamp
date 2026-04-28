import type Stripe from "stripe"
import { db } from "@/lib/db"
import { formatPrice, type Currency } from "@/lib/pricing"
import { sendEmail, renderDepositPaidEmail, renderFullyPaidEmail } from "@/lib/email"
import { createInvoiceForApplicationPayment, type InvoiceKind } from "@/lib/szamlazz"
import { extractBillingName } from "@/lib/billing-name"
import { INVOICE_GENERATION_ENABLED } from "@/lib/invoice-toggle"

export async function processPaidCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return { processed: 0 }

  const applicationIds = parseApplicationIds(session)
  if (applicationIds.length === 0) {
    console.warn("[stripe/sync] paid checkout session without applicationIds", session.id)
    return { processed: 0 }
  }

  const paymentMode = (session.metadata?.paymentMode as "earlyBirdFull" | "regularDeposit" | "regularFull" | "full" | "deposit" | "remainder") || "earlyBirdFull"
  const isDepositPayment = paymentMode === "regularDeposit" || paymentMode === "deposit"
  const isFullPayment = paymentMode !== "remainder" && !isDepositPayment
  const currency = (session.metadata?.currency as "HUF" | "EUR") || "HUF"

  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null

  const applications = await db.application.findMany({
    where: { id: { in: applicationIds } },
    include: { camp: true },
  })
  if (applications.length === 0) return { processed: 0 }

  const newlyDepositPaid: typeof applications = []
  const newlyFullyPaid: typeof applications = []
  const invoiceTargets: {
    app: AppWithCamp
    paymentEventId: string
    amount: number
    kind: InvoiceKind
  }[] = []

  await db.$transaction(async (tx) => {
    for (const app of applications) {
      const remainderExpected = Math.max(0, app.totalAmount - app.depositAmount)
      const perAppExpected =
        isDepositPayment
          ? app.depositAmount
          : paymentMode === "remainder"
            ? remainderExpected
            : app.totalAmount
      const already =
        isDepositPayment
          ? app.depositPaidAmount
          : paymentMode === "remainder"
            ? app.remainderPaidAmount
            : app.depositPaidAmount + app.remainderPaidAmount

      if (already >= perAppExpected && perAppExpected > 0) continue

      const now = new Date()
      const data: Parameters<typeof tx.application.update>[0]["data"] = {
        stripePaymentIntentId: paymentIntentId,
        stripeCustomerId: customerId,
      }

      if (isFullPayment || !app.isInstallment) {
        data.paymentStatus = "FULLY_PAID"
        data.depositPaidAmount = app.depositAmount || perAppExpected
        data.remainderPaidAmount = Math.max(0, (app.totalAmount || perAppExpected) - (app.depositAmount || 0))
        data.depositPaidAt = app.depositPaidAt ?? now
        data.fullyPaidAt = now
        newlyFullyPaid.push(app)
      } else if (paymentMode === "remainder") {
        data.paymentStatus = "FULLY_PAID"
        data.remainderPaidAmount = perAppExpected
        data.fullyPaidAt = now
        newlyFullyPaid.push(app)
      } else {
        data.paymentStatus = "DEPOSIT_PAID"
        data.depositPaidAmount = perAppExpected
        data.depositPaidAt = now
        newlyDepositPaid.push(app)
      }

      await tx.application.update({ where: { id: app.id }, data })

      const invoiceKind: InvoiceKind =
        isDepositPayment ? "deposit" : paymentMode === "remainder" ? "remainder" : "full"

      const createdEvent = await tx.paymentEvent.create({
        data: {
          applicationId: app.id,
          type:
            isDepositPayment
              ? "deposit_paid"
              : paymentMode === "remainder"
                ? "remainder_paid"
                : "full_paid",
          amount: perAppExpected,
          currency,
          stripeId: session.id,
        },
        select: { id: true },
      })

      invoiceTargets.push({
        app,
        paymentEventId: createdEvent.id,
        amount: perAppExpected,
        kind: invoiceKind,
      })
    }
  })

  await Promise.all([
    ...newlyDepositPaid.map((app) => sendDepositPaidEmail(app, currency)),
    ...newlyFullyPaid.map((app) => sendFullyPaidEmail(app, currency)),
    ...invoiceTargets.map((target) => issueInvoice(target, currency)),
  ])

  return { processed: invoiceTargets.length }
}

async function issueInvoice(
  target: { app: AppWithCamp; paymentEventId: string; amount: number; kind: InvoiceKind },
  currency: Currency,
) {
  if (!INVOICE_GENERATION_ENABLED) {
    console.info("[stripe/sync] Invoice generation temporarily disabled; skipping Szamlazz.hu invoice.")
    return
  }

  try {
    const { app } = target
    const result = await createInvoiceForApplicationPayment({
      kind: target.kind,
      amount: target.amount,
      currency,
      parent: {
        name: extractBillingName(app.notes, app.parentName),
        email: app.parentEmail,
        postalCode: app.parentPostalCode,
        city: app.parentCity,
        address: app.parentAddress,
        taxNumber: app.parentTaxNumber,
      },
      child: { name: app.childName },
      camp: {
        city: app.camp.city,
        venue: app.camp.venue,
        dates: formatCampDates(app.camp),
      },
    })

    if (!result) {
      console.warn("[stripe/sync] Számlázz.hu invoice was not generated for application", app.id)
      return
    }

    await db.paymentEvent.update({
      where: { id: target.paymentEventId },
      data: {
        invoiceNumber: result.invoiceNumber,
        invoiceUrl: result.downloadUrl,
      },
    })
  } catch (err) {
    console.error("[stripe/sync] Invoice creation failed:", err)
  }
}

type AppWithCamp = Awaited<ReturnType<typeof db.application.findMany<{ include: { camp: true } }>>>[number]

function formatCampDates(camp: AppWithCamp["camp"]): string {
  const raw = camp.dates
  if (typeof raw === "string" && raw.length > 0) return raw
  if (raw && typeof raw === "object" && "hu" in raw && typeof (raw as { hu?: unknown }).hu === "string") {
    return (raw as { hu: string }).hu
  }
  return ""
}

async function sendDepositPaidEmail(app: AppWithCamp, currency: Currency) {
  try {
    const remainder = Math.max(0, app.totalAmount - app.depositAmount)
    const { subject, html } = renderDepositPaidEmail({
      parentName: app.parentName,
      childName: app.childName,
      campCity: app.camp.city,
      campDates: formatCampDates(app.camp),
      depositAmount: formatPrice(app.depositAmount, currency),
      remainderAmount: formatPrice(remainder, currency),
      totalAmount: formatPrice(app.totalAmount, currency),
    })
    const res = await sendEmail({ to: app.parentEmail, subject, html })
    if (!res.sent) console.warn("[stripe/sync] deposit email not sent:", res.error)
  } catch (err) {
    console.warn("[stripe/sync] deposit email error:", err)
  }
}

async function sendFullyPaidEmail(app: AppWithCamp, currency: Currency) {
  try {
    const { subject, html } = renderFullyPaidEmail({
      parentName: app.parentName,
      childName: app.childName,
      campCity: app.camp.city,
      campDates: formatCampDates(app.camp),
      totalAmount: formatPrice(app.totalAmount, currency),
    })
    const res = await sendEmail({ to: app.parentEmail, subject, html })
    if (!res.sent) console.warn("[stripe/sync] fully paid email not sent:", res.error)
  } catch (err) {
    console.warn("[stripe/sync] fully paid email error:", err)
  }
}

function parseApplicationIds(session: Stripe.Checkout.Session): string[] {
  const raw = session.metadata?.applicationIds
  if (!raw) return []
  return raw.split(",").map((s) => s.trim()).filter(Boolean)
}
