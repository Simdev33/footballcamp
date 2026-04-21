/**
 * Pricing helpers for camps.
 *
 * A camp has a regular price and an early-bird price, each in HUF and EUR.
 * The effective price depends on whether today is before the camp's
 * `earlyBirdUntil` cut-off date.
 */

export type Currency = "HUF" | "EUR"

export type CampPriceFields = {
  priceHuf: number
  priceEur: number
  earlyBirdPriceHuf: number
  earlyBirdPriceEur: number
  earlyBirdUntil: Date | string | null
  depositPercent: number
}

/**
 * Returns true if today is on/before the early-bird cut-off date.
 * If `earlyBirdUntil` is null, early bird is considered always-on
 * (pre-migration behaviour, can be tightened later per camp).
 */
export function isEarlyBirdActive(earlyBirdUntil: Date | string | null, now: Date = new Date()): boolean {
  if (!earlyBirdUntil) return true
  const cutoff = typeof earlyBirdUntil === "string" ? new Date(earlyBirdUntil) : earlyBirdUntil
  // Include the whole cut-off day
  const endOfDay = new Date(cutoff)
  endOfDay.setHours(23, 59, 59, 999)
  return now <= endOfDay
}

/**
 * Picks the effective price (in minor-amount-agnostic integer units — for HUF
 * that's just forints, for EUR cents we handle separately on the Stripe side).
 * Returns both the effective amount and whether early bird was applied.
 */
export function pickEffectivePrice(
  camp: CampPriceFields,
  currency: Currency,
  now: Date = new Date(),
): { amount: number; earlyBird: boolean; regular: number; earlyBirdAmount: number } {
  const regular = currency === "HUF" ? camp.priceHuf : camp.priceEur
  const earlyBirdAmount = currency === "HUF" ? camp.earlyBirdPriceHuf : camp.earlyBirdPriceEur

  const eb = isEarlyBirdActive(camp.earlyBirdUntil)
  const hasEb = earlyBirdAmount > 0 && eb
  const amount = hasEb ? earlyBirdAmount : regular

  return { amount, earlyBird: hasEb, regular, earlyBirdAmount }
  void now
}

/**
 * Computes deposit / remainder split for an installment payment.
 * Depositpercent is an integer 1-99 stored on the Camp.
 */
export function splitInstallment(total: number, depositPercent: number): { deposit: number; remainder: number } {
  const pct = Math.max(1, Math.min(99, depositPercent || 40))
  const deposit = Math.round((total * pct) / 100)
  const remainder = total - deposit
  return { deposit, remainder }
}

/**
 * Human-readable price formatter. HUF uses thousands separator + "Ft",
 * EUR uses euro sign prefix.
 */
export function formatPrice(amount: number, currency: Currency): string {
  if (!amount || amount <= 0) return ""
  if (currency === "HUF") {
    return `${amount.toLocaleString("hu-HU")} Ft`
  }
  return `€${amount.toLocaleString("hu-HU")}`
}

/**
 * Converts a price to the Stripe unit amount.
 *
 * Stripe's "special case" currencies (HUF, TWD, UGX) are internally treated as
 * two-decimal, but only whole-unit amounts are accepted — we must multiply by
 * 100 AND the result must be a multiple of 100 (no fractional forints).
 * EUR is a regular two-decimal currency, so cents = amount * 100.
 *
 * See: https://docs.stripe.com/currencies#special-cases
 */
export function toStripeUnitAmount(amount: number, currency: Currency): number {
  if (currency === "HUF") {
    // Round to whole forints first, then scale to the two-decimal representation.
    return Math.round(amount) * 100
  }
  // EUR (and any other normal two-decimal currency)
  return Math.round(amount * 100)
}
