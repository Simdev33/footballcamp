"use client"

import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function LimitedSpots() {
  const { t } = useLanguage()

  return (
    <section className="relative py-10 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#d4a017] via-[#c4920f] to-[#d4a017]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0a1f0a33)]" />

      <div className="relative z-10 max-w-[900px] mx-auto px-4 md:px-12 lg:px-24 text-center">
        <h2 className="font-serif text-xl md:text-3xl lg:text-4xl font-bold text-[#0a1f0a] leading-tight">
          {t.limitedSpots.title}
        </h2>
        <p className="mt-3 md:mt-4 text-sm md:text-lg text-[#0a1f0a]/75 max-w-2xl mx-auto leading-relaxed">
          {t.limitedSpots.text}
        </p>

        <p className="mt-3 md:mt-5 text-xs md:text-sm text-[#0a1f0a]/65 font-medium max-w-xl mx-auto">
          {t.limitedSpots.earlyBirdNote}
        </p>

        <div className="mt-6 md:mt-8">
          <a
            href="#jelentkezes"
            className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-[#0a1f0a] text-[#d4a017] text-sm md:text-base font-semibold hover:bg-[#0a1f0a]/90 transition-colors duration-300"
          >
            {t.limitedSpots.cta}
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
