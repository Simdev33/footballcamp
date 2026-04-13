"use client"

import { useLanguage } from "@/lib/language-context"
import { CampCard } from "@/components/camp-card"

const CDN = "https://focis.b-cdn.net"
const CAMP_IMAGES = [
  `${CDN}/Post_1%20Camp/01%20Template%20Benfica%20Camp%202025_26_FEED.png`,
  `${CDN}/Post_1%20Camp/02%20Template%20Benfica%20Camp%202025_26-02.png`,
] as const

export function LocationCards() {
  const { t } = useLanguage()

  const locations = t.locations.camps.map((camp, index) => ({
    ...camp,
    image: CAMP_IMAGES[index] ?? CAMP_IMAGES[0],
  }))

  return (
    <section className="relative overflow-hidden py-14 md:py-28">
      <div className="absolute inset-0 bg-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-12 lg:px-24">
        <div className="mb-8 md:mb-14 text-center">
          {/* Stadium location pin icon */}
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0a1f0a]/5 border border-[#0a1f0a]/10 mb-4">
            <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 text-[#d4a017]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h2 className="font-serif text-xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {t.locations.title}{" "}
            <span className="text-primary">{t.locations.titleHighlight}</span>
          </h2>
        </div>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:gap-10">
          {locations.map((location) => (
            <CampCard key={location.city} camp={location} imageSrc={location.image} />
          ))}
        </div>
      </div>
    </section>
  )
}
