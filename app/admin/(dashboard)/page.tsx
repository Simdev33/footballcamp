import { db } from "@/lib/db"
import Link from "next/link"
import {
  Tent, ClipboardList, BookOpen, FileText, ArrowRight, CheckCircle2,
} from "lucide-react"

export const dynamic = "force-dynamic"

async function getStats() {
  try {
    const [campCount, applicationCount, blogCount, galleryCount, newApplications, actionableApplications] = await Promise.all([
      db.camp.count({ where: { active: true } }),
      db.application.count(),
      db.blogPost.count({ where: { published: true } }),
      db.galleryImage.count(),
      db.application.count({ where: { status: "new" } }),
      db.application.findMany({
        where: { status: "new" },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          childName: true,
          parentName: true,
          status: true,
          createdAt: true,
          camp: { select: { city: true } },
        },
      }),
    ])
    return { campCount, applicationCount, blogCount, galleryCount, newApplications, actionableApplications }
  } catch {
    return {
      campCount: 0,
      applicationCount: 0,
      blogCount: 0,
      galleryCount: 0,
      newApplications: 0,
      actionableApplications: [] as Array<{
        id: string
        childName: string
        parentName: string
        status: string
        createdAt: Date
        camp: { city: string }
      }>,
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const taskCards: {
    href: string
    label: string
    plainTitle: string
    description: string
    button: string
    icon: React.ComponentType<{ className?: string }>
    tone: string
    steps: string[]
  }[] = [
    {
      href: "/admin/taborok/uj",
      label: "Leggyakoribb",
      plainTitle: "Új tábort szeretnék feltenni",
      description: "Indíts innen, ha új helyszín vagy új időpont kerül fel a weboldalra.",
      button: "Új tábor indítása",
      icon: Tent,
      tone: "bg-teal-50 text-teal-700 ring-teal-100",
      steps: ["Alapadatok", "Árak és helyek", "Kép kiválasztása", "Mentés"],
    },
    {
      href: "/admin/taborok",
      label: "Gyors módosítás",
      plainTitle: "Tábor időpontját, árát vagy helyeit módosítom",
      description: "Meglévő táborhoz nyúlj hozzá: időpont, ár, férőhely, aktív/inaktív állapot.",
      button: "Tábor kiválasztása",
      icon: Tent,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      steps: ["Tábor kiválasztása", "Adat javítása", "Mentés", "Weboldal ellenőrzése"],
    },
    {
      href: "/admin/jelentkezesek",
      label: stats.newApplications > 0 ? `${stats.newApplications} új` : "Nincs új",
      plainTitle: "Jelentkezéseket nézek át",
      description: "A friss jelentkezések, státuszok és fizetések ellenőrzéséhez.",
      button: "Jelentkezések megnyitása",
      icon: ClipboardList,
      tone: "bg-sky-50 text-sky-700 ring-sky-100",
      steps: ["Új jelentkezés megnyitása", "Adatok ellenőrzése", "Státusz állítása", "Megjegyzés mentése"],
    },
    {
      href: "/admin/tartalom",
      label: "Weboldal szöveg",
      plainTitle: "Szöveget vagy képet cserélek a weboldalon",
      description: "Főoldal, Táborok, Klubok, Partnerprogram és más oldalak szövegei, képei.",
      button: "Oldal kiválasztása",
      icon: FileText,
      tone: "bg-indigo-50 text-indigo-700 ring-indigo-100",
      steps: ["Oldal kiválasztása", "Szekció megnyitása", "Szöveg vagy kép csere", "Mentés"],
    },
    {
      href: "/admin/blog/uj",
      label: "Hír",
      plainTitle: "Új hírt vagy blogbejegyzést rakok ki",
      description: "Cikk, rövid hír vagy tájékoztató feltöltése a Hírek oldalra.",
      button: "Új bejegyzés írása",
      icon: BookOpen,
      tone: "bg-amber-50 text-amber-700 ring-amber-100",
      steps: ["Cím megadása", "Szöveg megírása", "Kép választása", "Publikálás"],
    },
  ]

  const summaryCards = [
    { label: "Aktív tábor", value: stats.campCount, href: "/admin/taborok" },
    { label: "Összes jelentkezés", value: stats.applicationCount, href: "/admin/jelentkezesek" },
    { label: "Publikált hír", value: stats.blogCount, href: "/admin/blog" },
    { label: "Galéria kép", value: stats.galleryCount, href: "/admin/galeria" },
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
      <div className="rounded-3xl border border-teal-100 bg-gradient-to-br from-white via-teal-50 to-sky-50 p-6 shadow-sm md:p-8">
        <p className="text-sm font-bold uppercase tracking-wider text-teal-700">Egyszerű vezérlőpult</p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-slate-950 md:text-4xl">Mit szeretnél most elintézni?</h2>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
          Ne menüpontot keress, hanem válaszd ki a feladatot. Minden kártyán látod, milyen lépések következnek.
        </p>
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-950">Válassz feladatot</h3>
            <p className="mt-1 text-base text-slate-600">Ezek a leggyakoribb napi műveletek, nagy gombokkal és előre látható lépésekkel.</p>
          </div>
          <Link href="/" target="_blank" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-bold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
            Weboldal megnyitása <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {taskCards.map((task) => (
            <Link
              key={task.href}
              href={task.href}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md md:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ring-1 ${task.tone}`}>
                  <task.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">{task.label}</span>
                  </div>
                  <h4 className="mt-3 font-serif text-2xl font-bold leading-tight text-slate-950">{task.plainTitle}</h4>
                  <p className="mt-2 text-base leading-relaxed text-slate-600">{task.description}</p>

                  <ol className="mt-5 grid gap-2 sm:grid-cols-2">
                    {task.steps.map((step, index) => (
                      <li key={step} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-teal-700 ring-1 ring-teal-100">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>

                  <span className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 text-base font-bold text-white transition-colors group-hover:bg-teal-700 sm:w-auto">
                    {task.button} <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Elintézendő jelentkezések</h2>
              <p className="mt-1 text-sm text-slate-500">Csak az új, még átnézésre váró jelentkezések.</p>
            </div>
            <Link href="/admin/jelentkezesek" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-teal-50 px-4 text-sm font-bold text-teal-700 hover:bg-teal-100">
              Összes megtekintése <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {stats.actionableApplications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
              <p className="mt-3 text-base font-bold text-slate-950">Most nincs új jelentkezés, amit intézni kell.</p>
              <p className="mt-1 text-sm text-slate-500">Ha érkezik új jelentkező, itt fog megjelenni elsőként.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.actionableApplications.map((app) => (
                <Link key={app.id} href={`/admin/jelentkezesek/${app.id}`} className="flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-slate-950 text-base font-bold">{app.childName}</p>
                    <p className="text-slate-500 text-sm">{app.parentName} &middot; {app.camp.city} &middot; {app.createdAt.toLocaleDateString("hu-HU")}</p>
                  </div>
                  <span className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl bg-sky-50 px-4 text-sm font-bold text-sky-700 ring-1 ring-sky-100">
                    {STATUS_LABELS[app.status] || app.status}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-xl font-bold text-slate-950">Állapot röviden</h2>
          <p className="mt-1 text-sm text-slate-500">Csak tájékoztató számok, nem innen kell dolgozni.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {summaryCards.map((card) => (
              <Link key={card.label} href={card.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-teal-50 hover:border-teal-100">
                <p className="font-serif text-3xl font-bold text-slate-950">{card.value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">{card.label}</p>
              </Link>
            ))}
          </div>
          {stats.newApplications > 0 && (
            <Link href="/admin/jelentkezesek" className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 text-sm font-bold text-white transition-colors hover:bg-sky-700">
              {stats.newApplications} új jelentkezés vár rád <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
