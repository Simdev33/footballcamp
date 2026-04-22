import { notFound } from "next/navigation"
import Link from "next/link"
import { getSiteContent, getDbSections } from "@/lib/content"
import { translations } from "@/lib/i18n"
import { ContentEditor } from "@/components/admin/content-editor"
import { CONTENT_PAGES, type ContentPageId } from "@/lib/admin-content-pages"
import { PageHeader } from "@/components/admin/page-header"
import { PageImagesEditor } from "@/components/admin/page-images-editor"
import { getSiteImages } from "@/lib/site-images"
import { getImagesForAdminPage } from "@/lib/admin-page-data"
import { ArrowLeft, ExternalLink } from "lucide-react"

export const dynamic = "force-dynamic"

const PREVIEW_PATHS: Record<ContentPageId, string | null> = {
  home: "/",
  helyszinek: "/taborok",
  klubok: "/klubok",
  partner: "/partnerprogram",
  gyik: "/gyik",
  galeria: "/galeria",
  altalanos: "/",
  jogi: "/aszf",
}

export default async function ContentPageEditor({
  params,
}: {
  params: Promise<{ pageId: string }>
}) {
  const { pageId } = await params
  const meta = CONTENT_PAGES.find((p) => p.id === (pageId as ContentPageId))
  if (!meta) notFound()

  const [content, dbSections, imageOverrides] = await Promise.all([
    getSiteContent(),
    getDbSections(),
    getSiteImages(),
  ])

  const initial = (content ?? { hu: translations.hu, en: translations.en }) as {
    hu: Record<string, unknown>
    en: Record<string, unknown>
  }

  const imageItems = getImagesForAdminPage(pageId, imageOverrides)
  const previewPath = PREVIEW_PATHS[pageId as ContentPageId]
  const Icon = meta.icon

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/tartalom"
          className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Vissza az összes aloldalhoz
        </Link>
      </div>

      <PageHeader
        icon={Icon}
        title={meta.label}
        description={meta.description}
        actions={
          previewPath ? (
            <Link
              href={previewPath}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium rounded transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Oldal megtekintése
            </Link>
          ) : null
        }
      />

      {imageItems.length > 0 && <PageImagesEditor items={imageItems} />}

      <ContentEditor
        initialContent={initial}
        dbSections={dbSections}
        pageId={pageId as ContentPageId}
        header={
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Szövegek</h3>
            <p className="text-white/50 text-xs mt-0.5">
              Ennek az aloldalnak a szekciói. Kattints bármelyik kártyára a szerkesztéshez.
            </p>
          </div>
        }
      />
    </div>
  )
}
