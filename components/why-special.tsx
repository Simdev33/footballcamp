"use client"

import { useRef } from "react"
import Image from "next/image"
import { Check, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function WhySpecial() {
  const { t } = useLanguage()

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a1f0a]" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/gyerekek-edzovel.jpg"
                alt="Gyerekek az edzővel"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0a] via-transparent to-transparent" />

              {/* Stat card */}
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#0a1f0a]/95 border border-[#d4a017]/30 shadow-[0_10px_30px_#d4a01726]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0a1f0a] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#d4a017]" />
                  </div>
                  <div>
                    <span className="font-serif text-4xl font-bold text-primary">
                      {t.whySpecial.statValue}
                    </span>
                    <span className="block text-white/60 text-sm mt-1">{t.whySpecial.statLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-[#d4a017]/30 -z-10" />
            <div className="absolute -bottom-6 -right-6 w-1/2 h-1/2 bg-[#d4a017]/10 -z-20" />
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-6 py-2 bg-[#d4a017] text-[#0a1f0a] text-sm tracking-[0.3em] uppercase font-medium">
              {t.whySpecial.badge}
            </span>

            <h2 className="mt-5 font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-[1.1]">
              {t.whySpecial.title}{" "}
              <span className="text-[#d4a017]">{t.whySpecial.titleHighlight}</span>{" "}
              {t.whySpecial.titleEnd}
            </h2>

            <p className="mt-6 text-base text-white/70 leading-relaxed">
              {t.whySpecial.text}
            </p>

            <div className="mt-8 space-y-4">
              {t.whySpecial.bullets.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 group"
                >
                  <div className="mt-0.5 w-6 h-6 bg-[#d4a017] flex items-center justify-center flex-shrink-0 group-hover:bg-[#d4a017]/80 transition-all duration-300">
                    <Check className="w-4 h-4 text-[#0a1f0a]" />
                  </div>
                  <span className="text-sm text-white/80 group-hover:text-[#d4a017] transition-colors">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
