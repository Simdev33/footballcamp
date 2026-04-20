"use client"

import { SubpageHero } from "@/components/subpage-hero"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { ArrowRight, FileText, Mail } from "lucide-react"

type AszfSection = { heading: string; paragraphs: string[] }
type AszfContent = {
  title: string
  subtitle: string
  intro: string
  sections: AszfSection[]
  downloadLabel: string
  backToRegister: string
  contact: string
  placeholder: string
}

export default function AszfPage() {
  const { t } = useLanguage()
  const a = (t as unknown as { aszf: AszfContent }).aszf

  return (
    <main>
      <SubpageHero title={a.title} subtitle={a.subtitle} />

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <article className="bg-white border border-border/50 shadow-sm p-6 md:p-10 space-y-8 text-[15px] leading-relaxed text-foreground">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#d4a017]/10 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-[#d4a017]" />
              </div>
              <p className="text-muted-foreground">{a.intro}</p>
            </div>

            {a.placeholder && (
              <div className="border-l-4 border-[#d4a017] bg-[#d4a017]/5 px-4 py-3 text-sm text-muted-foreground italic">
                {a.placeholder}
              </div>
            )}

            {a.sections.map((section, i) => (
              <section key={i} className="space-y-3">
                <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                  {section.heading}
                </h2>
                <div className="space-y-2">
                  {section.paragraphs.map((p, j) => (
                    <p key={j} className="text-foreground/90">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link
                href="/jelentkezes"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:shadow-[0_10px_30px_#d4a0174d] transition-all"
              >
                {a.backToRegister}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/kapcsolat"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0a1f0a] text-[#d4a017] font-semibold hover:bg-[#d4a017] hover:text-[#0a1f0a] transition-colors"
              >
                <Mail className="w-5 h-5" />
                {a.contact}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
