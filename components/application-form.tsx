"use client"

import Image from "next/image"
import { ArrowRight, Shield, CreditCard, Users, BadgePercent } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const TRUST_ITEMS = [
  { Icon: Users, color: "#22c55e" },
  { Icon: BadgePercent, color: "#ef4444" },
  { Icon: CreditCard, color: "#3b82f6" },
] as const

export function ApplicationForm() {
  const { t } = useLanguage()

  return (
    <section className="relative py-14 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="https://focis.b-cdn.net/site/edzes-kozben.jpg"
                alt="Edzés közben"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0a]/60 via-transparent to-transparent" />
            </div>
            <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-full h-full border-2 border-primary/30 -z-10" />
          </div>

          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 md:px-6 md:py-2 bg-[#0a1f0a] text-[#d4a017] text-xs md:text-sm tracking-[0.3em] uppercase font-medium">
              {t.form.badge}
            </span>

            <h2 className="mt-4 md:mt-5 font-serif text-xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.05]">
              {t.form.title} <br />
              <span className="text-primary">{t.form.titleHighlight}</span>
            </h2>

            <p className="mt-4 md:mt-6 text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
              {t.form.subtitle}
            </p>

            <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
              {TRUST_ITEMS.map(({ Icon, color }, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div
                    className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0 rounded-lg transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${color}18` }}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm md:text-base group-hover:text-primary transition-colors">{t.form.trust[i].label}</p>
                    <p className="text-muted-foreground text-xs md:text-sm">{t.form.trust[i].desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 md:mt-10">
              <a
                href="/jelentkezes"
                className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-5 bg-primary text-primary-foreground text-sm md:text-lg font-semibold hover:shadow-[0_20px_50px_#d4a0174d] transition-shadow duration-300"
              >
                <span>{t.form.cta}</span>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            </div>

            <div className="mt-4 md:mt-6 flex items-center gap-2 md:gap-3 text-muted-foreground">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <span className="text-xs md:text-sm">{t.form.security}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
