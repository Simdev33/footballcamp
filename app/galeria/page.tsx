import { db } from "@/lib/db"
import { GALLERY_ALBUMS, FALLBACK_ALBUM, isAlbumSlug } from "@/lib/gallery-albums"
import { GalleryAlbumsView, type AlbumSummary } from "./gallery-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Galéria | KICK OFF Camps",
  description: "Képek és videók a KICK OFF Camps focitáborairól.",
}

export default async function GaleriaPage() {
  try {
    const images = await db.galleryImage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { url: true, category: true },
    })

    const byAlbum = new Map<string, string[]>()
    for (const img of images) {
      const key = isAlbumSlug(img.category) ? img.category : FALLBACK_ALBUM.slug
      const list = byAlbum.get(key) ?? []
      list.push(img.url)
      byAlbum.set(key, list)
    }

    const summaries: AlbumSummary[] = []

    for (const album of GALLERY_ALBUMS) {
      const urls = byAlbum.get(album.slug) ?? []
      const videoCount = album.videos?.length ?? 0
      if (urls.length === 0 && videoCount === 0) continue
      summaries.push({
        slug: album.slug,
        photoCount: urls.length,
        videoCount,
        coverUrl: album.coverUrl || urls[0] || null,
      })
    }

    const fallbackUrls = byAlbum.get(FALLBACK_ALBUM.slug) ?? []
    if (fallbackUrls.length > 0) {
      summaries.push({
        slug: FALLBACK_ALBUM.slug,
        photoCount: fallbackUrls.length,
        videoCount: 0,
        coverUrl: fallbackUrls[0],
      })
    }

    summaries.sort((a, b) => {
      const sa = GALLERY_ALBUMS.find((x) => x.slug === a.slug)?.sortOrder ?? FALLBACK_ALBUM.sortOrder
      const sb = GALLERY_ALBUMS.find((x) => x.slug === b.slug)?.sortOrder ?? FALLBACK_ALBUM.sortOrder
      return sb - sa
    })

    return <GalleryAlbumsView albums={summaries} />
  } catch {
    return <GalleryAlbumsView albums={[]} unavailable />
  }
}
