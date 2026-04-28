import { db } from "@/lib/db"
import { updateApplicationStatus, updateApplicationNotes } from "@/lib/actions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, Shirt, Home, Trophy, Users, CreditCard, Receipt, Banknote } from "lucide-react"
import { PAYMENT_STATUS_CONFIG } from "@/lib/payment-status"
import { formatPrice } from "@/lib/pricing"
import type { PaymentStatus } from "@prisma/client"
import { RemainderButton } from "@/components/admin/remainder-button"
import { TransferPaidButton } from "@/components/admin/transfer-paid-button"
import { ResendPaymentConfirmationButton } from "@/components/admin/resend-payment-confirmation-button"

export const dynamic = 'force-dynamic'

const STATUSES = [
  { value: "new", label: "Új", color: "bg-blue-500" },
  { value: "processing", label: "Feldolgozás alatt", color: "bg-amber-500" },
  { value: "accepted", label: "Elfogadva", color: "bg-emerald-500" },
  { value: "paid", label: "Fizetve", color: "bg-teal-600" },
  { value: "cancelled", label: "Lemondva", color: "bg-red-500" },
]

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const app = await db.application.findUnique({
    where: { id },
    select: {
      id: true,
      parentName: true,
      parentEmail: true,
      parentPhone: true,
      childName: true,
      childBirthDate: true,
      childCity: true,
      currentClub: true,
      jerseySize: true,
      shortsSize: true,
      socksSize: true,
      status: true,
      notes: true,
      siblingGroupId: true,
      paymentStatus: true,
      paymentMethod: true,
      isInstallment: true,
      currency: true,
      totalAmount: true,
      depositAmount: true,
      depositPaidAmount: true,
      remainderPaidAmount: true,
      transferReference: true,
      transferExpectedAmount: true,
      remainderReminderSentAt: true,
      createdAt: true,
      camp: { select: { city: true, dates: true } },
      paymentEvents: {
        orderBy: { createdAt: "desc" },
        select: { id: true, type: true, amount: true, currency: true, note: true, createdAt: true },
      },
    },
  })
  if (!app) notFound()

  const siblings = app.siblingGroupId
    ? await db.application.findMany({
        where: { siblingGroupId: app.siblingGroupId, NOT: { id: app.id } },
        select: {
          id: true,
          childName: true,
          camp: { select: { city: true, dates: true } },
        },
      })
    : []

  const ageYears = Math.floor(
    (Date.now() - app.childBirthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
  )

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/admin/jelentkezesek" className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950">
        <ArrowLeft className="w-4 h-4" /> Vissza
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wider text-teal-700">Jelentkezés részletei</p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-slate-950">{app.childName}</h2>
        <p className="mt-2 text-base leading-relaxed text-slate-600">
          Itt látod egyben a gyermek adatait, a szülői elérhetőséget, a tábor választását, a fizetést és a belső megjegyzéseket.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm md:p-6">
        <h3 className="border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Adatok</h3>
        <InfoRow icon={User} label="Gyermek" value={`${app.childName} (${ageYears} éves)`} />
        <InfoRow icon={Calendar} label="Szül. dátum" value={app.childBirthDate.toLocaleDateString("hu-HU")} />
        <InfoRow icon={Home} label="Lakhely" value={app.childCity || "—"} />
        <InfoRow icon={Trophy} label="Jelenlegi egyesület" value={app.currentClub || "Jelenleg nem focizik"} />
        <InfoRow icon={Shirt} label="Méretek (mez / rövidnadrág / sportszár)" value={`${app.jerseySize || "—"} / ${app.shortsSize || "—"} / ${app.socksSize || "—"}`} />
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <InfoRow icon={User} label="Szülő" value={app.parentName} />
          <InfoRow icon={Mail} label="Email" value={app.parentEmail} />
          <InfoRow icon={Phone} label="Telefon" value={app.parentPhone} />
          <InfoRow icon={MapPin} label="Tábor" value={`${app.camp.city} – ${app.camp.dates}`} />
          <InfoRow icon={Calendar} label="Jelentkezés" value={app.createdAt.toLocaleDateString("hu-HU")} />
        </div>
      </div>

      {siblings.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
            <Users className="w-4 h-4" /> Testvérek ugyanebből a jelentkezésből
          </h3>
          <ul className="space-y-2">
            {siblings.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/jelentkezesek/${s.id}`} className="inline-flex min-h-10 items-center rounded-2xl bg-teal-50 px-4 text-sm font-bold text-teal-700 hover:bg-teal-100">
                  {s.childName} – {s.camp.city} ({s.camp.dates})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Payment section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-5 shadow-sm md:p-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
            {app.paymentMethod === "TRANSFER" ? <Banknote className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
            Fizetés {app.paymentMethod === "TRANSFER" ? "(átutalás)" : "(bankkártya)"}
          </h3>
          <span className={`text-xs px-2 py-1 font-medium ${PAYMENT_STATUS_CONFIG[app.paymentStatus as PaymentStatus].class}`}>
            {PAYMENT_STATUS_CONFIG[app.paymentStatus as PaymentStatus].label}
          </span>
        </div>

        {app.paymentMethod === "TRANSFER" && app.transferReference && (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 space-y-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-800">Közleménykód</p>
                <p className="font-mono text-lg font-bold text-amber-900">{app.transferReference}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-800">Várt átutalás</p>
                <p className="font-semibold text-slate-950">
                  {formatPrice(app.transferExpectedAmount, (app.currency as "HUF" | "EUR") || "HUF")}
                </p>
              </div>
            </div>
            {app.paymentStatus === "PENDING" && (
              <TransferPaidButton
                applicationId={app.id}
                kinds={app.isInstallment ? ["deposit", "full"] : ["full"]}
              />
            )}
            {app.paymentStatus === "DEPOSIT_PAID" && (
              <TransferPaidButton applicationId={app.id} kinds={["remainder"]} />
            )}
            {app.paymentStatus === "FULLY_PAID" && (
              <p className="text-sm font-medium text-emerald-700">A teljes összeg beérkezett.</p>
            )}
          </div>
        )}

        {app.totalAmount > 0 ? (
          <>
            <div className="grid gap-4 text-sm sm:grid-cols-2">
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
              <div className="pt-4 border-t border-slate-100">
                <p className="mb-3 text-sm text-slate-600">
                  {app.remainderReminderSentAt
                    ? `Utolsó emlékeztető: ${app.remainderReminderSentAt.toLocaleDateString("hu-HU")}`
                    : "Még nem kapott emlékeztetőt a hátralévő összegről."}
                </p>
                <RemainderButton applicationId={app.id} />
              </div>
            )}

            {(app.paymentStatus === "DEPOSIT_PAID" || app.paymentStatus === "FULLY_PAID") && (
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-sm font-bold text-slate-950">Visszaigazoló email</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Újraküldi a fizetési visszaigazolást a szülő email címére, számla generálása nélkül.
                  </p>
                </div>
                <ResendPaymentConfirmationButton applicationId={app.id} />
              </div>
            )}
          </>
        ) : (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Nincs még fizetési adat (a jelentkezés még nem indított Stripe checkoutot).</p>
        )}

        {/* Timeline */}
        {app.paymentEvents.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
              <Receipt className="w-3.5 h-3.5" /> Fizetési esemény napló
            </h4>
            <ul className="space-y-2">
              {app.paymentEvents.map((ev) => (
                <li key={ev.id} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-950">{eventLabel(ev.type)}</p>
                    {ev.note && <p className="mt-1 text-slate-500">{ev.note}</p>}
                  </div>
                  <div className="text-right">
                    {ev.amount > 0 && (
                      <p className="font-bold text-teal-700">{formatPrice(ev.amount, (ev.currency as "HUF" | "EUR") || "HUF")}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">{ev.createdAt.toLocaleString("hu-HU")}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Status change */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h3 className="mb-2 text-lg font-bold text-slate-950">Státusz módosítása</h3>
        <p className="mb-4 text-sm text-slate-600">Válaszd ki, hol tart a jelentkezés feldolgozása.</p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <form key={s.value} action={async () => { "use server"; await updateApplicationStatus(id, s.value) }}>
              <button
                type="submit"
                className={`min-h-11 rounded-2xl px-4 text-sm font-bold transition-all ${
                  app.status === s.value
                    ? `${s.color} text-white`
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s.label}
              </button>
            </form>
          ))}
        </div>
      </div>

      {/* Notes */}
      <form action={async (formData: FormData) => { "use server"; await updateApplicationNotes(id, formData.get("notes") as string) }} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h3 className="mb-2 text-lg font-bold text-slate-950">Megjegyzések</h3>
        <p className="mb-4 text-sm text-slate-600">Belső admin megjegyzés, a szülő nem látja.</p>
        <textarea
          name="notes"
          defaultValue={app.notes}
          rows={4}
          className="mb-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-relaxed text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 resize-y"
          placeholder="Belső megjegyzések..."
        />
        <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-teal-600 px-6 text-base font-bold text-white transition-colors hover:bg-teal-700">
          Mentés
        </button>
      </form>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="grid gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 sm:grid-cols-[1.5rem_13rem_1fr] sm:items-center sm:bg-transparent sm:border-transparent sm:px-0 sm:py-0">
      <Icon className="w-4 h-4 text-teal-600" />
      <span className="text-sm font-bold text-slate-500">{label}</span>
      <span className="break-words text-base font-medium text-slate-950">{value}</span>
    </div>
  )
}

function PaymentStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
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
    case "confirmation_email_resent": return "Visszaigazoló email újraküldve"
    default: return type
  }
}
