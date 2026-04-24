import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { BlogDetailView, type BlogDetailData, type RelatedPost } from "./blog-detail-view"

export const dynamic = "force-dynamic"

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  try {
    const post = await db.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { name: true } } },
    })
    if (!post || !post.published) notFound()

    const related = await db.blogPost.findMany({
      where: { published: true, category: post.category, id: { not: post.id } },
      take: 3,
      orderBy: { createdAt: "desc" },
    })

    const data: BlogDetailData = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt.toISOString(),
      authorName: post.author?.name ?? "",
      wordCount: post.content.split(/\s+/).length,
    }

    const relatedData: RelatedPost[] = related.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      category: r.category,
      createdAt: r.createdAt.toISOString(),
    }))

    return <BlogDetailView post={data} related={relatedData} />
  } catch {
    notFound()
  }
}
