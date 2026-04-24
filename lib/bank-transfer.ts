import { db } from "@/lib/db"

/**
 * Bank transfer configuration for Tireksz Nonprofit Kft.
 * Shown to parents who pick "átutalás" as their payment method.
 */
export const BANK_DETAILS = {
  accountHolder: "Tireksz Nonprofit Kft.",
  bankName: "CIB Bank",
  accountNumber: "10700158-74439876-51100005",
  // IBAN is derivable from the Hungarian account number. Kept here for
  // EUR / international payers.
  iban: "HU77 1070 0158 7443 9876 5110 0005",
  swift: "CIBHHUHB",
} as const

/**
 * Character set used for transfer references. Avoids visually ambiguous
 * characters (0/O, 1/I, etc.) so parents don't mistype them on a bank
 * statement screen.
 */
const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
const REF_PREFIX = "KO-"
const REF_BODY_LENGTH = 6

function randomCode(): string {
  let out = ""
  for (let i = 0; i < REF_BODY_LENGTH; i += 1) {
    out += REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)]
  }
  return `${REF_PREFIX}${out}`
}

/**
 * Generates a unique transfer reference code (e.g. "KO-7H3KPQ"). Retries
 * a small number of times to avoid collisions — with 32^6 combinations
 * conflicts should be extremely rare.
 */
export async function generateTransferReference(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = randomCode()
    const existing = await db.application.findFirst({
      where: { transferReference: candidate },
      select: { id: true },
    })
    if (!existing) return candidate
  }
  // Fallback — should never happen in practice.
  return `${REF_PREFIX}${Date.now().toString(36).toUpperCase()}`
}

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Computes a reasonable payment deadline for an initial bank transfer.
 * Policy: within 7 days of submission, but always at least 15 days
 * before the camp starts (per ÁSZF §4.6). If the camp is too close we
 * fall back to 3 days, which still gives the admin time to reconcile.
 */
export function computeTransferDeadline(
  campStart: Date | null | undefined,
  submittedAt: Date = new Date(),
): Date {
  const sevenDays = new Date(submittedAt.getTime() + 7 * DAY_MS)
  if (!campStart) return sevenDays
  const fifteenBeforeCamp = new Date(campStart.getTime() - 15 * DAY_MS)
  const deadline = fifteenBeforeCamp < sevenDays ? fifteenBeforeCamp : sevenDays
  const minDeadline = new Date(submittedAt.getTime() + 3 * DAY_MS)
  return deadline < minDeadline ? minDeadline : deadline
}

export function formatDeadline(d: Date, locale: "hu" | "en" = "hu"): string {
  return d.toLocaleDateString(locale === "hu" ? "hu-HU" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
