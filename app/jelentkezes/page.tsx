"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { SubpageHero } from "@/components/subpage-hero"
import { SizeChart, SIZE_OPTIONS } from "@/components/size-chart"
import { Send, Loader2, Plus, Trash2, HeartPulse, ChevronDown, ChevronUp, CreditCard, Banknote } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { getHealthDeclaration } from "@/lib/health-declaration"
import { storePendingConversion } from "@/lib/google-ads-conversion"
import { fireLeadEvent } from "@/lib/meta-pixel"
import { formatPrice, splitInstallment } from "@/lib/pricing"

interface Camp {
  id: string
  city: string
  venue: string
  dates: string
  earlyBirdPrice: string
  remainingSpots: number
  priceHuf: number
  earlyBirdPriceHuf: number
  earlyBirdUntil: string | null
  depositPercent: number
  effectiveHuf: number
}

interface ChildForm {
  childName: string
  childBirthDate: string
  childCity: string
  playsFootball: "yes" | "no" | ""
  currentClub: string
  jerseySize: string
  shortsSize: string
  socksSize: string
  campId: string
}

const emptyChild = (): ChildForm => ({
  childName: "",
  childBirthDate: "",
  childCity: "",
  playsFootball: "",
  currentClub: "",
  jerseySize: "",
  shortsSize: "",
  socksSize: "",
  campId: "",
})

const inputBase =
  "w-full h-11 px-4 border text-foreground focus:outline-none transition-colors text-[15px] bg-background rounded-md"
const inputClass = `${inputBase} border-border focus:border-[#d4a017]`
const inputErr = `${inputBase} border-red-500 focus:border-red-600`
const labelClass = "block text-sm font-medium text-foreground mb-1.5"
const cls = (err?: string) => (err ? inputErr : inputClass)
const FieldError = ({ msg }: { msg?: string }) =>
  msg ? <p className="mt-1 text-xs text-red-600">{msg}</p> : null

function JelentkezesForm() {
  const searchParams = useSearchParams()
  const canceled = searchParams.get("canceled")
  const { t, locale } = useLanguage()
  const f = t.applyForm
  const hd = getHealthDeclaration(locale)

  const [camps, setCamps] = useState<Camp[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [healthOpen, setHealthOpen] = useState(false)

  const [parent, setParent] = useState({
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    parentPostalCode: "",
    parentCity: "",
    parentAddress: "",
    parentTaxNumber: "",
    notes: "",
  })
  const [children, setChildren] = useState<ChildForm[]>([emptyChild()])
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [healthAccepted, setHealthAccepted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [paymentMode, setPaymentMode] = useState<"full" | "deposit">("full")
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "TRANSFER">("CARD")

  useEffect(() => {
    fetch("/api/camps")
      .then((r) => r.json())
      .then(setCamps)
      .catch(() => setCamps([]))
  }, [])

  const campMap = new Map(camps.map((c) => [c.id, c]))
  const selectedCamps = children
    .map((child) => campMap.get(child.campId))
    .filter((c): c is Camp => Boolean(c))

  const effectivePerChild = selectedCamps.map((c) => c.effectiveHuf)
  const totalFull = effectivePerChild.reduce((s, v) => s + v, 0)
  const totalDeposit = selectedCamps.reduce((s, c) => {
    return s + splitInstallment(c.effectiveHuf, c.depositPercent).deposit
  }, 0)
  const dueNow = paymentMode === "full" ? totalFull : totalDeposit
  const remainderAfterDeposit = totalFull - totalDeposit

  const updateChild = (index: number, patch: Partial<ChildForm>) => {
    setChildren((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)))
  }

  const addChild = () => setChildren((prev) => [...prev, emptyChild()])
  const removeChild = (index: number) =>
    setChildren((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)))

  const scrollToFirstError = (errs: Record<string, string>) => {
    const firstKey = Object.keys(errs)[0]
    if (!firstKey) return
    const el = document.querySelector(`[data-field="${firstKey}"]`)
    if (el && "scrollIntoView" in el) {
      ;(el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" })
      const focusable = (el as HTMLElement).querySelector("input,select,textarea,button") as HTMLElement | null
      focusable?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const errs: Record<string, string> = {}
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRe = /^[+0-9 ()/.-]{7,}$/

    if (!parent.parentName.trim()) errs["parentName"] = f.errRequired
    if (!parent.parentEmail.trim()) errs["parentEmail"] = f.errRequired
    else if (!emailRe.test(parent.parentEmail.trim())) errs["parentEmail"] = f.errInvalidEmail
    if (!parent.parentPhone.trim()) errs["parentPhone"] = f.errRequired
    else if (!phoneRe.test(parent.parentPhone.trim())) errs["parentPhone"] = f.errInvalidPhone
    if (!parent.parentPostalCode.trim()) errs["parentPostalCode"] = f.errRequired
    else if (!/^\d{4}$/.test(parent.parentPostalCode.trim())) errs["parentPostalCode"] = f.errInvalidPostal
    if (!parent.parentCity.trim()) errs["parentCity"] = f.errRequired
    if (!parent.parentAddress.trim()) errs["parentAddress"] = f.errRequired

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (const [i, c] of children.entries()) {
      if (!c.childName.trim()) errs[`child-${i}-childName`] = f.errRequired
      if (!c.childBirthDate) errs[`child-${i}-childBirthDate`] = f.errRequired
      else {
        const bd = new Date(c.childBirthDate)
        if (isNaN(bd.getTime())) errs[`child-${i}-childBirthDate`] = f.errInvalidDate
        else if (bd > today) errs[`child-${i}-childBirthDate`] = f.errFutureBirth
        else {
          const age = (today.getTime() - bd.getTime()) / (365.25 * 24 * 3600 * 1000)
          if (age < 5 || age > 17) errs[`child-${i}-childBirthDate`] = f.errAgeRange
        }
      }
      if (!c.childCity.trim()) errs[`child-${i}-childCity`] = f.errRequired
      if (!c.campId) errs[`child-${i}-campId`] = f.errPickCamp
      if (!c.playsFootball) errs[`child-${i}-playsFootball`] = f.errPickOption
      if (c.playsFootball === "yes" && !c.currentClub.trim()) errs[`child-${i}-currentClub`] = f.errEnterClub
      if (!c.jerseySize) errs[`child-${i}-jerseySize`] = f.errPickSize
      if (!c.shortsSize) errs[`child-${i}-shortsSize`] = f.errPickSize
      if (!c.socksSize) errs[`child-${i}-socksSize`] = f.errRequired
    }
    if (!privacyAccepted) errs["privacy"] = f.errAcceptPrivacy
    if (!healthAccepted) errs["health"] = f.errAcceptHealth

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      setError(f.errFixFields)
      scrollToFirstError(errs)
      return
    }

    setFieldErrors({})
    setLoading(true)
    storePendingConversion({
      email: parent.parentEmail,
      phone: parent.parentPhone,
    })
    fireLeadEvent({ value: dueNow, currency: "HUF" })
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parent,
          paymentMethod,
          paymentMode,
          children: children.map((c) => ({
            ...c,
            currentClub: c.playsFootball === "yes" ? c.currentClub.trim() : "",
          })),
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        setError(text || f.errGeneric)
        setLoading(false)
        return
      }
      const applyJson = (await res.json()) as
        | { applicationIds: string[]; paymentMethod: "CARD" }
        | { applicationIds: string[]; paymentMethod: "TRANSFER"; transferReference: string }

      if (applyJson.paymentMethod === "TRANSFER") {
        window.location.href = `/jelentkezes/atutalas?ref=${encodeURIComponent(applyJson.transferReference)}`
        return
      }

      const { applicationIds } = applyJson
      const checkoutRes = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationIds, currency: "HUF", paymentMode }),
      })
      if (!checkoutRes.ok) {
        const text = await checkoutRes.text()
        setError(text || f.errCheckoutFailed)
        setLoading(false)
        return
      }
      const { url } = (await checkoutRes.json()) as { url: string }
      window.location.href = url
    } catch {
      setError(f.errNetwork)
      setLoading(false)
    }
  }

  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-8 p-5 md:p-6 border-l-4 border-[#d4a017] bg-[#d4a017]/5 rounded-md">
          <p className="text-[15px] leading-relaxed text-foreground">{f.intro}</p>
        </div>
        {canceled && (
          <div className="mb-6 p-4 border border-amber-300 bg-amber-50 text-amber-800 text-sm rounded-md">
            {f.canceledMsg}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="space-y-10 bg-white p-6 md:p-10 border border-border/50 shadow-sm rounded-lg"
        >
          {/* Parent section */}
          <div className="space-y-6">
            <div className="border-b border-border/70 pb-3">
              <h3 className="font-serif text-xl font-bold text-foreground">{f.parentSection}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.parentSectionHint}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div data-field="parentName">
                <label className={labelClass}>{f.parentName}</label>
                <input
                  type="text"
                  placeholder={f.parentNamePh}
                  value={parent.parentName}
                  onChange={(e) => setParent({ ...parent, parentName: e.target.value })}
                  aria-invalid={!!fieldErrors.parentName}
                  className={cls(fieldErrors.parentName)}
                />
                <FieldError msg={fieldErrors.parentName} />
              </div>
              <div data-field="parentEmail">
                <label className={labelClass}>{f.parentEmail}</label>
                <input
                  type="email"
                  placeholder={f.parentEmailPh}
                  value={parent.parentEmail}
                  onChange={(e) => setParent({ ...parent, parentEmail: e.target.value })}
                  aria-invalid={!!fieldErrors.parentEmail}
                  className={cls(fieldErrors.parentEmail)}
                />
                <FieldError msg={fieldErrors.parentEmail} />
              </div>
            </div>

            <div data-field="parentPhone">
              <label className={labelClass}>{f.parentPhone}</label>
              <input
                type="tel"
                placeholder={f.parentPhonePh}
                value={parent.parentPhone}
                onChange={(e) => setParent({ ...parent, parentPhone: e.target.value })}
                aria-invalid={!!fieldErrors.parentPhone}
                className={cls(fieldErrors.parentPhone)}
              />
              <FieldError msg={fieldErrors.parentPhone} />
            </div>
          </div>

          {/* Billing address — required for Számlázz.hu invoice generation */}
          <div className="space-y-6">
            <div className="border-b border-border/70 pb-3">
              <h3 className="font-serif text-xl font-bold text-foreground">{f.billingSection}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.billingSectionHint}</p>
            </div>

            <div className="grid sm:grid-cols-[140px_1fr] gap-4">
              <div data-field="parentPostalCode">
                <label className={labelClass}>{f.billingPostalCode}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder={f.billingPostalCodePh}
                  value={parent.parentPostalCode}
                  onChange={(e) => setParent({ ...parent, parentPostalCode: e.target.value.replace(/\D/g, "") })}
                  aria-invalid={!!fieldErrors.parentPostalCode}
                  className={cls(fieldErrors.parentPostalCode)}
                />
                <FieldError msg={fieldErrors.parentPostalCode} />
              </div>
              <div data-field="parentCity">
                <label className={labelClass}>{f.billingCity}</label>
                <input
                  type="text"
                  placeholder={f.billingCityPh}
                  value={parent.parentCity}
                  onChange={(e) => setParent({ ...parent, parentCity: e.target.value })}
                  aria-invalid={!!fieldErrors.parentCity}
                  className={cls(fieldErrors.parentCity)}
                />
                <FieldError msg={fieldErrors.parentCity} />
              </div>
            </div>

            <div data-field="parentAddress">
              <label className={labelClass}>{f.billingAddress}</label>
              <input
                type="text"
                placeholder={f.billingAddressPh}
                value={parent.parentAddress}
                onChange={(e) => setParent({ ...parent, parentAddress: e.target.value })}
                aria-invalid={!!fieldErrors.parentAddress}
                className={cls(fieldErrors.parentAddress)}
              />
              <FieldError msg={fieldErrors.parentAddress} />
            </div>

            <div data-field="parentTaxNumber">
              <label className={labelClass}>
                {f.billingTaxNumber}{" "}
                <span className="text-muted-foreground font-normal">{f.billingTaxNumberOptional}</span>
              </label>
              <input
                type="text"
                placeholder={f.billingTaxNumberPh}
                value={parent.parentTaxNumber}
                onChange={(e) => setParent({ ...parent, parentTaxNumber: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Children sections */}
          {children.map((child, index) => (
            <div key={index} className="space-y-6">
              <div className="flex items-end justify-between gap-4 border-b border-border/70 pb-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    {children.length === 1
                      ? f.childSectionOne
                      : f.childSectionN.replace("{n}", String(index + 1))}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{f.childSectionHint}</p>
                </div>
                {children.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChild(index)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {f.childDelete}
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div data-field={`child-${index}-childName`}>
                  <label className={labelClass}>{f.childName}</label>
                  <input
                    type="text"
                    placeholder={f.childNamePh}
                    value={child.childName}
                    onChange={(e) => updateChild(index, { childName: e.target.value })}
                    aria-invalid={!!fieldErrors[`child-${index}-childName`]}
                    className={cls(fieldErrors[`child-${index}-childName`])}
                  />
                  <FieldError msg={fieldErrors[`child-${index}-childName`]} />
                </div>
                <div data-field={`child-${index}-childBirthDate`}>
                  <label className={labelClass}>{f.childBirth}</label>
                  <input
                    type="date"
                    value={child.childBirthDate}
                    onChange={(e) => updateChild(index, { childBirthDate: e.target.value })}
                    aria-invalid={!!fieldErrors[`child-${index}-childBirthDate`]}
                    className={cls(fieldErrors[`child-${index}-childBirthDate`])}
                  />
                  <FieldError msg={fieldErrors[`child-${index}-childBirthDate`]} />
                </div>
              </div>

              <div data-field={`child-${index}-childCity`}>
                <label className={labelClass}>{f.childCity}</label>
                <input
                  type="text"
                  placeholder={f.childCityPh}
                  value={child.childCity}
                  onChange={(e) => updateChild(index, { childCity: e.target.value })}
                  aria-invalid={!!fieldErrors[`child-${index}-childCity`]}
                  className={cls(fieldErrors[`child-${index}-childCity`])}
                />
                <FieldError msg={fieldErrors[`child-${index}-childCity`]} />
              </div>

              <div className="space-y-3" data-field={`child-${index}-playsFootball`}>
                <label className={labelClass}>{f.playsQuestion}</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => updateChild(index, { playsFootball: "yes" })}
                    className={`flex-1 h-11 border text-sm font-medium rounded-md transition-colors ${
                      child.playsFootball === "yes"
                        ? "bg-[#d4a017] border-[#d4a017] text-[#0a1f0a]"
                        : fieldErrors[`child-${index}-playsFootball`]
                          ? "bg-background border-red-500 text-foreground"
                          : "bg-background border-border text-foreground hover:border-[#d4a017]/60"
                    }`}
                  >
                    {f.yes}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateChild(index, { playsFootball: "no", currentClub: "" })}
                    className={`flex-1 h-11 border text-sm font-medium rounded-md transition-colors ${
                      child.playsFootball === "no"
                        ? "bg-[#d4a017] border-[#d4a017] text-[#0a1f0a]"
                        : fieldErrors[`child-${index}-playsFootball`]
                          ? "bg-background border-red-500 text-foreground"
                          : "bg-background border-border text-foreground hover:border-[#d4a017]/60"
                    }`}
                  >
                    {f.no}
                  </button>
                </div>
                <FieldError msg={fieldErrors[`child-${index}-playsFootball`]} />
                {child.playsFootball === "yes" && (
                  <div className="pt-1" data-field={`child-${index}-currentClub`}>
                    <label className={labelClass}>{f.clubLabel}</label>
                    <input
                      type="text"
                      placeholder={f.clubPh}
                      value={child.currentClub}
                      onChange={(e) => updateChild(index, { currentClub: e.target.value })}
                      aria-invalid={!!fieldErrors[`child-${index}-currentClub`]}
                      className={cls(fieldErrors[`child-${index}-currentClub`])}
                    />
                    <FieldError msg={fieldErrors[`child-${index}-currentClub`]} />
                  </div>
                )}
              </div>

              {/* Sizes */}
              <div className="space-y-3">
                <div className="flex items-end justify-between flex-wrap gap-2">
                  <div>
                    <label className={labelClass + " mb-0"}>{f.sizesTitle}</label>
                    <p className="text-xs text-muted-foreground mt-1">{f.sizesHint}</p>
                  </div>
                  <SizeChart />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div data-field={`child-${index}-jerseySize`}>
                    <label className="block text-xs text-muted-foreground mb-1.5">{f.jerseySize}</label>
                    <select
                      value={child.jerseySize}
                      onChange={(e) => updateChild(index, { jerseySize: e.target.value })}
                      aria-invalid={!!fieldErrors[`child-${index}-jerseySize`]}
                      className={cls(fieldErrors[`child-${index}-jerseySize`])}
                    >
                      <option value="">{f.selectPlaceholder}</option>
                      {SIZE_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <FieldError msg={fieldErrors[`child-${index}-jerseySize`]} />
                  </div>
                  <div data-field={`child-${index}-shortsSize`}>
                    <label className="block text-xs text-muted-foreground mb-1.5">{f.shortsSize}</label>
                    <select
                      value={child.shortsSize}
                      onChange={(e) => updateChild(index, { shortsSize: e.target.value })}
                      aria-invalid={!!fieldErrors[`child-${index}-shortsSize`]}
                      className={cls(fieldErrors[`child-${index}-shortsSize`])}
                    >
                      <option value="">{f.selectPlaceholder}</option>
                      {SIZE_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <FieldError msg={fieldErrors[`child-${index}-shortsSize`]} />
                  </div>
                  <div data-field={`child-${index}-socksSize`}>
                    <label className="block text-xs text-muted-foreground mb-1.5">{f.shoeSize}</label>
                    <input
                      type="number"
                      min={25}
                      max={48}
                      placeholder={f.shoeSizePh}
                      value={child.socksSize}
                      onChange={(e) => updateChild(index, { socksSize: e.target.value })}
                      aria-invalid={!!fieldErrors[`child-${index}-socksSize`]}
                      className={cls(fieldErrors[`child-${index}-socksSize`])}
                    />
                    <FieldError msg={fieldErrors[`child-${index}-socksSize`]} />
                  </div>
                </div>
              </div>

              <div data-field={`child-${index}-campId`}>
                <label className={labelClass}>{f.campSelect}</label>
                <select
                  value={child.campId}
                  onChange={(e) => updateChild(index, { campId: e.target.value })}
                  aria-invalid={!!fieldErrors[`child-${index}-campId`]}
                  className={cls(fieldErrors[`child-${index}-campId`])}
                >
                  <option value="">{f.campSelectPlaceholder}</option>
                  {camps.map((camp) => (
                    <option key={camp.id} value={camp.id}>
                      {camp.city} – {camp.dates}
                    </option>
                  ))}
                </select>
                <FieldError msg={fieldErrors[`child-${index}-campId`]} />
              </div>
            </div>
          ))}

          {/* Add another child */}
          <button
            type="button"
            onClick={addChild}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#d4a017]/50 text-[#d4a017] font-medium hover:bg-[#d4a017]/5 hover:border-[#d4a017] transition-colors rounded-md"
          >
            <Plus className="w-5 h-5" />
            {f.addChild}
          </button>

          {/* Notes */}
          <div>
            <label className={labelClass}>
              {f.notesLabel} <span className="text-muted-foreground font-normal">{f.notesOptional}</span>
            </label>
            <textarea
              rows={3}
              placeholder={f.notesPh}
              value={parent.notes}
              onChange={(e) => setParent({ ...parent, notes: e.target.value })}
              className="w-full px-4 py-3 border border-border text-foreground focus:border-[#d4a017] focus:outline-none transition-colors text-[15px] bg-background resize-none rounded-md"
            />
          </div>

          {/* Health declaration */}
          <div className="border border-[#d4a017]/30 bg-[#d4a017]/5 p-5 space-y-4 rounded-md">
            <div className="flex items-start gap-3">
              <HeartPulse className="w-5 h-5 text-[#d4a017] shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-serif text-lg font-bold text-foreground">{hd.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{hd.formIntro}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <Link href="/egeszsegugyi-nyilatkozat" target="_blank" className="text-[#d4a017] underline hover:no-underline">
                    {hd.openInNewTab}
                  </Link>
                  <a href="/egeszsegugyi-nyilatkozat.docx" download className="text-[#d4a017] underline hover:no-underline">
                    {hd.downloadLabel}
                  </a>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHealthOpen(!healthOpen)}
              className="inline-flex items-center gap-1.5 text-sm text-[#0a1f0a] font-medium hover:text-[#d4a017] transition-colors"
            >
              {healthOpen ? (
                <>
                  <ChevronUp className="w-4 h-4" /> {hd.formHide}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" /> {hd.formReadHere}
                </>
              )}
            </button>

            {healthOpen && (
              <div className="max-h-64 overflow-y-auto space-y-3 text-[13px] leading-relaxed text-foreground bg-white p-4 border border-border/50 rounded-md">
                {hd.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <p className="font-semibold">{hd.commitmentsIntro}</p>
                <ul className="list-disc pl-5 space-y-1">
                  {hd.commitments.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
                <p className="font-semibold">{hd.consent}</p>
              </div>
            )}

            <div data-field="health">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={healthAccepted}
                  onChange={(e) => setHealthAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#d4a017] cursor-pointer"
                />
                <span className="text-sm text-foreground">{hd.formCheckboxLabel}</span>
              </label>
              <FieldError msg={fieldErrors.health} />
            </div>
          </div>

          {/* Privacy */}
          <div data-field="privacy">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#d4a017] cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">
                {f.privacyLabel}{" "}
                <Link href="/adatkezelesi-tajekoztato" target="_blank" className="text-[#d4a017] underline hover:no-underline">
                  {f.privacyLink}
                </Link>{" "}
                {f.privacyAnd}{" "}
                <Link href="/aszf" target="_blank" className="text-[#d4a017] underline hover:no-underline">
                  {f.termsLink}
                </Link>
                {f.privacyEnd}
              </span>
            </label>
            <FieldError msg={fieldErrors.privacy} />
          </div>

          {/* Payment section */}
          {selectedCamps.length > 0 && (
            <div className="border border-[#d4a017]/30 bg-[#d4a017]/5 p-5 space-y-5 rounded-md">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">{f.paymentTitle}</h3>
                <p className="text-xs text-muted-foreground mt-1">{f.paymentDesc}</p>
              </div>

              <div>
                <label className={labelClass}>{f.paymentScheduleLabel}</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMode("full")}
                    className={`p-4 border text-left rounded-md transition-colors ${
                      paymentMode === "full"
                        ? "bg-[#d4a017] border-[#d4a017] text-[#0a1f0a]"
                        : "bg-background border-border text-foreground hover:border-[#d4a017]/60"
                    }`}
                  >
                    <div className="font-semibold text-sm">{f.paymentScheduleFull}</div>
                    <div className="text-xs mt-1 opacity-80">{f.paymentScheduleFullDesc}</div>
                    <div className="mt-2 font-bold text-base">{formatPrice(totalFull, "HUF")}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode("deposit")}
                    className={`p-4 border text-left rounded-md transition-colors ${
                      paymentMode === "deposit"
                        ? "bg-[#d4a017] border-[#d4a017] text-[#0a1f0a]"
                        : "bg-background border-border text-foreground hover:border-[#d4a017]/60"
                    }`}
                  >
                    <div className="font-semibold text-sm">{f.paymentScheduleDeposit}</div>
                    <div className="text-xs mt-1 opacity-80">{f.paymentScheduleDepositDesc}</div>
                    <div className="mt-2 font-bold text-base">{formatPrice(totalDeposit, "HUF")}</div>
                    <div className="text-xs mt-0.5 opacity-70">
                      {f.paymentScheduleDepositLater.replace("{amount}", formatPrice(remainderAfterDeposit, "HUF"))}
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>{f.paymentMethodLabel}</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("CARD")}
                    className={`p-4 border text-left rounded-md transition-colors ${
                      paymentMethod === "CARD"
                        ? "bg-[#d4a017] border-[#d4a017] text-[#0a1f0a]"
                        : "bg-background border-border text-foreground hover:border-[#d4a017]/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <div className="font-semibold text-sm">{f.paymentMethodCard}</div>
                    </div>
                    <div className="text-xs mt-1 opacity-80">{f.paymentMethodCardDesc}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("TRANSFER")}
                    className={`p-4 border text-left rounded-md transition-colors ${
                      paymentMethod === "TRANSFER"
                        ? "bg-[#d4a017] border-[#d4a017] text-[#0a1f0a]"
                        : "bg-background border-border text-foreground hover:border-[#d4a017]/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4" />
                      <div className="font-semibold text-sm">{f.paymentMethodTransfer}</div>
                    </div>
                    <div className="text-xs mt-1 opacity-80">{f.paymentMethodTransferDesc}</div>
                  </button>
                </div>
              </div>

              {paymentMethod === "TRANSFER" && (
                <div className="p-4 bg-white border border-[#d4a017]/30 rounded-md text-sm text-foreground">
                  <p className="leading-relaxed">{f.paymentTransferHint}</p>
                </div>
              )}

              <div className="flex items-baseline justify-between border-t border-[#d4a017]/20 pt-3">
                <span className="text-sm text-muted-foreground">
                  {paymentMethod === "TRANSFER" ? f.paymentDueNowTransfer : f.paymentDueNowCard}
                </span>
                <span className="font-serif text-2xl font-bold text-foreground">
                  {formatPrice(dueNow, "HUF")}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:bg-[#d4a017]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded-md"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" /> {f.submit}
              </>
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">{f.afterSubmit}</p>
        </form>
      </div>
    </section>
  )
}

function JelentkezesHero() {
  const { t } = useLanguage()
  return <SubpageHero title={t.applyForm.heroTitle} subtitle={t.applyForm.heroSubtitle} />
}

export default function JelentkezesPage() {
  return (
    <main>
      <JelentkezesHero />
      <Suspense fallback={<div className="py-20 text-center text-muted-foreground">...</div>}>
        <JelentkezesForm />
      </Suspense>
    </main>
  )
}
