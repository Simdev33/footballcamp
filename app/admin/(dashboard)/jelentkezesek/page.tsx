import { db } from "@/lib/db"
import { updateApplicationStatus } from "@/lib/actions"
import Link from "next/link"

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  new: { label: "Új", class: "bg-blue-500/15 text-blue-400" },
  processing: { label: "Feldolgozás alatt", class: "bg-amber-500/15 text-amber-400" },
  accepted: { label: "Elfogadva", class: "bg-emerald-500/15 text-emerald-400" },
  paid: { label: "Fizetve", class: "bg-[#d4a017]/15 text-[#d4a017]" },
  cancelled: { label: "Lemondva", class: "bg-red-500/15 text-red-400" },
}

const STATUSES = ["new", "processing", "accepted", "paid", "cancelled"]

export default async function AdminApplicationsPage() {
  const applications = await db.application.findMany({
    orderBy: { createdAt: "desc" },
    include: { camp: true },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Jelentkezések ({applications.length})</h2>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 text-white/30">Még nincs jelentkezés</div>
      ) : (
        <div className="bg-[#0a1f0a] border border-[#d4a017]/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-wider font-medium">Gyermek</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-wider font-medium">Szülő</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-wider font-medium">Tábor</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-wider font-medium">Kor</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-wider font-medium">Státusz</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-wider font-medium">Dátum</th>
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
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white/70">{app.parentName}</p>
                      <p className="text-white/30 text-xs">{app.parentEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-white/50">{app.camp.city}</td>
                    <td className="px-4 py-3 text-white/50">{app.childAge} év</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 font-medium ${status.class}`}>{status.label}</span>
                    </td>
                    <td className="px-4 py-3 text-white/30 text-xs">{app.createdAt.toLocaleDateString("hu-HU")}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/jelentkezesek/${app.id}`} className="text-[#d4a017] text-xs hover:underline">
                        Részletek
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
