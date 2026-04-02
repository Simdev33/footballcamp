import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function POST(request: Request) {
  const formData = await request.formData()

  const campId = formData.get("campId") as string
  const camp = await db.camp.findUnique({ where: { id: campId } })
  if (!camp || camp.remainingSpots <= 0) {
    return new Response("Camp is full or not found", { status: 400 })
  }

  await db.application.create({
    data: {
      parentName: formData.get("parentName") as string,
      parentEmail: formData.get("parentEmail") as string,
      parentPhone: formData.get("parentPhone") as string,
      childName: formData.get("childName") as string,
      childAge: Number(formData.get("childAge")),
      campId,
      notes: (formData.get("notes") as string) || "",
    },
  })

  await db.camp.update({
    where: { id: campId },
    data: { remainingSpots: { decrement: 1 } },
  })

  redirect("/jelentkezes?success=true")
}
