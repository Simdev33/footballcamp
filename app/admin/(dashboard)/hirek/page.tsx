import { db } from "@/lib/db"
import { deleteNews } from "@/lib/actions"
import Link from "next/link"
import { Plus, Pencil, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 20

export default async function AdminNewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams
  const currentPage = Math.max(1, Number(sp.page) || 1)

  const [news, total] = await Promise.all([
    db.news.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.news.count(),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Hirek kezelese ({total})</h2>
        <Link href="/admin/hirek/uj" className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4a017] text-[#0a1f0a] text-sm font-semibold hover:bg-[#d4a017]/90 transition-colors">
          <Plus className="w-4 h-4" /> Uj hir
        </Link>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-20 text-white/30">Meg nincs hir letrehozva</div>
      ) : (
        <div className="bg-[#0a1f0a] border border-[#d4a017]/10 divide-y divide-white/5">
          {news.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {item.published ? (
                    <Eye className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-white/30" />
                  )}
                  <h3 className="text-white font-medium text-sm truncate">{item.title}</h3>
                </div>
                <p className="text-white/30 text-xs">
                  {item.author.name} &middot; {item.createdAt.toLocaleDateString("hu-HU")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/hirek/${item.id}`} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-[#d4a017] bg-white/5 hover:bg-[#d4a017]/10 transition-colors">
                  <Pencil className="w-4 h-4" />
                </Link>
                <form action={async () => { "use server"; await deleteNews(item.id) }}>
                  <button type="submit" className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-red-400 bg-white/5 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link href={`/admin/hirek?page=${currentPage - 1}`} className="w-9 h-9 flex items-center justify-center bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
          <span className="px-3 py-1.5 text-sm text-white/50">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/admin/hirek?page=${currentPage + 1}`} className="w-9 h-9 flex items-center justify-center bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
