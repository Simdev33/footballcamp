import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { pickEffectivePrice } from "@/lib/pricing"

export const dynamic = "force-dynamic"

export async function GET() {
  const camps = await db.camp.findMany({
    where: { active: true, remainingSpots: { gt: 0 } },
    select: {
      id: true,
      slug: true,
      city: true,
      venue: true,
      dates: true,
      priceHuf: true,
      priceEur: true,
      earlyBirdPriceHuf: true,
      earlyBirdPriceEur: true,
      earlyBirdUntil: true,
      depositPercent: true,
      earlyBirdPrice: true, // legacy string, kept for backward-compat
      remainingSpots: true,
    },
    orderBy: { createdAt: "asc" },
  })

  const enriched = camps.map((c) => {
    const huf = pickEffectivePrice(c, "HUF")
    const eur = pickEffectivePrice(c, "EUR")
    return {
      ...c,
      effectiveHuf: huf.amount,
      effectiveEur: eur.amount,
      earlyBirdActiveHuf: huf.earlyBird,
      earlyBirdActiveEur: eur.earlyBird,
    }
  })

  return NextResponse.json(enriched)
}
