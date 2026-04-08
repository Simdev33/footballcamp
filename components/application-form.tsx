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
      <div className="absolute inset-0 bg-[#0a1f0a]" />

      {/* Stadium atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#d4a01712_0%,transparent_50%)]" />

      {/* Pitch lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <rect x="40" y="30" width="720" height="540" stroke="white" strokeWidth="2" fill="none" />
        <line x1="400" y1="30" x2="400" y2="570" stroke="white" strokeWidth="2" />
        <circle cx="400" cy="300" r="80" stroke="white" strokeWidth="2" fill="none" />
        <rect x="40" y="180" width="140" height="240" stroke="white" strokeWidth="2" fill="none" />
        <rect x="580" y="180" width="180" height="240" stroke="white" strokeWidth="2" fill="none" />
      </svg>

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="https://focis.b-cdn.net/site/edzes-kozben.jpg"
                alt="Edzés közben"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0a] via-transparent to-transparent" />

              {/* "Signing day" overlay badge */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                <div className="bg-[#0a1f0a]/90 backdrop-blur-sm border border-[#d4a017]/30 p-4 md:p-5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 text-[#d4a017] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
                      <polyline points="14,3 14,8 21,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <div>
                      <span className="block text-[#d4a017] text-xs md:text-sm font-bold uppercase tracking-wider">Jelentkezés nyitva</span>
                      <span className="block text-white/60 text-[10px] md:text-xs mt-0.5">Korlátozott helyek — ne maradj le!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-full h-full border-2 border-[#d4a017]/30 rounded-lg -z-10" />
          </div>

          <div>
            <span className="inline-block px-4 py-1.5 md:px-6 md:py-2 bg-[#d4a017] text-[#0a1f0a] text-xs md:text-sm tracking-[0.3em] uppercase font-bold">
              {t.form.badge}
            </span>

            <h2 className="mt-4 md:mt-5 font-serif text-xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.05]">
              {t.form.title} <br />
              <span className="text-[#d4a017]">{t.form.titleHighlight}</span>
            </h2>

            <p className="mt-4 md:mt-6 text-sm md:text-base text-white/65 leading-relaxed max-w-lg">
              {t.form.subtitle}
            </p>

            <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
              {TRUST_ITEMS.map(({ Icon, color }, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div
                    className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center shrink-0 rounded-lg transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${color}20` }}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm md:text-base group-hover:text-[#d4a017] transition-colors">{t.form.trust[i].label}</p>
                    <p className="text-white/50 text-xs md:text-sm">{t.form.trust[i].desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 md:mt-10">
              <a
                href="/jelentkezes"
                className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-5 bg-[#d4a017] text-[#0a1f0a] text-sm md:text-lg font-bold hover:shadow-[0_20px_50px_#d4a0174d] transition-all duration-300"
              >
                <span>{t.form.cta}</span>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            </div>

            <div className="mt-4 md:mt-6 flex items-center gap-2 md:gap-3 text-white/50">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-[#d4a017]" />
              <span className="text-xs md:text-sm">{t.form.security}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
