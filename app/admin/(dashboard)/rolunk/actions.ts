"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { Prisma } from "@prisma/client"
import type { RolunkContent } from "@/lib/rolunk-content"

export async function saveRolunkContent(content: RolunkContent) {
  await db.siteContent.upsert({
    where: { section_locale: { section: "rolunk", locale: "hu" } },
    create: {
      section: "rolunk",
      locale: "hu",
      content: content as unknown as Prisma.InputJsonValue,
    },
    update: {
      content: content as unknown as Prisma.InputJsonValue,
    },
  })

  revalidatePath("/rolunk")
  revalidatePath("/admin/rolunk")
}
