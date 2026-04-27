import { db } from "@/lib/db"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ClipboardList } from "lucide-react"
import { PAYMENT_STATUS_CONFIG } from "@/lib/payment-status"
import { formatPrice } from "@/lib/pricing"
import type { PaymentStatus } from "@prisma/client"
import { PageHeader } from "@/components/admin/page-header"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 20

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  new: { label: "Új", class: "bg-sky-50 text-sky-700 ring-sky-200" },
  processing: { label: "Feldolgozás alatt", class: "bg-amber-50 text-amber-700 ring-amber-200" },
  accepted: { label: "Elfogadva", class: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  paid: { label: "Fizetve", class: "bg-teal-50 text-teal-700 ring-teal-200" },
  cancelled: { label: "Lemondva", class: "bg-red-50 text-red-700 ring-red-200" },
}

const PAYMENT_CLASS: Record<PaymentStatus, string> = {
  PENDING: "bg-slate-100 text-slate-600 ring-slate-200",
  DEPOSIT_PAID: "bg-amber-50 text-amber-700 ring-amber-200",
  FULLY_PAID: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  FAILED: "bg-red-50 text-red-700 ring-red-200",
  EXPIRED: "bg-slate-100 text-slate-500 ring-slate-200",
  REFUNDED: "bg-purple-50 text-purple-700 ring-purple-200",
}

export default async function AdminApplicationsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams
  const currentPage = Math.max(1, Number(sp.page) || 1)

  const [applications, total] = await Promise.all([
    db.application.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        childName: true,
        childBirthDate: true,
        parentName: true,
        parentEmail: true,
        siblingGroupId: true,
        status: true,
        paymentStatus: true,
        currency: true,
        totalAmount: true,
        depositPaidAmount: true,
        remainderPaidAmount: true,
        createdAt: true,
        camp: { select: { city: true } },
      },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.application.count(),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardList}
        title={`Jelentkezések (${total})`}
        description="A weboldalon keresztül érkezett összes jelentkezés. Kattints egy sorra a részletekhez, státusz és fizetési állapot módosításához."
      />

      {applications.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center text-slate-500 shadow-sm">
          Még nincs jelentkezés.
        </div>
      ) : (
        <>
        <div className="grid gap-4 md:hidden">
          {applications.map((app) => {
            const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.new
            const pay = PAYMENT_STATUS_CONFIG[app.paymentStatus as PaymentStatus]
            const currency = (app.currency as "HUF" | "EUR") || "HUF"
            const paid = app.depositPaidAmount + app.remainderPaidAmount
            return (
              <Link
                key={app.id}
                href={`/admin/jelentkezesek/${app.id}`}
                className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Gyermek</p>
                    <h3 className="mt-1 text-xl font-bold text-slate-950">{app.childName}</h3>
                    {app.siblingGroupId && (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-teal-700">Testvér csoport</p>
                    )}
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${status.class}`}>{status.label}</span>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-600">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Szülő</span>
                    <span className="font-medium text-slate-900">{app.parentName}</span>
                    <span className="block break-all text-slate-500">{app.parentEmail}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Tábor</span>
                      <span className="font-medium text-slate-900">{app.camp.city}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Dátum</span>
                      <span>{app.createdAt.toLocaleDateString("hu-HU")}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${PAYMENT_CLASS[app.paymentStatus as PaymentStatus]}`}>
                      {pay.label}
                    </span>
                    {app.totalAmount > 0 && (
                      <span className="text-sm font-medium text-slate-700">
                        {formatPrice(paid, currency)} / {formatPrice(app.totalAmount, currency)}
                      </span>
                    )}
                  </div>
                </div>

                <span className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-teal-600 px-4 text-sm font-bold text-white">
                  Részletek megnyitása
                </span>
              </Link>
            )
          })}
        </div>

        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-4 text-slate-500 text-xs uppercase tracking-wider font-bold">Gyermek</th>
                <th className="text-left px-5 py-4 text-slate-500 text-xs uppercase tracking-wider font-bold">Szülő</th>
                <th className="text-left px-5 py-4 text-slate-500 text-xs uppercase tracking-wider font-bold">Tábor</th>
                <th className="text-left px-5 py-4 text-slate-500 text-xs uppercase tracking-wider font-bold">Születési dátum</th>
                <th className="text-left px-5 py-4 text-slate-500 text-xs uppercase tracking-wider font-bold">Státusz</th>
                <th className="text-left px-5 py-4 text-slate-500 text-xs uppercase tracking-wider font-bold">Fizetés</th>
                <th className="text-left px-5 py-4 text-slate-500 text-xs uppercase tracking-wider font-bold">Dátum</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => {
                const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.new
                const pay = PAYMENT_STATUS_CONFIG[app.paymentStatus as PaymentStatus]
                const currency = (app.currency as "HUF" | "EUR") || "HUF"
                const paid = app.depositPaidAmount + app.remainderPaidAmount
                return (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-slate-950 font-semibold">{app.childName}</p>
                      {app.siblingGroupId && (
                        <p className="text-[11px] text-teal-700 uppercase tracking-wider mt-0.5 font-semibold">Testvér csoport</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-800 font-medium">{app.parentName}</p>
                      <p className="text-slate-500 text-xs">{app.parentEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-700">{app.camp.city}</td>
                    <td className="px-5 py-4 text-slate-600">{app.childBirthDate.toLocaleDateString("hu-HU")}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-3 py-1.5 font-semibold rounded-full ring-1 ${status.class}`}>{status.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-3 py-1.5 font-semibold rounded-full ring-1 ${PAYMENT_CLASS[app.paymentStatus as PaymentStatus]}`}>{pay.label}</span>
                      {app.totalAmount > 0 && (
                        <div className="text-xs text-slate-500 mt-2">
                          {formatPrice(paid, currency)} / {formatPrice(app.totalAmount, currency)}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">{app.createdAt.toLocaleDateString("hu-HU")}</td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/jelentkezesek/${app.id}`} className="inline-flex min-h-10 items-center rounded-xl bg-teal-50 px-3 text-xs font-bold text-teal-700 hover:bg-teal-100">
                        Részletek
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          {currentPage > 1 && (
            <Link href={`/admin/jelentkezesek?page=${currentPage - 1}`} className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
          <span className="px-4 py-2 text-sm font-semibold text-slate-600">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/admin/jelentkezesek?page=${currentPage + 1}`} className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
