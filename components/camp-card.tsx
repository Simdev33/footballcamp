"use client"

import { MapPin, Calendar, Users, ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import type { Translations } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export type CampCardCamp = Translations["locations"]["camps"][number]

type CampCardProps = {
  camp: CampCardCamp
  imageSrc: string
  className?: string
  priority?: boolean
}

export function CampCard({ camp, imageSrc, className, priority }: CampCardProps) {
  const { t } = useLanguage()

  return (
    <div className={cn("group relative", className)}>
      <div className="relative overflow-hidden bg-[#0a1f0a] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_100px_#d4a01733]">
        <div className="relative aspect-[16/8] overflow-hidden">
          <Image
            src={imageSrc}
            alt={camp.city}
            fill
            sizes="(max-width: 1024px) 100vw, 420px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <div className="absolute bottom-4 left-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-serif text-2xl font-bold text-white drop-shadow-lg md:text-3xl">{camp.city}</span>
            </div>
            <p className="ml-8 mt-1 text-xs text-white/70">{camp.venue}</p>
          </div>

          <div className="absolute right-4 top-4 bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">
            <Sparkles className="mr-2 inline-block h-4 w-4" />
            {t.locations.earlyBirdBadge}
          </div>
        </div>

        <div className="p-4 lg:p-5">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <div className="mb-3 flex items-center gap-3 text-white/60">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium uppercase tracking-widest">{t.locations.dateLabel}</span>
              </div>
              <p className="text-sm font-semibold text-white">{camp.dates}</p>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-3 text-white/60">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium uppercase tracking-widest">{t.locations.spotsLabel}</span>
              </div>
              <p className="text-sm font-semibold text-white">
                {camp.spots} {t.locations.spots}
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between border-t border-white/10 pt-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">{t.locations.earlyBirdLabel}</p>
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-2xl font-bold text-white md:text-3xl">{camp.earlyBird}</span>
                <span className="text-base text-white/50 line-through decoration-primary/50">{camp.price}</span>
              </div>
            </div>
          </div>

          <Link href="/jelentkezes" className="mt-4 block">
            <span className="flex w-full items-center justify-center gap-2 border-2 border-[#d4a017] px-6 py-3 text-sm font-semibold text-[#d4a017] transition-all duration-300 hover:bg-[#d4a017] hover:text-[#0a1f0a]">
              {camp.cta}
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
        </div>

        <div className="absolute left-0 top-0 h-20 w-20 border-l-2 border-t-2 border-primary/30" />
        <div className="absolute bottom-0 right-0 h-20 w-20 border-b-2 border-r-2 border-primary/30" />
      </div>
    </div>
  )
}
