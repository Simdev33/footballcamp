"use client"

import { SubpageHero } from "@/components/subpage-hero"
import { FAQSection } from "@/components/faq-section"
import { useLanguage } from "@/lib/language-context"

export default function GyikPage() {
  const { t } = useLanguage()

  return (
    <main>
      <SubpageHero
        title={t.faq.badge}
        subtitle="Válaszok a leggyakrabban feltett kérdésekre"
      />
      <FAQSection />
    </main>
  )
}
