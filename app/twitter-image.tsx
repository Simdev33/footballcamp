import { renderOgImage } from "@/lib/og-image"

export const runtime = "edge"
export const alt = "Kickoff Elite Football Camps — Nemzetközi futballtáborok"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function TwitterImage() {
  return renderOgImage()
}
