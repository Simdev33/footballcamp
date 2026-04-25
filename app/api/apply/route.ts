import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { pickEffectivePrice, splitInstallment } from "@/lib/pricing"
import {
  BANK_DETAILS,
  computeTransferDeadline,
  generateTransferReference,
} from "@/lib/bank-transfer"
import { sendEmail, renderTransferInstructionsEmail } from "@/lib/email"
import { billingNameNoteLine } from "@/lib/billing-name"

interface ChildPayload {
  childName?: string
  childBirthDate?: string
  childCity?: string
  currentClub?: string
  jerseySize?: string
  shortsSize?: string
  socksSize?: string
  kitPreference?: string
  campId?: string
}

interface ApplyPayload {
  parentName?: string
  parentEmail?: string
  parentPhone?: string
  billingName?: string
  parentPostalCode?: string
  parentCity?: string
  parentAddress?: string
  parentTaxNumber?: string
  notes?: string
  paymentMethod?: "CARD" | "TRANSFER"
  paymentMode?: "full" | "deposit"
  children?: ChildPayload[]
}

const KIT_LABELS: Record<string, string> = {
  "home-red": "Piros mez szett",
  "away-white": "Fehér mez szett",
  "goalkeeper-black": "Fekete kapus szett",
}

export async function POST(request: Request) {
  let payload: ApplyPayload

  try {
    payload = await request.json()
  } catch {
    return new NextResponse("Érvénytelen kérés formátum.", { status: 400 })
  }

  const {
    parentName,
    parentEmail,
    parentPhone,
    billingName,
    parentPostalCode,
    parentCity,
    parentAddress,
    parentTaxNumber,
    notes,
    children,
  } = payload

  const paymentMethod: "CARD" | "TRANSFER" = payload.paymentMethod === "TRANSFER" ? "TRANSFER" : "CARD"
  const paymentMode: "full" | "deposit" = payload.paymentMode === "deposit" ? "deposit" : "full"

  if (!parentName || !parentEmail || !parentPhone) {
    return new NextResponse("Hiányzó szülői adatok.", { status: 400 })
  }

  if (!billingName) {
    return new NextResponse("Hiányzó számlázási név.", { status: 400 })
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
      !c.socksSize ||
      !c.kitPreference
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
  const currency = "HUF" as const

  // Pre-compute per-application amounts so both CARD and TRANSFER flows
  // know exactly what to charge / transfer per child.
  const perChildAmounts = children.map((c) => {
    const camp = campMap.get(c.campId!)!
    const { amount: total } = pickEffectivePrice(camp, currency)
    const { deposit } = splitInstallment(total, camp.depositPercent)
    const due = paymentMode === "deposit" ? deposit : total
    return { total, deposit, due }
  })

  const transferReference =
    paymentMethod === "TRANSFER" ? await generateTransferReference() : null

  const applicationIds = await db.$transaction(async (tx) => {
    const ids: string[] = []
    for (const [i, c] of children.entries()) {
      const amounts = perChildAmounts[i]
      const childNotes = [
        notes?.trim(),
        billingNameNoteLine(billingName),
        c.kitPreference ? `Felszerelés választás: ${KIT_LABELS[c.kitPreference] || c.kitPreference}` : "",
      ].filter(Boolean).join("\n")

      const created = await tx.application.create({
        data: {
          parentName,
          parentEmail,
          parentPhone,
          parentPostalCode: parentPostalCode?.trim() || "",
          parentCity: parentCity?.trim() || "",
          parentAddress: parentAddress?.trim() || "",
          parentTaxNumber: parentTaxNumber?.trim() || "",
          childName: c.childName!,
          childBirthDate: new Date(c.childBirthDate!),
          childCity: c.childCity || "",
          currentClub: c.currentClub || "",
          jerseySize: c.jerseySize || "",
          shortsSize: c.shortsSize || "",
          socksSize: c.socksSize || "",
          campId: c.campId!,
          notes: childNotes,
          siblingGroupId,
          paymentMethod,
          // Only TRANSFER persists amounts here — CARD relies on the
          // /api/stripe/create-checkout endpoint to set them as part of
          // building the Stripe session. That keeps Stripe the source of
          // truth for card payments.
          ...(paymentMethod === "TRANSFER"
            ? {
                currency,
                totalAmount: amounts.total,
                depositAmount: amounts.deposit,
                isInstallment: paymentMode === "deposit",
                transferReference: transferReference!,
                transferExpectedAmount: amounts.due,
              }
            : {}),
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

  if (paymentMethod === "TRANSFER") {
    const totalDue = perChildAmounts.reduce((s, a) => s + a.due, 0)

    // Pick the earliest camp start among the selected camps to derive the
    // deadline — safest for multi-child submissions with different camps.
    const earliestStart = children
      .map((c) => campMap.get(c.campId!)?.startDate ?? null)
      .filter((d): d is Date => d != null)
      .sort((a, b) => a.getTime() - b.getTime())[0] ?? null

    const deadline = computeTransferDeadline(earliestStart)

    // Fire-and-log the instruction email. Failure must not break the
    // submission — the confirmation page shows the same info on-screen.
    try {
      const childrenBrief = children.map((c, i) => ({
        name: c.childName!,
        camp: campMap.get(c.campId!)!.city,
        amount: perChildAmounts[i].due,
      }))
      const { subject, html } = renderTransferInstructionsEmail({
        parentName: parentName!,
        children: childrenBrief,
        currency,
        totalAmount: totalDue,
        reference: transferReference!,
        deadline,
        isInstallment: paymentMode === "deposit",
      })
      await sendEmail({ to: parentEmail!, subject, html, replyTo: "info@kickoffcamps.hu" })
    } catch (err) {
      console.error("[apply] Transfer instruction email failed:", err)
    }

    return NextResponse.json({
      success: true,
      applicationIds,
      paymentMethod: "TRANSFER",
      transferReference,
      amountDue: totalDue,
      currency,
      deadline: deadline.toISOString(),
      bank: BANK_DETAILS,
    })
  }

  return NextResponse.json({ success: true, applicationIds, paymentMethod: "CARD" })
}
