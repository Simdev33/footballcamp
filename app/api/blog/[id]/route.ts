import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const post = await db.blogPost.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      category: true,
      published: true,
    },
  })
  if (!post) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(post)
}
