"use client"

import Image from "next/image"
import { Check, Quote } from "lucide-react"
import type { RolunkContent } from "@/lib/rolunk-content"
import { useLanguage } from "@/lib/language-context"

type RolunkViewProps = {
  content: {
    hu: RolunkContent
    en: RolunkContent
  }
  heroImg: string
  missionImg: string
}

export function RolunkView({ content, heroImg, missionImg }: RolunkViewProps) {
  const { t, locale } = useLanguage()
  const current = content[locale]

  return (
    <main>
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroImg} alt="" fill className="object-cover" priority unoptimized={heroImg.includes("b-cdn.net")} />
          <div className="absolute inset-0 bg-[#0a1f0a]/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f0a]/40 via-transparent to-[#0a1f0a]" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="max-w-3xl">
            <span className="inline-block px-5 py-2 bg-[#d4a017] text-[#0a1f0a] text-xs tracking-[0.3em] uppercase font-bold mb-6">
              {current.badge}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05]">
              {current.heroTitle}
            </h1>
            <div
              className="prose prose-invert prose-lg mt-6 text-white/70 leading-relaxed max-w-2xl"
              dangerouslySetInnerHTML={{ __html: current.heroText }}
            />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              <span className="text-[#d4a017]">{current.missionTitle}</span>
            </h2>
            <div
              className="prose prose-sm md:prose-base mt-4 text-muted-foreground max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: current.missionText }}
            />
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

      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a1f0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#d4a01712_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-[900px] mx-auto px-6 md:px-12 text-center">
          <Quote className="w-10 h-10 text-[#d4a017] mx-auto mb-8" />
          <blockquote
            className="font-serif text-2xl md:text-3xl lg:text-4xl text-white italic leading-snug [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: `&ldquo;${current.quote}&rdquo;` }}
          />
          <p className="mt-8 text-[#d4a017] font-medium text-lg">{current.quoteAuthor}</p>
          <div className="w-20 h-1 bg-[#d4a017] mx-auto mt-8" />
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={missionImg} alt="Kickoff" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" loading="lazy" unoptimized={missionImg.includes("b-cdn.net")} />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-[#d4a017]/30 -z-10" />
            </div>
            <div>
              <span className="inline-block px-5 py-2 bg-[#0a1f0a] text-[#d4a017] text-xs tracking-[0.3em] uppercase font-medium mb-4">
                {t.usp.badge}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                {current.uspTitle} <span className="text-[#d4a017]">{current.uspText}</span>
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
