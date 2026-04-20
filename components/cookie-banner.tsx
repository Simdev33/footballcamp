"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Cookie, X, ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { readConsent, writeConsent, type ConsentState } from "@/lib/cookie-consent"

type BannerContent = {
  title: string
  description: string
  acceptAll: string
  rejectAll: string
  customize: string
  save: string
  more: string
  reopen: string
  categories: {
    necessary: { name: string; desc: string }
    analytics: { name: string; desc: string }
    marketing: { name: string; desc: string }
  }
}

export function CookieBanner() {
  const { t } = useLanguage()
  const c = (t as unknown as { cookieBanner: BannerContent }).cookieBanner

  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const existing = readConsent()
    if (!existing) {
      setOpen(true)
    } else {
      setAnalytics(existing.analytics)
      setMarketing(existing.marketing)
    }

    const handler = () => {
      setOpen(true)
      const cur = readConsent()
      if (cur) {
        setAnalytics(cur.analytics)
        setMarketing(cur.marketing)
      }
    }
    window.addEventListener("cookie-consent-reopen", handler)
    return () => window.removeEventListener("cookie-consent-reopen", handler)
  }, [])

  if (!open) return null

  const handleAcceptAll = () => {
    writeConsent({ analytics: true, marketing: true })
    setOpen(false)
  }
  const handleRejectAll = () => {
    writeConsent({ analytics: false, marketing: false })
    setOpen(false)
  }
  const handleSave = () => {
    writeConsent({ analytics, marketing })
    setOpen(false)
  }

  return (
    <div
      role="dialog"
      aria-label={c.title}
      aria-modal="false"
      className="fixed inset-x-0 bottom-0 z-[100] p-3 md:p-4 pointer-events-none"
    >
      <div className="pointer-events-auto max-w-4xl mx-auto bg-[#0a1f0a] text-white border border-[#d4a017]/40 shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
        <div className="p-5 md:p-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-10 h-10 bg-[#d4a017]/15 items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-[#d4a017]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-serif text-lg md:text-xl font-bold text-[#d4a017]">{c.title}</h2>
                <button
                  type="button"
                  onClick={handleRejectAll}
                  aria-label={c.rejectAll}
                  className="text-white/50 hover:text-white transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-white/75 leading-relaxed">{c.description}</p>

              {expanded && (
                <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                  <CategoryRow
                    name={c.categories.necessary.name}
                    desc={c.categories.necessary.desc}
                    checked
                    disabled
                  />
                  <CategoryRow
                    name={c.categories.analytics.name}
                    desc={c.categories.analytics.desc}
                    checked={analytics}
                    onChange={setAnalytics}
                  />
                  <CategoryRow
                    name={c.categories.marketing.name}
                    desc={c.categories.marketing.desc}
                    checked={marketing}
                    onChange={setMarketing}
                  />
                </div>
              )}

              <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:items-center">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2.5 bg-[#d4a017] text-[#0a1f0a] font-semibold text-sm hover:shadow-[0_8px_20px_#d4a01755] transition-all"
                >
                  {c.acceptAll}
                </button>
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="px-4 py-2.5 bg-transparent text-white border border-white/30 font-semibold text-sm hover:bg-white/10 transition-colors"
                >
                  {c.rejectAll}
                </button>
                {expanded ? (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2.5 bg-transparent text-[#d4a017] border border-[#d4a017]/60 font-semibold text-sm hover:bg-[#d4a017]/10 transition-colors"
                  >
                    {c.save}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="px-4 py-2.5 text-white/80 hover:text-white text-sm font-medium inline-flex items-center gap-1.5"
                  >
                    {c.customize}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
                <Link
                  href="/cookie-policy"
                  className="text-xs text-white/50 hover:text-white/80 underline sm:ml-auto"
                >
                  {c.more}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CategoryRow({
  name,
  desc,
  checked,
  onChange,
  disabled,
}: {
  name: string
  desc: string
  checked: boolean
  onChange?: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={name}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${
          checked ? "bg-[#d4a017]" : "bg-white/20"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      <div className="text-sm">
        <p className="font-semibold text-white">{name}</p>
        <p className="text-white/60 text-xs mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

export function reopenCookieBanner() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cookie-consent-reopen"))
  }
}
