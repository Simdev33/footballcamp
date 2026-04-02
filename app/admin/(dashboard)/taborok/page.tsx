import { db } from "@/lib/db"
import { deleteCamp } from "@/lib/actions"
import Link from "next/link"
import { Plus, MapPin, Calendar, Users, Pencil, Trash2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminCampsPage() {
  const camps = await db.camp.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { applications: true } } } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Táborok kezelése</h2>
        <Link href="/admin/taborok/uj" className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4a017] text-[#0a1f0a] text-sm font-semibold hover:bg-[#d4a017]/90 transition-colors">
          <Plus className="w-4 h-4" /> Új tábor
        </Link>
      </div>

      {camps.length === 0 ? (
        <div className="text-center py-20 text-white/30">Még nincs tábor létrehozva</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {camps.map((camp) => (
            <div key={camp.id} className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-[#d4a017]" />
                    <h3 className="text-white font-bold text-lg">{camp.city}</h3>
                  </div>
                  <p className="text-white/40 text-xs">{camp.venue}</p>
                </div>
                <span className={`text-xs px-2 py-1 font-medium ${camp.active ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                  {camp.active ? "Aktív" : "Inaktív"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2 text-white/50">
                  <Calendar className="w-4 h-4 text-[#d4a017]" />
                  <span>{camp.dates}</span>
                </div>
                <div className="flex items-center gap-2 text-white/50">
                  <Users className="w-4 h-4 text-[#d4a017]" />
                  <span>{camp.remainingSpots}/{camp.totalSpots} hely</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#d4a017] font-bold">{camp.earlyBirdPrice}</span>
                <span className="text-white/30 line-through text-sm">{camp.price}</span>
                <span className="ml-auto text-xs text-white/30">{camp._count.applications} jelentkező</span>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/taborok/${camp.id}`} className="flex-1 flex items-center justify-center gap-2 h-9 bg-white/5 text-white/60 hover:text-[#d4a017] hover:bg-[#d4a017]/10 transition-colors text-sm">
                  <Pencil className="w-4 h-4" /> Szerkesztés
                </Link>
                <form action={async () => { "use server"; await deleteCamp(camp.id) }}>
                  <button type="submit" className="h-9 px-3 bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
