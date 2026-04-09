import { getSiteContent, getDbSections } from "@/lib/content"
import { translations } from "@/lib/i18n"
import { ContentEditor } from "@/components/admin/content-editor"

export const dynamic = "force-dynamic"

export default async function ContentPage() {
  const content = (await getSiteContent()) ?? {
    hu: translations.hu,
    en: translations.en,
  }
  const dbSections = await getDbSections()

  return (
    <ContentEditor
      initialContent={content as { hu: Record<string, unknown>; en: Record<string, unknown> }}
      dbSections={dbSections}
    />
  )
}
