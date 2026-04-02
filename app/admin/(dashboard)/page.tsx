import { db } from "@/lib/db"
import { Tent, ClipboardList, Newspaper, ImageIcon } from "lucide-react"

export const dynamic = 'force-dynamic'

async function getStats() {
  const [campCount, applicationCount, newsCount, galleryCount, newApplications, recentApplications] = await Promise.all([
    db.camp.count({ where: { active: true } }),
    db.application.count(),
    db.news.count({ where: { published: true } }),
    db.galleryImage.count(),
    db.application.count({ where: { status: "new" } }),
    db.application.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { camp: true },
    }),
  ])

  return { campCount, applicationCount, newsCount, galleryCount, newApplications, recentApplications }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: "Aktív táborok", value: stats.campCount, icon: Tent, color: "bg-emerald-500" },
    { label: "Jelentkezések", value: stats.applicationCount, sub: `${stats.newApplications} új`, icon: ClipboardList, color: "bg-blue-500" },
    { label: "Publikált hírek", value: stats.newsCount, icon: Newspaper, color: "bg-amber-500" },
    { label: "Galéria képek", value: stats.galleryCount, icon: ImageIcon, color: "bg-purple-500" },
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
      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              {card.sub && <span className="text-xs bg-[#d4a017]/15 text-[#d4a017] px-2 py-1 font-medium">{card.sub}</span>}
            </div>
            <p className="font-serif text-3xl font-bold text-white">{card.value}</p>
            <p className="text-white/40 text-xs mt-1 uppercase tracking-wider">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-[#0a1f0a] border border-[#d4a017]/10">
        <div className="px-6 py-4 border-b border-[#d4a017]/10">
          <h2 className="text-white font-medium">Legutóbbi jelentkezések</h2>
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
                <span className={`text-xs px-2 py-1 font-medium ${
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
