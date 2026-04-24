import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { BANK_DETAILS, computeTransferDeadline } from "@/lib/bank-transfer"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const ref = url.searchParams.get("ref")?.trim()
  if (!ref) {
    return new NextResponse("Hiányzó közleménykód.", { status: 400 })
  }

  const applications = await db.application.findMany({
    where: { transferReference: ref },
    include: { camp: true },
    orderBy: { createdAt: "asc" },
  })

  if (applications.length === 0) {
    return new NextResponse("Nem található ilyen közleménykóddal jelentkezés.", { status: 404 })
  }

  const first = applications[0]
  const totalAmount = applications.reduce((s, a) => s + a.transferExpectedAmount, 0)
  const currency = first.currency as "HUF" | "EUR"
  const isInstallment = first.isInstallment
  const alreadyPaid =
    first.paymentStatus === "DEPOSIT_PAID" ||
    first.paymentStatus === "FULLY_PAID"

  const earliestStart = applications
    .map((a) => a.camp.startDate)
    .filter((d): d is Date => d != null)
    .sort((a, b) => a.getTime() - b.getTime())[0] ?? null

  const deadline = computeTransferDeadline(earliestStart, first.createdAt)

  return NextResponse.json({
    reference: ref,
    parentName: first.parentName,
    parentEmail: first.parentEmail,
    totalAmount,
    currency,
    isInstallment,
    alreadyPaid,
    deadline: deadline.toISOString(),
    bank: BANK_DETAILS,
    paymentStatus: first.paymentStatus,
    children: applications.map((a) => ({
      childName: a.childName,
      campCity: a.camp.city,
      campDates: a.camp.dates,
      amount: a.transferExpectedAmount,
    })),
  })
}
