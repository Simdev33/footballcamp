"use client"

import { Check } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function TargetAudience() {
  const { t } = useLanguage()

  return (
    <section className="relative py-14 md:py-24 overflow-hidden bg-background">
      <div className="max-w-[900px] mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-block px-4 py-1.5 md:px-5 md:py-2 bg-[#0a1f0a] text-[#d4a017] text-xs tracking-[0.3em] uppercase font-bold">
            {t.targetAudience.badge}
          </span>
          <h2 className="mt-4 font-serif text-xl md:text-3xl lg:text-4xl font-bold text-foreground">
            {t.targetAudience.title}{" "}
            <span className="text-[#d4a017]">{t.targetAudience.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.targetAudience.text}
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {t.targetAudience.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl border border-border/50 bg-white hover:border-[#d4a017]/40 hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#22c55e]/15 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#22c55e]/25 transition-colors">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-[#22c55e]" />
              </div>
              <span className="text-sm md:text-base text-foreground font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
