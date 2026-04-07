"use client"

import { Globe, GraduationCap, Users, Zap, Heart } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const ICONS = [Globe, GraduationCap, Users, Zap, Heart]
const COLORS = ["#3b82f6", "#d4a017", "#22c55e", "#ef4444", "#8b5cf6"]

export function WhyDifferent() {
  const { t } = useLanguage()

  return (
    <section className="relative py-14 md:py-24 overflow-hidden bg-background">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 md:px-5 md:py-2 bg-[#0a1f0a] text-[#d4a017] text-xs tracking-[0.3em] uppercase font-bold">
            {t.whyDifferent.badge}
          </span>
          <h2 className="mt-4 font-serif text-xl md:text-3xl lg:text-4xl font-bold text-foreground">
            {t.whyDifferent.title}{" "}
            <span className="text-[#d4a017]">{t.whyDifferent.titleHighlight}</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {t.whyDifferent.items.map((item, i) => {
            const Icon = ICONS[i]
            const color = COLORS[i]
            return (
              <div
                key={item.title}
                className="group relative p-5 md:p-6 border border-border/50 rounded-xl hover:border-[#d4a017]/40 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color }} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif font-bold text-sm md:text-base text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
