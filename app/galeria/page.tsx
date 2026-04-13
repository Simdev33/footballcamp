"use client"

import { SubpageHero } from "@/components/subpage-hero"

export default function GaleriaPage() {
  return (
    <main>
      <SubpageHero
        title="Galéria"
        subtitle="Hamarosan frissítjük a galériát!"
      />
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
          <p className="text-muted-foreground text-lg">
            A galéria jelenleg nem elérhető. Hamarosan frissítjük a legújabb képekkel!
          </p>
        </div>
      </section>
    </main>
  )
}
