import { db } from "@/lib/db"
import { updateApplicationStatus, updateApplicationNotes } from "@/lib/actions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, Shirt, Home, Trophy, Users, CreditCard, Receipt } from "lucide-react"
import { PAYMENT_STATUS_CONFIG } from "@/lib/payment-status"
import { formatPrice } from "@/lib/pricing"
import type { PaymentStatus } from "@prisma/client"
import { RemainderButton } from "@/components/admin/remainder-button"

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
  const app = await db.application.findUnique({
    where: { id },
    include: {
      camp: true,
      paymentEvents: { orderBy: { createdAt: "desc" } },
    },
  })
  if (!app) notFound()

  const siblings = app.siblingGroupId
    ? await db.application.findMany({
        where: { siblingGroupId: app.siblingGroupId, NOT: { id: app.id } },
        include: { camp: true },
      })
    : []

  const ageYears = Math.floor(
    (Date.now() - app.childBirthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
  )

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/jelentkezesek" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Vissza
      </Link>

      <h2 className="text-xl font-bold text-white">{app.childName} jelentkezése</h2>

      <div className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6 space-y-4">
        <h3 className="text-white/40 text-xs uppercase tracking-wider font-medium border-b border-white/10 pb-2">Adatok</h3>
        <InfoRow icon={User} label="Gyermek" value={`${app.childName} (${ageYears} éves)`} />
        <InfoRow icon={Calendar} label="Szül. dátum" value={app.childBirthDate.toLocaleDateString("hu-HU")} />
        <InfoRow icon={Home} label="Lakhely" value={app.childCity || "—"} />
        <InfoRow icon={Trophy} label="Jelenlegi egyesület" value={app.currentClub || "Jelenleg nem focizik"} />
        <InfoRow icon={Shirt} label="Méretek (mez / rövidnadrág / sportszár)" value={`${app.jerseySize || "—"} / ${app.shortsSize || "—"} / ${app.socksSize || "—"}`} />
        <div className="border-t border-white/10 pt-4 space-y-4">
          <InfoRow icon={User} label="Szülő" value={app.parentName} />
          <InfoRow icon={Mail} label="Email" value={app.parentEmail} />
          <InfoRow icon={Phone} label="Telefon" value={app.parentPhone} />
          <InfoRow icon={MapPin} label="Tábor" value={`${app.camp.city} – ${app.camp.dates}`} />
          <InfoRow icon={Calendar} label="Jelentkezés" value={app.createdAt.toLocaleDateString("hu-HU")} />
        </div>
      </div>

      {siblings.length > 0 && (
        <div className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6">
          <h3 className="text-white/40 text-xs uppercase tracking-wider font-medium mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" /> Testvérek ugyanebből a jelentkezésből
          </h3>
          <ul className="space-y-2">
            {siblings.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/jelentkezesek/${s.id}`} className="text-[#d4a017] hover:underline text-sm">
                  {s.childName} – {s.camp.city} ({s.camp.dates})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Payment section */}
      <div className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-white/40 text-xs uppercase tracking-wider font-medium flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Fizetés
          </h3>
          <span className={`text-xs px-2 py-1 font-medium ${PAYMENT_STATUS_CONFIG[app.paymentStatus as PaymentStatus].class}`}>
            {PAYMENT_STATUS_CONFIG[app.paymentStatus as PaymentStatus].label}
          </span>
        </div>

        {app.totalAmount > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <PaymentStat label="Teljes összeg" value={formatPrice(app.totalAmount, (app.currency as "HUF" | "EUR") || "HUF")} />
              <PaymentStat
                label={app.isInstallment ? "Foglaló (fizetve / terv)" : "Fizetve"}
                value={
                  app.isInstallment
                    ? `${formatPrice(app.depositPaidAmount, (app.currency as "HUF" | "EUR") || "HUF")} / ${formatPrice(app.depositAmount, (app.currency as "HUF" | "EUR") || "HUF")}`
                    : formatPrice(app.depositPaidAmount + app.remainderPaidAmount, (app.currency as "HUF" | "EUR") || "HUF")
                }
              />
              {app.isInstallment && (
                <>
                  <PaymentStat
                    label="Hátralévő (fizetve)"
                    value={formatPrice(app.remainderPaidAmount, (app.currency as "HUF" | "EUR") || "HUF")}
                  />
                  <PaymentStat
                    label="Hátralévő (várt)"
                    value={formatPrice(Math.max(0, app.totalAmount - app.depositPaidAmount - app.remainderPaidAmount), (app.currency as "HUF" | "EUR") || "HUF")}
                  />
                </>
              )}
            </div>

            {app.isInstallment && app.paymentStatus !== "FULLY_PAID" && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/50 mb-3">
                  {app.remainderReminderSentAt
                    ? `Utolsó emlékeztető: ${app.remainderReminderSentAt.toLocaleDateString("hu-HU")}`
                    : "Még nem kapott emlékeztetőt a hátralévő összegről."}
                </p>
                <RemainderButton applicationId={app.id} />
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-white/40">Nincs még fizetési adat (a jelentkezés még nem indított Stripe checkoutot).</p>
        )}

        {/* Timeline */}
        {app.paymentEvents.length > 0 && (
          <div className="pt-4 border-t border-white/10">
            <h4 className="text-white/40 text-xs uppercase tracking-wider font-medium mb-3 flex items-center gap-2">
              <Receipt className="w-3.5 h-3.5" /> Fizetési esemény napló
            </h4>
            <ul className="space-y-2">
              {app.paymentEvents.map((ev) => (
                <li key={ev.id} className="flex items-start justify-between text-xs bg-white/5 px-3 py-2">
                  <div>
                    <p className="text-white">{eventLabel(ev.type)}</p>
                    {ev.note && <p className="text-white/40 mt-0.5">{ev.note}</p>}
                  </div>
                  <div className="text-right">
                    {ev.amount > 0 && (
                      <p className="text-[#d4a017] font-medium">{formatPrice(ev.amount, (ev.currency as "HUF" | "EUR") || "HUF")}</p>
                    )}
                    <p className="text-white/30 mt-0.5">{ev.createdAt.toLocaleString("hu-HU")}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
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
      <span className="text-white/40 text-sm w-56 shrink-0">{label}</span>
      <span className="text-white text-sm">{value}</span>
    </div>
  )
}

function PaymentStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-white/40">{label}</p>
      <p className="text-white font-semibold mt-0.5">{value}</p>
    </div>
  )
}

function eventLabel(type: string): string {
  switch (type) {
    case "deposit_paid": return "Foglaló beérkezett"
    case "remainder_paid": return "Hátralévő beérkezett"
    case "full_paid": return "Teljes összeg beérkezett"
    case "failed": return "Sikertelen fizetés"
    case "refund": return "Visszatérítés"
    case "link_sent": return "Fizetési link generálva"
    default: return type
  }
}
