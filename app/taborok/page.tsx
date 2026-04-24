import { db } from "@/lib/db"
import { getSiteImages, resolveSiteImage } from "@/lib/site-images"
import { TaborokView } from "./taborok-view"

export const dynamic = "force-dynamic"

export default async function TaborokPage() {
  const [camps, images] = await Promise.all([
    db.camp.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" },
    }),
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
    clubName: c.clubName,
    imageUrl: c.imageUrl,
  }))

  return <TaborokView camps={campsData} heroImg={heroImg} />
}
