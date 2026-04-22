import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Cron entry point: finds deposit-paid applications whose camp starts in the
 * next ~30 days and that haven't been reminded yet, then generates+sends a
 * remainder Stripe checkout link for each. The Stripe session itself is valid
 * for 14 days (see /api/stripe/remainder), so parents get the mail 30 days
 * before camp start and have 2 weeks to pay.
 *
 * Vercel cron calls this with a Bearer token (CRON_SECRET) header.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return new NextResponse("CRON_SECRET not configured.", { status: 500 })
  }

  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  const vercelCron = request.headers.get("x-vercel-cron") === "1"
  if (bearer !== cronSecret && !vercelCron) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const now = new Date()
  const in30Days = new Date(now.getTime() + 30 * 24 * 3600 * 1000)

  const candidates = await db.application.findMany({
    where: {
      isInstallment: true,
      paymentStatus: "DEPOSIT_PAID",
      remainderReminderSentAt: null,
      camp: {
        startDate: {
          not: null,
          gte: now,
          lte: in30Days,
        },
      },
    },
    include: { camp: true },
  })

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://kickoffcamps.hu"

  const results: Array<{ id: string; ok: boolean; emailed?: boolean; error?: string }> = []
  for (const app of candidates) {
    try {
      const res = await fetch(`${origin}/api/stripe/remainder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cronSecret}`,
        },
        body: JSON.stringify({ applicationId: app.id, send: true }),
      })
      if (!res.ok) {
        results.push({ id: app.id, ok: false, error: await res.text() })
      } else {
        const data = (await res.json()) as { emailed: boolean; emailError?: string }
        results.push({ id: app.id, ok: true, emailed: data.emailed, error: data.emailError })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      results.push({ id: app.id, ok: false, error: message })
    }
  }

  return NextResponse.json({ processed: candidates.length, results })
}
