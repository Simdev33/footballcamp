import { notFound } from "next/navigation"
import Link from "next/link"
import { getSiteContentWithDbSections } from "@/lib/content"
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

  const [{ content, dbSections }, imageOverrides] = await Promise.all([
    getSiteContentWithDbSections(),
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
          className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-950"
        >
          <ArrowLeft className="w-4 h-4" />
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
              className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-teal-50 px-4 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-100"
            >
              <ExternalLink className="w-4 h-4" />
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
            <h3 className="font-serif text-2xl font-bold text-slate-950">Szövegek</h3>
            <p className="text-slate-600 text-base mt-1">
              Ennek az aloldalnak a szekciói. Kattints bármelyik kártyára a szerkesztéshez.
            </p>
          </div>
        }
      />
    </div>
  )
}
