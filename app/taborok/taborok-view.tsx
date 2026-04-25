"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Calendar, ArrowRight, Tag, Shirt, Utensils, Dumbbell, Heart, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { CampTranslation } from "@/lib/camp-translations"

const KID_ICONS = [Shirt, Utensils, Dumbbell, Heart]

type Camp = {
  id: string
  slug: string
  city: string
  venue: string
  dates: string
  price: string
  earlyBirdPrice: string
  clubName: string
  imageUrl: string | null
  translationEn?: CampTranslation
}

type CampsListStrings = {
  heroTitle: string
  heroSubtitle: string
  kidsBadge: string
  kidsTitle: string
  kidsTitleHighlight: string
  kidsTitleEnd: string
  kidsItems: { title: string; desc: string }[]
  locationsBadge: string
  locationsTitle: string
  locationsHighlight: string
  emptyState: string
  dateLabel: string
  ageLabel: string
  ageRange: string
  earlyBirdLabel: string
  details: string
}

export function TaborokView({ camps, heroImg }: { camps: Camp[]; heroImg: string }) {
  const { t, locale } = useLanguage()
  const p = (t as unknown as { campsListPage: CampsListStrings }).campsListPage
  const displayCamp = (camp: Camp) => ({
    ...camp,
    city: locale === "en" ? camp.translationEn?.city?.trim() || camp.city : camp.city,
    venue: locale === "en" ? camp.translationEn?.venue?.trim() || camp.venue : camp.venue,
    dates: locale === "en" ? camp.translationEn?.dates?.trim() || camp.dates : camp.dates,
  })

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImg}
            alt="Kickoff"
            fill
            className="object-cover"
            priority
            unoptimized={heroImg.includes("b-cdn.net")}
          />
          <div className="absolute inset-0 bg-[#0a1f0a]/80" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">{p.heroTitle}</h1>
          <p className="mt-4 text-lg text-white/60 max-w-xl mx-auto">{p.heroSubtitle}</p>
          <div className="w-20 h-1 bg-[#d4a017] mx-auto mt-8" />
        </div>
      </section>

      {/* What Kids Get */}
      <section className="py-20 md:py-28 bg-[#0a1f0a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-14">
            <span className="inline-block px-6 py-2 bg-[#d4a017] text-[#0a1f0a] text-sm tracking-[0.3em] uppercase font-medium">
              {p.kidsBadge}
            </span>
            <h2 className="mt-5 font-serif text-3xl md:text-4xl font-bold text-white">
              {p.kidsTitle} <span className="text-[#d4a017]">{p.kidsTitleHighlight}</span> {p.kidsTitleEnd}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {p.kidsItems.map((item, index) => {
              const Icon = KID_ICONS[index]
              return (
                <div key={item.title} className="group relative p-8 bg-[#0f2b0f] border border-[#d4a017]/10 hover:border-[#d4a017]/50 transition-colors duration-300 text-center">
                  <div className="w-16 h-16 mx-auto mb-5 bg-[#d4a017]/15 flex items-center justify-center group-hover:bg-[#d4a017] transition-colors duration-300">
                    <Icon className="w-8 h-8 text-[#d4a017] group-hover:text-[#0a1f0a] transition-colors" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-[#d4a017] transition-colors">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Camp Cards from DB */}
      <section className="py-20 md:py-28 bg-[#0a1f0a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-14">
            <span className="inline-block px-6 py-2 bg-[#0a1f0a] border border-[#d4a017]/30 text-[#d4a017] text-sm tracking-[0.3em] uppercase font-medium">
              {p.locationsBadge}
            </span>
            <h2 className="mt-5 font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {p.locationsTitle} <span className="text-[#d4a017]">{p.locationsHighlight}</span>
            </h2>
          </div>

          {camps.length === 0 ? (
            <p className="text-center text-white/40 py-12">{p.emptyState}</p>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
              {camps.map((rawCamp) => {
                const camp = displayCamp(rawCamp)
                return (
                <Link key={camp.id} href={`/taborok/${camp.slug}`} className="group block">
                  <div className="relative overflow-hidden bg-[#0f2b0f] border border-[#d4a017]/10 transition-[transform,box-shadow] duration-500 will-change-transform hover:-translate-y-2 hover:shadow-[0_40px_100px_#d4a01733]">
                    <div className="relative aspect-[16/8] overflow-hidden">
                      {camp.imageUrl ? (
                        <Image
                          src={camp.imageUrl}
                          alt={camp.city}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
                          unoptimized={camp.imageUrl.includes("b-cdn.net")}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4a017]/20 to-[#0a1f0a] flex items-center justify-center">
                          <MapPin className="w-16 h-16 text-[#d4a017]/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      <div className="absolute bottom-4 left-6">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-[#d4a017]" />
                          <span className="font-serif text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{camp.city}</span>
                        </div>
                        <p className="mt-1 text-white/70 ml-8 text-xs">{camp.venue}</p>
                      </div>

                      <div className="absolute top-4 right-4 px-3 py-2 bg-[#d4a017] text-[#0a1f0a] font-bold text-xs">
                        <Tag className="inline-block w-4 h-4 mr-1" />
                        {camp.clubName}
                      </div>
                    </div>

                    <div className="p-5 lg:p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 text-white/50 mb-2">
                            <Calendar className="w-4 h-4 text-[#d4a017]" />
                            <span className="text-xs uppercase tracking-wider font-medium">{p.dateLabel}</span>
                          </div>
                          <p className="font-semibold text-white text-sm">{camp.dates}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-white/50 mb-2">
                            <Clock className="w-4 h-4 text-[#d4a017]" />
                            <span className="text-xs uppercase tracking-wider font-medium">{p.ageLabel}</span>
                          </div>
                          <p className="font-semibold text-white text-sm">{p.ageRange}</p>
                        </div>
                      </div>

                      <div className="flex items-end justify-between border-t border-white/10 pt-4">
                        <div>
                          <p className="text-xs text-[#d4a017] uppercase tracking-wider mb-1 font-medium">{p.earlyBirdLabel}</p>
                          <div className="flex items-baseline gap-3">
                            <span className="font-serif text-2xl md:text-3xl font-bold text-white">{camp.earlyBirdPrice}</span>
                            <span className="text-sm text-white/40 line-through">{camp.price}</span>
                          </div>
                        </div>
                        <span className="flex items-center gap-2 text-[#d4a017] text-sm font-semibold group-hover:underline">
                          {p.details} <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-[#d4a017]/20" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#d4a017]/20" />
                  </div>
                </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
