import { db } from "@/lib/db"
import { BlogListView, type BlogPostSummary } from "./blog-view"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    })

    const summaries: BlogPostSummary[] = posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      imageUrl: p.imageUrl,
      createdAt: p.createdAt.toISOString(),
      authorName: p.author?.name ?? "",
      wordCount: p.content.split(/\s+/).length,
    }))

    return <BlogListView posts={summaries} />
  } catch {
    return <BlogListView posts={[]} unavailable />
  }
}
