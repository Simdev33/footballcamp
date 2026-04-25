import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { CampForm } from "@/components/admin/camp-form"
import { getCampTranslation } from "@/lib/camp-translations"

export const dynamic = "force-dynamic"

export default async function EditCampPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [camp, campTranslationEn] = await Promise.all([
    db.camp.findUnique({ where: { id } }),
    getCampTranslation(id, "en"),
  ])
  if (!camp) notFound()

  return <CampForm camp={camp} campTranslationEn={campTranslationEn} />
}
