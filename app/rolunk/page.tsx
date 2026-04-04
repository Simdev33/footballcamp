"use client"

import Image from "next/image"
import { Check, Quote, Trophy, Users, Target, Heart } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const STATS = [
  { icon: Trophy, value: "2024", label: "Alapítás éve" },
  { icon: Users, value: "500+", label: "Gyerek eddig" },
  { icon: Target, value: "15+", label: "Profi edző" },
  { icon: Heart, value: "98%", label: "Elégedettség" },
]

export default function RolunkPage() {
  const { t } = useLanguage()

  return (
    <main>
      {/* Hero with background image */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://focis.b-cdn.net/site/gyerekek-edzovel.jpg" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[#0a1f0a]/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f0a]/40 via-transparent to-[#0a1f0a]" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="max-w-3xl">
            <span className="inline-block px-5 py-2 bg-[#d4a017] text-[#0a1f0a] text-xs tracking-[0.3em] uppercase font-bold mb-6">
              Rólunk
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05]">
              {t.whySpecial.title}{" "}
              <span className="text-[#d4a017]">{t.whySpecial.titleHighlight}</span>{" "}
              {t.whySpecial.titleEnd}
            </h1>
            <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-2xl">{t.whySpecial.text}</p>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="relative -mt-12 z-20 max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
          {STATS.map((stat) => (
            <div key={stat.label} className="p-6 md:p-8 text-center border-r border-b border-gray-100 last:border-r-0 md:[&:nth-child(n+3)]:border-b-0 group hover:bg-[#0a1f0a] transition-colors duration-300">
              <stat.icon className="w-6 h-6 text-[#d4a017] mx-auto mb-3" />
              <span className="block font-serif text-3xl md:text-4xl font-bold text-[#0a1f0a] group-hover:text-[#d4a017] transition-colors">{stat.value}</span>
              <span className="block text-xs text-gray-500 group-hover:text-white/60 mt-1 uppercase tracking-wider transition-colors">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Values - Cards Grid */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Miért vagyunk <span className="text-[#d4a017]">különlegesek?</span>
            </h2>
            <div className="w-20 h-1 bg-[#d4a017] mx-auto mt-5" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {t.whySpecial.bullets.map((point, i) => (
              <div key={point} className={`flex items-start gap-4 p-6 border border-border/50 hover:border-[#d4a017]/40 hover:shadow-lg transition-all duration-300 ${i % 2 === 0 ? "bg-white" : "bg-[#0a1f0a] border-[#0a1f0a]"}`}>
                <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${i % 2 === 0 ? "bg-[#d4a017]" : "bg-[#d4a017]/20"}`}>
                  <Check className={`w-5 h-5 ${i % 2 === 0 ? "text-[#0a1f0a]" : "text-[#d4a017]"}`} />
                </div>
                <span className={`text-sm leading-relaxed ${i % 2 === 0 ? "text-foreground" : "text-white/80"}`}>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width Quote */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a1f0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#d4a01712_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-[900px] mx-auto px-6 md:px-12 text-center">
          <Quote className="w-10 h-10 text-[#d4a017] mx-auto mb-8" />
          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-white italic leading-snug">
            &ldquo;{t.experience.text1}{" "}
            <span className="text-[#d4a017] not-italic font-bold">{t.experience.textHighlight}</span>{" "}
            {t.experience.text1End}&rdquo;
          </blockquote>
          <p className="mt-8 text-[#d4a017] font-medium text-lg">{t.experience.text2}</p>
          <div className="w-20 h-1 bg-[#d4a017] mx-auto mt-8" />
        </div>
      </section>

      {/* USP Grid */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src="https://focis.b-cdn.net/Post_1%20Camp/01%20Template%20Benfica%20Camp%202025_26_FEED.png" alt="Kickoff" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" loading="lazy" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-[#d4a017]/30 -z-10" />
            </div>
            <div>
              <span className="inline-block px-5 py-2 bg-[#0a1f0a] text-[#d4a017] text-xs tracking-[0.3em] uppercase font-medium mb-4">
                {t.usp.badge}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                {t.usp.title} <span className="text-[#d4a017]">{t.usp.titleHighlight}</span>
              </h2>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.usp.items.map((item) => (
                  <div key={item.title} className="p-5 bg-[#0a1f0a] group hover:bg-[#d4a017] transition-colors duration-300">
                    <h4 className="font-serif font-bold text-[#d4a017] text-sm group-hover:text-[#0a1f0a] transition-colors">{item.title}</h4>
                    <p className="text-white/60 text-xs mt-2 group-hover:text-[#0a1f0a]/70 transition-colors">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
