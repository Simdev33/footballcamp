import { NextResponse } from "next/server"
import { getPublicCamps } from "@/lib/public-camps"

export const revalidate = 60

export async function GET() {
  const camps = await getPublicCamps()
  return NextResponse.json(camps, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  })
}
