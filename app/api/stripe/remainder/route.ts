import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { toStripeUnitAmount } from "@/lib/pricing"
import { sendEmail, renderRemainderEmail } from "@/lib/email"
import { NextResponse } from "next/server"
import { formatPrice } from "@/lib/pricing"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type Body = {
  applicationId?: string
  send?: boolean
}

/**
 * Generates a Stripe Checkout Session for the remaining amount on an
 * installment application and (optionally) emails the link to the parent.
 * Returns { url, emailed } so the admin UI can copy/forward the link too.
 */
export async function POST(request: Request) {
  const auth = await authorize(request)
  if (!auth.ok) return auth.response

  let body: Body
  try {
    body = await request.json()
  } catch {
    return new NextResponse("Érvénytelen kérés.", { status: 400 })
  }

  if (!body.applicationId) {
    return new NextResponse("Hiányzó applicationId.", { status: 400 })
  }

  const app = await db.application.findUnique({
    where: { id: body.applicationId },
    include: { camp: true },
  })

  if (!app) return new NextResponse("Jelentkezés nem található.", { status: 404 })
  if (!app.isInstallment) return new NextResponse("Ez a jelentkezés nem részletfizetéses.", { status: 400 })
  if (app.paymentStatus === "FULLY_PAID") return new NextResponse("Már ki van fizetve.", { status: 400 })

  const currency = (app.currency as "HUF" | "EUR") || "HUF"
  const remainder = Math.max(0, app.totalAmount - app.depositPaidAmount)
  if (remainder <= 0) return new NextResponse("Nincs hátralévő összeg.", { status: 400 })

  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://kickoffcamps.hu"

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: currency === "EUR" ? ["card", "sepa_debit"] : ["card"],
    customer_email: app.parentEmail,
    locale: "hu",
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Hátralévő összeg - ${app.camp.city} - ${app.childName}`,
            description: `${app.camp.venue} • ${app.camp.dates}`,
          },
          unit_amount: toStripeUnitAmount(remainder, currency),
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/jelentkezes/sikeres?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/`,
    metadata: {
      applicationIds: app.id,
      paymentMode: "remainder",
      currency,
    },
    payment_intent_data: {
      metadata: {
        applicationIds: app.id,
        paymentMode: "remainder",
        currency,
      },
    },
  })

  await db.application.update({
    where: { id: app.id },
    data: {
      stripeRemainderPaymentLinkId: session.id,
      stripeRemainderPaymentLinkUrl: session.url,
    },
  })

  await db.paymentEvent.create({
    data: {
      applicationId: app.id,
      type: "link_sent",
      amount: remainder,
      currency,
      stripeId: session.id,
      note: "Hátralévő fizetési link létrehozva",
    },
  })

  let emailed = false
  let emailError: string | undefined

  if (body.send !== false && session.url) {
    const { subject, html } = renderRemainderEmail({
      parentName: app.parentName,
      childName: app.childName,
      campCity: app.camp.city,
      campDates: app.camp.dates,
      amount: formatPrice(remainder, currency),
      paymentUrl: session.url,
    })
    const result = await sendEmail({
      to: app.parentEmail,
      subject,
      html,
      replyTo: "info@kickoffcamps.hu",
    })
    emailed = result.sent
    emailError = result.error

    if (result.sent) {
      await db.application.update({
        where: { id: app.id },
        data: { remainderReminderSentAt: new Date() },
      })
    }
  }

  return NextResponse.json({
    url: session.url,
    sessionId: session.id,
    emailed,
    emailError,
    amount: remainder,
    currency,
  })
}

async function authorize(request: Request): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  // Admin cookie session (NextAuth) or Bearer token for cron usage.
  const cronSecret = process.env.CRON_SECRET
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (cronSecret && bearer && bearer === cronSecret) return { ok: true }

  // Fall back to NextAuth session check.
  try {
    const { auth } = await import("@/lib/auth")
    const session = await auth()
    if (session?.user) return { ok: true }
  } catch {
    // auth module not available — reject
  }

  return { ok: false, response: new NextResponse("Unauthorized", { status: 401 }) }
}
