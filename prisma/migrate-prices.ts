/**
 * One-off migration: parse legacy string prices (e.g. "139.000 Ft") into
 * the new numeric HUF/EUR columns on Camp. Safe to run multiple times —
 * only overwrites when the new columns are still 0.
 *
 * Run with: npx tsx prisma/migrate-prices.ts
 */

import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

function parseHuf(raw: string | null | undefined): number {
  if (!raw) return 0
  // Drop everything except digits — "139.000 Ft" → "139000", "139 000 Ft" → "139000"
  const digits = raw.replace(/[^\d]/g, "")
  return digits ? parseInt(digits, 10) : 0
}

function parseEur(raw: string | null | undefined): number {
  if (!raw) return 0
  // Detect EUR (€ sign or "EUR"/"eur") first
  if (/€|eur/i.test(raw)) {
    const digits = raw.replace(/[^\d]/g, "")
    return digits ? parseInt(digits, 10) : 0
  }
  return 0
}

async function main() {
  const camps = await db.camp.findMany()

  let updated = 0
  for (const camp of camps) {
    const huf = camp.priceHuf > 0 ? camp.priceHuf : parseHuf(camp.price)
    const ebHuf = camp.earlyBirdPriceHuf > 0 ? camp.earlyBirdPriceHuf : parseHuf(camp.earlyBirdPrice)
    const eur = camp.priceEur > 0 ? camp.priceEur : parseEur(camp.price)
    const ebEur = camp.earlyBirdPriceEur > 0 ? camp.earlyBirdPriceEur : parseEur(camp.earlyBirdPrice)

    if (huf === camp.priceHuf && ebHuf === camp.earlyBirdPriceHuf && eur === camp.priceEur && ebEur === camp.earlyBirdPriceEur) {
      continue
    }

    await db.camp.update({
      where: { id: camp.id },
      data: {
        priceHuf: huf,
        priceEur: eur,
        earlyBirdPriceHuf: ebHuf,
        earlyBirdPriceEur: ebEur,
      },
    })

    console.log(`[migrate-prices] ${camp.city} (${camp.id}) — HUF: ${huf} (eb ${ebHuf}), EUR: ${eur} (eb ${ebEur})`)
    updated++
  }

  console.log(`[migrate-prices] Done. Updated ${updated}/${camps.length} camps.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
