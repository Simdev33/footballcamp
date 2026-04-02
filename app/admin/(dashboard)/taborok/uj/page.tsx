import { createCamp } from "@/lib/actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewCampPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/taborok" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Vissza
      </Link>

      <h2 className="text-xl font-bold text-white">Új tábor létrehozása</h2>

      <form action={createCamp} className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6 space-y-5">
        <Field label="Város" name="city" required placeholder="pl. Szeged" />
        <Field label="Helyszín" name="venue" required placeholder="pl. Szegedi Sportközpont" />
        <Field label="Dátumok" name="dates" required placeholder="pl. 2026. július 7-11." />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ár" name="price" required placeholder="pl. 159.000 Ft" />
          <Field label="Early Bird ár" name="earlyBirdPrice" required placeholder="pl. 139.000 Ft" />
        </div>
        <Field label="Összes hely" name="totalSpots" type="number" required placeholder="40" />
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="active" defaultChecked className="w-5 h-5 accent-[#d4a017]" />
          <span className="text-white text-sm">Aktív (megjelenik a publikus oldalon)</span>
        </label>
        <button type="submit" className="w-full h-11 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:bg-[#d4a017]/90 transition-colors">
          Tábor létrehozása
        </button>
      </form>
    </div>
  )
}

function Field({ label, name, type = "text", required = false, placeholder = "" }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string }) {
  return (
    <div>
      <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">{label}</label>
      <input type={type} name={name} required={required} placeholder={placeholder} className="w-full h-11 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm" />
    </div>
  )
}
