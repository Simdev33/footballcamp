import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { MapPin, Calendar, Users, ArrowRight, Tag, Check, Shield, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const camp = await db.camp.findUnique({ where: { slug } })
  if (!camp) return { title: "Tábor nem található" }

  return {
    title: `${camp.city} - ${camp.clubName} Tábor | Benfica Football Camp Hungary`,
    description: camp.description || `${camp.clubName} futballtábor ${camp.city} helyszínnel, ${camp.dates}. ${camp.ageRange} éves korosztálynak.`,
    openGraph: {
      title: `${camp.city} - ${camp.clubName} Tábor`,
      description: camp.description?.slice(0, 160) || undefined,
      images: camp.imageUrl ? [{ url: camp.imageUrl }] : undefined,
    },
  }
}

export default async function CampDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const camp = await db.camp.findUnique({ where: { slug } })
  if (!camp) notFound()

  const otherCamps = await db.camp.findMany({
    where: { active: true, id: { not: camp.id } },
    take: 3,
  })

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          {camp.imageUrl ? (
            <Image
              src={camp.imageUrl}
              alt={camp.city}
              fill
              className="object-cover"
              priority
              unoptimized={camp.imageUrl.includes("b-cdn.net")}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4a017]/10 to-[#0a1f0a]" />
          )}
          <div className="absolute inset-0 bg-[#0a1f0a]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0a] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-4 py-1.5 bg-[#d4a017] text-[#0a1f0a] text-xs font-bold uppercase tracking-wider">
              <Tag className="inline w-3.5 h-3.5 mr-1" />
              {camp.clubName}
            </span>
            <span className="text-white/50 text-sm">{camp.ageRange} éves korosztály</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            {camp.city}
          </h1>
          <p className="mt-3 text-lg text-white/60">{camp.venue} &middot; {camp.dates}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
            {/* Left: Description & Includes */}
            <div className="space-y-12">
              {camp.description && (
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                    A táborról
                  </h2>
                  <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                    {camp.description}
                  </div>
                </div>
              )}

              {camp.includes.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                    Mit tartalmaz
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {camp.includes.map((item) => (
                      <div key={item} className="flex items-start gap-3 p-4 bg-[#0a1f0a]/50 border border-[#d4a017]/10">
                        <div className="mt-0.5 w-6 h-6 bg-[#d4a017] flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 text-[#0a1f0a]" />
                        </div>
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Camp Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-6 bg-[#0a1f0a] border border-[#d4a017]/15">
                  <Calendar className="w-6 h-6 text-[#d4a017] mx-auto mb-2" />
                  <span className="block font-serif text-xl font-bold text-foreground">5 nap</span>
                  <span className="block text-muted-foreground text-xs mt-1">Teljes hét</span>
                </div>
                <div className="text-center p-6 bg-[#0a1f0a] border border-[#d4a017]/15">
                  <Clock className="w-6 h-6 text-[#d4a017] mx-auto mb-2" />
                  <span className="block font-serif text-xl font-bold text-foreground">4 edzés</span>
                  <span className="block text-muted-foreground text-xs mt-1">Naponta</span>
                </div>
                <div className="text-center p-6 bg-[#0a1f0a] border border-[#d4a017]/15">
                  <Users className="w-6 h-6 text-[#d4a017] mx-auto mb-2" />
                  <span className="block font-serif text-xl font-bold text-foreground">{camp.totalSpots} fő</span>
                  <span className="block text-muted-foreground text-xs mt-1">Maximum létszám</span>
                </div>
              </div>
            </div>

            {/* Right: Sticky Price Card */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="bg-[#0a1f0a] border border-[#d4a017]/20 overflow-hidden">
                <div className="bg-[#d4a017] px-6 py-4">
                  <p className="text-[#0a1f0a] text-xs font-bold uppercase tracking-wider">Early bird ár</p>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="font-serif text-3xl font-bold text-[#0a1f0a]">{camp.earlyBirdPrice}</span>
                    <span className="text-[#0a1f0a]/60 line-through text-base">{camp.price}</span>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-white/50">Helyszín</span>
                      <span className="text-white font-medium">{camp.venue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50">Időpont</span>
                      <span className="text-white font-medium">{camp.dates}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50">Korosztály</span>
                      <span className="text-white font-medium">{camp.ageRange} év</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50">Szabad helyek</span>
                      <span className={`font-bold ${camp.remainingSpots <= 5 ? "text-red-400" : "text-emerald-400"}`}>
                        {camp.remainingSpots} / {camp.totalSpots}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/jelentkezes?camp=${camp.slug}`}
                    className="flex w-full items-center justify-center gap-2 bg-[#d4a017] px-6 py-4 text-[#0a1f0a] font-bold text-base hover:shadow-[0_0_40px_#d4a01780] transition-shadow"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Jelentkezés
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <div className="flex items-center gap-2 justify-center text-white/30 text-xs">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Biztonságos regisztráció</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Camps */}
      {otherCamps.length > 0 && (
        <section className="py-16 md:py-24 bg-[#0a1f0a]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-10 text-center">
              Többi <span className="text-[#d4a017]">táborunk</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCamps.map((other) => (
                <Link key={other.id} href={`/taborok/${other.slug}`} className="group block">
                  <div className="bg-[#0f2b0f] border border-[#d4a017]/10 overflow-hidden hover:border-[#d4a017]/40 transition-colors">
                    <div className="relative aspect-video overflow-hidden">
                      {other.imageUrl ? (
                        <Image
                          src={other.imageUrl}
                          alt={other.city}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          unoptimized={other.imageUrl.includes("b-cdn.net")}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4a017]/10 to-[#0a1f0a] flex items-center justify-center">
                          <MapPin className="w-10 h-10 text-[#d4a017]/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <span className="font-serif text-xl font-bold text-white">{other.city}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-white/50 text-sm">{other.dates}</p>
                      <div className="flex items-baseline justify-between mt-2">
                        <span className="font-serif text-lg font-bold text-white">{other.earlyBirdPrice}</span>
                        <span className="text-[#d4a017] text-sm font-medium group-hover:underline flex items-center gap-1">
                          Részletek <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
