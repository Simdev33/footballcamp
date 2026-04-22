import { getRolunkContent } from "@/lib/rolunk-content"
import { getSiteImages } from "@/lib/site-images"
import { RolunkEditor } from "./rolunk-editor"

export const dynamic = "force-dynamic"

export default async function AdminRolunkPage() {
  const [content, images] = await Promise.all([getRolunkContent(), getSiteImages()])
  return <RolunkEditor initial={content} imageOverrides={images} />
}
