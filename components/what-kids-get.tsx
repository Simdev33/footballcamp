"use client"

import Image from "next/image"
import { Shirt, Utensils, Dumbbell, Heart } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useSiteImage } from "@/lib/site-images-context"

const ICONS = [Shirt, Utensils, Dumbbell, Heart]

export function WhatKidsGet() {
  const { t } = useLanguage()
  const image = useSiteImage("whatKidsGet.image")

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a1f0a]" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="text-center mb-14">
          <span className="inline-block px-6 py-2 bg-[#d4a017] text-[#0a1f0a] text-sm tracking-[0.3em] uppercase font-medium">
            {t.whatKidsGet.badge}
          </span>
          <h2 className="mt-5 font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            {t.whatKidsGet.title}{" "}
            <span className="text-primary">{t.whatKidsGet.titleHighlight}</span>{" "}
            {t.whatKidsGet.titleEnd}
          </h2>
          <p className="mt-4 text-base text-white/60 max-w-2xl mx-auto">{t.whatKidsGet.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={image}
                alt="Gyerekek a focitáborban"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
                unoptimized={image.includes("b-cdn.net")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0a] via-transparent to-transparent" />
            </div>
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#d4a017]/30 -z-10" />
          </div>

          <div className="space-y-5">
            {t.whatKidsGet.items.map((item, index) => {
              const Icon = ICONS[index]
              return (
                <div key={item.title} className="group flex items-start gap-5 p-5 bg-[#0f2b0f] border border-[#d4a017]/10 hover:border-[#d4a017]/40 transition-colors duration-300">
                  <div className="w-14 h-14 flex items-center justify-center flex-shrink-0 bg-[#d4a017]/15 group-hover:bg-[#d4a017] transition-colors duration-300">
                    <Icon className="w-7 h-7 text-[#d4a017] group-hover:text-[#0a1f0a] transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white mb-1 group-hover:text-[#d4a017] transition-colors duration-300">{item.title}</h3>
                    <p className="text-white/60 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
