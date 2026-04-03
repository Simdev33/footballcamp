"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Users } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { CampCard } from "@/components/camp-card"
import { cn } from "@/lib/utils"

const AUTOPLAY_MS = 7000
const CDN = "https://focis.b-cdn.net"

const CAMP_IMAGES = [
  `${CDN}/Post_1%20Camp/02%20Template%20Benfica%20Camp%202025_26-02.png`,
  `${CDN}/Post_1%20Camp/01%20Template%20Benfica%20Camp%202025_26_FEED.png`,
] as const

export function Hero() {
  const { t } = useLanguage()
  const camps = t.locations.camps
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const onSelect = useCallback((embla: CarouselApi) => {
    if (!embla) return
    setCurrent(embla.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api) return
    onSelect(api)
    const handleSelect = () => onSelect(api)
    api.on("select", handleSelect)
    return () => {
      api.off("select", handleSelect)
    }
  }, [api, onSelect])

  useEffect(() => {
    if (!api) return
    const id = window.setInterval(() => {
      api.scrollNext()
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [api])

  return (
    <section className="relative min-h-[100svh] overflow-hidden pb-20 md:pb-36">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={`${CDN}/site/hero-bg.mp4`} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f0a]/60 via-[#0a1f0a]/80 to-[#0a1f0a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f0a] via-transparent to-[#0a1f0a]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a1f0a_72%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-center px-4 pt-20 md:px-12 md:pt-24 lg:px-24 lg:pt-28">
        <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-in">
            <span className="inline-block border border-[#d4a017]/40 bg-[#0a1f0a]/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4a017] backdrop-blur-sm md:px-4 md:py-2 md:text-sm">
              {t.hero.campBadge}
            </span>

            <div className="mb-4 mt-4 md:mb-6 md:mt-6 inline-flex flex-wrap items-center gap-2 md:gap-3">
              <div className="h-3 w-3 md:h-4 md:w-4 animate-pulse rounded-full bg-[#d4a017]" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/80 md:text-base md:tracking-[0.3em]">
                {t.hero.location}
              </span>
              <Users className="h-4 w-4 md:h-5 md:w-5 text-[#d4a017]" />
            </div>

            <h1 className="font-serif text-[clamp(1.6rem,5vw,4rem)] font-bold leading-[0.95] tracking-tight">
              <span className="block text-white">{t.hero.line1}</span>
              <span className="block text-[#d4a017]">{t.hero.line2}</span>
              <span className="block text-white/75">{t.hero.line3}</span>
            </h1>

            <p className="mt-4 md:mt-6 max-w-xl text-sm font-light leading-relaxed text-white/65 md:text-lg">
              {t.hero.subtitle}
            </p>
            <p className="mt-2 md:mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#d4a017]/80 md:text-base">
              {t.hero.tagline}
            </p>

            <div className="mt-5 md:mt-8 flex flex-wrap items-center gap-3 md:gap-4">
              <a
                href="/jelentkezes"
                className="group relative inline-flex items-center gap-2 md:gap-3 overflow-hidden bg-[#d4a017] px-5 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold text-[#0a1f0a] transition-shadow duration-300 hover:shadow-[0_0_50px_#d4a01780]"
              >
                {t.hero.cta}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              <p className="text-sm text-white/55">{t.hero.earlyLabel}</p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-lg">
            <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-[#d4a017] lg:text-left">
              {t.hero.pickLocation}
            </p>

            <div className="mb-5 flex justify-center gap-2 lg:justify-start">
              {camps.map((c, i) => (
                <button
                  key={c.city}
                  type="button"
                  onClick={() => api?.scrollTo(i)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200",
                    current === i
                      ? "border-[#d4a017] bg-[#d4a017] text-[#0a1f0a]"
                      : "border-white/20 bg-black/30 text-white/80 backdrop-blur-sm hover:border-white/40 hover:text-white",
                  )}
                  aria-pressed={current === i}
                  aria-label={c.city}
                >
                  {c.city}
                </button>
              ))}
            </div>

            <div className="relative px-0 sm:px-10 lg:px-12">
              <button
                type="button"
                onClick={() => api?.scrollPrev()}
                className="absolute left-0 top-[42%] z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:flex"
                aria-label={t.hero.carouselPrev}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => api?.scrollNext()}
                className="absolute right-0 top-[42%] z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:flex"
                aria-label={t.hero.carouselNext}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <Carousel
                className="w-full"
                opts={{ loop: true, duration: 30 }}
                setApi={setApi}
              >
                <CarouselContent className="-ml-0">
                  {camps.map((camp, index) => (
                    <CarouselItem
                      key={camp.city}
                      className="basis-full min-w-0 shrink-0 grow-0 overflow-hidden pl-0"
                    >
                      <div className="box-border pb-1 pl-4 pr-6 pt-7 md:pl-5 md:pr-7 md:pt-8">
                        <div className="relative isolate">
                          <div className="relative z-10">
                            <CampCard camp={camp} imageSrc={CAMP_IMAGES[index] ?? CAMP_IMAGES[0]} priority={index === 0} />
                          </div>
                          <div
                            className="pointer-events-none absolute inset-0 -z-10 translate-x-2.5 -translate-y-2.5 border-2 border-[#d4a017]/35 md:translate-x-3 md:-translate-y-3"
                            aria-hidden
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            <div className="mt-8 flex justify-center gap-2.5 lg:justify-start" aria-label={t.hero.pickLocation}>
              {camps.map((camp, i) => (
                <button
                  key={camp.city}
                  type="button"
                  onClick={() => api?.scrollTo(i)}
                  className={cn(
                    "h-2.5 rounded-full transition-[width,background-color] duration-300",
                    current === i ? "w-10 bg-[#d4a017]" : "w-2.5 bg-white/35 hover:bg-white/55",
                  )}
                  aria-label={camp.city}
                  aria-current={current === i ? "true" : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-10 flex flex-col items-center md:bottom-8">
        <div className="pointer-events-none flex flex-col items-center gap-5 animate-bounce">
          <span className="text-[11px] font-medium uppercase tracking-[0.45em] text-[#d4a017]">
            {t.hero.scroll}
          </span>
          <div className="h-14 w-px bg-gradient-to-b from-[#d4a017] via-[#d4a017]/50 to-transparent" />
        </div>
      </div>
    </section>
  )
}
