"use client"

import { useState } from "react"
import { ArrowRight, Handshake } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CoachesSection() {
  const { t } = useLanguage()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-background to-card/40" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-6 py-2 bg-[#0a1f0a] text-[#d4a017] text-sm tracking-[0.3em] uppercase font-medium">
            {t.coaches.badge}
          </span>
          <h2 className="mt-5 font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.05]">
            {t.coaches.title}{" "}
            <span className="text-primary">{t.coaches.titleHighlight}</span>{" "}
            {t.coaches.titleEnd}
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
            {t.coaches.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {t.coaches.cards.map((card, index) => (
            <div
              key={card.name}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative bg-card border overflow-hidden transition-all duration-300 ${
                hoveredIndex === index
                  ? "border-primary/50 -translate-y-1 shadow-[0_20px_60px_#d4a01726]"
                  : "border-border/50"
              }`}
            >
              {/* Top accent */}
              <div className={`h-1 bg-gradient-to-r from-primary to-secondary transition-transform duration-300 origin-left ${
                hoveredIndex === index ? "scale-x-100" : "scale-x-0"
              }`} />

              <div className="p-6 lg:p-8">
                {/* Icon + Name */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-14 h-14 flex items-center justify-center transition-all duration-300 ${
                    index === 0
                      ? "bg-[#0a1f0a]"
                      : hoveredIndex === index
                        ? "bg-primary"
                        : "bg-[#0a1f0a]/10 border-2 border-dashed border-[#0a1f0a]/30"
                  }`}>
                    {index === 0 ? (
                      <span className="text-[#d4a017] font-serif font-bold text-2xl">B</span>
                    ) : (
                      <Handshake className={`w-7 h-7 transition-colors duration-300 ${
                        hoveredIndex === index ? "text-primary-foreground" : "text-[#0a1f0a]"
                      }`} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">{card.name}</h3>
                    <p className="text-xs text-primary font-medium tracking-wide uppercase">{card.role}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-secondary mb-4" />

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {card.desc}
                </p>

                {/* CTA */}
                <a
                  href={index === 0 ? "#rolunk" : "#kapcsolat"}
                  className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${
                    hoveredIndex === index ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {card.cta}
                  <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                    hoveredIndex === index ? "translate-x-1" : ""
                  }`} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
