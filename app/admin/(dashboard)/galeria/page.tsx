import { db } from "@/lib/db"
import { deleteGalleryImage } from "@/lib/actions"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { GalleryForm } from "@/components/admin/gallery-form"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 20

export default async function AdminGalleryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams
  const currentPage = Math.max(1, Number(sp.page) || 1)

  const [images, total] = await Promise.all([
    db.galleryImage.findMany({
      orderBy: { sortOrder: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.galleryImage.count(),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Galeria kezelese ({total} kep)</h2>
      </div>

      <GalleryForm />

      {images.length === 0 ? (
        <div className="text-center py-20 text-white/30">Meg nincs kep a galeriaban</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden bg-[#0a1f0a] border border-[#d4a017]/10">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                unoptimized={img.url.includes("b-cdn.net")}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-end">
                <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-xs truncate mb-2">{img.alt || "Nincs leiras"}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#d4a017] text-xs">{img.category}</span>
                    <form action={async () => { "use server"; await deleteGalleryImage(img.id) }}>
                      <button type="submit" className="w-7 h-7 flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link href={`/admin/galeria?page=${currentPage - 1}`} className="w-9 h-9 flex items-center justify-center bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
          <span className="px-3 py-1.5 text-sm text-white/50">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/admin/galeria?page=${currentPage + 1}`} className="w-9 h-9 flex items-center justify-center bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
