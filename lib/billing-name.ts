const BILLING_NAME_PREFIX = "Számlázási név:"

export function billingNameNoteLine(name: string): string {
  return `${BILLING_NAME_PREFIX} ${name.trim()}`
}

export function extractBillingName(notes: string | null | undefined, fallback: string): string {
  const line = (notes || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .find((item) => item.startsWith(BILLING_NAME_PREFIX))

  const value = line?.slice(BILLING_NAME_PREFIX.length).trim()
  return value || fallback
}
