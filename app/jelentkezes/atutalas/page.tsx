"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertTriangle, Building2, CheckCircle, Copy, Loader2, Mail } from "lucide-react"
import { SubpageHero } from "@/components/subpage-hero"
import { formatPrice, type Currency } from "@/lib/pricing"

type TransferInfo = {
  reference: string
  parentName: string
  parentEmail: string
  totalAmount: number
  currency: Currency
  isInstallment: boolean
  alreadyPaid: boolean
  deadline: string
  paymentStatus: string
  bank: {
    accountHolder: string
    bankName: string
    accountNumber: string
    iban: string
    swift: string
  }
  children: Array<{
    childName: string
    campCity: string
    campDates: string
    amount: number
  }>
}

function AtutalasContent() {
  const searchParams = useSearchParams()
  const ref = searchParams.get("ref")

  const [info, setInfo] = useState<TransferInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (!ref) {
      setError("Hiányzó közleménykód.")
      return
    }
    let cancelled = false
    fetch(`/api/apply/transfer-info?ref=${encodeURIComponent(ref)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text())
        return r.json() as Promise<TransferInfo>
      })
      .then((data) => { if (!cancelled) setInfo(data) })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : "Ismeretlen hiba.") })
    return () => { cancelled = true }
  }, [ref])

  const copy = (value: string, key: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return
    navigator.clipboard.writeText(value).then(() => {
      setCopied(key)
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500)
    }).catch(() => {})
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-lg mx-auto px-6 text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Hiba történt</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/jelentkezes" className="inline-block h-11 px-6 leading-[2.75rem] bg-[#d4a017] text-[#0a1f0a] font-semibold rounded-md">
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

  const deadlineDate = new Date(info.deadline)
  const deadlineStr = deadlineDate.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const amountLabel = info.isInstallment ? "Utalandó foglaló" : "Utalandó összeg"

  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="max-w-2xl mx-auto px-6 space-y-6">
        {/* Hero card */}
        <div className="bg-white p-6 md:p-10 border border-border/50 shadow-sm rounded-lg text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
            Jelentkezés rögzítve — köszönjük!
          </h1>
          <p className="text-muted-foreground">
            A hely véglegesítéséhez kérjük, utald át az alábbi összeget a megadott számlaszámra.
            Az utalási adatokat e-mailben is elküldtük a(z) <strong>{info.parentEmail}</strong> címre.
          </p>
        </div>

        {info.alreadyPaid && (
          <div className="p-4 border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm rounded-md">
            Ezt a jelentkezést már kifizetve jelöltük. Nem szükséges újra átutalni.
          </div>
        )}

        {/* Bank details — dark, high-contrast card */}
        <div className="bg-[#0a1f0a] text-white rounded-xl overflow-hidden border border-[#d4a017]/20 shadow-lg">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-[#d4a017]" />
              <span className="text-xs uppercase tracking-[2px] text-[#d4a017] font-semibold">
                Utalási adatok
              </span>
            </div>

            <div>
              <div className="font-serif text-xl md:text-2xl font-bold">{info.bank.accountHolder}</div>
              <div className="text-sm text-white/60 mt-0.5">{info.bank.bankName}</div>
            </div>

            <DetailRow
              label="Számlaszám"
              value={info.bank.accountNumber}
              copyKey="acct"
              copied={copied === "acct"}
              onCopy={copy}
              mono
            />

            <DetailRow
              label="Közlemény — KÖTELEZŐ!"
              value={info.reference}
              copyKey="ref"
              copied={copied === "ref"}
              onCopy={copy}
              highlight
              mono
            />

            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <div className="text-[11px] uppercase tracking-[1.5px] text-white/50 font-medium mb-1">
                  {amountLabel}
                </div>
                <div className="text-2xl font-bold">{formatPrice(info.totalAmount, info.currency)}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[1.5px] text-white/50 font-medium mb-1">
                  Határidő
                </div>
                <div className="text-lg font-semibold">{deadlineStr}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-1 text-xs text-white/60">
              <div><span className="text-white/40">IBAN:</span> {info.bank.iban}</div>
              <div><span className="text-white/40">SWIFT:</span> {info.bank.swift}</div>
            </div>
          </div>
        </div>

        {/* Important note */}
        <div className="p-5 border-l-4 border-[#d4a017] bg-[#d4a017]/5 rounded-md">
          <p className="text-sm text-foreground leading-relaxed">
            <strong>Fontos:</strong> a közleménybe pontosan a <span className="font-mono font-semibold text-[#0a1f0a]">{info.reference}</span> kódot
            írd be. Ez alapján tudjuk az utalást a jelentkezéshez kapcsolni. Az elektronikus számlát az utalás beérkezése után
            automatikusan e-mailben kiküldjük.
          </p>
        </div>

        {/* Per-child breakdown */}
        {info.children.length > 1 && (
          <div className="bg-white p-6 border border-border/50 rounded-lg">
            <h3 className="font-serif text-lg font-bold text-foreground mb-4">Részletezés</h3>
            <ul className="space-y-3">
              {info.children.map((c, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">
                    <strong>{c.childName}</strong> — {c.campCity} <span className="text-muted-foreground">({c.campDates})</span>
                  </span>
                  <span className="font-semibold text-foreground">{formatPrice(c.amount, info.currency)}</span>
                </li>
              ))}
              <li className="flex items-center justify-between text-base pt-3 border-t border-border/50">
                <span className="font-semibold text-foreground">Összesen</span>
                <span className="font-serif text-xl font-bold text-[#d4a017]">
                  {formatPrice(info.totalAmount, info.currency)}
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Next steps */}
        <div className="bg-white p-6 border border-border/50 rounded-lg">
          <h3 className="font-serif text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#d4a017]" />
            Mi történik ezután?
          </h3>
          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground">
            <li>Az utalás beérkezése után (kb. 1-3 munkanap) automatikusan visszaigazolunk e-mailben.</li>
            <li>A számlázz.hu automatikusan kiállítja és elküldi az elektronikus számlát.</li>
            {info.isInstallment && (
              <li>A hátralévő összegről a tábor kezdete előtt kb. 2 héttel küldünk külön fizetési linket vagy emlékeztetőt.</li>
            )}
            <li>Kérdés esetén bármikor elérsz minket a <a href="mailto:info@kickoffcamps.hu" className="text-[#d4a017] underline">info@kickoffcamps.hu</a> címen vagy a <a href="tel:+36307551110" className="text-[#d4a017] underline">+36 30 755 1110</a> telefonszámon.</li>
          </ol>
        </div>

        <div className="text-center">
          <Link href="/" className="inline-block h-11 px-6 leading-[2.75rem] bg-[#d4a017] text-[#0a1f0a] font-semibold rounded-md">
            Vissza a főoldalra
          </Link>
        </div>
      </div>
    </section>
  )
}

function DetailRow({
  label,
  value,
  copyKey,
  copied,
  onCopy,
  highlight = false,
  mono = false,
}: {
  label: string
  value: string
  copyKey: string
  copied: boolean
  onCopy: (value: string, key: string) => void
  highlight?: boolean
  mono?: boolean
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[1.5px] text-white/50 font-medium mb-1">{label}</div>
      <div className="flex items-center gap-3">
        <div
          className={`${mono ? "font-mono" : ""} ${highlight ? "text-[#d4a017] text-2xl" : "text-white text-lg"} font-bold break-all`}
        >
          {value}
        </div>
        <button
          type="button"
          onClick={() => onCopy(value, copyKey)}
          className="shrink-0 inline-flex items-center gap-1 px-3 h-8 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
          aria-label={`${label} másolása`}
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? "Másolva!" : "Másol"}
        </button>
      </div>
    </div>
  )
}

export default function AtutalasPage() {
  return (
    <main>
      <SubpageHero title="Átutalási adatok" subtitle="Köszönjük a jelentkezést!" />
      <Suspense fallback={<div className="py-20 text-center text-muted-foreground">…</div>}>
        <AtutalasContent />
      </Suspense>
    </main>
  )
}
