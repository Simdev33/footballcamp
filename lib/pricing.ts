/**
 * Pricing helpers for camps.
 */

export type Currency = "HUF" | "EUR"

export type CampPriceFields = {
  priceHuf: number
  priceEur: number
  // Legacy DB field name: this stores the fixed first-instalment amount.
  depositPercent: number
}

/**
 * Picks the effective price (in minor-amount-agnostic integer units — for HUF
 * that's just forints, for EUR cents we handle separately on the Stripe side).
 */
export function pickEffectivePrice(
  camp: CampPriceFields,
  currency: Currency,
): { amount: number; regular: number } {
  const regular = currency === "HUF" ? camp.priceHuf : camp.priceEur

  return { amount: regular, regular }
}

/**
 * Computes deposit / remainder split for an installment payment.
 * `depositValue` is a fixed amount in the camp currency.
 */
export function splitInstallment(total: number, depositValue: number): { deposit: number; remainder: number } {
  const normalizedTotal = Math.max(0, Math.round(total || 0))
  const fixedDeposit = Math.max(0, Math.round(depositValue || 0))
  const deposit = Math.min(normalizedTotal, fixedDeposit)
  const remainder = normalizedTotal - deposit
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
