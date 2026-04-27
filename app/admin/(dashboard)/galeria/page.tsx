import { db } from "@/lib/db"
import { deleteGalleryImage } from "@/lib/actions"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
import { GalleryForm } from "@/components/admin/gallery-form"
import { PageHeader } from "@/components/admin/page-header"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 20

export default async function AdminGalleryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams
  const currentPage = Math.max(1, Number(sp.page) || 1)

  const [images, total] = await Promise.all([
    db.galleryImage.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        url: true,
        alt: true,
        category: true,
      },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.galleryImage.count(),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ImageIcon}
        title={`Galéria (${total} kép)`}
        description="A weboldal „Galéria” szekciójában megjelenő képek kezelése. Tölts fel új képeket, vagy törölj régieket."
      />

      <GalleryForm />

      {images.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center text-slate-500 shadow-sm">
          Még nincs kép a galériában.
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
                    {img.category}
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
            <Link href={`/admin/galeria?page=${currentPage - 1}`} className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
          <span className="px-4 py-2 text-sm font-semibold text-slate-600">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/admin/galeria?page=${currentPage + 1}`} className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
