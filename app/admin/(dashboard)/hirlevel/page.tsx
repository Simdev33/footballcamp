import { PageHeader } from "@/components/admin/page-header"
import { db } from "@/lib/db"
import { ensureNewsletterTemplates } from "@/lib/newsletter"
import { Mail, Save } from "lucide-react"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"

async function updateNewsletterTemplate(formData: FormData) {
  "use server"

  const id = String(formData.get("id") || "")
  const subject = String(formData.get("subject") || "").trim()
  const previewText = String(formData.get("previewText") || "").trim()
  const body = String(formData.get("body") || "").trim()
  const enabled = formData.get("enabled") === "on"

  if (!id || !subject || !body) return

  await db.newsletterTemplate.update({
    where: { id },
    data: { subject, previewText, body, enabled },
  })

  revalidatePath("/admin/hirlevel")
}

async function getSubscribers() {
  try {
    return await db.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: "desc" },
      select: {
        id: true,
        email: true,
        locale: true,
        source: true,
        status: true,
        subscribedAt: true,
      },
    })
  } catch {
    return []
  }
}

export default async function NewsletterAdminPage() {
  await ensureNewsletterTemplates()
  const subscribers = await getSubscribers()
  const [templates, recentDeliveries, sentToday] = await Promise.all([
    db.newsletterTemplate.findMany({ orderBy: { slot: "asc" } }),
    db.newsletterDelivery.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        slot: true,
        status: true,
        error: true,
        sentAt: true,
        createdAt: true,
      },
    }),
    db.newsletterDelivery.count({
      where: {
        status: "sent",
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ])
  const activeSubscribers = subscribers.filter((subscriber) => subscriber.status === "active")
  const emailList = activeSubscribers.map((subscriber) => subscriber.email).join(", ")

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Mail}
        title="Hírlevél feliratkozók"
        description="Itt látod az oldalról érkező feliratkozásokat, és itt szerkesztheted a napi 3 automata hírlevél tartalmát."
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Aktív feliratkozó" value={activeSubscribers.length} />
        <StatCard label="Összes bejegyzés" value={subscribers.length} />
        <StatCard label="Mai kiküldött levél" value={sentToday} />
        <StatCard label="Automata időpontok" value="08 / 12 / 19" />
      </div>

      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
        <p className="font-bold">Fontos küldési megjegyzés</p>
        <p className="mt-1">
          A rendszer naponta háromszor próbál küldeni Budapest idő szerint: reggel 08:00, délben 12:00 és este 19:00.
          Minden levél alján automatikus leiratkozó link van.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {templates.map((template) => (
          <form key={template.id} action={updateNewsletterTemplate} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <input type="hidden" name="id" value={template.id} />
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700">{template.label} sablon</p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-slate-950">{slotTimeLabel(template.slot)}</h3>
              </div>
              <label className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                <input type="checkbox" name="enabled" defaultChecked={template.enabled} className="h-4 w-4 accent-teal-600" />
                Aktív
              </label>
            </div>

            <div className="space-y-4">
              <Field label="Tárgy">
                <input
                  name="subject"
                  defaultValue={template.subject}
                  required
                  className="min-h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </Field>

              <Field label="Előnézeti szöveg">
                <input
                  name="previewText"
                  defaultValue={template.previewText}
                  className="min-h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </Field>

              <Field label="Levél szövege">
                <textarea
                  name="body"
                  defaultValue={template.body}
                  required
                  rows={10}
                  className="w-full resize-y rounded-2xl border border-slate-200 p-4 text-sm leading-relaxed outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </Field>

              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 text-sm font-bold text-white transition-colors hover:bg-teal-700"
              >
                <Save className="h-4 w-4" />
                Sablon mentése
              </button>
            </div>
          </form>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Kimásolható e-mail lista</h3>
            <p className="mt-1 text-sm text-slate-500">Csak az aktív feliratkozók e-mail címei.</p>
          </div>
        </div>
        <textarea
          readOnly
          value={emailList}
          className="min-h-28 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none"
          placeholder="Még nincs aktív feliratkozó."
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-lg font-bold text-slate-950">Legutóbbi kiküldések</h3>
          <p className="mt-1 text-sm text-slate-500">A cron által indított hírlevelek legfrissebb naplója.</p>
        </div>

        {recentDeliveries.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm font-semibold text-slate-500">
            Még nincs kiküldési napló.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">E-mail</th>
                  <th className="px-5 py-3 font-bold">Időpont</th>
                  <th className="px-5 py-3 font-bold">Állapot</th>
                  <th className="px-5 py-3 font-bold">Küldés</th>
                  <th className="px-5 py-3 font-bold">Hiba</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-950">{delivery.email}</td>
                    <td className="px-5 py-4 text-slate-600">{slotTimeLabel(delivery.slot)}</td>
                    <td className="px-5 py-4">
                      <StatusPill status={delivery.status} />
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {(delivery.sentAt || delivery.createdAt).toLocaleString("hu-HU")}
                    </td>
                    <td className="max-w-xs truncate px-5 py-4 text-red-700" title={delivery.error || ""}>
                      {delivery.error || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-lg font-bold text-slate-950">Feliratkozók</h3>
          <p className="mt-1 text-sm text-slate-500">Legfrissebb feliratkozások elöl.</p>
        </div>

        {subscribers.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Mail className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 font-semibold text-slate-800">Még nincs hírlevél feliratkozó.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">E-mail</th>
                  <th className="px-5 py-3 font-bold">Nyelv</th>
                  <th className="px-5 py-3 font-bold">Forrás</th>
                  <th className="px-5 py-3 font-bold">Állapot</th>
                  <th className="px-5 py-3 font-bold">Feliratkozás</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-950">{subscriber.email}</td>
                    <td className="px-5 py-4 text-slate-600">{subscriber.locale.toUpperCase()}</td>
                    <td className="px-5 py-4 text-slate-600">{subscriber.source}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                        {subscriber.status === "active" ? "Aktív" : subscriber.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {subscriber.subscribedAt.toLocaleDateString("hu-HU")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 font-serif text-3xl font-bold text-slate-950">{value}</p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      {children}
    </label>
  )
}

function slotTimeLabel(slot: string) {
  if (slot === "morning") return "Reggel 08:00"
  if (slot === "noon") return "Délben 12:00"
  if (slot === "evening") return "Este 19:00"
  return slot
}

function StatusPill({ status }: { status: string }) {
  const classes =
    status === "sent"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : status === "failed"
        ? "bg-red-50 text-red-700 ring-red-100"
        : "bg-slate-50 text-slate-700 ring-slate-100"

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${classes}`}>
      {status === "sent" ? "Elküldve" : status === "failed" ? "Sikertelen" : status}
    </span>
  )
}
