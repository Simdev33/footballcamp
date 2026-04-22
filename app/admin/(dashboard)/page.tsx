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
        include: { camp: true },
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
    { label: "Jelentkezések", value: stats.applicationCount, sub: stats.newApplications > 0 ? `${stats.newApplications} új` : undefined, icon: ClipboardList, color: "bg-blue-500", href: "/admin/jelentkezesek" },
    { label: "Publikált hírek", value: stats.blogCount, icon: BookOpen, color: "bg-amber-500", href: "/admin/blog" },
    { label: "Galéria képek", value: stats.galleryCount, icon: ImageIcon, color: "bg-purple-500", href: "/admin/galeria" },
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
      <div className="bg-[#0a1f0a] border border-[#d4a017]/20 p-6 rounded-lg">
        <h2 className="font-serif text-2xl font-bold text-white">Üdv az admin felületen!</h2>
        <p className="text-white/60 text-sm mt-2 leading-relaxed max-w-2xl">
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
            className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6 hover:border-[#d4a017]/40 transition-colors rounded-lg group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${card.color} flex items-center justify-center rounded`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              {card.sub && <span className="text-xs bg-[#d4a017]/15 text-[#d4a017] px-2 py-1 font-medium rounded">{card.sub}</span>}
            </div>
            <p className="font-serif text-3xl font-bold text-white">{card.value}</p>
            <p className="text-white/40 text-xs mt-1 uppercase tracking-wider">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-white font-semibold text-lg mb-4">Mit szeretnél most csinálni?</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group bg-[#0a1f0a] border border-[#d4a017]/10 hover:border-[#d4a017]/40 transition-colors rounded-lg p-5 flex gap-4"
            >
              <div className="w-10 h-10 bg-[#d4a017]/15 text-[#d4a017] flex items-center justify-center flex-shrink-0 rounded">
                <q.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-white font-semibold text-sm">{q.label}</h4>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#d4a017] transition-colors" />
                </div>
                <p className="text-white/50 text-xs mt-1.5 leading-relaxed">{q.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-[#0a1f0a] border border-[#d4a017]/10 rounded-lg">
        <div className="px-6 py-4 border-b border-[#d4a017]/10 flex items-center justify-between">
          <h2 className="text-white font-medium">Legutóbbi jelentkezések</h2>
          <Link href="/admin/jelentkezesek" className="text-[#d4a017] text-xs hover:underline inline-flex items-center gap-1">
            Összes megtekintése <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {stats.recentApplications.length === 0 ? (
          <div className="px-6 py-12 text-center text-white/30 text-sm">Még nincs jelentkezés</div>
        ) : (
          <div className="divide-y divide-white/5">
            {stats.recentApplications.map((app) => (
              <div key={app.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{app.childName}</p>
                  <p className="text-white/40 text-xs">{app.parentName} &middot; {app.camp.city}</p>
                </div>
                <span className={`text-xs px-2 py-1 font-medium rounded ${
                  app.status === "new" ? "bg-blue-500/15 text-blue-400" :
                  app.status === "paid" ? "bg-emerald-500/15 text-emerald-400" :
                  app.status === "cancelled" ? "bg-red-500/15 text-red-400" :
                  "bg-[#d4a017]/15 text-[#d4a017]"
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
