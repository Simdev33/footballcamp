"use client"

import { SubpageHero } from "@/components/subpage-hero"
import { useLanguage } from "@/lib/language-context"

export default function GaleriaPage() {
  const { t } = useLanguage()
  const g = (t as unknown as { galeriaPage: { heroTitle: string; heroSubtitle: string; message: string } }).galeriaPage

  return (
    <main>
      <SubpageHero title={g.heroTitle} subtitle={g.heroSubtitle} />
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
          <p className="text-muted-foreground text-lg">{g.message}</p>
        </div>
      </section>
    </main>
  )
}
