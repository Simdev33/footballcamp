"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { CampCard } from "@/components/camp-card"
import { cn } from "@/lib/utils"
import { useDynamicCamps } from "@/lib/use-dynamic-camps"
const AUTOPLAY_MS = 7000
const CDN = "https://focis.b-cdn.net"

const CAMP_IMAGES = [
  "/benfica-camp.png",
] as const

export function Hero() {
  const { t } = useLanguage()
  const { camps } = useDynamicCamps()
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
    <section className="relative min-h-svh overflow-hidden pb-20 md:pb-36">
      {/* Video background */}
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
        <div className="absolute inset-0 bg-linear-to-b from-[#0a1f0a]/60 via-[#0a1f0a]/80 to-[#0a1f0a]" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a1f0a] via-transparent to-[#0a1f0a]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a1f0a_72%)]" />
      </div>

      {/* Stadium floodlight glow */}
      <div className="absolute top-0 left-[15%] w-[30%] h-[200px] bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.06)_0%,transparent_70%)] pointer-events-none z-1" />
      <div className="absolute top-0 right-[15%] w-[30%] h-[200px] bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.06)_0%,transparent_70%)] pointer-events-none z-1" />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-[1400px] flex-col justify-center px-4 pt-20 md:px-12 md:pt-24 lg:px-24 lg:pt-28">
        <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: text content */}
          <div className="animate-fade-in">
            <span className="inline-block border border-[#d4a017]/40 bg-[#0a1f0a]/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4a017] backdrop-blur-sm md:px-4 md:py-2 md:text-xs mb-5 md:mb-7">
              {t.hero.campBadge}
            </span>

            <h1 className="font-serif text-[clamp(1.8rem,5.5vw,4.2rem)] font-bold leading-[0.92] tracking-tight">
              <span className="block text-white">{t.hero.line1}</span>
              <span className="block text-[#d4a017] mt-1">{t.hero.line2}</span>
              <span className="block text-white/70 mt-1">{t.hero.line3}</span>
            </h1>

            <h2 className="mt-5 md:mt-7 max-w-xl text-sm font-light leading-relaxed text-white/60 md:text-lg">
              {t.hero.subtitle}
            </h2>

            {/* Trust indicators */}
            <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 md:gap-x-6">
              {t.hero.tagline.split("•").map((item, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[11px] md:text-sm font-medium text-[#d4a017]/75">
                  <span className="w-1 h-1 rounded-full bg-[#d4a017]/50" />
                  {item.trim()}
                </span>
              ))}
            </div>

            <div className="mt-6 md:mt-9 flex flex-wrap items-center gap-3 md:gap-5">
              <a
                href="/jelentkezes"
                className="group relative inline-flex items-center gap-2 md:gap-3 overflow-hidden bg-[#d4a017] px-6 py-3.5 md:px-9 md:py-4.5 text-sm md:text-base font-bold text-[#0a1f0a] transition-shadow duration-300 hover:shadow-[0_0_60px_#d4a01780] rounded-sm"
              >
                {t.hero.cta}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
                <p className="text-xs md:text-sm text-white/55 font-medium">{t.hero.earlyLabel}</p>
              </div>
            </div>
          </div>

          {/* Right: camp cards carousel */}
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
              {camps.length > 1 && (
                <>
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
                </>
              )}

              <Carousel
                className="w-full"
                opts={{ loop: true, duration: 30 }}
                setApi={setApi}
              >
                <CarouselContent className="ml-0">
                  {camps.map((camp, index) => (
                    <CarouselItem
                      key={camp.city}
                      className="basis-full min-w-0 shrink-0 grow-0 overflow-hidden pl-0"
                    >
                      <div className="box-border pb-1 pl-4 pr-6 pt-7 md:pl-5 md:pr-7 md:pt-8">
                        <div className="relative isolate">
                          <div className="relative z-10">
                            <CampCard camp={camp} imageSrc={camp.imageUrl || CAMP_IMAGES[index] || CAMP_IMAGES[0]} priority={index === 0} />
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

            {camps.length > 1 && (
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
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-10 flex flex-col items-center md:bottom-8">
        <div className="flex flex-col items-center gap-3 animate-bounce">
          <span className="text-[10px] font-semibold uppercase tracking-[0.5em] text-[#d4a017]/70">
            {t.hero.scroll}
          </span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-[#d4a017]/60">
            <path d="M8 4v12M4 12l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#d4a017]/20 z-10" />
    </section>
  )
}
