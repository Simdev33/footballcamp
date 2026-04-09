import { db } from "@/lib/db"
import { SubpageHero } from "@/components/subpage-hero"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight, Clock, Tag } from "lucide-react"

export const dynamic = "force-dynamic"

function readingTime(text: string): number {
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200))
}

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  })

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <main>
      <SubpageHero
        title="Blog"
        subtitle="Cikkek, tippek és inspiráció a futball világából"
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              Hamarosan érkeznek a cikkek!
            </div>
          ) : (
            <div className="space-y-16">
              {/* Featured post */}
              {featured && (
                <article className="group">
                  <Link href={`/blog/${featured.slug}`} className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
                    {featured.imageUrl && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={featured.imageUrl}
                          alt={featured.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d4a017]/10 text-[#d4a017] text-xs font-semibold uppercase tracking-wider">
                          <Tag className="w-3 h-3" />
                          {featured.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {readingTime(featured.content)} perc olvasás
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground group-hover:text-[#d4a017] transition-colors leading-tight">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="mt-3 text-muted-foreground leading-relaxed line-clamp-3">
                          {featured.excerpt}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {featured.createdAt.toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                        <span>{featured.author.name}</span>
                      </div>
                      <span className="inline-flex items-center gap-2 mt-5 text-[#d4a017] text-sm font-semibold group-hover:gap-3 transition-all">
                        Tovább olvasom <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </article>
              )}

              {/* Rest of posts */}
              {rest.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <article key={post.id} className="group bg-white border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                      {post.imageUrl && (
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4a017]">
                            {post.category}
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            {readingTime(post.content)} perc
                          </span>
                        </div>
                        <h2 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-[#d4a017] transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                          <Calendar className="w-3 h-3" />
                          <span>{post.createdAt.toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" })}</span>
                        </div>
                        <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-[#d4a017] text-sm font-semibold hover:gap-3 transition-all">
                          Tovább olvasom <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
