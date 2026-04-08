"use client"

import { useLanguage } from "@/lib/language-context"

const ACCENT_COLORS = ["#d4a017", "#22c55e", "#3b82f6", "#8b5cf6", "#ef4444"]

export function TargetAudience() {
  const { t } = useLanguage()

  return (
    <section className="relative py-14 md:py-24 overflow-hidden">
      {/* Dark green pitch-like background */}
      <div className="absolute inset-0 bg-[#0e2e14]" />
      {/* Mowing stripe texture */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.008)_0px,rgba(255,255,255,0.008)_60px,transparent_60px,transparent_120px)]" />
      {/* Stadium glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-32 bg-[radial-gradient(ellipse_at_top,#d4a01712_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-[900px] mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 md:px-5 md:py-2 bg-[#d4a017] text-[#0a1f0a] text-xs tracking-[0.3em] uppercase font-bold">
            {t.targetAudience.badge}
          </span>
          <h2 className="mt-4 font-serif text-xl md:text-3xl lg:text-4xl font-bold text-white">
            {t.targetAudience.title}{" "}
            <span className="text-[#d4a017]">{t.targetAudience.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-white/55 max-w-2xl mx-auto leading-relaxed">
            {t.targetAudience.text}
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {t.targetAudience.items.map((item, i) => (
            <div
              key={i}
              className="group flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.07] hover:border-[#d4a017]/30 transition-all duration-300"
            >
              {/* Jersey-style number */}
              <div
                className="w-11 h-11 md:w-13 md:h-13 rounded-lg flex items-center justify-center shrink-0 font-serif text-lg md:text-xl font-black border-2 transition-transform duration-200 group-hover:scale-110"
                style={{
                  borderColor: `${ACCENT_COLORS[i]}60`,
                  color: ACCENT_COLORS[i],
                  background: `${ACCENT_COLORS[i]}12`,
                }}
              >
                {i + 1}
              </div>

              <span className="text-sm md:text-base text-white/85 font-medium leading-snug group-hover:text-white transition-colors">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
