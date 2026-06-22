import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const news = await db.news.findUnique({ where: { id } })
  if (!news) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (!news.published) {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
  }

  return NextResponse.json(news)
}
