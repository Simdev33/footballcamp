"use client"

import Image from "next/image"
import { LocationCards } from "@/components/location-cards"
import { Shirt, Utensils, Dumbbell, Heart, Clock, Sun, Sunset, Moon } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const ICONS = [Shirt, Utensils, Dumbbell, Heart]

const SCHEDULE = [
  { time: "08:00", title: "Reggeli", desc: "Tápláló reggeli a szálláshelyen", icon: Sun, color: "bg-amber-500" },
  { time: "09:00", title: "Délelőtti edzés", desc: "Technikai alapok, labdaérzék fejlesztés", icon: Dumbbell, color: "bg-emerald-600" },
  { time: "11:00", title: "Taktikai tréning", desc: "Pozíciós játék, csapatmunka", icon: Dumbbell, color: "bg-emerald-700" },
  { time: "12:30", title: "Ebéd & pihenő", desc: "Kiegyensúlyozott ebéd és szabad idő", icon: Utensils, color: "bg-orange-500" },
  { time: "14:00", title: "Délutáni foglalkozás", desc: "Speciális készségfejlesztés", icon: Sunset, color: "bg-blue-600" },
  { time: "16:00", title: "Mérkőzések", desc: "Kis pályás meccsek, versenyhelyzetek", icon: Heart, color: "bg-red-500" },
  { time: "18:00", title: "Vacsora & program", desc: "Közös program, csapatépítés", icon: Moon, color: "bg-indigo-600" },
]

export default function TaborokPage() {
  const { t } = useLanguage()

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/field-with-balls.jpg" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[#0a1f0a]/80" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            {t.nav.camps}
          </h1>
          <p className="mt-4 text-lg text-white/60 max-w-xl mx-auto">{t.locations.badge}</p>
          <div className="w-20 h-1 bg-[#d4a017] mx-auto mt-8" />
        </div>
      </section>

      {/* What Kids Get - Icon Grid (full width, not zigzag) */}
      <section className="py-20 md:py-28 bg-[#0a1f0a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-14">
            <span className="inline-block px-6 py-2 bg-[#d4a017] text-[#0a1f0a] text-sm tracking-[0.3em] uppercase font-medium">
              {t.whatKidsGet.badge}
            </span>
            <h2 className="mt-5 font-serif text-3xl md:text-4xl font-bold text-white">
              {t.whatKidsGet.title}{" "}
              <span className="text-[#d4a017]">{t.whatKidsGet.titleHighlight}</span>{" "}
              {t.whatKidsGet.titleEnd}
            </h2>
            <p className="mt-4 text-base text-white/60 max-w-2xl mx-auto">{t.whatKidsGet.subtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.whatKidsGet.items.map((item, index) => {
              const Icon = ICONS[index]
              return (
                <div key={item.title} className="group relative p-8 bg-[#0f2b0f] border border-[#d4a017]/10 hover:border-[#d4a017]/50 transition-all duration-300 text-center">
                  <div className="w-16 h-16 mx-auto mb-5 bg-[#d4a017]/15 flex items-center justify-center group-hover:bg-[#d4a017] transition-colors duration-300">
                    <Icon className="w-8 h-8 text-[#d4a017] group-hover:text-[#0a1f0a] transition-colors" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-[#d4a017] transition-colors">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#d4a017]/20 group-hover:border-[#d4a017]/60 transition-colors" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#d4a017]/20 group-hover:border-[#d4a017]/60 transition-colors" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Daily Schedule - Timeline */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Egy napod <span className="text-[#d4a017]">nálunk</span>
            </h2>
            <div className="w-20 h-1 bg-[#d4a017] mx-auto mt-5" />
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[27px] md:left-[31px] top-0 bottom-0 w-px bg-gradient-to-b from-[#d4a017] via-[#d4a017]/40 to-transparent" />

            <div className="space-y-6">
              {SCHEDULE.map((item) => (
                <div key={item.time} className="relative flex gap-5 md:gap-8 group">
                  {/* Dot */}
                  <div className={`relative z-10 w-14 md:w-16 h-14 md:h-16 flex-shrink-0 ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-6 border-b border-border/30 group-last:border-b-0">
                    <span className="text-xs text-[#d4a017] font-bold tracking-wider">{item.time}</span>
                    <h3 className="font-serif text-lg font-bold text-foreground mt-1 group-hover:text-[#d4a017] transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location Cards */}
      <LocationCards />
    </main>
  )
}
