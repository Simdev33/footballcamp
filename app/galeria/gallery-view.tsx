"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Camera, MapPin, PlayCircle } from "lucide-react"
import { SubpageHero } from "@/components/subpage-hero"
import { useLanguage } from "@/lib/language-context"
import { getAlbumBySlug, albumText } from "@/lib/gallery-albums"

export type AlbumSummary = {
  slug: string
  photoCount: number
  videoCount: number
  coverUrl: string | null
}

type GalleryStrings = {
  heroTitle: string
  heroSubtitle: string
  message: string
  empty: string
  photos: string
  videos: string
  openAlbum: string
}

export function GalleryAlbumsView({
  albums,
  unavailable = false,
}: {
  albums: AlbumSummary[]
  unavailable?: boolean
}) {
  const { t, locale } = useLanguage()
  const g = (t as unknown as { galeriaPage: GalleryStrings }).galeriaPage

  return (
    <main>
      <SubpageHero title={g.heroTitle} subtitle={g.heroSubtitle} />

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          {albums.length === 0 ? (
            <p className="text-center py-16 text-muted-foreground text-lg">
              {unavailable ? g.message : g.empty}
            </p>
          ) : (
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album) => {
                const meta = getAlbumBySlug(album.slug)
                if (!meta) return null
                const text = albumText(meta, locale)

                return (
                  <Link
                    key={album.slug}
                    href={`/galeria/${album.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-sm border border-[#d4a017]/20 bg-[#0a1f0a] transition-colors hover:border-[#d4a017]/60"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#0a1f0a]">
                      {album.coverUrl && (
                        <Image
                          src={album.coverUrl}
                          alt={text.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0a] via-[#0a1f0a]/20 to-transparent" />

                      {/* Mappa-jelzés */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-[#d4a017] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#0a1f0a]">
                          <Camera className="h-3.5 w-3.5" />
                          {album.photoCount} {g.photos}
                        </span>
                        {album.videoCount > 0 && (
                          <span className="inline-flex items-center gap-1.5 bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#0a1f0a]">
                            <PlayCircle className="h-3.5 w-3.5" />
                            {album.videoCount} {g.videos}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      {(text.dateLabel || meta.location) && (
                        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase tracking-[0.2em] text-[#d4a017]">
                          {text.dateLabel && <span>{text.dateLabel}</span>}
                          {meta.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {meta.location}
                            </span>
                          )}
                        </div>
                      )}

                      <h2 className="font-serif text-xl md:text-2xl font-bold text-white">{text.title}</h2>
                      <p className="mt-2 text-sm text-white/60">{text.subtitle}</p>

                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#d4a017]">
                        {g.openAlbum}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
