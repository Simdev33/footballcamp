import { db } from "@/lib/db"
import { deleteGalleryImage } from "@/lib/actions"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ChevronLeft, ChevronRight, ImageIcon, ExternalLink } from "lucide-react"
import { GalleryForm } from "@/components/admin/gallery-form"
import { GalleryBulkUpload } from "@/components/admin/gallery-bulk-upload"
import { PageHeader } from "@/components/admin/page-header"
import { GALLERY_ALBUMS, FALLBACK_ALBUM, isAlbumSlug } from "@/lib/gallery-albums"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 24

const LEGACY_LABELS: Record<string, string> = {
  general: "Általános",
  training: "Edzés",
  match: "Mérkőzés",
  team: "Csapat",
  event: "Esemény",
}

function categoryLabel(category: string) {
  const album = GALLERY_ALBUMS.find((a) => a.slug === category)
  if (album) return album.title.hu
  return LEGACY_LABELS[category] ?? category
}

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; mappa?: string }>
}) {
  const sp = await searchParams
  const currentPage = Math.max(1, Number(sp.page) || 1)
  const albumFilter = sp.mappa || ""

  const albumSlugs = GALLERY_ALBUMS.map((a) => a.slug)
  const where =
    albumFilter === FALLBACK_ALBUM.slug
      ? { category: { notIn: albumSlugs } }
      : albumFilter
        ? { category: albumFilter }
        : undefined

  const [images, total, grouped] = await Promise.all([
    db.galleryImage.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, url: true, alt: true, category: true },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.galleryImage.count({ where }),
    db.galleryImage.groupBy({ by: ["category"], _count: { _all: true } }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const grandTotal = grouped.reduce((sum, g) => sum + g._count._all, 0)
  const otherCount = grouped
    .filter((g) => !isAlbumSlug(g.category))
    .reduce((sum, g) => sum + g._count._all, 0)

  const filters = [
    { slug: "", label: `Összes (${grandTotal})` },
    ...GALLERY_ALBUMS.map((a) => ({
      slug: a.slug,
      label: `${a.title.hu} (${grouped.find((g) => g.category === a.slug)?._count._all ?? 0})`,
    })),
    ...(otherCount > 0 ? [{ slug: FALLBACK_ALBUM.slug, label: `Egyéb / régi képek (${otherCount})` }] : []),
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ImageIcon}
        title={`Galéria (${grandTotal} kép)`}
        description="A weboldal „Galéria” oldalán megjelenő mappák és képek kezelése. A mappák (albumok) a lib/gallery-albums.ts fájlban vannak felsorolva."
      />

      <GalleryBulkUpload />
      <GalleryForm />

      {/* Mappa szűrő */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = albumFilter === f.slug
          return (
            <Link
              key={f.slug || "all"}
              href={f.slug ? `/admin/galeria?mappa=${f.slug}` : "/admin/galeria"}
              className={`inline-flex min-h-11 items-center rounded-2xl px-4 text-sm font-semibold transition-colors ${
                active
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </Link>
          )
        })}
        {albumFilter && isAlbumSlug(albumFilter) && (
          <a
            href={`/galeria/${albumFilter}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-teal-200 bg-teal-50 px-4 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-100"
          >
            <ExternalLink className="h-4 w-4" />
            Mappa megtekintése az oldalon
          </a>
        )}
      </div>

      {images.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center text-slate-500 shadow-sm">
          Még nincs kép ebben a mappában.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-square bg-slate-100">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized={img.url.includes("b-cdn.net")}
                />
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <p className="line-clamp-2 text-sm font-semibold text-slate-900">{img.alt || "Nincs leírás"}</p>
                  <span className="mt-2 inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                    {categoryLabel(img.category)}
                  </span>
                </div>
                <form action={async () => { "use server"; await deleteGalleryImage(img.id) }}>
                  <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 text-sm font-bold text-red-700 transition-colors hover:bg-red-100">
                    <Trash2 className="w-4 h-4" />
                    Kép törlése
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          {currentPage > 1 && (
            <Link
              href={`/admin/galeria?${albumFilter ? `mappa=${albumFilter}&` : ""}page=${currentPage - 1}`}
              className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
          <span className="px-4 py-2 text-sm font-semibold text-slate-600">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/admin/galeria?${albumFilter ? `mappa=${albumFilter}&` : ""}page=${currentPage + 1}`}
              className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
