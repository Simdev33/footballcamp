import { unstable_cache, revalidateTag } from "next/cache"
import { db } from "@/lib/db"
import { formatPrice, pickEffectivePrice } from "@/lib/pricing"
import { campTranslationSection, type CampTranslation } from "@/lib/camp-translations"

export const PUBLIC_CAMPS_TAG = "public-camps"

export type PublicCamp = {
  id: string
  slug: string
  city: string
  venue: string
  dates: string
  price: string
  earlyBirdPrice: string
  priceHuf: number
  priceEur: number
  earlyBirdPriceHuf: number
  earlyBirdPriceEur: number
  earlyBirdUntil: string | null
  depositPercent: number
  remainingSpots: number
  totalSpots: number
  ageRange: string
  clubName: string
  imageUrl: string | null
  effectiveHuf: number
  effectiveEur: number
  earlyBirdActiveHuf: boolean
  earlyBirdActiveEur: boolean
  translationEn?: CampTranslation
}

export const getPublicCamps = unstable_cache(
  async (): Promise<PublicCamp[]> => {
    const camps = await db.camp.findMany({
      where: { active: true },
      select: {
        id: true,
        slug: true,
        city: true,
        venue: true,
        dates: true,
        price: true,
        earlyBirdPrice: true,
        priceHuf: true,
        priceEur: true,
        earlyBirdPriceHuf: true,
        earlyBirdPriceEur: true,
        earlyBirdUntil: true,
        depositPercent: true,
        remainingSpots: true,
        totalSpots: true,
        ageRange: true,
        clubName: true,
        imageUrl: true,
      },
      orderBy: { createdAt: "asc" },
    })

    const translations = await db.siteContent.findMany({
      where: {
        locale: "en",
        section: { in: camps.map((camp) => campTranslationSection(camp.id)) },
      },
      select: { section: true, content: true },
    })
    const translationMap = new Map(translations.map((row) => [row.section, row.content as CampTranslation]))

    return camps.map((camp) => {
      const huf = pickEffectivePrice(camp, "HUF")
      const eur = pickEffectivePrice(camp, "EUR")
      return {
        ...camp,
        price: camp.priceHuf > 0 ? formatPrice(camp.priceHuf, "HUF") : camp.price,
        earlyBirdPrice: camp.earlyBirdPriceHuf > 0 ? formatPrice(camp.earlyBirdPriceHuf, "HUF") : camp.earlyBirdPrice,
        earlyBirdUntil: camp.earlyBirdUntil?.toISOString() || null,
        effectiveHuf: huf.amount,
        effectiveEur: eur.amount,
        earlyBirdActiveHuf: huf.earlyBird,
        earlyBirdActiveEur: eur.earlyBird,
        translationEn: translationMap.get(campTranslationSection(camp.id)) || {},
      }
    })
  },
  [PUBLIC_CAMPS_TAG],
  { revalidate: 60, tags: [PUBLIC_CAMPS_TAG] },
)

export function revalidatePublicCamps() {
  revalidateTag(PUBLIC_CAMPS_TAG, "max")
}
