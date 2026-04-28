import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")

  if (!token) {
    return htmlResponse("Hiányzó leiratkozási azonosító.", 400)
  }

  const subscriber = await db.newsletterSubscriber.findUnique({
    where: { unsubscribeToken: token },
    select: { id: true, email: true, status: true },
  })

  if (!subscriber) {
    return htmlResponse("Nem található ilyen leiratkozási link.", 404)
  }

  if (subscriber.status !== "unsubscribed") {
    await db.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "unsubscribed",
        unsubscribedAt: new Date(),
      },
    })
  }

  return htmlResponse(`Sikeresen leiratkoztattuk ezt az e-mail címet: ${escapeHtml(subscriber.email)}`)
}

function htmlResponse(message: string, status = 200) {
  return new NextResponse(
    `<!doctype html>
<html lang="hu">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hírlevél leiratkozás</title>
</head>
<body style="margin:0;background:#faf7f0;color:#1a1a1a;font-family:Arial,sans-serif;">
  <main style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">
    <section style="max-width:520px;background:white;border:1px solid #e8e4d9;border-radius:18px;padding:32px;box-shadow:0 10px 30px rgba(10,31,10,.08);">
      <p style="margin:0 0 8px;color:#b8860b;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:12px;">KickOff Camps</p>
      <h1 style="margin:0 0 14px;color:#0a1f0a;font-family:Georgia,serif;">Hírlevél leiratkozás</h1>
      <p style="margin:0 0 22px;line-height:1.6;">${message}</p>
      <a href="/" style="display:inline-block;background:#d4a017;color:#0a1f0a;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px;">Vissza a weboldalra</a>
    </section>
  </main>
</body>
</html>`,
    {
      status,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    },
  )
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
