"use client"

import { Palette, GraduationCap, Settings, CalendarDays, ArrowRight, Handshake } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

const ICONS = [Palette, GraduationCap, Settings, CalendarDays]

export function PartnerProgram() {
  const { t } = useLanguage()

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-background to-card/40" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="inline-block px-6 py-2 bg-[#0a1f0a] text-[#d4a017] text-sm tracking-[0.3em] uppercase font-medium">
              {t.partnerProgram.badge}
            </span>
            <h2 className="mt-5 font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.05]">
              {t.partnerProgram.title}{" "}
              <span className="text-primary">{t.partnerProgram.titleHighlight}</span>{" "}
              {t.partnerProgram.titleEnd}
            </h2>
            <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-lg">{t.partnerProgram.text}</p>

            <div className="mt-8 space-y-4">
              {t.partnerProgram.benefits.map((benefit, index) => {
                const Icon = ICONS[index]
                return (
                  <div key={benefit.title} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-[#0a1f0a] group-hover:bg-primary transition-colors duration-300">
                      <Icon className="w-6 h-6 text-[#d4a017] group-hover:text-primary-foreground transition-colors" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <a
              href="/kapcsolat"
              className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-base font-semibold hover:shadow-[0_20px_50px_#d4a0174d] transition-shadow duration-300"
            >
              <Handshake className="w-5 h-5" />
              {t.partnerProgram.cta}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src="https://focis.b-cdn.net/site/gyerekcsapat.jpg" alt="Gyerekcsapat" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-primary/30 -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
