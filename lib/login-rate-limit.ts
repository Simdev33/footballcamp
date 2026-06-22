import { createHash } from "crypto"
import { db } from "@/lib/db"

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 8
const LOCK_MS = 30 * 60 * 1000

function hashKey(email: string, ip: string) {
  return createHash("sha256").update(`${email.toLowerCase()}|${ip}`).digest("hex")
}

export async function assertLoginAllowed(email: string, ip: string) {
  const key = hashKey(email, ip)
  const row = await db.loginRateLimit.findUnique({ where: { key } })
  if (!row?.lockedUntil) return

  if (row.lockedUntil.getTime() > Date.now()) {
    const mins = Math.ceil((row.lockedUntil.getTime() - Date.now()) / 60000)
    throw new Error(`locked:${mins}`)
  }

  await db.loginRateLimit.update({
    where: { key },
    data: { failCount: 0, lockedUntil: null, windowStart: new Date() },
  })
}

export async function recordLoginFailure(email: string, ip: string) {
  const key = hashKey(email, ip)
  const now = new Date()
  const row = await db.loginRateLimit.findUnique({ where: { key } })

  if (!row) {
    await db.loginRateLimit.create({
      data: { key, failCount: 1, windowStart: now },
    })
    return
  }

  const windowExpired = now.getTime() - row.windowStart.getTime() > WINDOW_MS
  const failCount = windowExpired ? 1 : row.failCount + 1
  const lockedUntil =
    failCount >= MAX_ATTEMPTS ? new Date(now.getTime() + LOCK_MS) : null

  await db.loginRateLimit.upsert({
    where: { key },
    create: { key, failCount, windowStart: now, lockedUntil },
    update: {
      failCount,
      windowStart: windowExpired ? now : row.windowStart,
      lockedUntil,
    },
  })
}

export async function clearLoginFailures(email: string, ip: string) {
  const key = hashKey(email, ip)
  await db.loginRateLimit.deleteMany({ where: { key } })
}
