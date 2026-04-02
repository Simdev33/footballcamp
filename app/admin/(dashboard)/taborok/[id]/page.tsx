import { db } from "@/lib/db"
import { updateCamp } from "@/lib/actions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function EditCampPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const camp = await db.camp.findUnique({ where: { id } })
  if (!camp) notFound()

  const updateWithId = updateCamp.bind(null, camp.id)

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/taborok" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Vissza
      </Link>

      <h2 className="text-xl font-bold text-white">Tábor szerkesztése: {camp.city}</h2>

      <form action={updateWithId} className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6 space-y-5">
        <Field label="Város" name="city" defaultValue={camp.city} required />
        <Field label="Helyszín" name="venue" defaultValue={camp.venue} required />
        <Field label="Dátumok" name="dates" defaultValue={camp.dates} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ár" name="price" defaultValue={camp.price} required />
          <Field label="Early Bird ár" name="earlyBirdPrice" defaultValue={camp.earlyBirdPrice} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Összes hely" name="totalSpots" type="number" defaultValue={String(camp.totalSpots)} required />
          <Field label="Szabad helyek" name="remainingSpots" type="number" defaultValue={String(camp.remainingSpots)} required />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="active" defaultChecked={camp.active} className="w-5 h-5 accent-[#d4a017]" />
          <span className="text-white text-sm">Aktív</span>
        </label>
        <button type="submit" className="w-full h-11 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:bg-[#d4a017]/90 transition-colors">
          Mentés
        </button>
      </form>
    </div>
  )
}

function Field({ label, name, type = "text", required = false, defaultValue = "" }: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string }) {
  return (
    <div>
      <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">{label}</label>
      <input type={type} name={name} required={required} defaultValue={defaultValue} className="w-full h-11 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm" />
    </div>
  )
}
