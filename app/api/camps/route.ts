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
      depositPercent: true,
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
    }
  })

  return NextResponse.json(enriched)
}
