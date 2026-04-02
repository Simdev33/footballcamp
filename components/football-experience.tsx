"use client"

import { Quote } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function FootballExperience() {
  const { t } = useLanguage()

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://focis.b-cdn.net/Post_2%20Kit/fundo-infantis.png')" }}
        />
        <div className="absolute inset-0 bg-[#0a1f0a]/92" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-8">
          <div className="lg:col-span-3">
            <span className="inline-block px-6 py-2 bg-[#d4a017] text-[#0a1f0a] text-sm tracking-[0.3em] uppercase font-medium">
              {t.experience.badge}
            </span>
            <div className="mt-6 w-24 h-1 bg-gradient-to-r from-primary to-secondary" />
          </div>

          <div className="lg:col-span-9">
            <p className="font-serif text-xl md:text-2xl lg:text-3xl text-white leading-relaxed">
              {t.experience.text1}{" "}
              <span className="text-[#d4a017]">{t.experience.textHighlight}</span>{" "}
              {t.experience.text1End}
            </p>
            <p className="mt-8 text-lg md:text-xl text-primary font-medium">
              {t.experience.text2}
            </p>
          </div>
        </div>

        <div className="mt-16 lg:mt-20">
          <div className="relative bg-white/10 backdrop-blur-sm border border-[#d4a017]/20 p-8 lg:p-10">
            <div className="absolute -top-6 -left-3 w-14 h-14 bg-primary flex items-center justify-center shadow-[0_10px_40px_#d4a0174d]">
              <Quote className="w-7 h-7 text-primary-foreground" />
            </div>

            <blockquote className="relative z-10 pl-8 lg:pl-12">
              <p className="font-serif text-lg md:text-xl lg:text-2xl text-white italic leading-relaxed">
                {t.experience.quote}{" "}
                <span className="text-[#d4a017] not-italic font-bold">{t.experience.quoteHighlight}</span>
              </p>
              <footer className="mt-6 flex items-center gap-4">
                <div className="w-16 h-1 bg-gradient-to-r from-[#d4a017] to-[#b8860b]" />
                <cite className="not-italic">
                  <span className="block font-semibold text-white text-base">{t.experience.quoteAuthor}</span>
                  <span className="block text-white/60">{t.experience.quoteRole}</span>
                </cite>
              </footer>
            </blockquote>

            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#d4a017]/30" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#d4a017]/30" />
          </div>
        </div>
      </div>
    </section>
  )
}
