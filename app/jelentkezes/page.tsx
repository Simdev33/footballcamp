"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { SubpageHero } from "@/components/subpage-hero"
import { SizeChart, SIZE_OPTIONS } from "@/components/size-chart"
import { Send, CheckCircle, Loader2, Plus, Trash2, HeartPulse, ChevronDown, ChevronUp } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { getHealthDeclaration } from "@/lib/health-declaration"
import { fireApplyConversion, storePendingConversion } from "@/lib/google-ads-conversion"

interface Camp {
  id: string
  city: string
  venue: string
  dates: string
  earlyBirdPrice: string
  remainingSpots: number
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

const inputClass =
  "w-full h-11 px-4 border border-border text-foreground focus:border-[#d4a017] focus:outline-none transition-colors text-[15px] bg-background rounded-md"
const labelClass = "block text-sm font-medium text-foreground mb-1.5"

function JelentkezesForm() {
  const searchParams = useSearchParams()
  const success = searchParams.get("success")
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
    notes: "",
  })
  const [children, setChildren] = useState<ChildForm[]>([emptyChild()])
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [healthAccepted, setHealthAccepted] = useState(false)

  useEffect(() => {
    fetch("/api/camps")
      .then((r) => r.json())
      .then(setCamps)
      .catch(() => setCamps([]))
  }, [])

  useEffect(() => {
    if (success) {
      void fireApplyConversion()
    }
  }, [success])

  if (success) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-lg mx-auto px-6 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">{f.successTitle}</h2>
          <p className="text-muted-foreground">{f.successDesc}</p>
        </div>
      </section>
    )
  }

  const updateChild = (index: number, patch: Partial<ChildForm>) => {
    setChildren((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)))
  }

  const addChild = () => setChildren((prev) => [...prev, emptyChild()])
  const removeChild = (index: number) =>
    setChildren((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)))

  const formatErr = (template: string, n: number) => template.replace("{n}", String(n))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    for (const [i, c] of children.entries()) {
      const n = i + 1
      if (!c.childName || !c.childBirthDate || !c.childCity || !c.campId) {
        setError(formatErr(f.errChildMissing, n))
        return
      }
      if (!c.playsFootball) {
        setError(formatErr(f.errPlaysMissing, n))
        return
      }
      if (!c.jerseySize || !c.shortsSize || !c.socksSize) {
        setError(formatErr(f.errSizesMissing, n))
        return
      }
      if (c.playsFootball === "yes" && !c.currentClub.trim()) {
        setError(formatErr(f.errClubMissing, n))
        return
      }
    }

    setLoading(true)
    storePendingConversion({
      email: parent.parentEmail,
      phone: parent.parentPhone,
    })
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parent,
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
      window.location.href = "/jelentkezes?success=true"
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
              <div>
                <label className={labelClass}>{f.parentName}</label>
                <input
                  type="text"
                  required
                  placeholder={f.parentNamePh}
                  value={parent.parentName}
                  onChange={(e) => setParent({ ...parent, parentName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{f.parentEmail}</label>
                <input
                  type="email"
                  required
                  placeholder={f.parentEmailPh}
                  value={parent.parentEmail}
                  onChange={(e) => setParent({ ...parent, parentEmail: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>{f.parentPhone}</label>
              <input
                type="tel"
                required
                placeholder={f.parentPhonePh}
                value={parent.parentPhone}
                onChange={(e) => setParent({ ...parent, parentPhone: e.target.value })}
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
                <div>
                  <label className={labelClass}>{f.childName}</label>
                  <input
                    type="text"
                    required
                    placeholder={f.childNamePh}
                    value={child.childName}
                    onChange={(e) => updateChild(index, { childName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{f.childBirth}</label>
                  <input
                    type="date"
                    required
                    value={child.childBirthDate}
                    onChange={(e) => updateChild(index, { childBirthDate: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>{f.childCity}</label>
                <input
                  type="text"
                  required
                  placeholder={f.childCityPh}
                  value={child.childCity}
                  onChange={(e) => updateChild(index, { childCity: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="space-y-3">
                <label className={labelClass}>{f.playsQuestion}</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => updateChild(index, { playsFootball: "yes" })}
                    className={`flex-1 h-11 border text-sm font-medium rounded-md transition-colors ${
                      child.playsFootball === "yes"
                        ? "bg-[#d4a017] border-[#d4a017] text-[#0a1f0a]"
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
                        : "bg-background border-border text-foreground hover:border-[#d4a017]/60"
                    }`}
                  >
                    {f.no}
                  </button>
                </div>
                {child.playsFootball === "yes" && (
                  <div className="pt-1">
                    <label className={labelClass}>{f.clubLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder={f.clubPh}
                      value={child.currentClub}
                      onChange={(e) => updateChild(index, { currentClub: e.target.value })}
                      className={inputClass}
                    />
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
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">{f.jerseySize}</label>
                    <select
                      required
                      value={child.jerseySize}
                      onChange={(e) => updateChild(index, { jerseySize: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">{f.selectPlaceholder}</option>
                      {SIZE_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">{f.shortsSize}</label>
                    <select
                      required
                      value={child.shortsSize}
                      onChange={(e) => updateChild(index, { shortsSize: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">{f.selectPlaceholder}</option>
                      {SIZE_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">{f.shoeSize}</label>
                    <input
                      type="number"
                      required
                      min={25}
                      max={48}
                      placeholder={f.shoeSizePh}
                      value={child.socksSize}
                      onChange={(e) => updateChild(index, { socksSize: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>{f.campSelect}</label>
                <select
                  required
                  value={child.campId}
                  onChange={(e) => updateChild(index, { campId: e.target.value })}
                  className={inputClass}
                >
                  <option value="">{f.campSelectPlaceholder}</option>
                  {camps.map((camp) => (
                    <option key={camp.id} value={camp.id}>
                      {camp.city} – {camp.dates} ({camp.remainingSpots} {f.spotsShort})
                    </option>
                  ))}
                </select>
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

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={healthAccepted}
                onChange={(e) => setHealthAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#d4a017] cursor-pointer"
              />
              <span className="text-sm text-foreground">{hd.formCheckboxLabel}</span>
            </label>
          </div>

          {/* Privacy */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
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
