import { db } from "@/lib/db"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 20

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  new: { label: "Uj", class: "bg-blue-500/15 text-blue-400" },
  processing: { label: "Feldolgozas alatt", class: "bg-amber-500/15 text-amber-400" },
  accepted: { label: "Elfogadva", class: "bg-emerald-500/15 text-emerald-400" },
  paid: { label: "Fizetve", class: "bg-[#d4a017]/15 text-[#d4a017]" },
  cancelled: { label: "Lemondva", class: "bg-red-500/15 text-red-400" },
}

export default async function AdminApplicationsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams
  const currentPage = Math.max(1, Number(sp.page) || 1)

  const [applications, total] = await Promise.all([
    db.application.findMany({
      orderBy: { createdAt: "desc" },
      include: { camp: true },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.application.count(),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Jelentkezesek ({total})</h2>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 text-white/30">Meg nincs jelentkezes</div>
      ) : (
        <div className="bg-[#0a1f0a] border border-[#d4a017]/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-wider font-medium">Gyermek</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-wider font-medium">Szulo</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-wider font-medium">Tabor</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-wider font-medium">Szul. datum</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-wider font-medium">Statusz</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-wider font-medium">Datum</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.map((app) => {
                const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.new
                return (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{app.childName}</p>
                      {app.siblingGroupId && (
                        <p className="text-[10px] text-[#d4a017]/70 uppercase tracking-wider mt-0.5">Testvér csoport</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white/70">{app.parentName}</p>
                      <p className="text-white/30 text-xs">{app.parentEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-white/50">{app.camp.city}</td>
                    <td className="px-4 py-3 text-white/50">{app.childBirthDate.toLocaleDateString("hu-HU")}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 font-medium ${status.class}`}>{status.label}</span>
                    </td>
                    <td className="px-4 py-3 text-white/30 text-xs">{app.createdAt.toLocaleDateString("hu-HU")}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/jelentkezesek/${app.id}`} className="text-[#d4a017] text-xs hover:underline">
                        Reszletek
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link href={`/admin/jelentkezesek?page=${currentPage - 1}`} className="w-9 h-9 flex items-center justify-center bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
          <span className="px-3 py-1.5 text-sm text-white/50">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/admin/jelentkezesek?page=${currentPage + 1}`} className="w-9 h-9 flex items-center justify-center bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
