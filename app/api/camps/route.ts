import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const camps = await db.camp.findMany({
    where: { active: true, remainingSpots: { gt: 0 } },
    select: { id: true, city: true, venue: true, dates: true, earlyBirdPrice: true, remainingSpots: true },
    orderBy: { createdAt: "asc" },
  })
  return NextResponse.json(camps)
}
