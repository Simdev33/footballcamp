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
              className="group relative flex items-start gap-4 bg-[#0a1f0a] border border-white/10 hover:border-[#d4a017]/50 rounded-lg p-5 transition-all"
            >
              <div className="w-11 h-11 bg-[#d4a017]/15 text-[#d4a017] flex items-center justify-center rounded-md flex-shrink-0 group-hover:bg-[#d4a017] group-hover:text-[#0a1f0a] transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-white text-base">{page.label}</h3>
                {page.description && (
                  <p className="mt-1 text-white/50 text-xs leading-relaxed">{page.description}</p>
                )}
                <div className="mt-2 flex items-center gap-3 text-[11px] text-white/40">
                  <span className="inline-flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {page.sections.length} szekció
                  </span>
                  {imageCount > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <ImgIcon className="w-3 h-3" />
                      {imageCount} kép
                    </span>
                  )}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#d4a017] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
