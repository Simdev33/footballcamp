import { db } from "@/lib/db"
import { NextResponse } from "next/server"

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
      remainingSpots: true,
      totalSpots: true,
      ageRange: true,
      clubName: true,
      imageUrl: true,
    },
    orderBy: { createdAt: "asc" },
  })
  return NextResponse.json(camps)
}
