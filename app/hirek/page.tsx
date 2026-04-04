import { db } from "@/lib/db"
import { SubpageHero } from "@/components/subpage-hero"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function HirekPage() {
  const news = await db.news.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  })

  return (
    <main>
      <SubpageHero title="Hírek" subtitle="A legfrissebb hírek és események a Kickoff Elite Football Camps-tól" />

      <section className="py-20 bg-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24">
          {news.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">Hamarosan érkeznek a hírek!</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <article key={item.id} className="group bg-white border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {item.imageUrl && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.createdAt.toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" })}</span>
                      <span className="mx-1">&middot;</span>
                      <span>{item.author.name}</span>
                    </div>
                    <h2 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-[#d4a017] transition-colors line-clamp-2">{item.title}</h2>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{item.content.slice(0, 150)}...</p>
                    <Link href={`/hirek/${item.slug}`} className="inline-flex items-center gap-2 text-[#d4a017] text-sm font-semibold hover:gap-3 transition-all">
                      Tovább olvasom <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
