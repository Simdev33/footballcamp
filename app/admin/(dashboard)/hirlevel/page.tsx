import { PageHeader } from "@/components/admin/page-header"
import { db } from "@/lib/db"
import { Mail } from "lucide-react"

export const dynamic = "force-dynamic"

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
  const subscribers = await getSubscribers()
  const activeSubscribers = subscribers.filter((subscriber) => subscriber.status === "active")
  const emailList = activeSubscribers.map((subscriber) => subscriber.email).join(", ")

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Mail}
        title="Hírlevél feliratkozók"
        description="Itt látod az oldalról érkező hírlevél feliratkozásokat. Az e-mail címeket kimásolhatod külső hírlevélküldőbe is."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Aktív feliratkozó" value={activeSubscribers.length} />
        <StatCard label="Összes bejegyzés" value={subscribers.length} />
        <StatCard label="Forrás" value="Footer" />
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
