"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react"
import { SubpageHero } from "@/components/subpage-hero"
import { useLanguage } from "@/lib/language-context"
import { albumText, getAlbumBySlug } from "@/lib/gallery-albums"

export type AlbumPhoto = { id: string; url: string; alt: string }

type GalleryStrings = {
  heroTitle: string
  empty: string
  photos: string
  backToAlbums: string
  videoTitle: string
  photosTitle: string
  ctaTitle: string
  ctaText: string
  ctaButton: string
}

export function AlbumView({ slug, photos }: { slug: string; photos: AlbumPhoto[] }) {
  const { t, locale } = useLanguage()
  const g = (t as unknown as { galeriaPage: GalleryStrings }).galeriaPage
  const album = getAlbumBySlug(slug)
  const [index, setIndex] = useState<number | null>(null)

  const close = useCallback(() => setIndex(null), [])
  const prev = useCallback(
    () => setIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  )
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length],
  )

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [index, close, prev, next])

  if (!album) return null
  const text = albumText(album, locale)

  return (
    <main>
      <SubpageHero title={text.title} subtitle={text.subtitle} />

      <section className="bg-background py-12 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-[#d4a017]"
          >
            <ArrowLeft className="h-4 w-4" />
            {g.backToAlbums}
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.2em] text-[#d4a017]">
            {text.dateLabel && <span>{text.dateLabel}</span>}
            {album.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {album.location}
              </span>
            )}
            {photos.length > 0 && (
              <span>
                {photos.length} {g.photos}
              </span>
            )}
          </div>

          {text.description && (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {text.description}
            </p>
          )}

          {/* Videó */}
          {album.videos && album.videos.length > 0 && (
            <div className="mt-12">
              <h2 className="font-serif text-2xl font-bold md:text-3xl">{g.videoTitle}</h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {album.videos.map((video, i) => (
                  <figure
                    key={i}
                    className={`overflow-hidden rounded-sm border border-[#d4a017]/20 bg-[#0a1f0a] ${
                      video.aspect === "9/16" ? "mx-auto w-full max-w-sm" : ""
                    }`}
                  >
                    <div className="relative" style={{ aspectRatio: video.aspect ?? "16 / 9" }}>
                      {video.kind === "embed" ? (
                        <iframe
                          src={video.url}
                          title={video.title[locale] ?? video.title.hu}
                          loading="lazy"
                          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full border-0"
                        />
                      ) : (
                        <video
                          controls
                          preload="none"
                          playsInline
                          poster={video.poster}
                          className="absolute inset-0 h-full w-full bg-black object-contain"
                        >
                          <source src={video.url} type="video/mp4" />
                        </video>
                      )}
                    </div>
                    <figcaption className="px-5 py-4 text-sm font-semibold text-white">
                      {video.title[locale] ?? video.title.hu}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          {/* Képek */}
          <div className="mt-12">
            <h2 className="font-serif text-2xl font-bold md:text-3xl">{g.photosTitle}</h2>

            {photos.length === 0 ? (
              <p className="mt-6 text-muted-foreground">{g.empty}</p>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4">
                {photos.map((photo, i) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={photo.alt || `${text.title} - ${i + 1}`}
                    className="group relative aspect-[4/3] cursor-pointer overflow-hidden border border-[#d4a017]/10 bg-[#0a1f0a]"
                  >
                    <Image
                      src={photo.url}
                      alt={photo.alt || `${text.title} - ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading={i < 8 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-[#0a1f0a]/0 transition-colors group-hover:bg-[#0a1f0a]/30" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-16 border border-[#d4a017]/30 bg-[#0a1f0a] p-8 text-center md:p-12">
            <h2 className="font-serif text-2xl font-bold text-white md:text-3xl">{g.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/60">{g.ctaText}</p>
            <Link
              href="/jelentkezes"
              className="mt-6 inline-flex min-h-12 items-center justify-center bg-[#d4a017] px-8 text-sm font-bold uppercase tracking-[0.15em] text-[#0a1f0a] transition-colors hover:bg-[#e0b02a]"
            >
              {g.ctaButton}
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {index !== null && photos[index] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); close() }}
            aria-label="Bezárás"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center bg-white/10 transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev() }}
                aria-label="Előző kép"
                className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center bg-white/10 transition-colors hover:bg-white/20 md:left-6"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label="Következő kép"
                className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center bg-white/10 transition-colors hover:bg-white/20 md:right-6"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </>
          )}

          <div className="relative h-[80vh] w-[92vw] max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[index].url}
              alt={photos[index].alt || `${text.title} - ${index + 1}`}
              fill
              sizes="92vw"
              className="object-contain"
              priority
            />
          </div>

          <div className="absolute bottom-5 left-0 right-0 px-6 text-center text-sm text-white/60">
            {photos[index].alt && <span className="mr-3 text-white/80">{photos[index].alt}</span>}
            {index + 1} / {photos.length}
          </div>
        </div>
      )}
    </main>
  )
}
