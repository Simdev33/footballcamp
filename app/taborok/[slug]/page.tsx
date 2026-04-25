import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CampDetailView, type CampDetail } from "./camp-detail-view"
import { getCampTranslation } from "@/lib/camp-translations"

export const dynamic = "force-dynamic"

type ScheduleItem = { time: string; activity: string }
type CoachItem = { name: string; role: string; image: string; bio: string }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const camp = await db.camp.findUnique({ where: { slug } })
  if (!camp) return { title: "Tábor nem található / Camp not found" }

  const description =
    camp.description?.slice(0, 160) ||
    `${camp.clubName} futballtábor ${camp.city} — ${camp.dates}. ${camp.ageRange} éves korosztálynak. Early bird ár: ${camp.earlyBirdPrice}.`
  const canonical = `/taborok/${camp.slug}`

  return {
    title: `${camp.city} — ${camp.clubName}`,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: `${camp.city} — ${camp.clubName} focitábor`,
      description,
      url: canonical,
      images: camp.imageUrl ? [{ url: camp.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${camp.city} — ${camp.clubName} focitábor`,
      description,
      images: camp.imageUrl ? [camp.imageUrl] : undefined,
    },
  }
}

export default async function CampDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const camp = await db.camp.findUnique({ where: { slug } })
  if (!camp) notFound()

  const [otherCamps, campTranslationEn] = await Promise.all([
    db.camp.findMany({
      where: { active: true, id: { not: camp.id } },
      take: 3,
    }),
    getCampTranslation(camp.id, "en"),
  ])

  const detail: CampDetail = {
    id: camp.id,
    slug: camp.slug,
    city: camp.city,
    venue: camp.venue,
    dates: camp.dates,
    price: camp.price,
    earlyBirdPrice: camp.earlyBirdPrice,
    clubName: camp.clubName,
    ageRange: camp.ageRange,
    imageUrl: camp.imageUrl,
    description: camp.description,
    includes: camp.includes,
    schedule: (camp.schedule as ScheduleItem[] | null) || [],
    coaches: (camp.coaches as CoachItem[] | null) || [],
    faq: camp.faq as { question: string; answer: string }[] | null,
    gallery: camp.gallery,
    videoUrl: camp.videoUrl,
    mapEmbedUrl: camp.mapEmbedUrl,
  }

  const otherData = otherCamps.map((o) => ({
    id: o.id,
    slug: o.slug,
    city: o.city,
    dates: o.dates,
    earlyBirdPrice: o.earlyBirdPrice,
    imageUrl: o.imageUrl,
  }))

  return <CampDetailView camp={detail} otherCamps={otherData} campTranslationEn={campTranslationEn} />
}
