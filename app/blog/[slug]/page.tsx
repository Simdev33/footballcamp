import { db } from "@/lib/db"
import { SubpageHero } from "@/components/subpage-hero"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Clock, Tag } from "lucide-react"

export const dynamic = "force-dynamic"

function readingTime(text: string): number {
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200))
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await db.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  })
  if (!post || !post.published) notFound()

  const relatedPosts = await db.blogPost.findMany({
    where: { published: true, category: post.category, id: { not: post.id } },
    take: 3,
    orderBy: { createdAt: "desc" },
  })

  return (
    <main>
      <SubpageHero title={post.title} />

      <section className="py-12 md:py-16 bg-background">
        <article className="max-w-[800px] mx-auto px-6 md:px-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Vissza a bloghoz
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d4a017]/10 text-[#d4a017] text-xs font-semibold uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.createdAt.toLocaleDateString("hu-HU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readingTime(post.content)} perc olvasás
            </span>
          </div>

          {post.imageUrl && (
            <div className="relative aspect-[16/9] overflow-hidden mb-10">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="800px"
                priority
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {post.content.split("\n").map((paragraph, i) =>
              paragraph.trim() ? (
                <p
                  key={i}
                  className="text-foreground/80 leading-relaxed mb-4"
                >
                  {paragraph}
                </p>
              ) : null,
            )}
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-10 border-t border-border">
              <h3 className="font-serif text-xl font-bold text-foreground mb-6">
                Hasonló cikkek
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="group p-4 border border-border/50 hover:border-[#d4a017]/30 transition-colors"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#d4a017] mb-1">
                      {related.category}
                    </p>
                    <h4 className="font-serif font-bold text-sm text-foreground group-hover:text-[#d4a017] transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {related.createdAt.toLocaleDateString("hu-HU", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </section>
    </main>
  )
}
