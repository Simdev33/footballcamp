import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { pickEffectivePrice, formatPrice } from "@/lib/pricing"

export const dynamic = "force-dynamic"

export async function GET() {
  const camps = await db.camp.findMany({
    where: { active: true },
    select: {
      id: true,
      slug: true,
      city: true,
      venue: true,
      dates: true,
      price: true,
      earlyBirdPrice: true,
      priceHuf: true,
      priceEur: true,
      earlyBirdPriceHuf: true,
      earlyBirdPriceEur: true,
      earlyBirdUntil: true,
      depositPercent: true,
      remainingSpots: true,
      totalSpots: true,
      ageRange: true,
      clubName: true,
      imageUrl: true,
    },
    orderBy: { createdAt: "asc" },
  })

  const enriched = camps.map((c) => {
    const huf = pickEffectivePrice(c, "HUF")
    const eur = pickEffectivePrice(c, "EUR")
    // Prefer the formatted string from the numeric HUF columns; fall back
    // to the legacy string field if numbers are missing.
    const priceStr = c.priceHuf > 0 ? formatPrice(c.priceHuf, "HUF") : c.price
    const earlyBirdStr = c.earlyBirdPriceHuf > 0 ? formatPrice(c.earlyBirdPriceHuf, "HUF") : c.earlyBirdPrice
    return {
      ...c,
      price: priceStr,
      earlyBirdPrice: earlyBirdStr,
      effectiveHuf: huf.amount,
      effectiveEur: eur.amount,
      earlyBirdActiveHuf: huf.earlyBird,
      earlyBirdActiveEur: eur.earlyBird,
    }
  })

  return NextResponse.json(enriched)
}
