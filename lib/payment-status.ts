import type { PaymentStatus } from "@prisma/client"

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; class: string }> = {
  PENDING: { label: "Függőben", class: "bg-white/10 text-white/60" },
  DEPOSIT_PAID: { label: "Első részlet fizetve", class: "bg-amber-500/15 text-amber-400" },
  FULLY_PAID: { label: "Kifizetve", class: "bg-emerald-500/15 text-emerald-400" },
  FAILED: { label: "Sikertelen", class: "bg-red-500/15 text-red-400" },
  EXPIRED: { label: "Lejárt", class: "bg-white/10 text-white/40" },
  REFUNDED: { label: "Visszatérítve", class: "bg-purple-500/15 text-purple-400" },
}
