"use client"

/**
 * Meta (Facebook) Pixel helpers.
 *
 * The pixel script is injected from `app/layout.tsx` with an initial
 * `fbq('consent', 'revoke')` so no tracking happens before the visitor
 * opts in to marketing cookies. The cookie banner calls `grantPixelConsent()`
 * / `revokePixelConsent()` to toggle tracking.
 */

export const META_PIXEL_ID = "804886405638081"

const LEAD_DEDUPE_KEY = "kickoff.fbq-lead-fired"
const PURCHASE_DEDUPE_PREFIX = "kickoff.fbq-purchase-fired:"

type FbqFn = (...args: unknown[]) => void
type FbqWindow = Window & { fbq?: FbqFn }

function getFbq(): FbqFn | null {
  if (typeof window === "undefined") return null
  const fn = (window as FbqWindow).fbq
  return typeof fn === "function" ? fn : null
}

export function grantPixelConsent() {
  getFbq()?.("consent", "grant")
}

export function revokePixelConsent() {
  getFbq()?.("consent", "revoke")
}

/**
 * Fires a Meta Pixel "Lead" event for the current visitor. Called when
 * the parent successfully submits the registration form. Safe to call
 * multiple times — self-dedupes using sessionStorage.
 */
export function fireLeadEvent(args?: { value?: number; currency?: string }) {
  const fbq = getFbq()
  if (!fbq) return
  try {
    if (sessionStorage.getItem(LEAD_DEDUPE_KEY)) return
    sessionStorage.setItem(LEAD_DEDUPE_KEY, "1")
  } catch {
    // storage may be blocked — still fire the event
  }
  const payload: Record<string, unknown> = {}
  if (args?.value !== undefined) payload.value = args.value
  if (args?.currency) payload.currency = args.currency
  fbq("track", "Lead", payload)
}

/**
 * Fires a Meta Pixel "Purchase" event with the paid amount. Dedupes
 * per Stripe session id.
 */
export function firePurchaseEvent(args: {
  value: number
  currency: string
  transactionId: string
}) {
  const fbq = getFbq()
  if (!fbq) return
  const dedupeKey = `${PURCHASE_DEDUPE_PREFIX}${args.transactionId}`
  try {
    if (sessionStorage.getItem(dedupeKey)) return
    sessionStorage.setItem(dedupeKey, "1")
  } catch {
    // ignore
  }
  fbq("track", "Purchase", {
    value: args.value,
    currency: args.currency,
    eventID: args.transactionId,
  })
}
