"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Handshake, Mail, Users, Globe, Heart, Check } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useSiteImage } from "@/lib/site-images-context"

const SECTION_ICONS = [Users, Globe, Heart]
const SECTION_COLORS = ["#22c55e", "#3b82f6", "#d4a017"]

export default function PartnerprogramPage() {
  const { t } = useLanguage()
  const heroImg = useSiteImage("partnerProgram.hero")

  return (
    <main>
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a1f0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#d4a01718_0%,transparent_50%)]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-12 lg:px-24 text-center">
          <Handshake className="w-10 h-10 md:w-12 md:h-12 text-[#d4a017] mx-auto mb-5" />
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white">
            {t.partnerProgram.title}{" "}
            <span className="text-[#d4a017]">{t.partnerProgram.titleHighlight}</span>
          </h1>
          <p className="mt-6 text-sm md:text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
            {t.partnerProgram.intro}
          </p>
        </div>
      </section>

      <section className="py-14 md:py-24 bg-background">
        <div className="max-w-[1100px] mx-auto px-4 md:px-12 lg:px-24 space-y-10 md:space-y-14">
          {t.partnerProgram.sections.map((section, index) => {
            const Icon = SECTION_ICONS[index]
            const color = SECTION_COLORS[index]
            return (
              <div key={section.title} className="border border-border/50 rounded-xl overflow-hidden bg-white">
                <div className="p-6 md:p-10">
                  <div className="flex items-start gap-4 md:gap-6 mb-6">
                    <div
                      className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${color}15` }}
                    >
                      <Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                        {section.title}
                      </h2>
                      <p className="text-sm md:text-base text-[#d4a017] font-medium mt-1">{section.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                    {section.text}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                        {section.practiceTitle}
                      </h3>
                      <ul className="space-y-2">
                        {section.practiceItems.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
                            <span className="text-xs md:text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                        {section.benefitTitle}
                      </h3>
                      <ul className="space-y-2">
                        {section.benefitItems.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#d4a017]" />
                            <span className="text-xs md:text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-border/30">
                    <Link
                      href="/kapcsolat"
                      className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all duration-300"
                      style={{ color }}
                    >
                      {t.partnerProgram.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroImg} alt="Kickoff" fill className="object-cover" loading="lazy" unoptimized={heroImg.includes("b-cdn.net")} />
          <div className="absolute inset-0 bg-[#0a1f0a]/90" />
        </div>
        <div className="relative z-10 max-w-[800px] mx-auto px-4 md:px-12 text-center">
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-white">
            {t.partnerProgram.ctaTitle}
          </h2>
          <p className="mt-5 text-sm md:text-base text-white/60 leading-relaxed">
            {t.partnerProgram.ctaText}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/kapcsolat" className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-[#d4a017] text-[#0a1f0a] text-sm md:text-base font-semibold hover:shadow-[0_20px_50px_#d4a0174d] transition-shadow duration-300">
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
              {t.partnerProgram.cta}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
