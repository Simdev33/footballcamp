import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

interface ChildPayload {
  childName?: string
  childBirthDate?: string
  childCity?: string
  currentClub?: string
  jerseySize?: string
  shortsSize?: string
  socksSize?: string
  campId?: string
}

interface ApplyPayload {
  parentName?: string
  parentEmail?: string
  parentPhone?: string
  notes?: string
  children?: ChildPayload[]
}

export async function POST(request: Request) {
  let payload: ApplyPayload

  try {
    payload = await request.json()
  } catch {
    return new NextResponse("Érvénytelen kérés formátum.", { status: 400 })
  }

  const { parentName, parentEmail, parentPhone, notes, children } = payload

  if (!parentName || !parentEmail || !parentPhone) {
    return new NextResponse("Hiányzó szülői adatok.", { status: 400 })
  }

  if (!children || !Array.isArray(children) || children.length === 0) {
    return new NextResponse("Legalább egy gyermek adatait meg kell adni.", { status: 400 })
  }

  for (const [i, c] of children.entries()) {
    if (
      !c.childName ||
      !c.childBirthDate ||
      !c.childCity ||
      !c.campId ||
      !c.jerseySize ||
      !c.shortsSize ||
      !c.socksSize
    ) {
      return new NextResponse(`A(z) ${i + 1}. gyermek adatai hiányosak.`, { status: 400 })
    }
  }

  const campIds = Array.from(new Set(children.map((c) => c.campId!)))
  const camps = await db.camp.findMany({ where: { id: { in: campIds } } })
  const campMap = new Map(camps.map((c) => [c.id, c]))

  const requiredPerCamp = new Map<string, number>()
  for (const c of children) {
    requiredPerCamp.set(c.campId!, (requiredPerCamp.get(c.campId!) || 0) + 1)
  }
  for (const [campId, needed] of requiredPerCamp) {
    const camp = campMap.get(campId)
    if (!camp) {
      return new NextResponse("A kiválasztott tábor nem található.", { status: 400 })
    }
    if (camp.remainingSpots < needed) {
      return new NextResponse(
        `A(z) "${camp.city}" táborban nincs elegendő szabad hely (${camp.remainingSpots} szabad, ${needed} szükséges).`,
        { status: 400 },
      )
    }
  }

  const siblingGroupId = children.length > 1 ? randomUUID() : null

  const applicationIds = await db.$transaction(async (tx) => {
    const ids: string[] = []
    for (const c of children) {
      const created = await tx.application.create({
        data: {
          parentName,
          parentEmail,
          parentPhone,
          childName: c.childName!,
          childBirthDate: new Date(c.childBirthDate!),
          childCity: c.childCity || "",
          currentClub: c.currentClub || "",
          jerseySize: c.jerseySize || "",
          shortsSize: c.shortsSize || "",
          socksSize: c.socksSize || "",
          campId: c.campId!,
          notes: notes || "",
          siblingGroupId,
        },
        select: { id: true },
      })
      ids.push(created.id)
    }

    for (const [campId, needed] of requiredPerCamp) {
      await tx.camp.update({
        where: { id: campId },
        data: { remainingSpots: { decrement: needed } },
      })
    }
    return ids
  })

  return NextResponse.json({ success: true, applicationIds })
}
