"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Loader2, AlertTriangle } from "lucide-react"
import { SubpageHero } from "@/components/subpage-hero"
import { useLanguage } from "@/lib/language-context"
import { firePurchaseConversion } from "@/lib/google-ads-conversion"
import { firePurchaseEvent } from "@/lib/meta-pixel"
import { formatPrice, type Currency } from "@/lib/pricing"

type SessionInfo = {
  status: string | null
  paymentStatus: string | null
  currency: Currency
  paymentMode: "full" | "deposit"
  amountTotal: number
  customerEmail: string | null
  applications: Array<{
    id: string
    childName: string
    paymentStatus: string
    totalAmount: number
    depositAmount: number
    isInstallment: boolean
    camp: { city: string; dates: string }
  }>
}

function SikeresContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { t } = useLanguage()
  const f = t.applyForm

  const [info, setInfo] = useState<SessionInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError("Hiányzó session azonosító.")
      return
    }
    let cancelled = false
    fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text())
        return r.json() as Promise<SessionInfo>
      })
      .then((data) => {
        if (cancelled) return
        setInfo(data)
        if (data.paymentStatus === "paid" && data.amountTotal > 0) {
          void firePurchaseConversion({
            value: data.amountTotal,
            currency: data.currency,
            transactionId: sessionId,
          })
          firePurchaseEvent({
            value: data.amountTotal,
            currency: data.currency,
            transactionId: sessionId,
          })
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Ismeretlen hiba.")
      })
    return () => {
      cancelled = true
    }
  }, [sessionId])

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-lg mx-auto px-6 text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Hiba történt</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/jelentkezes" className="inline-block h-11 px-6 bg-[#d4a017] text-[#0a1f0a] font-semibold rounded-md">
            Vissza a jelentkezéshez
          </Link>
        </div>
      </section>
    )
  }

  if (!info) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-lg mx-auto px-6 text-center">
          <Loader2 className="w-10 h-10 text-[#d4a017] animate-spin mx-auto" />
        </div>
      </section>
    )
  }

  const isPaid = info.paymentStatus === "paid"
  const remainingTotal = info.applications.reduce(
    (sum, a) => sum + (a.isInstallment ? Math.max(0, a.totalAmount - a.depositAmount) : 0),
    0,
  )

  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white p-6 md:p-10 border border-border/50 shadow-sm rounded-lg text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">{f.successTitle}</h1>
          <p className="text-muted-foreground mb-8">{f.successDesc}</p>

          <div className="text-left border-t border-border/50 pt-6 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Kifizetett összeg</span>
              <span className="font-serif text-2xl font-bold text-foreground">
                {formatPrice(info.amountTotal, info.currency)}
              </span>
            </div>

            {info.paymentMode === "deposit" && remainingTotal > 0 && (
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Hátralévő összeg</span>
                <span className="text-base font-semibold text-foreground">
                  {formatPrice(remainingTotal, info.currency)}
                </span>
              </div>
            )}

            {info.customerEmail && (
              <p className="text-xs text-muted-foreground">
                A visszaigazolást a(z) <strong>{info.customerEmail}</strong> címre küldtük.
              </p>
            )}

            {info.applications.length > 0 && (
              <div className="pt-4 border-t border-border/40 space-y-2">
                <p className="text-sm font-semibold text-foreground">Jelentkezők</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {info.applications.map((a) => (
                    <li key={a.id} className="flex items-center justify-between">
                      <span>{a.childName} — {a.camp.city}</span>
                      <span className="text-xs uppercase tracking-wider text-[#d4a017]">
                        {a.paymentStatus === "FULLY_PAID" ? "Kifizetve" : a.paymentStatus === "DEPOSIT_PAID" ? "Első részlet fizetve" : "Feldolgozás alatt"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {info.paymentMode === "deposit" && (
              <p className="text-xs text-muted-foreground pt-3">
                A hátralévő összegről egy külön fizetési linket fogsz kapni e-mailben a tábor előtt.
              </p>
            )}
          </div>

          {!isPaid && (
            <p className="mt-6 text-sm text-amber-600">
              A fizetés még feldolgozás alatt van. Rövidesen értesítünk.
            </p>
          )}

          <div className="mt-8">
            <Link href="/" className="inline-block h-11 px-6 leading-[2.75rem] bg-[#d4a017] text-[#0a1f0a] font-semibold rounded-md">
              Vissza a főoldalra
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function SikeresPage() {
  return (
    <main>
      <SubpageHero title="Sikeres jelentkezés" subtitle="Köszönjük a bizalmat!" />
      <Suspense fallback={<div className="py-20 text-center text-muted-foreground">…</div>}>
        <SikeresContent />
      </Suspense>
    </main>
  )
}
