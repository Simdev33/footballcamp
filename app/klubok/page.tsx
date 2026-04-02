"use client"

import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

const FAMOUS_PLAYERS = [
  "João Félix", "Bernardo Silva", "Rúben Dias", "Gonçalo Ramos",
  "Ángel Di María", "Jan Oblak", "Ederson", "Renato Sanches",
]

const STATS = [
  { value: "120+", label: "év történelem" },
  { value: "80+", label: "országban jelen" },
  { value: "50+", label: "profi akadémiai végzős" },
  { value: "#1", label: "portugál akadémia" },
]

export default function KlubokPage() {
  const { t } = useLanguage()

  return (
    <main>
      {/* Full-bleed hero with giant Benfica branding */}
      <section className="relative pt-36 pb-28 md:pt-44 md:pb-36 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a1f0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#d4a01720_0%,transparent_50%)]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#d4a017] to-[#b8860b] flex items-center justify-center">
                  <span className="text-[#0a1f0a] font-serif font-bold text-4xl">B</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-bold text-white">SL Benfica</span>
                  <span className="block text-sm text-[#d4a017] tracking-widest uppercase">Football Academy</span>
                </div>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05]">
                {t.coaches.badge}
              </h1>
              <p className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">{t.coaches.subtitle}</p>
            </div>
            {/* Stats on the right */}
            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
              {STATS.map((stat) => (
                <div key={stat.label} className="p-6 bg-white/5 border border-[#d4a017]/20 text-center min-w-[140px] hover:bg-[#d4a017]/10 transition-colors duration-300">
                  <span className="block font-serif text-3xl md:text-4xl font-bold text-[#d4a017]">{stat.value}</span>
                  <span className="block text-white/50 text-xs mt-2 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Club Description - Alternating blocks (not zigzag component) */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Wide text column */}
            <div className="lg:col-span-3">
              <span className="inline-block px-5 py-2 bg-[#0a1f0a] text-[#d4a017] text-xs tracking-[0.3em] uppercase font-medium mb-4">
                {t.coaches.cards[0].role}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Világszínvonalú <span className="text-[#d4a017]">utánpótlás-nevelés</span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                A Benfica akadémia a világ egyik legelismertebb utánpótlás-műhelye. Az akadémia módszertana a technikai kiválóságra, a taktikai intelligenciára és a mentális erősségre épül.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">{t.coaches.cards[0].desc}</p>
            </div>
            {/* Narrow image */}
            <div className="lg:col-span-2 relative">
              <div className="aspect-[3/4] overflow-hidden relative">
                <Image src="/gyerekek-edzovel.jpg" alt="Edzők és gyerekek" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" loading="lazy" />
              </div>
              <div className="absolute -bottom-3 -left-3 w-full h-full border-2 border-[#d4a017]/30 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Famous Alumni - Marquee-style */}
      <section className="py-16 bg-[#0a1f0a] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 mb-10 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
            Akadémiai <span className="text-[#d4a017]">végzősök</span>
          </h2>
          <p className="mt-3 text-white/50 text-sm">Néhány név a világhírű Benfica akadémiáról</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 max-w-[1000px] mx-auto px-6">
          {FAMOUS_PLAYERS.map((player, i) => (
            <span
              key={player}
              className={`px-6 py-3 font-serif text-lg font-bold border transition-colors duration-300 ${
                i % 3 === 0
                  ? "bg-[#d4a017] text-[#0a1f0a] border-[#d4a017]"
                  : "bg-transparent text-white/80 border-[#d4a017]/30 hover:bg-[#d4a017]/10"
              }`}
            >
              {player}
            </span>
          ))}
        </div>
      </section>

      {/* Second coach/club */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-2 relative order-2 lg:order-1">
              <div className="aspect-[3/4] overflow-hidden relative">
                <Image src="/soccer-ball-field.jpg" alt="Futball pálya" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" loading="lazy" />
              </div>
              <div className="absolute -top-3 -right-3 w-full h-full border-2 border-[#d4a017]/30 -z-10" />
            </div>
            <div className="lg:col-span-3 order-1 lg:order-2">
              <span className="inline-block px-5 py-2 bg-[#0a1f0a] text-[#d4a017] text-xs tracking-[0.3em] uppercase font-medium mb-4">
                {t.coaches.cards[1].role}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {t.coaches.cards[1].name}
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">{t.coaches.cards[1].desc}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
