import { db } from "@/lib/db"
import { SubpageHero } from "@/components/subpage-hero"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const news = await db.news.findUnique({ where: { slug }, include: { author: { select: { name: true } } } })
  if (!news || !news.published) notFound()

  return (
    <main>
      <SubpageHero title={news.title} />

      <section className="py-16 bg-background">
        <article className="max-w-[800px] mx-auto px-6 md:px-12">
          <Link href="/hirek" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Vissza a hírekhez
          </Link>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {news.createdAt.toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {news.author.name}</span>
          </div>

          {news.imageUrl && (
            <div className="relative aspect-[16/9] overflow-hidden mb-8">
              <Image src={news.imageUrl} alt={news.title} fill className="object-cover" sizes="800px" priority />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {news.content.split("\n").map((paragraph, i) => (
              paragraph.trim() ? <p key={i} className="text-foreground/80 leading-relaxed mb-4">{paragraph}</p> : null
            ))}
          </div>
        </article>
      </section>
    </main>
  )
}
