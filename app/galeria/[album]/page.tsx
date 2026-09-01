import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { GALLERY_ALBUMS, FALLBACK_ALBUM, getAlbumBySlug } from "@/lib/gallery-albums"
import { AlbumView, type AlbumPhoto } from "./album-view"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ album: string }> }) {
  const { album: slug } = await params
  const album = getAlbumBySlug(slug)
  if (!album) return { title: "Galéria | KICK OFF Camps" }
  return {
    title: `${album.title.hu} | Galéria | KICK OFF Camps`,
    description: album.description.hu,
    openGraph: {
      title: album.title.hu,
      description: album.description.hu,
      images: album.coverUrl ? [album.coverUrl] : undefined,
    },
  }
}

export default async function AlbumPage({ params }: { params: Promise<{ album: string }> }) {
  const { album: slug } = await params
  const album = getAlbumBySlug(slug)
  if (!album) notFound()

  let photos: AlbumPhoto[] = []
  try {
    const rows = await db.galleryImage.findMany({
      where:
        slug === FALLBACK_ALBUM.slug
          ? { category: { notIn: GALLERY_ALBUMS.map((a) => a.slug) } }
          : { category: slug },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, url: true, alt: true },
    })
    photos = rows.map((r) => ({ id: r.id, url: r.url, alt: r.alt }))
  } catch {
    photos = []
  }

  // A beállított albumok akkor is elérhetők, ha még nincs bennük kép (feltöltés
  // előtt „még nincsenek képek” üzenet jelenik meg 404 helyett). Csak a gyűjtő-
  // album 404-ezik, ha üres, mert annak külön nincs értelme.
  if (photos.length === 0 && !album.videos?.length && slug === FALLBACK_ALBUM.slug) notFound()

  return <AlbumView slug={slug} photos={photos} />
}
