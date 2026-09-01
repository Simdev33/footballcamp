"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Camera, PlayCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { albumText, getHomeAlbum } from "@/lib/gallery-albums"

type RecapStrings = {
  badge: string
  title: string
  titleHighlight: string
  text: string
  cta: string
  photoBadge: string
  videoBadge: string
}

/**
 * Főoldali visszatekintő szekció a legutóbbi lezajlott táborra.
 * A megjelenített albumot a lib/gallery-albums.ts `showOnHome` mezője határozza meg.
 */
export function CampRecap() {
  const { t, locale } = useLanguage()
  const album = getHomeAlbum()
  const r = (t as unknown as { campRecap?: RecapStrings }).campRecap

  if (!album || !r) return null

  const text = albumText(album, locale)
  const highlights = (album.highlights ?? []).slice(0, 6)
  const hasVideo = (album.videos?.length ?? 0) > 0

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-[#0a1f0a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#d4a0171a_0%,transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* Szöveg */}
          <div>
            <span className="inline-block bg-[#d4a017] px-5 py-2 text-xs font-medium uppercase tracking-[0.3em] text-[#0a1f0a]">
              {r.badge}
            </span>
            <h2 className="mt-5 font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {r.title} <span className="text-[#d4a017]">{r.titleHighlight}</span>
            </h2>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/40">
              {text.dateLabel}
              {album.location ? ` · ${album.location}` : ""}
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">{r.text}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/60">
                <Camera className="h-4 w-4 text-[#d4a017]" />
                {r.photoBadge}
              </span>
              {hasVideo && (
                <span className="inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/60">
                  <PlayCircle className="h-4 w-4 text-[#d4a017]" />
                  {r.videoBadge}
                </span>
              )}
            </div>

            <Link
              href={`/galeria/${album.slug}`}
              className="mt-8 inline-flex items-center gap-2 bg-[#d4a017] px-7 py-3.5 text-sm font-bold text-[#0a1f0a] transition-all duration-300 hover:shadow-[0_0_30px_#d4a01780]"
            >
              {r.cta}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Képmozaik */}
          <Link
            href={`/galeria/${album.slug}`}
            className="group grid grid-cols-3 grid-rows-2 gap-2 md:gap-3"
            aria-label={text.title}
          >
            {highlights.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden border border-[#d4a017]/15 ${
                  i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                }`}
              >
                <Image
                  src={src}
                  alt={`${text.title} – ${i + 1}`}
                  fill
                  sizes={i === 0 ? "(max-width: 1024px) 66vw, 400px" : "(max-width: 1024px) 33vw, 200px"}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#0a1f0a]/10 transition-colors group-hover:bg-[#0a1f0a]/0" />
              </div>
            ))}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#d4a017]/20" />
    </section>
  )
}
