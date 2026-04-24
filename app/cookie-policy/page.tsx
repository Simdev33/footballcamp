"use client"

import { SubpageHero } from "@/components/subpage-hero"
import { useLanguage } from "@/lib/language-context"
import { reopenCookieBanner } from "@/components/cookie-banner"
import Link from "next/link"
import { Cookie, Settings, ArrowRight } from "lucide-react"

type PolicySection = { heading: string; paragraphs: string[] }
type PolicyContent = {
  title: string
  subtitle: string
  intro: string
  sections: PolicySection[]
  placeholder?: string
}

export default function CookiePolicyPage() {
  const { t } = useLanguage()
  const p = (t as unknown as { cookiePolicy: PolicyContent }).cookiePolicy
  const b = (t as unknown as { cookieBanner: { reopen: string } }).cookieBanner
  const pp = (t as unknown as { privacyPolicy: { backLink: string } }).privacyPolicy

  return (
    <main>
      <SubpageHero title={p.title} subtitle={p.subtitle} />

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <article className="bg-white border border-border/50 shadow-sm p-6 md:p-10 space-y-8 text-[15px] leading-relaxed text-foreground">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#d4a017]/10 flex items-center justify-center shrink-0">
                <Cookie className="w-6 h-6 text-[#d4a017]" />
              </div>
              <p className="text-muted-foreground">{p.intro}</p>
            </div>

            {p.placeholder && (
              <div className="border-l-4 border-[#d4a017] bg-[#d4a017]/5 px-4 py-3 text-sm text-muted-foreground italic">
                {p.placeholder}
              </div>
            )}

            {p.sections.map((section, i) => (
              <section key={i} className="space-y-3">
                <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                  {section.heading}
                </h2>
                <div className="space-y-2">
                  {section.paragraphs.map((para, j) => (
                    <p key={j} className="text-foreground/90">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={reopenCookieBanner}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:shadow-[0_10px_30px_#d4a0174d] transition-all"
              >
                <Settings className="w-5 h-5" />
                {b.reopen}
              </button>
              <Link
                href="/adatkezelesi-tajekoztato"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0a1f0a] text-[#d4a017] font-semibold hover:bg-[#d4a017] hover:text-[#0a1f0a] transition-colors"
              >
                {pp.backLink}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
