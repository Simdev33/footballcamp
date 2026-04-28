import { renderNewsletterEmail, sendEmail } from "@/lib/email"
import { db } from "@/lib/db"
import {
  ensureNewsletterTemplates,
  getBudapestDateKey,
  getBudapestNewsletterSlot,
  isNewsletterSlot,
} from "@/lib/newsletter"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

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

  await ensureNewsletterTemplates()

  const url = new URL(request.url)
  const requestedSlot = url.searchParams.get("slot")
  const slot = isNewsletterSlot(requestedSlot) ? requestedSlot : getBudapestNewsletterSlot()

  if (!slot) {
    return NextResponse.json({ skipped: true, reason: "Not a configured Budapest newsletter hour." })
  }

  const sentDate = getBudapestDateKey()
  const template = await db.newsletterTemplate.findUnique({ where: { slot } })

  if (!template || !template.enabled) {
    return NextResponse.json({ skipped: true, reason: "Newsletter template is disabled or missing.", slot })
  }

  const subscribers = await db.newsletterSubscriber.findMany({
    where: { status: "active" },
    orderBy: { subscribedAt: "asc" },
    select: {
      id: true,
      email: true,
      unsubscribeToken: true,
    },
  })

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://kickoffcamps.hu"
  const results: Array<{ email: string; status: "sent" | "failed" | "skipped"; error?: string }> = []

  for (const subscriber of subscribers) {
    let deliveryId: string | null = null

    try {
      const delivery = await db.newsletterDelivery.create({
        data: {
          subscriberId: subscriber.id,
          templateId: template.id,
          slot,
          sentDate,
          email: subscriber.email,
          status: "pending",
        },
        select: { id: true },
      })
      deliveryId = delivery.id
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        results.push({ email: subscriber.email, status: "skipped", error: "Already processed for this slot today." })
        continue
      }
      throw err
    }

    const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribeToken)}`
    const email = renderNewsletterEmail({
      subject: template.subject,
      previewText: template.previewText,
      body: template.body,
      slotLabel: template.label,
      recipientEmail: subscriber.email,
      unsubscribeUrl,
    })

    const sent = await sendEmail({
      to: subscriber.email,
      subject: email.subject,
      html: email.html,
    })

    if (sent.sent) {
      await db.newsletterDelivery.update({
        where: { id: deliveryId },
        data: {
          status: "sent",
          providerId: sent.id,
          sentAt: new Date(),
        },
      })
      results.push({ email: subscriber.email, status: "sent" })
    } else {
      await db.newsletterDelivery.update({
        where: { id: deliveryId },
        data: {
          status: "failed",
          error: sent.error || "Unknown email send failure",
        },
      })
      results.push({ email: subscriber.email, status: "failed", error: sent.error })
    }
  }

  return NextResponse.json({
    slot,
    sentDate,
    subscribers: subscribers.length,
    sent: results.filter((result) => result.status === "sent").length,
    failed: results.filter((result) => result.status === "failed").length,
    skipped: results.filter((result) => result.status === "skipped").length,
    results,
  })
}

function isUniqueConstraintError(err: unknown) {
  return typeof err === "object" && err !== null && "code" in err && err.code === "P2002"
}
