"use client"

import { Hero } from "@/components/hero"
import { USPSection } from "@/components/usp-section"
import { ZigzagSection } from "@/components/zigzag-section"
import { LocationCards } from "@/components/location-cards"
import { FootballExperience } from "@/components/football-experience"
import { ApplicationForm } from "@/components/application-form"
import { Check, Shirt, Utensils, Dumbbell, Heart, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

const KID_ICONS = [Shirt, Utensils, Dumbbell, Heart]

export default function Home() {
  const { t } = useLanguage()

  return (
    <main>
      <Hero />

      <USPSection />

      {/* Zigzag 1: Rólunk - gyerekek edzővel (image left, content right) */}
      <ZigzagSection
        badge={t.whySpecial.badge}
        title={t.whySpecial.title}
        titleHighlight={t.whySpecial.titleHighlight}
        titleEnd={t.whySpecial.titleEnd}
        text={t.whySpecial.text}
        imageSrc="/gyerekek-edzovel.jpg"
        imageAlt="Gyerekek az edzővel a pályán"
      >
        <div className="space-y-3">
          {t.whySpecial.bullets.map((point) => (
            <div key={point} className="flex items-start gap-3 group">
              <div className="mt-0.5 w-6 h-6 bg-[#d4a017] flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-[#0a1f0a]" />
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                {point}
              </span>
            </div>
          ))}
        </div>
        <Link href="/rolunk" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          {t.coaches.cards[0].cta}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </ZigzagSection>

      {/* Zigzag 2: Csapatszellem - gyerekcsapat (text left, image right, dark) */}
      <ZigzagSection
        reversed
        dark
        badge="Csapatszellem"
        title="Több mint"
        titleHighlight="edzés"
        text="Táborainkban a gyerekek nemcsak technikai tudást szereznek, hanem megtanulnak együtt dolgozni, egymást támogatni és csapatban gondolkodni. Az összetartozás érzése az, ami igazán különlegessé teszi a tábori élményt – és ami a pályán kívül is elkíséri őket."
        imageSrc="/gyerekcsapat.jpg"
        imageAlt="Gyerekcsapat összetartás"
      >
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "40", label: "fő / tábor" },
            { value: "4", label: "edzés / nap" },
            { value: "5", label: "nap / turnus" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-white/10 border border-[#d4a017]/20">
              <span className="block font-serif text-2xl font-bold text-[#d4a017]">{stat.value}</span>
              <span className="block text-white/60 text-xs mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </ZigzagSection>

      {/* Zigzag 3: Mit kap a gyerek - edzés közben (image left, content right) */}
      <ZigzagSection
        badge={t.whatKidsGet.badge}
        title={t.whatKidsGet.title}
        titleHighlight={t.whatKidsGet.titleHighlight}
        titleEnd={t.whatKidsGet.titleEnd}
        text={t.whatKidsGet.subtitle}
        imageSrc="/edzes-kozben.jpg"
        imageAlt="Edzés közben a pályán"
      >
        <div className="space-y-4">
          {t.whatKidsGet.items.map((item, index) => {
            const Icon = KID_ICONS[index]
            return (
              <div key={item.title} className="flex items-start gap-4 group">
                <div className="w-11 h-11 bg-[#0a1f0a] flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-all duration-300">
                  <Icon className="w-5 h-5 text-[#d4a017] group-hover:text-primary-foreground transition-colors" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-foreground text-sm group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="text-muted-foreground text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
        <Link href="/taborok" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          {t.nav.camps} részletek
          <ArrowRight className="w-4 h-4" />
        </Link>
      </ZigzagSection>

      <LocationCards />

      {/* Zigzag 4: Futball élmény - kickoff labdával (text left, image right, dark) */}
      <ZigzagSection
        reversed
        dark
        badge={t.experience.badge}
        title={t.experience.text1}
        titleHighlight={t.experience.textHighlight}
        titleEnd={t.experience.text1End}
        text={t.experience.text2}
        imageSrc="https://focis.b-cdn.net/Post_2%20Kit/fundo-iniciados-juvenis.png"
        imageAlt="Benfica Football Camp"
      >
        <blockquote className="relative pl-6 border-l-2 border-[#d4a017]/50">
          <p className="font-serif text-base text-white/80 italic leading-relaxed">
            &ldquo;{t.experience.quote}{" "}
            <span className="text-[#d4a017] not-italic font-bold">{t.experience.quoteHighlight}</span>&rdquo;
          </p>
          <footer className="mt-4">
            <span className="block font-semibold text-white text-sm">{t.experience.quoteAuthor}</span>
            <span className="block text-white/60 text-xs">{t.experience.quoteRole}</span>
          </footer>
        </blockquote>
      </ZigzagSection>

      <ApplicationForm />
    </main>
  )
}
