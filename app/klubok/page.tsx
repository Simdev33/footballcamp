"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Shield } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useSiteImage } from "@/lib/site-images-context"

const BENFICA_LOGO = "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/SL_Benfica_logo.svg/1280px-SL_Benfica_logo.svg.png"

const CLUB_LINKS = ["/klubok/benfica"]
const CLUB_LOGOS = [BENFICA_LOGO]

export default function KlubokPage() {
  const { t } = useLanguage()
  const bannerImg = useSiteImage("klubok.banner")

  return (
    <main>
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={bannerImg}
            alt="Kickoff partner clubs"
            fill
            priority
            className="object-cover"
            unoptimized={bannerImg.includes("b-cdn.net")}
          />
          <div className="absolute inset-0 bg-[#0a1f0a]/85" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#d4a01718_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-12 lg:px-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4a017]/10 border border-[#d4a017]/40 text-[#d4a017] text-[10px] md:text-xs font-bold tracking-[0.35em] uppercase">
            <Shield className="h-3.5 w-3.5" />
            {t.coaches.badge}
          </span>
          <h1 className="mt-5 font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white">
            {t.coaches.title} <span className="text-[#d4a017]">{t.coaches.titleHighlight}</span> {t.coaches.titleEnd}
          </h1>
          <p className="mt-6 text-sm md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            {t.coaches.subtitle}
          </p>
        </div>
      </section>

      <section className="py-14 md:py-24 bg-background">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 lg:px-24">
          <div className="grid md:grid-cols-2 gap-5 md:gap-8">
            {t.coaches.cards.map((club, index) => {
              const href = CLUB_LINKS[index] || "/klubok"
              const logo = CLUB_LOGOS[index]

              return (
                <Link
                  key={club.name}
                  href={href}
                  className="group relative overflow-hidden rounded-xl border border-border/60 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-[#d4a017]" />
                  <div className="flex items-start gap-5">
                    {logo ? (
                      <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-lg bg-[#0a1f0a]/5 p-2">
                        <Image src={logo} alt={club.name} fill sizes="80px" className="object-contain p-2" />
                      </div>
                    ) : (
                      <div className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-lg bg-[#0a1f0a]/5 text-[#d4a017] flex items-center justify-center">
                        <Shield className="h-8 w-8" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {club.name}
                      </h2>
                      <p className="mt-1 text-xs md:text-sm font-semibold uppercase tracking-wider text-[#d4a017]">
                        {club.role}
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 text-sm md:text-base text-muted-foreground leading-relaxed">
                    {club.desc}
                  </p>

                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-300">
                    {club.cta}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
