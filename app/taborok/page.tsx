import { getSiteImages, resolveSiteImage } from "@/lib/site-images"
import { TaborokView } from "./taborok-view"
import { getPublicCamps } from "@/lib/public-camps"

export const dynamic = "force-dynamic"

export default async function TaborokPage() {
  const [camps, images] = await Promise.all([
    getPublicCamps(),
    getSiteImages(),
  ])
  const heroImg = resolveSiteImage("taborok.hero", images)

  const campsData = camps.map((c) => ({
    id: c.id,
    slug: c.slug,
    city: c.city,
    venue: c.venue,
    dates: c.dates,
    price: c.price,
    earlyBirdPrice: c.earlyBirdPrice,
    earlyBirdUntil: c.earlyBirdUntil,
    clubName: c.clubName,
    imageUrl: c.imageUrl,
    translationEn: c.translationEn,
  }))

  return <TaborokView camps={campsData} heroImg={heroImg} />
}
