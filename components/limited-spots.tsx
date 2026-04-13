"use client"

import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function LimitedSpots() {
  const { t } = useLanguage()

  return (
    <section className="relative py-0 overflow-hidden">
      {/* Stadium ticket design */}
      <div className="relative bg-[#0a1f0a]">
        <div className="relative py-10 md:py-16">
          {/* Dotted perforation lines (ticket style) */}
          <div className="absolute top-0 left-[10%] right-[10%] border-t-2 border-dashed border-[#d4a017]/20" />
          <div className="absolute bottom-0 left-[10%] right-[10%] border-b-2 border-dashed border-[#d4a017]/20" />

          {/* Stadium light glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-32 bg-[radial-gradient(ellipse_at_top,#d4a01720_0%,transparent_70%)]" />

          <div className="relative z-10 max-w-[900px] mx-auto px-4 md:px-12 lg:px-24 text-center">
            {/* Whistle icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#d4a017]/40 bg-[#d4a017]/10 mb-5 md:mb-6">
              <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 text-[#d4a017]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 9V4M15 12h5M12 15v5M9 12H4" />
                <path d="M15.5 8.5l3.5-3.5M15.5 15.5l3.5 3.5M8.5 15.5L5 19M8.5 8.5L5 5" />
              </svg>
            </div>

            {/* Scoreboard-style title */}
            <div className="inline-block mb-4 md:mb-5">
              <div className="bg-[#1a3a1a] border border-[#d4a017]/30 px-6 py-3 md:px-8 md:py-4">
                <h2 className="font-serif text-lg md:text-2xl lg:text-3xl font-bold text-[#d4a017] leading-tight tracking-wide">
                  {t.limitedSpots.title}
                </h2>
              </div>
            </div>

            <p className="text-sm md:text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
              {t.limitedSpots.text}
            </p>

            <p className="mt-3 md:mt-4 text-xs md:text-sm text-[#d4a017]/70 font-medium max-w-xl mx-auto">
              {t.limitedSpots.earlyBirdNote}
            </p>

            <div className="mt-6 md:mt-8">
              <a
                href="#jelentkezes"
                className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-[#d4a017] text-[#0a1f0a] text-sm md:text-base font-bold hover:shadow-[0_0_40px_#d4a01766] transition-all duration-300"
              >
                {t.limitedSpots.cta}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
