import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { pickEffectivePrice, splitInstallment, toStripeUnitAmount } from "@/lib/pricing"
import { NextResponse } from "next/server"

type CreateParams = Parameters<typeof stripe.checkout.sessions.create>[0] & object
type LineItem = NonNullable<CreateParams["line_items"]>[number]
type PaymentMethodType = NonNullable<CreateParams["payment_method_types"]>[number]

export const dynamic = "force-dynamic"

type PaymentMode = "full" | "deposit"

interface CreateCheckoutBody {
  applicationIds?: string[]
  paymentMode?: PaymentMode
}

export async function POST(request: Request) {
  let body: CreateCheckoutBody
  try {
    body = await request.json()
  } catch {
    return new NextResponse("Érvénytelen kérés.", { status: 400 })
  }

  const { applicationIds, paymentMode } = body
  const currency = "HUF" as const
  if (!applicationIds?.length) {
    return new NextResponse("Hiányzó applicationIds.", { status: 400 })
  }
  if (paymentMode !== "full" && paymentMode !== "deposit") {
    return new NextResponse("Érvénytelen fizetési mód.", { status: 400 })
  }

  const applications = await db.application.findMany({
    where: { id: { in: applicationIds } },
    include: { camp: true },
  })

  if (applications.length === 0 || applications.length !== applicationIds.length) {
    return new NextResponse("Jelentkezés nem található.", { status: 404 })
  }

  // Build Stripe line items — one per application (= per child per camp).
  const lineItems: LineItem[] = []
  let totalDue = 0
  const updates: { id: string; total: number; deposit: number }[] = []

  for (const app of applications) {
    const effective = pickEffectivePrice(app.camp, currency)
    if (effective.amount <= 0) {
      return new NextResponse(
        `A(z) "${app.camp.city}" táborhoz nincs ${currency} ár beállítva.`,
        { status: 400 },
      )
    }

    const { deposit } = splitInstallment(effective.amount, app.camp.depositPercent)
    const amountForThisChild = paymentMode === "full" ? effective.amount : deposit

    updates.push({ id: app.id, total: effective.amount, deposit })
    totalDue += amountForThisChild

    const descriptor = paymentMode === "deposit"
      ? `Elso reszlet - ${app.camp.city} - ${app.childName}`
      : `Tabor - ${app.camp.city} - ${app.childName}`

    lineItems.push({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: descriptor,
          description: `${app.camp.venue} • ${app.camp.dates}`,
        },
        unit_amount: toStripeUnitAmount(amountForThisChild, currency),
      },
      quantity: 1,
    })
  }

  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://kickoffcamps.hu"

  // "card" automatically enables Apple Pay & Google Pay on supported devices.
  // SEPA Direct Debit only works in EUR, so we skip it (we charge in HUF).
  // LinkPay is NOT enabled — we only want card + wallets.
  const paymentMethodTypes: PaymentMethodType[] = ["card"]

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      customer_email: applications[0].parentEmail,
      locale: "hu",
      success_url: `${origin}/jelentkezes/sikeres?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/jelentkezes?canceled=true`,
      allow_promotion_codes: false,
      metadata: {
        applicationIds: applicationIds.join(","),
        paymentMode,
        currency,
      },
      payment_intent_data: {
        metadata: {
          applicationIds: applicationIds.join(","),
          paymentMode,
          currency,
        },
      },
    })

    // Persist the planned amounts + Stripe session on each application.
    await db.$transaction(
      applications.map((app) => {
        const u = updates.find((x) => x.id === app.id)!
        return db.application.update({
          where: { id: app.id },
          data: {
            currency,
            totalAmount: u.total,
            depositAmount: u.deposit,
            isInstallment: paymentMode === "deposit",
            stripeCheckoutSessionId: session.id,
          },
        })
      }),
    )

    return NextResponse.json({ url: session.url, sessionId: session.id, totalDue })
  } catch (err: unknown) {
    console.error("[stripe/create-checkout] Failed:", err)
    const message = err instanceof Error ? err.message : "Stripe hiba."
    return new NextResponse(message, { status: 500 })
  }
}
