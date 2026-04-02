import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { CampForm } from "@/components/admin/camp-form"

export const dynamic = "force-dynamic"

export default async function EditCampPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const camp = await db.camp.findUnique({ where: { id } })
  if (!camp) notFound()

  return <CampForm camp={camp} />
}
