"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Handshake, Phone, Users, Building2, Heart } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const SECTION_ICONS = [Users, Building2, Heart]

const STEPS = [
  { num: "01", title: "Vedd fel velünk a kapcsolatot", desc: "Írj nekünk emailt vagy hívj minket telefonon. Megbeszéljük az elképzeléseidet." },
  { num: "02", title: "Egyeztetjük a részleteket", desc: "Közösen kiválasztjuk a megfelelő időpontot, helyszínt és formátumot." },
  { num: "03", title: "Elkészítjük a közös arculatot", desc: "Marketing anyagokat készítünk a te szervezeted arculatával." },
  { num: "04", title: "Elindítjuk a közös programot", desc: "Mi végezzük a teljes szervezést, te csak a résztvevőidet hozod!" },
]

export default function PartnerprogramPage() {
  const { t } = useLanguage()

  return (
    <main>
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a1f0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#d4a01718_0%,transparent_50%)]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <Handshake className="w-12 h-12 text-[#d4a017] mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            {t.partnerProgram.title}{" "}
            <span className="text-[#d4a017]">{t.partnerProgram.titleHighlight}</span>{" "}
            {t.partnerProgram.titleEnd}
          </h1>
          <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto">{t.partnerProgram.text}</p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12 lg:px-24 space-y-8">
          {t.partnerProgram.sections.map((section, index) => {
            const Icon = SECTION_ICONS[index]
            return (
              <div key={section.title} className="group p-8 md:p-10 bg-white border border-border/50 hover:border-[#d4a017]/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-[#0a1f0a] flex items-center justify-center shrink-0 group-hover:bg-[#d4a017] transition-colors duration-300">
                    <Icon className="w-7 h-7 text-[#d4a017] group-hover:text-[#0a1f0a] transition-colors" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-[#d4a017] transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{section.text}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#0a1f0a]">
        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
              Hogyan <span className="text-[#d4a017]">működik?</span>
            </h2>
            <div className="w-20 h-1 bg-[#d4a017] mx-auto mt-5" />
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-[#d4a017]/30 hidden md:block" />

            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <div key={step.num} className="relative flex gap-6 md:gap-10 group">
                  <div className="relative z-10 w-16 h-16 flex-shrink-0 bg-[#d4a017] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="font-serif text-2xl font-bold text-[#0a1f0a]">{step.num}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#d4a017] transition-colors">{step.title}</h3>
                    <p className="text-white/50 text-sm mt-2 leading-relaxed">{step.desc}</p>
                    {i < STEPS.length - 1 && <div className="w-12 h-px bg-[#d4a017]/30 mt-6" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://focis.b-cdn.net/Post_1%20Camp/03%20Template%20Benfica%20Camp%202025_26-03.png" alt="Kickoff" fill className="object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[#0a1f0a]/85" />
        </div>
        <div className="relative z-10 max-w-[800px] mx-auto px-6 md:px-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
            Készen állsz a <span className="text-[#d4a017]">partneri együttműködésre?</span>
          </h2>
          <p className="mt-6 text-white/60 text-lg">Vedd fel velünk a kapcsolatot és építsünk együtt valami nagyszerűt.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/kapcsolat" className="inline-flex items-center gap-3 px-8 py-4 bg-[#d4a017] text-[#0a1f0a] text-base font-semibold hover:shadow-[0_20px_50px_#d4a0174d] transition-shadow duration-300">
              <Phone className="w-5 h-5" />
              {t.partnerProgram.cta}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
