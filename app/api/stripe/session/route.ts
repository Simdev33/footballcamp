import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * Returns lightweight info about a Checkout Session for the success page.
 * The success page uses this to display a receipt summary and to fire the
 * Google Ads purchase conversion with the real paid amount.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")
  if (!sessionId) {
    return new NextResponse("Missing session_id.", { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const currency = (session.metadata?.currency as "HUF" | "EUR") || (session.currency?.toUpperCase() as "HUF" | "EUR") || "HUF"
    const paymentMode = (session.metadata?.paymentMode as "full" | "deposit") || "full"
    const amountTotalRaw = session.amount_total ?? 0
    const amountTotal = currency === "EUR" ? Math.round(amountTotalRaw / 100) : amountTotalRaw

    const applicationIds = (session.metadata?.applicationIds ?? "").split(",").filter(Boolean)
    const applications = applicationIds.length
      ? await db.application.findMany({
          where: { id: { in: applicationIds } },
          select: {
            id: true,
            childName: true,
            paymentStatus: true,
            totalAmount: true,
            depositAmount: true,
            isInstallment: true,
            camp: { select: { city: true, dates: true } },
          },
        })
      : []

    return NextResponse.json({
      status: session.status,
      paymentStatus: session.payment_status,
      currency,
      paymentMode,
      amountTotal,
      customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
      applications,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error."
    return new NextResponse(message, { status: 500 })
  }
}
