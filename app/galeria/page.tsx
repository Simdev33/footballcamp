"use client"

import { SubpageHero } from "@/components/subpage-hero"
import { GallerySection } from "@/components/gallery-section"
import { useLanguage } from "@/lib/language-context"

export default function GaleriaPage() {
  const { t } = useLanguage()

  return (
    <main>
      <SubpageHero
        title={t.gallery.badge}
        subtitle={t.gallery.subtitle}
      />
      <GallerySection />
    </main>
  )
}
