import { db } from "@/lib/db"
import { deleteCamp } from "@/lib/actions"
import Link from "next/link"
import { Plus, MapPin, Calendar, Users, Pencil, Trash2, Tent } from "lucide-react"
import { formatPrice } from "@/lib/pricing"
import { PageHeader } from "@/components/admin/page-header"

export const dynamic = 'force-dynamic'

export default async function AdminCampsPage() {
  const camps = await db.camp.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      city: true,
      venue: true,
      dates: true,
      active: true,
      remainingSpots: true,
      totalSpots: true,
      earlyBirdPrice: true,
      earlyBirdPriceHuf: true,
      price: true,
      priceHuf: true,
      _count: { select: { applications: true } },
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Tent}
        title={`Táborok (${camps.length})`}
        description="Itt tudsz új tábort létrehozni, a meglévőket szerkeszteni (időpont, ár, helyszín), vagy aktívra/inaktívra állítani."
        actions={
          <Link href="/admin/taborok/uj" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 text-base font-bold text-white transition-colors hover:bg-teal-700 sm:w-auto">
            <Plus className="w-4 h-4" /> Új tábor
          </Link>
        }
      />

      {camps.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center text-slate-500 shadow-sm">
          Még nincs tábor létrehozva.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {camps.map((camp) => (
            <div key={camp.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-5 h-5 text-teal-600" />
                    <h3 className="text-slate-950 font-bold text-xl">{camp.city}</h3>
                  </div>
                  <p className="text-slate-500 text-sm">{camp.venue}</p>
                </div>
                <span className={`inline-flex min-h-9 items-center rounded-full px-3 text-xs font-bold ring-1 ${camp.active ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-red-50 text-red-700 ring-red-200"}`}>
                  {camp.active ? "Aktív" : "Inaktív"}
                </span>
              </div>

              <div className="grid gap-3 mb-5 text-sm sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-3 text-slate-700">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>{camp.dates}</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-3 text-slate-700">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span>{camp.remainingSpots}/{camp.totalSpots} hely</span>
                </div>
              </div>

              <div className="flex items-end gap-3 mb-5 flex-wrap">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">EarlyBird ár</p>
                  <span className="text-teal-700 text-xl font-bold">{formatPrice(camp.earlyBirdPriceHuf, "HUF") || camp.earlyBirdPrice}</span>
                </div>
                <span className="pb-0.5 text-slate-400 line-through text-sm">{formatPrice(camp.priceHuf, "HUF") || camp.price}</span>
                <span className="ml-auto rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 ring-1 ring-sky-100">{camp._count.applications} jelentkező</span>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href={`/admin/taborok/${camp.id}`} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-teal-50 px-4 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-100">
                  <Pencil className="w-4 h-4" /> Szerkesztés
                </Link>
                <form action={async () => { "use server"; await deleteCamp(camp.id) }}>
                  <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 text-sm font-bold text-red-700 transition-colors hover:bg-red-100 sm:w-auto">
                    <Trash2 className="w-4 h-4" />
                    Törlés
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
