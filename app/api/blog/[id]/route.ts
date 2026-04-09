import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const post = await db.blogPost.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  })
  if (!post) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(post)
}
