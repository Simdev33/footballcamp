"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertTriangle, Building2, CheckCircle, Copy, Loader2, Mail } from "lucide-react"
import { SubpageHero } from "@/components/subpage-hero"
import { useLanguage } from "@/lib/language-context"
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

type TransferStrings = {
  heroTitle: string
  heroSubtitle: string
  errorTitle: string
  missingRef: string
  unknownError: string
  backToRegister: string
  confirmTitle: string
  confirmDesc1: string
  confirmDesc2: string
  confirmDesc2Suffix: string
  alreadyPaid: string
  transferDetails: string
  accountNumber: string
  memoLabel: string
  amountDeposit: string
  amountFull: string
  deadline: string
  importantPrefix: string
  important1: string
  important2: string
  breakdownTitle: string
  total: string
  nextStepsTitle: string
  step1: string
  step2: string
  step3Installment: string
  step4Prefix: string
  step4Middle: string
  step4Suffix: string
  copy: string
  copied: string
  copyAria: string
  backToHome: string
}

function AtutalasContent() {
  const searchParams = useSearchParams()
  const ref = searchParams.get("ref")
  const { t, locale } = useLanguage()
  const tr = (t as unknown as { transferPage: TransferStrings }).transferPage

  const [info, setInfo] = useState<TransferInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (!ref) {
      setError(tr.missingRef)
      return
    }
    let cancelled = false
    fetch(`/api/apply/transfer-info?ref=${encodeURIComponent(ref)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text())
        return r.json() as Promise<TransferInfo>
      })
      .then((data) => { if (!cancelled) setInfo(data) })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : tr.unknownError) })
    return () => { cancelled = true }
  }, [ref, tr.missingRef, tr.unknownError])

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
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">{tr.errorTitle}</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/jelentkezes" className="inline-block h-11 px-6 leading-[2.75rem] bg-[#d4a017] text-[#0a1f0a] font-semibold rounded-md">
            {tr.backToRegister}
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
  const deadlineStr = deadlineDate.toLocaleDateString(locale === "en" ? "en-GB" : "hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const amountLabel = info.isInstallment ? tr.amountDeposit : tr.amountFull

  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="max-w-2xl mx-auto px-6 space-y-6">
        {/* Hero card */}
        <div className="bg-white p-6 md:p-10 border border-border/50 shadow-sm rounded-lg text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
            {tr.confirmTitle}
          </h1>
          <p className="text-muted-foreground">
            {tr.confirmDesc1}{" "}
            {tr.confirmDesc2} <strong>{info.parentEmail}</strong>{tr.confirmDesc2Suffix}
          </p>
        </div>

        {info.alreadyPaid && (
          <div className="p-4 border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm rounded-md">
            {tr.alreadyPaid}
          </div>
        )}

        {/* Bank details — dark, high-contrast card */}
        <div className="bg-[#0a1f0a] text-white rounded-xl overflow-hidden border border-[#d4a017]/20 shadow-lg">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-[#d4a017]" />
              <span className="text-xs uppercase tracking-[2px] text-[#d4a017] font-semibold">
                {tr.transferDetails}
              </span>
            </div>

            <div>
              <div className="font-serif text-xl md:text-2xl font-bold">{info.bank.accountHolder}</div>
              <div className="text-sm text-white/60 mt-0.5">{info.bank.bankName}</div>
            </div>

            <DetailRow
              label={tr.accountNumber}
              value={info.bank.accountNumber}
              copyKey="acct"
              copied={copied === "acct"}
              onCopy={copy}
              copyLabel={tr.copy}
              copiedLabel={tr.copied}
              copyAria={tr.copyAria}
              mono
            />

            <DetailRow
              label={tr.memoLabel}
              value={info.reference}
              copyKey="ref"
              copied={copied === "ref"}
              onCopy={copy}
              copyLabel={tr.copy}
              copiedLabel={tr.copied}
              copyAria={tr.copyAria}
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
                  {tr.deadline}
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
            <strong>{tr.importantPrefix}</strong> {tr.important1}{" "}
            <span className="font-mono font-semibold text-[#0a1f0a]">{info.reference}</span>{" "}
            {tr.important2}
          </p>
        </div>

        {/* Per-child breakdown */}
        {info.children.length > 1 && (
          <div className="bg-white p-6 border border-border/50 rounded-lg">
            <h3 className="font-serif text-lg font-bold text-foreground mb-4">{tr.breakdownTitle}</h3>
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
                <span className="font-semibold text-foreground">{tr.total}</span>
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
            {tr.nextStepsTitle}
          </h3>
          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground">
            <li>{tr.step1}</li>
            <li>{tr.step2}</li>
            {info.isInstallment && <li>{tr.step3Installment}</li>}
            <li>
              {tr.step4Prefix}{" "}
              <a href="mailto:info@kickoffcamps.hu" className="text-[#d4a017] underline">info@kickoffcamps.hu</a>{" "}
              {tr.step4Middle}{" "}
              <a href="tel:+36307551110" className="text-[#d4a017] underline">+36 30 755 1110</a>
              {tr.step4Suffix}
            </li>
          </ol>
        </div>

        <div className="text-center">
          <Link href="/" className="inline-block h-11 px-6 leading-[2.75rem] bg-[#d4a017] text-[#0a1f0a] font-semibold rounded-md">
            {tr.backToHome}
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
  copyLabel,
  copiedLabel,
  copyAria,
  highlight = false,
  mono = false,
}: {
  label: string
  value: string
  copyKey: string
  copied: boolean
  onCopy: (value: string, key: string) => void
  copyLabel: string
  copiedLabel: string
  copyAria: string
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
          aria-label={copyAria.replace("{label}", label)}
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
    </div>
  )
}

function AtutalasHero() {
  const { t } = useLanguage()
  const tr = (t as unknown as { transferPage: TransferStrings }).transferPage
  return <SubpageHero title={tr.heroTitle} subtitle={tr.heroSubtitle} />
}

export default function AtutalasPage() {
  return (
    <main>
      <AtutalasHero />
      <Suspense fallback={<div className="py-20 text-center text-muted-foreground">…</div>}>
        <AtutalasContent />
      </Suspense>
    </main>
  )
}
