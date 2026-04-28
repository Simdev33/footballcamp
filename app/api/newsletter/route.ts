import { db } from "@/lib/db"
import { NextResponse } from "next/server"

type NewsletterPayload = {
  email?: string
  name?: string
  locale?: string
  source?: string
  website?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let payload: NewsletterPayload

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ message: "Érvénytelen kérés." }, { status: 400 })
  }

  if (payload.website) {
    return NextResponse.json({ ok: true })
  }

  const email = payload.email?.trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ message: "Adj meg egy érvényes e-mail címet." }, { status: 400 })
  }

  const locale = payload.locale === "en" ? "en" : "hu"
  const consentText =
    locale === "en"
      ? "I consent to receiving newsletters from Kickoff Elite Football Camps."
      : "Hozzájárulok, hogy a Kickoff Elite Football Camps hírlevelet küldjön nekem."

  try {
    await db.newsletterSubscriber.upsert({
      where: { email },
      create: {
        email,
        name: payload.name?.trim() || "",
        locale,
        source: payload.source?.trim() || "footer",
        status: "active",
        consentText,
      },
      update: {
        name: payload.name?.trim() || undefined,
        locale,
        source: payload.source?.trim() || "footer",
        status: "active",
        consentText,
        subscribedAt: new Date(),
        unsubscribedAt: null,
      },
    })
  } catch (err) {
    console.error("[newsletter] subscription failed:", err)
    return NextResponse.json({ message: "A feliratkozás most nem sikerült." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
