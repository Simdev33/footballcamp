"use client"

import { useLanguage } from "@/lib/language-context"
import { CampCard } from "@/components/camp-card"

const CAMP_IMAGES = ["/field-with-balls.jpg", "/stadium-pitch.jpg"] as const

export function LocationCards() {
  const { t } = useLanguage()

  const locations = t.locations.camps.map((camp, index) => ({
    ...camp,
    image: CAMP_IMAGES[index] ?? CAMP_IMAGES[0],
  }))

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="mb-14 text-center">
          <span className="inline-block bg-[#0a1f0a] px-6 py-2 text-sm font-medium uppercase tracking-[0.3em] text-[#d4a017]">
            {t.locations.badge}
          </span>
          <h2 className="mt-5 font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            {t.locations.title}{" "}
            <span className="text-primary">{t.locations.titleHighlight}</span>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {locations.map((location) => (
            <CampCard key={location.city} camp={location} imageSrc={location.image} />
          ))}
        </div>
      </div>
    </section>
  )
}
