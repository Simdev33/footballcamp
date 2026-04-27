import Link from "next/link"
import { CONTENT_PAGES } from "@/lib/admin-content-pages"
import { PageHeader } from "@/components/admin/page-header"
import { FileText, ArrowRight, Image as ImgIcon } from "lucide-react"
import { SITE_IMAGE_LABELS, type SiteImageKey } from "@/lib/site-images"

export const dynamic = "force-dynamic"

export default async function ContentHubPage() {
  const imageCountByGroup: Record<string, number> = {}
  for (const key of Object.keys(SITE_IMAGE_LABELS) as SiteImageKey[]) {
    const g = SITE_IMAGE_LABELS[key].group
    imageCountByGroup[g] = (imageCountByGroup[g] || 0) + 1
  }

  // Map content pages to the image-group ids used in SITE_IMAGE_LABELS.
  const groupsForPage: Record<string, string[]> = {
    home: ["home", "jelentkezes"],
    helyszinek: ["taborok", "jelentkezes"],
    klubok: ["klubok"],
    partner: ["partnerprogram"],
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Szövegek és képek szerkesztése"
        description="Válaszd ki melyik aloldalt szeretnéd szerkeszteni. Minden aloldal szövegei és képei együtt, egy helyen találhatók."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CONTENT_PAGES.map((page) => {
          const Icon = page.icon
          const imageCount = (groupsForPage[page.id] || []).reduce(
            (acc, g) => acc + (imageCountByGroup[g] || 0),
            0,
          )
          return (
            <Link
              key={page.id}
              href={`/admin/tartalom/${page.id}`}
              className="group relative flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-teal-200 hover:shadow-md"
            >
              <div className="w-12 h-12 bg-teal-50 text-teal-700 flex items-center justify-center rounded-2xl flex-shrink-0 ring-1 ring-teal-100 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-slate-950 text-lg">{page.label}</h3>
                {page.description && (
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">{page.description}</p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                    <FileText className="w-3 h-3" />
                    {page.sections.length} szekció
                  </span>
                  {imageCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-sky-700 ring-1 ring-sky-100">
                      <ImgIcon className="w-3 h-3" />
                      {imageCount} kép
                    </span>
                  )}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
