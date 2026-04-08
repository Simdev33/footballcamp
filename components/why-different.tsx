"use client"

import { useLanguage } from "@/lib/language-context"

const JERSEY_COLORS = ["#d4a017", "#22c55e", "#3b82f6", "#ef4444", "#8b5cf6"]

export function WhyDifferent() {
  const { t } = useLanguage()

  return (
    <section className="relative py-14 md:py-24 overflow-hidden">
      {/* Tactic board background */}
      <div className="absolute inset-0 bg-[#1a5c2a]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.01)_0px,rgba(255,255,255,0.01)_2px,transparent_2px,transparent_30px)]" />

      {/* Chalk-style pitch outline */}
      <svg className="absolute inset-4 md:inset-8 opacity-[0.08] pointer-events-none" viewBox="0 0 800 500" fill="none" preserveAspectRatio="none">
        <rect x="0" y="0" width="800" height="500" stroke="white" strokeWidth="3" rx="4" />
        <line x1="400" y1="0" x2="400" y2="500" stroke="white" strokeWidth="3" />
        <circle cx="400" cy="250" r="70" stroke="white" strokeWidth="3" />
        <circle cx="400" cy="250" r="4" fill="white" />
        <rect x="0" y="150" width="120" height="200" stroke="white" strokeWidth="3" />
        <rect x="680" y="150" width="120" height="200" stroke="white" strokeWidth="3" />
        <rect x="0" y="190" width="50" height="120" stroke="white" strokeWidth="3" />
        <rect x="750" y="190" width="50" height="120" stroke="white" strokeWidth="3" />
      </svg>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 md:px-5 md:py-2 bg-white/10 backdrop-blur-sm text-white text-xs tracking-[0.3em] uppercase font-bold border border-white/20">
            {t.whyDifferent.badge}
          </span>
          <h2 className="mt-4 font-serif text-xl md:text-3xl lg:text-4xl font-bold text-white">
            {t.whyDifferent.title}{" "}
            <span className="text-[#d4a017]">{t.whyDifferent.titleHighlight}</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {t.whyDifferent.items.map((item, i) => {
            const clr = JERSEY_COLORS[i]
            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0a1f0a]/70 backdrop-blur-sm hover:border-[#d4a017]/50 transition-all duration-300"
              >
                {/* Jersey number watermark */}
                <div
                  className="absolute -right-3 -top-4 font-serif text-[80px] md:text-[100px] font-black leading-none opacity-[0.07] select-none pointer-events-none"
                  style={{ color: clr }}
                >
                  {i + 1}
                </div>

                <div className="relative p-5 md:p-6">
                  {/* Jersey number badge */}
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-4 border-2 font-serif text-lg md:text-xl font-black transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{ borderColor: clr, color: clr, background: `${clr}15` }}
                  >
                    {i + 1}
                  </div>
                  <h3 className="font-serif font-bold text-sm md:text-base text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom accent bar */}
                <div className="h-1 w-full transition-opacity duration-300 opacity-40 group-hover:opacity-100" style={{ background: clr }} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
