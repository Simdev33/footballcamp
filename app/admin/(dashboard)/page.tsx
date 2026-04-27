import { db } from "@/lib/db"
import Link from "next/link"
import {
  Tent, ClipboardList, BookOpen, ImageIcon, Info, FileText, ArrowRight,
} from "lucide-react"

export const dynamic = "force-dynamic"

async function getStats() {
  try {
    const [campCount, applicationCount, blogCount, galleryCount, newApplications, recentApplications] = await Promise.all([
      db.camp.count({ where: { active: true } }),
      db.application.count(),
      db.blogPost.count({ where: { published: true } }),
      db.galleryImage.count(),
      db.application.count({ where: { status: "new" } }),
      db.application.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          childName: true,
          parentName: true,
          status: true,
          camp: { select: { city: true } },
        },
      }),
    ])
    return { campCount, applicationCount, blogCount, galleryCount, newApplications, recentApplications }
  } catch {
    return {
      campCount: 0,
      applicationCount: 0,
      blogCount: 0,
      galleryCount: 0,
      newApplications: 0,
      recentApplications: [] as Array<{
        id: string
        childName: string
        parentName: string
        status: string
        camp: { city: string }
      }>,
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: "Aktív táborok", value: stats.campCount, icon: Tent, color: "bg-emerald-500", href: "/admin/taborok" },
    { label: "Jelentkezések", value: stats.applicationCount, sub: stats.newApplications > 0 ? `${stats.newApplications} új` : undefined, icon: ClipboardList, color: "bg-sky-500", href: "/admin/jelentkezesek" },
    { label: "Publikált hírek", value: stats.blogCount, icon: BookOpen, color: "bg-amber-500", href: "/admin/blog" },
    { label: "Galéria képek", value: stats.galleryCount, icon: ImageIcon, color: "bg-indigo-500", href: "/admin/galeria" },
  ]

  const quickActions: { href: string; label: string; description: string; icon: React.ComponentType<{ className?: string }>; }[] = [
    { href: "/admin/taborok", label: "Táborok kezelése", description: "Új tábor létrehozása, meglévő szerkesztése, ár, időpont, hely beállítása.", icon: Tent },
    { href: "/admin/jelentkezesek", label: "Jelentkezések", description: "A beérkezett jelentkezések megtekintése, státusz és fizetési állapot kezelése.", icon: ClipboardList },
    { href: "/admin/tartalom", label: "Oldalak szövegei és képei", description: "Főoldal, Klubok, Partnerprogram és további aloldalak szövegeit és képeit szerkesztheted egy helyen.", icon: FileText },
    { href: "/admin/rolunk", label: "Rólunk oldal szerkesztése", description: "A „Rólunk” aloldal szövegeit szerkesztheted itt, szekciókra bontva.", icon: Info },
    { href: "/admin/blog", label: "Hírek / cikkek", description: "A „Hírek” aloldalon megjelenő cikkek kezelése, újak létrehozása.", icon: BookOpen },
    { href: "/admin/galeria", label: "Galéria", description: "A galériában megjelenő képek kezelése.", icon: ImageIcon },
  ]

  const STATUS_LABELS: Record<string, string> = {
    new: "Új",
    processing: "Feldolgozás alatt",
    accepted: "Elfogadva",
    paid: "Fizetve",
    cancelled: "Lemondva",
  }

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-6 shadow-sm md:p-8">
        <h2 className="font-serif text-3xl font-bold text-slate-950">Üdv az admin felületen!</h2>
        <p className="text-slate-600 text-base mt-3 leading-relaxed max-w-3xl">
          Itt tudod kezelni a weboldal teljes tartalmát. A bal oldali menüben vagy az alábbi kártyákon
          válaszd ki, mit szeretnél szerkeszteni. Ha elakadsz, minden oldalon találsz rövid leírást.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} flex items-center justify-center rounded-2xl shadow-sm`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              {card.sub && <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 ring-1 ring-sky-200">{card.sub}</span>}
            </div>
            <p className="font-serif text-4xl font-bold text-slate-950">{card.value}</p>
            <p className="text-slate-500 text-sm mt-1 font-semibold">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-slate-950 font-bold text-2xl mb-4">Mit szeretnél most csinálni?</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-md flex gap-4"
            >
              <div className="w-12 h-12 bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 rounded-2xl ring-1 ring-teal-100">
                <q.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-slate-950 font-bold text-base">{q.label}</h4>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 transition-colors" />
                </div>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">{q.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-slate-950 text-xl font-bold">Legutóbbi jelentkezések</h2>
          <Link href="/admin/jelentkezesek" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-teal-50 px-4 text-sm font-bold text-teal-700 hover:bg-teal-100">
            Összes megtekintése <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {stats.recentApplications.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500 text-sm">Még nincs jelentkezés</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.recentApplications.map((app) => (
              <div key={app.id} className="px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-slate-950 text-base font-bold">{app.childName}</p>
                  <p className="text-slate-500 text-sm">{app.parentName} &middot; {app.camp.city}</p>
                </div>
                <span className={`inline-flex min-h-9 items-center rounded-full px-3 text-xs font-bold ring-1 ${
                  app.status === "new" ? "bg-sky-50 text-sky-700 ring-sky-200" :
                  app.status === "paid" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" :
                  app.status === "cancelled" ? "bg-red-50 text-red-700 ring-red-200" :
                  "bg-amber-50 text-amber-700 ring-amber-200"
                }`}>
                  {STATUS_LABELS[app.status] || app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
