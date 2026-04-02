import { db } from "@/lib/db"
import { updateApplicationStatus, updateApplicationNotes } from "@/lib/actions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin } from "lucide-react"

export const dynamic = 'force-dynamic'

const STATUSES = [
  { value: "new", label: "Új", color: "bg-blue-500" },
  { value: "processing", label: "Feldolgozás alatt", color: "bg-amber-500" },
  { value: "accepted", label: "Elfogadva", color: "bg-emerald-500" },
  { value: "paid", label: "Fizetve", color: "bg-[#d4a017]" },
  { value: "cancelled", label: "Lemondva", color: "bg-red-500" },
]

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const app = await db.application.findUnique({ where: { id }, include: { camp: true } })
  if (!app) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/jelentkezesek" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Vissza
      </Link>

      <h2 className="text-xl font-bold text-white">{app.childName} jelentkezése</h2>

      <div className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6 space-y-4">
        <h3 className="text-white/40 text-xs uppercase tracking-wider font-medium border-b border-white/10 pb-2">Adatok</h3>
        <InfoRow icon={User} label="Gyermek" value={`${app.childName} (${app.childAge} éves)`} />
        <InfoRow icon={User} label="Szülő" value={app.parentName} />
        <InfoRow icon={Mail} label="Email" value={app.parentEmail} />
        <InfoRow icon={Phone} label="Telefon" value={app.parentPhone} />
        <InfoRow icon={MapPin} label="Tábor" value={`${app.camp.city} – ${app.camp.dates}`} />
        <InfoRow icon={Calendar} label="Jelentkezés" value={app.createdAt.toLocaleDateString("hu-HU")} />
      </div>

      {/* Status change */}
      <div className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6">
        <h3 className="text-white/40 text-xs uppercase tracking-wider font-medium mb-4">Státusz módosítása</h3>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <form key={s.value} action={async () => { "use server"; await updateApplicationStatus(id, s.value) }}>
              <button
                type="submit"
                className={`px-4 py-2 text-xs font-medium transition-all ${
                  app.status === s.value
                    ? `${s.color} text-white`
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {s.label}
              </button>
            </form>
          ))}
        </div>
      </div>

      {/* Notes */}
      <form action={async (formData: FormData) => { "use server"; await updateApplicationNotes(id, formData.get("notes") as string) }} className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6">
        <h3 className="text-white/40 text-xs uppercase tracking-wider font-medium mb-4">Megjegyzések</h3>
        <textarea
          name="notes"
          defaultValue={app.notes}
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm resize-none mb-3"
          placeholder="Belső megjegyzések..."
        />
        <button type="submit" className="px-6 h-9 bg-[#d4a017] text-[#0a1f0a] text-sm font-semibold hover:bg-[#d4a017]/90 transition-colors">
          Mentés
        </button>
      </form>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-[#d4a017]" />
      <span className="text-white/40 text-sm w-24">{label}</span>
      <span className="text-white text-sm">{value}</span>
    </div>
  )
}
