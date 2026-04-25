import { getRolunkContent } from "@/lib/rolunk-content"
import { getSiteImages, resolveSiteImage } from "@/lib/site-images"
import { RolunkView } from "./rolunk-view"

export const dynamic = "force-dynamic"

export default async function RolunkPage() {
  const [contentHu, contentEn, images] = await Promise.all([
    getRolunkContent("hu"),
    getRolunkContent("en"),
    getSiteImages(),
  ])

  const heroImg = resolveSiteImage("rolunk.hero", images)
  const missionImg = resolveSiteImage("rolunk.mission", images)

  return (
    <RolunkView
      content={{ hu: contentHu, en: contentEn }}
      heroImg={heroImg}
      missionImg={missionImg}
    />
  )
}
