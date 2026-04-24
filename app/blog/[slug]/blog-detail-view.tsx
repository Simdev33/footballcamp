"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Clock, Tag } from "lucide-react"
import { SubpageHero } from "@/components/subpage-hero"
import { useLanguage } from "@/lib/language-context"

export type BlogDetailData = {
  id: string
  slug: string
  title: string
  content: string
  category: string
  imageUrl: string | null
  createdAt: string
  authorName: string
  wordCount: number
}

export type RelatedPost = {
  id: string
  slug: string
  title: string
  category: string
  createdAt: string
}

type BlogStrings = {
  backToBlog: string
  readingTime: string
  relatedTitle: string
  dateLocale: string
}

function readingMinutes(words: number): number {
  return Math.max(1, Math.ceil(words / 200))
}

export function BlogDetailView({ post, related }: { post: BlogDetailData; related: RelatedPost[] }) {
  const { t } = useLanguage()
  const b = (t as unknown as { blogPage: BlogStrings }).blogPage
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(b.dateLocale, { year: "numeric", month: "long", day: "numeric" })
  const fmtShort = (iso: string) =>
    new Date(iso).toLocaleDateString(b.dateLocale, { year: "numeric", month: "short", day: "numeric" })

  return (
    <main>
      <SubpageHero title={post.title} />

      <section className="py-12 md:py-16 bg-background">
        <article className="max-w-[800px] mx-auto px-6 md:px-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> {b.backToBlog}
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d4a017]/10 text-[#d4a017] text-xs font-semibold uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {fmt(post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.authorName}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readingMinutes(post.wordCount)} {b.readingTime}
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
                <p key={i} className="text-foreground/80 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ) : null,
            )}
          </div>

          {related.length > 0 && (
            <div className="mt-16 pt-10 border-t border-border">
              <h3 className="font-serif text-xl font-bold text-foreground mb-6">{b.relatedTitle}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/blog/${r.slug}`}
                    className="group p-4 border border-border/50 hover:border-[#d4a017]/30 transition-colors"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#d4a017] mb-1">{r.category}</p>
                    <h4 className="font-serif font-bold text-sm text-foreground group-hover:text-[#d4a017] transition-colors line-clamp-2">
                      {r.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">{fmtShort(r.createdAt)}</p>
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
