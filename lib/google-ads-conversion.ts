"use client"

// Google Ads konverziós címke - töltsd ki miután létrehoztad a konverziót
// Formátum: "AW-18106758812/XXXXXXXXXXX"
export const APPLY_CONVERSION_SEND_TO = "AW-18106758812/fKL9CO6HhqAcEJzt_LlD"

const PENDING_KEY = "kickoff.pending-conversion"

type GtagFn = (...args: unknown[]) => void
type GtagWindow = Window & { gtag?: GtagFn }

export type PendingConversion = {
  email: string
  phone: string
  value?: number
  currency?: string
}

export function storePendingConversion(data: PendingConversion) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizePhone(phone: string) {
  // E.164 format, csak a számjegyek, + előtaggal
  const digits = phone.replace(/[^\d+]/g, "")
  if (digits.startsWith("+")) return digits
  if (digits.startsWith("36")) return "+" + digits
  if (digits.startsWith("06")) return "+36" + digits.slice(2)
  return "+" + digits
}

async function sha256(value: string) {
  if (typeof window === "undefined" || !window.crypto?.subtle) return undefined
  const buf = new TextEncoder().encode(value)
  const hash = await window.crypto.subtle.digest("SHA-256", buf)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function fireApplyConversion() {
  if (typeof window === "undefined") return
  if (!APPLY_CONVERSION_SEND_TO) return

  const w = window as GtagWindow
  if (typeof w.gtag !== "function") return

  let pending: PendingConversion | null = null
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    if (raw) pending = JSON.parse(raw) as PendingConversion
  } catch {
    // ignore
  }

  // Enhanced conversions user data
  if (pending?.email || pending?.phone) {
    const email = pending.email ? await sha256(normalizeEmail(pending.email)) : undefined
    const phone = pending.phone ? await sha256(normalizePhone(pending.phone)) : undefined
    w.gtag("set", "user_data", {
      sha256_email_address: email,
      sha256_phone_number: phone,
    })
  }

  w.gtag("event", "conversion", {
    send_to: APPLY_CONVERSION_SEND_TO,
    value: pending?.value ?? 139000,
    currency: pending?.currency ?? "HUF",
    transaction_id: String(Date.now()),
  })

  try {
    sessionStorage.removeItem(PENDING_KEY)
  } catch {
    // ignore
  }
}

/**
 * Fires a Google Ads purchase conversion with the actual paid amount
 * (e.g. from a Stripe Checkout Session). Safe to call multiple times —
 * guards against double-firing using sessionStorage per transactionId.
 */
export async function firePurchaseConversion(args: {
  value: number
  currency: string
  transactionId: string
}) {
  if (typeof window === "undefined") return
  if (!APPLY_CONVERSION_SEND_TO) return

  const w = window as GtagWindow
  if (typeof w.gtag !== "function") return

  const dedupeKey = `kickoff.fired-conversion:${args.transactionId}`
  try {
    if (sessionStorage.getItem(dedupeKey)) return
    sessionStorage.setItem(dedupeKey, "1")
  } catch {
    // ignore
  }

  let pending: PendingConversion | null = null
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    if (raw) pending = JSON.parse(raw) as PendingConversion
  } catch {
    // ignore
  }

  if (pending?.email || pending?.phone) {
    const email = pending.email ? await sha256(normalizeEmail(pending.email)) : undefined
    const phone = pending.phone ? await sha256(normalizePhone(pending.phone)) : undefined
    w.gtag("set", "user_data", {
      sha256_email_address: email,
      sha256_phone_number: phone,
    })
  }

  w.gtag("event", "conversion", {
    send_to: APPLY_CONVERSION_SEND_TO,
    value: args.value,
    currency: args.currency,
    transaction_id: args.transactionId,
  })

  try {
    sessionStorage.removeItem(PENDING_KEY)
  } catch {
    // ignore
  }
}
