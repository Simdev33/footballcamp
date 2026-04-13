"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function FAQSection() {
  const { t } = useLanguage()
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0, 1, 2, 3, 4]))

  const toggleIndex = (index: number) => {
    setOpenIndices(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="relative z-10 max-w-[1000px] mx-auto px-6 md:px-12">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {t.faq.title}{" "}
            <span className="text-primary">{t.faq.titleHighlight}</span>
          </h2>
        </div>

        <div className="space-y-3">
          {t.faq.items.map((item, index) => {
            const isOpen = openIndices.has(index)
            return (
              <div
                key={index}
                className={`border transition-all duration-300 ${
                  isOpen ? "border-primary/40 shadow-[0_10px_40px_#d4a01720]" : "border-border/50 hover:border-primary/20"
                }`}
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                >
                  <span className="flex items-center gap-4">
                    <span className={`font-serif text-lg font-bold transition-colors duration-300 ${isOpen ? "text-primary" : "text-primary/40"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={`font-medium text-base transition-colors duration-300 ${isOpen ? "text-foreground" : "text-muted-foreground"}`}>
                      {item.question}
                    </span>
                  </span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
                </button>

                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <div className="px-5 md:px-6 pb-5 md:pb-6 pl-16 md:pl-[4.5rem]">
                      <div className="w-10 h-0.5 bg-gradient-to-r from-primary to-secondary mb-4" />
                      <p className="text-muted-foreground leading-relaxed text-sm">{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
