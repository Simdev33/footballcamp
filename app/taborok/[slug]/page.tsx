import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { MapPin, Calendar, Users, ArrowRight, Tag, Check, Shield, Clock } from "lucide-react"
import { CampFaq } from "./camp-faq"
import { CampGallery } from "./camp-gallery"

export const dynamic = "force-dynamic"

type ScheduleItem = { time: string; activity: string }
type CoachItem = { name: string; role: string; image: string; bio: string }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const camp = await db.camp.findUnique({ where: { slug } })
  if (!camp) return { title: "Tábor nem található" }

  return {
    title: `${camp.city} - ${camp.clubName} Tábor | Kickoff Elite Football Camps`,
    description: camp.description || `${camp.clubName} futballtábor ${camp.city} helyszínnel, ${camp.dates}. ${camp.ageRange} éves korosztálynak.`,
    openGraph: {
      title: `${camp.city} - ${camp.clubName} Tábor`,
      description: camp.description?.slice(0, 160) || undefined,
      images: camp.imageUrl ? [{ url: camp.imageUrl }] : undefined,
    },
  }
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/)
  return match?.[1] || null
}

export default async function CampDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const camp = await db.camp.findUnique({ where: { slug } })
  if (!camp) notFound()

  const otherCamps = await db.camp.findMany({
    where: { active: true, id: { not: camp.id } },
    take: 3,
  })

  const schedule = (camp.schedule as ScheduleItem[] | null) || []
  const coaches = (camp.coaches as CoachItem[] | null) || []
  const faq = camp.faq as { question: string; answer: string }[] | null
  const ytId = camp.videoUrl ? getYouTubeId(camp.videoUrl) : null

  return (
    <main>
      {/* ─── HERO ─── */}
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
            <div className="absolute inset-0 bg-linear-to-br from-[#d4a017]/10 to-[#0a1f0a]" />
          )}
          <div className="absolute inset-0 bg-[#0a1f0a]/75" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a1f0a] via-transparent to-transparent" />
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

      {/* ─── CONTENT + SIDEBAR ─── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
            {/* Left column */}
            <div className="space-y-16">

              {/* Description */}
              {camp.description && (
                <div>
                  <SectionTitle>A táborról</SectionTitle>
                  <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                    {camp.description}
                  </div>
                </div>
              )}

              {/* Schedule */}
              {schedule.length > 0 && (
                <div>
                  <SectionTitle>Napi program</SectionTitle>
                  <div className="relative">
                    <div className="absolute left-[39px] top-2 bottom-2 w-px bg-[#d4a017]/20" />
                    <div className="space-y-0">
                      {schedule.map((item, i) => (
                        <div key={i} className="flex items-start gap-5 group py-3">
                          <div className="relative z-10 w-20 shrink-0 text-right">
                            <span className="font-mono text-sm font-bold text-[#d4a017]">{item.time}</span>
                          </div>
                          <div className="relative z-10 mt-1.5 w-3 h-3 rounded-full bg-[#d4a017] shrink-0 ring-4 ring-background" />
                          <div className="flex-1 pb-1">
                            <span className="text-foreground text-sm font-medium">{item.activity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Includes */}
              {camp.includes.length > 0 && (
                <div>
                  <SectionTitle>Mit tartalmaz</SectionTitle>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {camp.includes.map((item) => (
                      <div key={item} className="flex items-start gap-3 p-4 bg-white border border-border/60 shadow-sm">
                        <div className="mt-0.5 w-6 h-6 bg-[#d4a017] flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 text-[#0a1f0a]" />
                        </div>
                        <span className="text-sm text-foreground font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <StatBox icon={<Calendar className="w-6 h-6" />} value={camp.dates.split(/[-–]/)[0]?.trim() || camp.dates} label="Időpont" />
                <StatBox icon={<MapPin className="w-6 h-6" />} value={camp.venue} label="Helyszín" />
              </div>

              {/* Coaches */}
              {coaches.length > 0 && (
                <div>
                  <SectionTitle>Edzők</SectionTitle>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {coaches.map((coach, i) => (
                      <div key={i} className="flex gap-4 p-5 bg-white border border-border/60 shadow-sm">
                        {coach.image ? (
                          <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-full border-2 border-[#d4a017]/30">
                            <Image
                              src={coach.image}
                              alt={coach.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                              unoptimized={coach.image.includes("b-cdn.net")}
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 shrink-0 bg-[#0a1f0a] rounded-full flex items-center justify-center">
                            <Users className="w-8 h-8 text-[#d4a017]/50" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif font-bold text-foreground">{coach.name}</h4>
                          <p className="text-[#d4a017] text-xs font-semibold uppercase tracking-wider mt-0.5">{coach.role}</p>
                          {coach.bio && (
                            <p className="text-muted-foreground text-sm mt-2 line-clamp-3">{coach.bio}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ─── RIGHT: Sticky Price Card ─── */}
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
                    <InfoRow label="Helyszín" value={camp.venue} />
                    <InfoRow label="Időpont" value={camp.dates} />
                    <InfoRow label="Korosztály" value="7-15 éves korosztályig" />
                  </div>

                  <Link
                    href={`/jelentkezes?camp=${camp.slug}`}
                    className="flex w-full items-center justify-center gap-2 bg-[#d4a017] px-6 py-4 text-[#0a1f0a] font-bold text-base hover:shadow-[0_0_40px_#d4a01780] transition-shadow"
                  >
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

      {/* ─── GALLERY (full-width) ─── */}
      {camp.gallery.length > 0 && (
        <section className="py-16 md:py-24 bg-[#0a1f0a]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-10 text-center">
              Galéria
            </h2>
            <CampGallery images={camp.gallery} campName={camp.city} />
          </div>
        </section>
      )}

      {/* ─── VIDEO ─── */}
      {ytId && (
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-[1000px] mx-auto px-6 md:px-12 lg:px-24">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-10 text-center">
              Videó
            </h2>
            <div className="aspect-video border border-[#d4a017]/20 overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* ─── MAP ─── */}
      {camp.mapEmbedUrl && (
        <section className="py-16 md:py-24 bg-[#0a1f0a]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4 text-center">
              Helyszín
            </h2>
            <p className="text-white/50 text-center mb-10">
              <MapPin className="inline w-4 h-4 mr-1" />
              {camp.venue}, {camp.city}
            </p>
            <div className="aspect-21/9 border border-[#d4a017]/20 overflow-hidden">
              <iframe
                src={camp.mapEmbedUrl}
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ ─── */}
      {faq && faq.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-[800px] mx-auto px-6 md:px-12 lg:px-24">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-10 text-center">
              Gyakran Ismételt Kérdések
            </h2>
            <CampFaq items={faq} />
          </div>
        </section>
      )}

      {/* ─── OTHER CAMPS ─── */}
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
                        <div className="absolute inset-0 bg-linear-to-br from-[#d4a017]/10 to-[#0a1f0a] flex items-center justify-center">
                          <MapPin className="w-10 h-10 text-[#d4a017]/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
      {children}
    </h2>
  )
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center p-6 bg-[#0a1f0a] border border-[#d4a017]/15">
      <div className="text-[#d4a017] mx-auto mb-2 flex justify-center">{icon}</div>
      <span className="block font-serif text-lg font-bold text-white leading-tight">{value}</span>
      <span className="block text-white/50 text-xs mt-1">{label}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/50">{label}</span>
      <span className="text-white font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}
