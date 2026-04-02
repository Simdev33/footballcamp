"use client"

import { useRef, useState } from "react"
import { Globe, GraduationCap, Languages, Trophy } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const iconComponents = [Globe, GraduationCap, Languages, Trophy]

export function USPSection() {
  const { t } = useLanguage()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="text-center mb-14">
          <span className="inline-block px-6 py-2 bg-[#0a1f0a] text-[#d4a017] text-sm tracking-[0.3em] uppercase font-medium">
            {t.usp.badge}
          </span>
          <h2 className="mt-5 font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {t.usp.title}{" "}
            <span className="text-primary">{t.usp.titleHighlight}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {iconComponents.map((Icon, index) => (
            <div
              key={t.usp.items[index].title}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              <div
                className={`relative p-7 md:p-8 bg-card/80 border border-border/50 overflow-hidden transition-all duration-300 ${
                  hoveredIndex === index ? 'border-primary/50 -translate-y-2 shadow-[0_20px_60px_#d4a01733]' : ''
                }`}
              >
                <span className={`absolute -top-4 -right-2 font-serif text-[6rem] font-bold text-primary pointer-events-none transition-opacity duration-300 ${
                  hoveredIndex === index ? 'opacity-15' : 'opacity-5'
                }`}>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className={`relative w-14 h-14 flex items-center justify-center mb-5 transition-all duration-300 ${
                  hoveredIndex === index ? 'bg-primary shadow-[0_0_30px_#d4a01766]' : 'bg-[#0a1f0a]'
                }`}>
                  <Icon
                    className={`w-7 h-7 transition-colors duration-300 ${
                      hoveredIndex === index ? 'text-primary-foreground' : 'text-[#d4a017]'
                    }`}
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="font-serif text-lg md:text-xl font-bold text-foreground mb-2">
                  {t.usp.items[index].title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t.usp.items[index].desc}
                </p>

                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary origin-left transition-transform duration-300 ${
                  hoveredIndex === index ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
