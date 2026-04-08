"use client"

import { Check, Plane, Dumbbell, Users, Languages, Utensils, Shirt, Heart, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { ZigzagSection } from "@/components/zigzag-section"
import { WhyDifferent } from "@/components/why-different"
import { USPSection } from "@/components/usp-section"
import { LimitedSpots } from "@/components/limited-spots"
import { TargetAudience } from "@/components/target-audience"
import { LocationCards } from "@/components/location-cards"
import { ApplicationForm } from "@/components/application-form"
import { FootballDivider, GrassStrip } from "@/components/football-divider"

const CDN = "https://focis.b-cdn.net"

const KID_ITEMS = [
  { Icon: Plane, color: "#3b82f6" },
  { Icon: Dumbbell, color: "#ef4444" },
  { Icon: Users, color: "#22c55e" },
  { Icon: Languages, color: "#8b5cf6" },
  { Icon: Utensils, color: "#f97316" },
  { Icon: Shirt, color: "#d4a017" },
  { Icon: Heart, color: "#ec4899" },
]

export default function BelowFoldHome() {
  const { t } = useLanguage()

  return (
    <>
      {/* 1. WhySpecial – bevezető szekció */}
      <ZigzagSection
        badge={t.whySpecial.badge}
        title={t.whySpecial.title}
        titleHighlight={t.whySpecial.titleHighlight}
        titleEnd={t.whySpecial.titleEnd}
        text={t.whySpecial.text}
        imageSrc={`${CDN}/site/gyerekek-edzovel.jpg`}
        imageAlt="Gyerekek az edzővel a pályán"
      >
        <div className="space-y-3">
          {t.whySpecial.bullets.map((point) => (
            <div key={point} className="flex items-start gap-3 group">
              <div className="mt-0.5 w-6 h-6 bg-[#d4a017] flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-[#0a1f0a]" />
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                {point}
              </span>
            </div>
          ))}
        </div>
        <Link href="/taborok" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          {t.whySpecial.detailsCta}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </ZigzagSection>

      {/* Grass transition → tactic board */}
      <GrassStrip />

      {/* 2. Ezért más ez a focitábor — taktikai tábla stílus */}
      <WhyDifferent />

      <GrassStrip />

      {/* 3. USP – 11 érv, focipálya felállás */}
      <USPSection />

      {/* 4. Korlátozott létszám CTA — stadion jegy stílus */}
      <LimitedSpots />

      {/* 5. Mit kapsz a táborban? */}
      <ZigzagSection
        reversed
        badge={t.whatKidsGet.badge}
        title={t.whatKidsGet.title}
        titleHighlight={t.whatKidsGet.titleHighlight}
        titleEnd={t.whatKidsGet.titleEnd}
        text={t.whatKidsGet.subtitle}
        imageSrc={`${CDN}/site/edzes-kozben.jpg`}
        imageAlt="Edzés közben a pályán"
      >
        <div className="space-y-3 md:space-y-4">
          {t.whatKidsGet.items.map((item, index) => {
            const kid = KID_ITEMS[index]
            if (!kid) return null
            const { Icon, color } = kid
            return (
              <div key={item.title} className="flex items-start gap-3 md:gap-4 group">
                <div
                  className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center shrink-0 rounded-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color }} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-foreground text-xs md:text-sm group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="text-muted-foreground text-[11px] md:text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </ZigzagSection>

      {/* Pitch center line divider */}
      <FootballDivider />

      {/* 6. Kinek ajánljuk? — csapatlista stílus */}
      <TargetAudience />

      {/* 7. Több mint edzés */}
      <ZigzagSection
        dark
        badge={t.experience.badge}
        title={t.experience.title}
        titleHighlight={t.experience.titleHighlight}
        titleEnd={t.experience.titleEnd}
        text={`${t.experience.text1} ${t.experience.text1End}`}
        imageSrc={`${CDN}/site/gyerekcsapat.jpg`}
        imageAlt="Gyerekcsapat összetartás"
      >
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
          {[
            { value: "15", label: "fő / csoport", color: "#22c55e" },
            { value: "4", label: "edzés / nap", color: "#3b82f6" },
            { value: "5", label: "nap / turnus", color: "#d4a017" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 md:p-4 bg-white/5 border border-white/10 rounded-lg">
              <span className="block font-serif text-xl md:text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
              <span className="block text-white/60 text-[10px] md:text-xs mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
        <blockquote className="relative pl-6 border-l-2 border-[#d4a017]/50">
          <p className="font-serif text-sm text-white/70 italic leading-relaxed">
            &ldquo;{t.experience.text2}&rdquo;
          </p>
        </blockquote>
      </ZigzagSection>

      <GrassStrip />

      {/* 8. Helyszínek */}
      <LocationCards />

      {/* 9. Záró CTA — Transfer window stílus */}
      <ApplicationForm />
    </>
  )
}
