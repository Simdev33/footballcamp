"use client"

import Image from "next/image"
import { ArrowRight, Sparkles, Shield, Clock, Users } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const trustIcons = [Users, Sparkles, Clock] as const

export function ApplicationForm() {
  const { t } = useLanguage()

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/edzes-kozben.jpg"
                alt="Edzés közben"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0a]/60 via-transparent to-transparent" />
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full border-2 border-primary/30 -z-10" />
          </div>

          {/* Content */}
          <div>
            <span className="inline-block px-6 py-2 bg-[#0a1f0a] text-[#d4a017] text-sm tracking-[0.3em] uppercase font-medium">
              {t.form.badge}
            </span>

            <h2 className="mt-5 font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.05]">
              {t.form.title} <br />
              <span className="text-primary">{t.form.titleHighlight}</span>
            </h2>

            <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-lg">
              {t.form.subtitle}
            </p>

            <div className="mt-8 space-y-4">
              {trustIcons.map((Icon, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-[#0a1f0a] flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                    <Icon className="w-5 h-5 text-[#d4a017] group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">{t.form.trust[i].label}</p>
                    <p className="text-muted-foreground text-sm">{t.form.trust[i].desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <a
                href="/jelentkezes"
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground text-lg font-semibold hover:shadow-[0_20px_50px_#d4a0174d] transition-shadow duration-300"
              >
                <Sparkles className="w-6 h-6" />
                <span>{t.form.cta}</span>
                <ArrowRight className="w-6 h-6" />
              </a>
            </div>

            <div className="mt-6 flex items-center gap-3 text-muted-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm">{t.form.security}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
