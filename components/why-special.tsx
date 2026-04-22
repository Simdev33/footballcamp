"use client"

import Image from "next/image"
import { Check, Trophy } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useSiteImage } from "@/lib/site-images-context"

export function WhySpecial() {
  const { t } = useLanguage()
  const image = useSiteImage("whySpecial.image")

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a1f0a]" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={image}
                alt="Gyerekek az edzővel"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
                unoptimized={image.includes("b-cdn.net")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0a] via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 md:bottom-6 md:left-6 md:right-6 p-4 md:p-5 bg-[#0a1f0a]/95 border border-[#d4a017]/30 rounded-lg shadow-[0_10px_30px_#d4a01726]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 md:w-12 md:h-12 bg-[#d4a017]/15 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 md:w-6 md:h-6 text-[#d4a017]" />
                  </div>
                  <div>
                    <span className="font-serif text-3xl md:text-4xl font-bold text-[#d4a017]">
                      {t.whySpecial.statValue}
                    </span>
                    <span className="block text-white/60 text-xs md:text-sm mt-0.5">{t.whySpecial.statLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 md:-top-5 md:-left-5 w-full h-full border-2 border-[#d4a017]/25 rounded-lg -z-10" />
          </div>

          <div className="order-1 lg:order-2">
            {t.whySpecial.badge && (
              <span className="inline-block px-6 py-2 bg-[#d4a017] text-[#0a1f0a] text-sm tracking-[0.3em] uppercase font-medium">
                {t.whySpecial.badge}
              </span>
            )}

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
                <div key={point} className="flex items-start gap-3 group">
                  <div className="mt-0.5 w-6 h-6 bg-[#d4a017] flex items-center justify-center shrink-0 group-hover:bg-[#d4a017]/80 transition-all duration-300">
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
