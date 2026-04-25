"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { Prisma } from "@prisma/client"
import type { SiteImageKey } from "@/lib/site-images"

export async function saveSiteImages(patch: Partial<Record<SiteImageKey, string>>) {
  const existing = await db.siteContent.findUnique({
    where: { section_locale: { section: "images", locale: "hu" } },
  })

  const current = (existing?.content as Record<string, string> | null) ?? {}
  const next: Record<string, string> = { ...current }
  for (const [k, v] of Object.entries(patch)) {
    if (!v) {
      delete next[k]
    } else {
      next[k] = v
    }
  }

  await db.siteContent.upsert({
    where: { section_locale: { section: "images", locale: "hu" } },
    create: {
      section: "images",
      locale: "hu",
      content: next as unknown as Prisma.InputJsonValue,
    },
    update: {
      content: next as unknown as Prisma.InputJsonValue,
    },
  })

  revalidatePath("/", "layout")
  revalidatePath("/admin/tartalom", "layout")
  revalidatePath("/partnerprogram")
  revalidatePath("/klubok")
  revalidatePath("/klubok/benfica")
}
