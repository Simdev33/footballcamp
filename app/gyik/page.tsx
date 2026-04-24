"use client"

import { SubpageHero } from "@/components/subpage-hero"
import { FAQSection } from "@/components/faq-section"
import { useLanguage } from "@/lib/language-context"

export default function GyikPage() {
  const { t } = useLanguage()
  const g = (t as unknown as { gyikPage: { subtitle: string } }).gyikPage

  return (
    <main>
      <SubpageHero title={t.faq.badge} subtitle={g.subtitle} />
      <FAQSection />
    </main>
  )
}
