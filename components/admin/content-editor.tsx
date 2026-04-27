"use client"

import { useEffect, useState, useTransition } from "react"
import {
  Save, Pencil, X, Plus, Trash2, Globe, RotateCcw, Check, Eye,
  Loader2,
  ArrowRight, ChevronDown,
} from "lucide-react"
import { updateSiteContent, resetSiteContent } from "@/lib/actions"
import type { Locale } from "@/lib/i18n"
import { CONTENT_PAGES, type ContentPageId } from "@/lib/admin-content-pages"

// Re-export for any client-only imports that still point at this module.
export type { ContentPageId } from "@/lib/admin-content-pages"
export { CONTENT_PAGES } from "@/lib/admin-content-pages"

// ─── Page & section registry ───

const PAGES = CONTENT_PAGES

const SECTION_INFO: Record<string, { label: string; desc: string; theme: string }> = {
  hero:            { label: "Hero szekció",              desc: "Fejléc videó háttérrel",             theme: "dark" },
  whySpecial:      { label: "Miért különleges?",         desc: "Bevezető szekció képpel",            theme: "light" },
  whyDifferent:    { label: "Ezért más ez a focitábor",  desc: "Taktikai tábla kártyák",             theme: "green" },
  usp:             { label: "11 érv (USP)",              desc: "Focipálya felállás",                 theme: "dark" },
  limitedSpots:    { label: "Korlátozott létszám",       desc: "CTA – stadion jegy stílus",          theme: "gold" },
  whatKidsGet:     { label: "Mit kapsz a táborban?",     desc: "Ikonos tartalmi lista",              theme: "light" },
  targetAudience:  { label: "Kinek ajánljuk?",           desc: "Számozott célcsoport lista",         theme: "dark" },
  experience:      { label: "Több mint edzés",           desc: "Statisztikák és idézet",             theme: "dark" },
  locations:       { label: "Helyszínek feliratok",      desc: "Címek és label-ek (táborok az admin Táborok fülön)", theme: "light" },
  campsListPage:   { label: "Táborok főoldal",           desc: "A Táborok menüpont általános szövegei és kártya feliratai", theme: "dark" },
  form:            { label: "Jelentkezés szekció",       desc: "CTA és trust elemek",                theme: "dark" },
  coaches:         { label: "Klubok",                    desc: "Partner klubok kártyái",             theme: "light" },
  partnerProgram:  { label: "Partnerprogram",            desc: "Partner szekciók és CTA",            theme: "light" },
  faq:             { label: "Gyakori kérdések",          desc: "Kérdés-válasz párok",                theme: "light" },
  gallery:         { label: "Galéria feliratok",         desc: "Galéria szekció szövegei",           theme: "light" },
  nav:             { label: "Navigáció",                 desc: "Menüpontok elnevezései",             theme: "light" },
  footer:          { label: "Lábléc",                    desc: "Footer tartalom és linkek",          theme: "dark" },
  aszf:            { label: "ÁSZF",                       desc: "Általános Szerződési Feltételek – szekciónként szerkeszthető", theme: "light" },
  cookiePolicy:    { label: "Cookie tájékoztató",          desc: "Süti-tájékoztató aloldal tartalma",  theme: "light" },
  cookieBanner:    { label: "Cookie sáv",                  desc: "A cookie-elfogadó sáv és kategóriák szövegei", theme: "light" },
}

const FIELD_LABELS: Record<string, string> = {
  badge: "Badge", title: "Cím", titleHighlight: "Kiemelt szó", titleEnd: "Cím vége",
  text: "Szöveg", subtitle: "Alcím", desc: "Leírás", cta: "Gomb felirat",
  items: "Elemek", bullets: "Felsorolás pontjai",
  campBadge: "Badge szöveg", location: "Korosztály felirat", pickLocation: "Helyszín választó",
  line1: "Cím 1. sor", line2: "Cím 2. sor", line3: "Cím 3. sor",
  tagline: "Tagline (• elválasztó)", earlyLabel: "Korlátozott felirat",
  scroll: "Görgetés felirat", carouselPrev: "Előző gomb", carouselNext: "Következő gomb",
  earlyBirdNote: "Early bird megjegyzés",
  text1: "Szöveg 1", text1End: "Szöveg 1 vége", textHighlight: "Kiemelt szöveg",
  text2: "Idézet szöveg", quote: "Idézet", quoteHighlight: "Idézet kiemelt",
  quoteAuthor: "Idézet szerző", quoteRole: "Idézet beosztás",
  dateLabel: "Dátum felirat", spotsLabel: "Férőhely felirat",
  earlyBirdLabel: "Early bird felirat", earlyBirdBadge: "Early bird badge", spots: "Fő felirat",
  trust: "Trust elemek", security: "Biztonsági szöveg", label: "Felirat",
  about: "Rólunk", partnerProgram: "Partnerprogram", gallery: "Galéria",
  contact: "Kapcsolat", faq: "GYIK", register: "Jelentkezés",
  clubs: "Klubok", camps: "Táborok",
  cards: "Klub kártyák", partnerTile: "Partnerprogram csempe", name: "Név", role: "Beosztás",
  intro: "Bevezető", sections: "Szekciók",
  practiceTitle: "Gyakorlati cím", practiceItems: "Gyakorlati pontok",
  benefitTitle: "Előny cím", benefitItems: "Előny pontok",
  ctaTitle: "CTA cím", ctaText: "CTA szöveg",
  question: "Kérdés", answer: "Válasz",
  heading: "Szekció címe", paragraphs: "Bekezdések",
  backToRegister: "Vissza a jelentkezéshez gomb", downloadLabel: "Letöltés gomb felirat",
  placeholder: "Ideiglenes jelzés (üres = elrejtve)",
  acceptAll: "Minden elfogadása gomb", rejectAll: "Csak szükséges gomb",
  customize: "Beállítások gomb", save: "Mentés gomb", more: "Részletek link",
  reopen: "Újranyitás link felirat", categories: "Kategóriák",
  necessary: "Szükséges", analytics: "Statisztikai", marketing: "Marketing",
  navTitle: "Navigáció cím", links: "Linkek",
  newsletterTitle: "Hírlevél cím", newsletterDesc: "Hírlevél leírás",
  emailPlaceholder: "Email placeholder", subscribed: "Feliratkozott szöveg",
  copyright: "Copyright", motto: "Mottó", href: "URL",
  detailsCta: "Részletek gomb", statValue: "Statisztika érték", statLabel: "Statisztika felirat",
  heroTitle: "Hero cím", heroSubtitle: "Hero alcím", kidsBadge: "Gyerek szekció badge",
  kidsTitle: "Gyerek szekció cím", kidsTitleHighlight: "Gyerek cím kiemelés", kidsTitleEnd: "Gyerek cím vége",
  kidsItems: "Gyerek szekció elemek", locationsBadge: "Helyszínek badge",
  locationsTitle: "Helyszínek cím", locationsHighlight: "Helyszínek kiemelés",
  emptyState: "Üres állapot", ageLabel: "Korosztály felirat", ageRange: "Korosztály",
}

const SKIP_FIELDS: Record<string, string[]> = {
  locations: ["camps"],
}

// ─── Helpers ───

function getLabel(key: string): string {
  return FIELD_LABELS[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())
}

function themeClasses(theme: string) {
  switch (theme) {
    case "dark":  return "bg-white border-slate-200"
    case "green": return "bg-emerald-50 border-emerald-100"
    case "gold":  return "bg-amber-50 border-amber-100"
    default:      return "bg-white border-slate-200"
  }
}

function themeTextClasses(theme: string) {
  switch (theme) {
    case "dark": case "green": case "gold": return "text-slate-950"
    default: return "text-slate-950"
  }
}

function createEmptyItem(template: unknown): unknown {
  if (typeof template === "string") return ""
  if (Array.isArray(template)) return []
  if (typeof template === "object" && template !== null) {
    const obj: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(template)) {
      if (typeof v === "string") obj[k] = ""
      else if (Array.isArray(v)) obj[k] = []
      else obj[k] = ""
    }
    return obj
  }
  return ""
}

// ─── Field renderers ───

function FieldInput({
  label, value, onChange, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-12 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
      />
    </div>
  )
}

function FieldTextarea({
  label, value, onChange, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; hint?: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(8, Math.max(3, value.split("\n").length + 1))}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-relaxed text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 resize-y"
      />
      {hint && <p className="text-sm text-slate-500">{hint}</p>}
    </div>
  )
}

function renderFields(
  data: Record<string, unknown>,
  path: string[],
  updateField: (path: string[], value: unknown) => void,
  skipKeys: string[] = [],
) {
  return Object.entries(data).map(([key, value]) => {
    if (skipKeys.includes(key)) return null

    const currentPath = [...path, key]
    const fieldLabel = getLabel(key)

    if (typeof value === "string") {
      const isLong = value.length > 100
      return isLong ? (
        <FieldTextarea
          key={key}
          label={fieldLabel}
          value={value}
          onChange={(v) => updateField(currentPath, v)}
        />
      ) : (
        <FieldInput
          key={key}
          label={fieldLabel}
          value={value}
          onChange={(v) => updateField(currentPath, v)}
        />
      )
    }

    if (Array.isArray(value)) {
      if (value.length === 0 || typeof value[0] === "string") {
        return (
          <FieldTextarea
            key={key}
            label={fieldLabel}
            value={(value as string[]).join("\n")}
            onChange={(v) => updateField(currentPath, v.split("\n").filter(Boolean))}
            hint="Minden sor egy elem"
          />
        )
      }

      if (typeof value[0] === "object" && value[0] !== null) {
        return (
          <div key={key} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">
                {fieldLabel} ({value.length})
              </label>
              <button
                type="button"
                onClick={() => {
                  const template = value[0]
                  const newItem = createEmptyItem(template)
                  updateField(currentPath, [...value, newItem])
                }}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-teal-50 px-3 text-sm font-bold text-teal-700 hover:bg-teal-100 transition-colors"
              >
                <Plus className="w-4 h-4" /> Új elem
              </button>
            </div>
            {(value as Record<string, unknown>[]).map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    #{i + 1}
                  </span>
                  {value.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...value]
                        next.splice(i, 1)
                        updateField(currentPath, next)
                      }}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-red-50 px-3 text-sm font-bold text-red-700 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Törlés
                    </button>
                  )}
                </div>
                {Object.entries(item).map(([subKey, subVal]) => {
                  const subPath = [...currentPath, String(i), subKey]
                  const subLabel = getLabel(subKey)

                  if (typeof subVal === "string") {
                    return subVal.length > 80 ? (
                      <FieldTextarea
                        key={subKey}
                        label={subLabel}
                        value={subVal}
                        onChange={(v) => updateField(subPath, v)}
                      />
                    ) : (
                      <FieldInput
                        key={subKey}
                        label={subLabel}
                        value={subVal}
                        onChange={(v) => updateField(subPath, v)}
                      />
                    )
                  }

                  if (Array.isArray(subVal) && subVal.every((x) => typeof x === "string")) {
                    return (
                      <FieldTextarea
                        key={subKey}
                        label={subLabel}
                        value={(subVal as string[]).join("\n")}
                        onChange={(v) => updateField(subPath, v.split("\n").filter(Boolean))}
                        hint="Minden sor egy elem"
                      />
                    )
                  }

                  return null
                })}
              </div>
            ))}
          </div>
        )
      }
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div key={key} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label className="text-sm font-semibold text-slate-700">{fieldLabel}</label>
          <div className="space-y-3">
            {renderFields(value as Record<string, unknown>, currentPath, updateField, skipKeys)}
          </div>
        </div>
      )
    }

    return null
  })
}

// ─── Live preview (reader view) ───

const CHECK_COLORS = ["#d4a017", "#22c55e", "#3b82f6", "#ef4444", "#8b5cf6"]

function LiveSectionPreview({ sectionId, data }: { sectionId: string; data: Record<string, unknown> }) {
  const d = data as Record<string, string | string[] | Record<string, unknown>[]>

  switch (sectionId) {
    case "hero":
      return (
        <div className="relative bg-[#0a1f0a] px-6 py-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#d4a01715_0%,transparent_60%)]" />
          <div className="relative z-10 max-w-md">
            {d.campBadge && (
              <span className="inline-block border border-[#d4a017]/40 bg-[#0a1f0a]/80 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d4a017] mb-3">
                {d.campBadge as string}
              </span>
            )}
            {d.location && (
              <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/70">{d.location as string}</span>
              </div>
            )}
            <h1 className="font-serif text-2xl font-bold leading-[0.95]">
              <span className="block text-white">{d.line1 as string}</span>
              <span className="block text-[#d4a017] mt-0.5">{d.line2 as string}</span>
              <span className="block text-white/70 mt-0.5">{d.line3 as string}</span>
            </h1>
            <p className="mt-3 text-xs text-white/60 leading-relaxed">{d.subtitle as string}</p>
            {d.tagline && (
              <div className="mt-2 flex flex-wrap gap-x-3">
                {(d.tagline as string).split("•").map((t, i) => (
                  <span key={i} className="flex items-center gap-1 text-[9px] text-[#d4a017]/75">
                    <span className="w-1 h-1 rounded-full bg-[#d4a017]/50" />{t.trim()}
                  </span>
                ))}
              </div>
            )}
            {d.cta && (
              <div className="mt-5">
                <span className="inline-flex items-center gap-2 bg-[#d4a017] px-5 py-2.5 text-xs font-bold text-[#0a1f0a]">
                  {d.cta as string} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            )}
          </div>
        </div>
      )

    case "whySpecial":
      return (
        <div className="bg-[#eef1ec] px-6 py-8">
          {d.badge && <span className="inline-block px-3 py-1 bg-[#0a1f0a] text-[#d4a017] text-[9px] tracking-[0.3em] uppercase font-medium">{d.badge as string}</span>}
          <h2 className="mt-3 font-serif text-lg font-bold text-[#0a1f0a] leading-tight">
            {d.title as string} <span className="text-[#d4a017]">{d.titleHighlight as string}</span> {d.titleEnd as string}
          </h2>
          <p className="mt-2 text-xs text-[#0a1f0a]/60 leading-relaxed">{d.text as string}</p>
          {Array.isArray(d.bullets) && (
            <div className="mt-4 space-y-2">
              {(d.bullets as string[]).map((b, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="mt-0.5 w-4 h-4 bg-[#d4a017] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#0a1f0a]" />
                  </div>
                  <span className="text-[10px] text-[#0a1f0a]/70">{b}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )

    case "whyDifferent":
      return (
        <div className="relative bg-[#1a5c2a] px-6 py-8 overflow-hidden">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.01)_0px,rgba(255,255,255,0.01)_2px,transparent_2px,transparent_20px)]" />
          <div className="relative z-10">
            {d.badge && <span className="inline-block px-3 py-1 bg-white/10 text-white text-[9px] tracking-[0.3em] uppercase font-bold border border-white/20">{d.badge as string}</span>}
            <h2 className="mt-3 font-serif text-lg font-bold text-white text-center">
              {d.title as string} <span className="text-[#d4a017]">{d.titleHighlight as string}</span>
            </h2>
            {Array.isArray(d.items) && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {(d.items as Record<string, string>[]).slice(0, 4).map((item, i) => (
                  <div key={i} className="bg-[#0a1f0a]/70 border border-white/10 p-3 rounded-lg">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center mb-2 border-2 font-serif text-xs font-black" style={{ borderColor: CHECK_COLORS[i], color: CHECK_COLORS[i], background: `${CHECK_COLORS[i]}15` }}>
                      {i + 1}
                    </div>
                    <h3 className="font-serif font-bold text-[10px] text-white mb-0.5">{item.title}</h3>
                    <p className="text-[9px] text-white/50 leading-relaxed line-clamp-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )

    case "usp":
      return (
        <div className="bg-[#0a1f0a] px-6 py-8">
          {d.badge && <span className="inline-block px-3 py-1 bg-[#d4a017] text-[#0a1f0a] text-[9px] tracking-[0.3em] uppercase font-bold">{d.badge as string}</span>}
          <h2 className="mt-3 font-serif text-lg font-bold text-white text-center">
            {d.title as string} <span className="text-[#d4a017]">{d.titleHighlight as string}</span>
          </h2>
          <p className="mt-1 text-[10px] text-white/50 text-center uppercase tracking-wider">{d.subtitle as string}</p>
          {Array.isArray(d.items) && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {(d.items as Record<string, string>[]).map((item, i) => (
                <div key={i} className="flex flex-col items-center w-16">
                  <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center" style={{ borderColor: `${CHECK_COLORS[i % 5]}40`, background: `${CHECK_COLORS[i % 5]}08` }}>
                    <span className="font-serif text-sm font-bold" style={{ color: CHECK_COLORS[i % 5] }}>{i + 1}</span>
                  </div>
                  <span className="text-[7px] text-white/70 text-center mt-1 leading-tight">{item.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )

    case "limitedSpots":
      return (
        <div className="bg-[#0a1f0a] px-6 py-8 text-center">
          <div className="h-1.5 bg-gradient-to-r from-[#1e6b1e] via-[#2d7a2d] to-[#1e6b1e] -mx-6 -mt-8 mb-6" />
          <div className="inline-block bg-[#1a3a1a] border border-[#d4a017]/30 px-4 py-2 mb-3">
            <h2 className="font-serif text-sm font-bold text-[#d4a017]">{d.title as string}</h2>
          </div>
          <p className="text-[10px] text-white/65 max-w-sm mx-auto">{d.text as string}</p>
          <p className="mt-2 text-[9px] text-[#d4a017]/70">{d.earlyBirdNote as string}</p>
          {d.cta && (
            <span className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[#d4a017] text-[#0a1f0a] text-[10px] font-bold">
              {d.cta as string} <ArrowRight className="w-3 h-3" />
            </span>
          )}
          <div className="h-1.5 bg-gradient-to-r from-[#1e6b1e] via-[#2d7a2d] to-[#1e6b1e] -mx-6 -mb-8 mt-6" />
        </div>
      )

    case "whatKidsGet":
      return (
        <div className="bg-[#eef1ec] px-6 py-8">
          {d.badge && <span className="inline-block px-3 py-1 bg-[#0a1f0a] text-[#d4a017] text-[9px] tracking-[0.3em] uppercase font-medium">{d.badge as string}</span>}
          <h2 className="mt-3 font-serif text-lg font-bold text-[#0a1f0a]">
            {d.title as string} <span className="text-[#d4a017]">{d.titleHighlight as string}</span> {d.titleEnd as string}
          </h2>
          <p className="mt-2 text-xs text-[#0a1f0a]/60">{d.subtitle as string}</p>
          {Array.isArray(d.items) && (
            <div className="mt-4 space-y-2">
              {(d.items as Record<string, string>[]).map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 text-[10px] font-bold" style={{ background: `${CHECK_COLORS[i % 5]}18`, color: CHECK_COLORS[i % 5] }}>
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[10px] text-[#0a1f0a]">{item.title}</h4>
                    <p className="text-[9px] text-[#0a1f0a]/50">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )

    case "targetAudience":
      return (
        <div className="bg-[#0e2e14] px-6 py-8">
          {d.badge && <span className="inline-block px-3 py-1 bg-[#d4a017] text-[#0a1f0a] text-[9px] tracking-[0.3em] uppercase font-bold">{d.badge as string}</span>}
          <h2 className="mt-3 font-serif text-lg font-bold text-white text-center">
            {d.title as string} <span className="text-[#d4a017]">{d.titleHighlight as string}</span>
          </h2>
          <p className="mt-2 text-xs text-white/55 text-center">{d.text as string}</p>
          {Array.isArray(d.items) && (
            <div className="mt-4 space-y-2">
              {(d.items as string[]).map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 font-serif font-black text-xs border-2" style={{ borderColor: `${CHECK_COLORS[i % 5]}60`, color: CHECK_COLORS[i % 5] }}>
                    {i + 1}
                  </div>
                  <span className="text-[10px] text-white/85">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )

    case "experience":
      return (
        <div className="bg-[#0a1f0a] px-6 py-8">
          {d.badge && <span className="inline-block px-3 py-1 bg-[#0a1f0a] text-[#d4a017] text-[9px] tracking-[0.3em] uppercase font-medium border border-[#d4a017]/30">{d.badge as string}</span>}
          <h2 className="mt-3 font-serif text-lg font-bold text-white">
            {d.title as string} <span className="text-[#d4a017]">{d.titleHighlight as string}</span> {d.titleEnd as string}
          </h2>
          <p className="mt-2 text-xs text-white/70 leading-relaxed">{d.text1 as string}</p>
          <div className="grid grid-cols-3 gap-2 my-4">
            {[{ v: "15", l: "fő / csoport", c: "#22c55e" }, { v: "4", l: "edzés / nap", c: "#3b82f6" }, { v: "5", l: "nap / turnus", c: "#d4a017" }].map(s => (
              <div key={s.l} className="text-center p-2 bg-white/5 border border-white/10 rounded">
                <span className="block font-serif text-lg font-bold" style={{ color: s.c }}>{s.v}</span>
                <span className="block text-white/60 text-[8px]">{s.l}</span>
              </div>
            ))}
          </div>
          {d.text2 && (
            <blockquote className="pl-3 border-l-2 border-[#d4a017]/50 text-xs text-white/70 italic">
              &ldquo;{d.text2 as string}&rdquo;
            </blockquote>
          )}
        </div>
      )

    case "faq":
      return (
        <div className="bg-[#eef1ec] px-6 py-8">
          {d.badge && <span className="inline-block px-3 py-1 bg-[#0a1f0a] text-[#d4a017] text-[9px] tracking-[0.3em] uppercase font-medium">{d.badge as string}</span>}
          <h2 className="mt-3 font-serif text-lg font-bold text-[#0a1f0a]">
            {d.title as string} <span className="text-[#d4a017]">{d.titleHighlight as string}</span>
          </h2>
          {Array.isArray(d.items) && (
            <div className="mt-4 space-y-2">
              {(d.items as Record<string, string>[]).map((item, i) => (
                <div key={i} className="border border-[#0a1f0a]/10 bg-white">
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <span className="text-[10px] font-semibold text-[#0a1f0a]">{item.question}</span>
                    <ChevronDown className="w-3 h-3 text-[#0a1f0a]/30 shrink-0" />
                  </div>
                  {i === 0 && (
                    <div className="px-3 pb-2.5 border-t border-[#0a1f0a]/5">
                      <p className="text-[9px] text-[#0a1f0a]/60 leading-relaxed line-clamp-2">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )

    case "form":
      return (
        <div className="bg-[#0a1f0a] px-6 py-8">
          {d.badge && <span className="inline-block px-3 py-1 bg-[#d4a017] text-[#0a1f0a] text-[9px] tracking-[0.3em] uppercase font-bold">{d.badge as string}</span>}
          <h2 className="mt-3 font-serif text-lg font-bold text-white leading-tight">
            {d.title as string}<br /><span className="text-[#d4a017]">{d.titleHighlight as string}</span>
          </h2>
          <p className="mt-2 text-xs text-white/65">{d.subtitle as string}</p>
          {Array.isArray(d.trust) && (
            <div className="mt-3 space-y-2">
              {(d.trust as Record<string, string>[]).map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: `${CHECK_COLORS[i % 5]}20` }}>
                    <Check className="w-3 h-3" style={{ color: CHECK_COLORS[i % 5] }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-white">{t.label}</p>
                    <p className="text-[8px] text-white/50">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {d.cta && (
            <span className="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 bg-[#d4a017] text-[#0a1f0a] text-[10px] font-bold">
              {d.cta as string} <ArrowRight className="w-3 h-3" />
            </span>
          )}
        </div>
      )

    case "coaches":
      return (
        <div className="bg-[#eef1ec] px-6 py-8">
          {d.badge && <span className="inline-block px-3 py-1 bg-[#0a1f0a] text-[#d4a017] text-[9px] tracking-[0.3em] uppercase font-medium">{d.badge as string}</span>}
          <h2 className="mt-3 font-serif text-lg font-bold text-[#0a1f0a]">
            {d.title as string} <span className="text-[#d4a017]">{d.titleHighlight as string}</span> {d.titleEnd as string}
          </h2>
          <p className="mt-2 text-xs text-[#0a1f0a]/60">{d.subtitle as string}</p>
          {Array.isArray(d.cards) && (
            <div className="mt-4 space-y-3">
              {(d.cards as Record<string, string>[]).map((card, i) => (
                <div key={i} className="border border-[#0a1f0a]/10 bg-white p-4 rounded">
                  <h3 className="font-serif font-bold text-sm text-[#0a1f0a]">{card.name}</h3>
                  <p className="text-[9px] text-[#d4a017] font-medium uppercase tracking-wider">{card.role}</p>
                  <p className="mt-2 text-[10px] text-[#0a1f0a]/60 line-clamp-3">{card.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )

    case "nav":
      return (
        <div className="bg-[#eef1ec] px-6 py-6">
          <div className="flex items-center gap-4 border-b border-[#0a1f0a]/10 pb-4">
            <div className="w-20 h-7 bg-[#0a1f0a]/10 rounded" />
            <div className="flex flex-wrap gap-3">
              {Object.entries(d).map(([key, val]) => (
                typeof val === "string" && (
                  <span key={key} className="text-[10px] text-[#0a1f0a]/60 font-medium hover:text-[#d4a017]">{val}</span>
                )
              ))}
            </div>
          </div>
        </div>
      )

    case "footer":
      return (
        <div className="bg-[#0a1f0a] px-6 py-8">
          <p className="text-xs text-white/60 mb-4 max-w-xs">{d.desc as string}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-[9px] text-[#d4a017] tracking-[0.3em] uppercase mb-2">{d.navTitle as string}</h3>
              {Array.isArray(d.links) && (d.links as Record<string, string>[]).slice(0, 4).map((l, i) => (
                <p key={i} className="text-[10px] text-white/60 mb-1">{l.label}</p>
              ))}
            </div>
            <div>
              <h3 className="text-[9px] text-[#d4a017] tracking-[0.3em] uppercase mb-2">{d.newsletterTitle as string}</h3>
              <p className="text-[10px] text-white/60">{d.newsletterDesc as string}</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-[9px] text-white/40">{d.copyright as string}</p>
            <p className="text-[10px] text-[#d4a017] italic font-serif mt-1">{d.motto as string}</p>
          </div>
        </div>
      )

    case "gallery":
      return (
        <div className="bg-[#eef1ec] px-6 py-8 text-center">
          {d.badge && <span className="inline-block px-3 py-1 bg-[#0a1f0a] text-[#d4a017] text-[9px] tracking-[0.3em] uppercase font-medium">{d.badge as string}</span>}
          <h2 className="mt-3 font-serif text-lg font-bold text-[#0a1f0a]">
            {d.title as string} <span className="text-[#d4a017]">{d.titleHighlight as string}</span>
          </h2>
          <p className="mt-2 text-xs text-[#0a1f0a]/60">{d.subtitle as string}</p>
          <div className="mt-4 grid grid-cols-3 gap-1.5">
            {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-[#0a1f0a]/10 rounded" />)}
          </div>
        </div>
      )

    case "locations":
      return (
        <div className="bg-[#eef1ec] px-6 py-8 text-center">
          {d.badge && <span className="inline-block px-3 py-1 bg-[#0a1f0a] text-[#d4a017] text-[9px] tracking-[0.3em] uppercase font-medium">{d.badge as string}</span>}
          <h2 className="mt-3 font-serif text-lg font-bold text-[#0a1f0a]">
            {d.title as string} <span className="text-[#d4a017]">{d.titleHighlight as string}</span>
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {["Szeged", "Kecskemét"].map(city => (
              <div key={city} className="border border-[#0a1f0a]/10 bg-white p-3 rounded text-left">
                <p className="font-serif font-bold text-xs text-[#0a1f0a]">{city}</p>
                <div className="mt-1 text-[9px] text-[#0a1f0a]/50 space-y-0.5">
                  <p>{d.dateLabel as string}: ...</p>
                  <p>{d.spotsLabel as string}: ...</p>
                  <p className="text-[#d4a017] font-medium">{d.earlyBirdLabel as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case "partnerProgram":
      return (
        <div className="bg-[#eef1ec] px-6 py-8">
          {d.badge && <span className="inline-block px-3 py-1 bg-[#0a1f0a] text-[#d4a017] text-[9px] tracking-[0.3em] uppercase font-medium">{d.badge as string}</span>}
          <h2 className="mt-3 font-serif text-lg font-bold text-[#0a1f0a]">
            {d.title as string} <span className="text-[#d4a017]">{d.titleHighlight as string}</span> {d.titleEnd as string}
          </h2>
          <p className="mt-2 text-[10px] text-[#0a1f0a]/60 line-clamp-3">{d.intro as string}</p>
          {Array.isArray(d.sections) && (
            <div className="mt-4 space-y-2">
              {(d.sections as Record<string, string>[]).map((s, i) => (
                <div key={i} className="border border-[#0a1f0a]/10 bg-white p-3 rounded">
                  <h3 className="font-serif font-bold text-[10px] text-[#0a1f0a]">{s.title}</h3>
                  <p className="text-[9px] text-[#0a1f0a]/50 line-clamp-2">{s.text}</p>
                </div>
              ))}
            </div>
          )}
          {d.ctaTitle && (
            <div className="mt-4 text-center">
              <p className="font-serif font-bold text-sm text-[#0a1f0a]">{d.ctaTitle as string}</p>
              <span className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 bg-[#d4a017] text-[#0a1f0a] text-[10px] font-bold">
                {d.cta as string} <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          )}
        </div>
      )

    default:
      return (
        <div className="bg-[#eef1ec] px-6 py-8 text-center text-[#0a1f0a]/40 text-xs">
          Előnézet nem elérhető ehhez a szekcióhoz
        </div>
      )
  }
}

// ─── Section preview (collapsed view) ───

function SectionPreview({
  sectionId,
  content,
  info,
  isCustomized,
}: {
  sectionId: string
  content: Record<string, unknown>
  info: { label: string; desc: string; theme: string }
  isCustomized: boolean
}) {
  const title =
    (content.title as string) ||
    (content.line1 as string) ||
    (content.campBadge as string) ||
    ""
  const highlight = (content.titleHighlight as string) || (content.line2 as string) || ""
  const sub =
    (content.subtitle as string) ||
    (content.text as string) ||
    (content.desc as string) ||
    ""

  return (
    <div className={`relative p-5 md:p-6 ${themeClasses(info.theme)} ${themeTextClasses(info.theme)}`}>
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-serif font-bold text-lg truncate">{info.label}</h3>
              {isCustomized && (
                <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700 ring-1 ring-teal-200">
                  Szerkesztve
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mb-4">{info.desc}</p>
          </div>
        </div>

        {title && (
          <p className="font-serif text-xl font-bold leading-tight text-slate-950">
            {title}{" "}
            {highlight && <span className="text-teal-700">{highlight}</span>}
          </p>
        )}
        {sub && (
          <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">{sub.slice(0, 150)}{sub.length > 150 ? "…" : ""}</p>
        )}

        {sectionId === "faq" && Array.isArray(content.items) && (
          <p className="mt-3 text-sm text-slate-500">{(content.items as unknown[]).length} kérdés-válasz</p>
        )}
        {sectionId === "usp" && Array.isArray(content.items) && (
          <p className="mt-3 text-sm text-slate-500">{(content.items as unknown[]).length} elem</p>
        )}
      </div>
    </div>
  )
}

// ─── Small helpers ───

function LocaleToggle({ locale, onChange }: { locale: Locale; onChange: (l: Locale) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
      {(["hu", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`flex min-h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors ${
            locale === l
              ? "bg-teal-600 text-white"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Globe className="w-4 h-4" />
          {l === "hu" ? "Magyar" : "English"}
        </button>
      ))}
    </div>
  )
}

// ─── Main editor ───

interface ContentEditorProps {
  initialContent: { hu: Record<string, unknown>; en: Record<string, unknown> }
  dbSections: string[]
  /**
   * When provided, the editor is scoped to that single page (no page tabs shown).
   * Useful for dedicated per-page admin screens.
   */
  pageId?: ContentPageId
  /** Optional image picker block rendered above the sections. */
  imagesSlot?: React.ReactNode
  /** Optional header slot (title + description) rendered at the very top. */
  header?: React.ReactNode
}

export function ContentEditor({
  initialContent,
  dbSections: initialDbSections,
  pageId,
  imagesSlot,
  header,
}: ContentEditorProps) {
  const [locale, setLocale] = useState<Locale>("hu")
  const [activePage, setActivePage] = useState<ContentPageId>(pageId || "home")
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, unknown> | null>(null)
  const [content, setContent] = useState(initialContent)
  const [dbSections, setDbSections] = useState(initialDbSections)
  const [isPending, startTransition] = useTransition()
  const [savedSection, setSavedSection] = useState<string | null>(null)

  const currentPage = PAGES.find((p) => p.id === activePage)
  const lockedToPage = Boolean(pageId)
  const localeContent = (content[locale] || {}) as Record<string, Record<string, unknown>>
  const hasUnsavedChanges = Boolean(editingSection && editData)

  useEffect(() => {
    if (!hasUnsavedChanges) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [hasUnsavedChanges])

  const confirmDiscard = () => {
    if (!hasUnsavedChanges) return true
    return window.confirm("Van mentetlen módosításod. Biztosan elhagyod ezt a szerkesztést mentés nélkül?")
  }

  const startEdit = (sectionId: string) => {
    if (editingSection && editingSection !== sectionId && !confirmDiscard()) return
    setEditingSection(sectionId)
    setEditData(JSON.parse(JSON.stringify(localeContent[sectionId] || {})))
  }

  const cancelEdit = () => {
    setEditingSection(null)
    setEditData(null)
  }

  const updateField = (path: string[], value: unknown) => {
    setEditData((prev) => {
      if (!prev) return prev
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next as Record<string, unknown>
      for (let i = 1; i < path.length - 1; i++) {
        obj = obj[path[i]] as Record<string, unknown>
      }
      obj[path[path.length - 1]] = value
      return next
    })
  }

  const handleSave = () => {
    if (!editingSection || !editData) return
    const section = editingSection
    const data = editData
    startTransition(async () => {
      await updateSiteContent(section, locale, data as Record<string, unknown>)
      setContent((prev) => ({
        ...prev,
        [locale]: { ...(prev[locale] as Record<string, unknown>), [section]: data },
      }))
      const key = `${section}:${locale}`
      if (!dbSections.includes(key)) setDbSections((prev) => [...prev, key])
      setEditingSection(null)
      setEditData(null)
      setSavedSection(section)
      setTimeout(() => setSavedSection(null), 2500)
    })
  }

  const handleReset = (sectionId: string) => {
    startTransition(async () => {
      await resetSiteContent(sectionId, locale)
      setDbSections((prev) => prev.filter((s) => s !== `${sectionId}:${locale}`))
      setSavedSection(sectionId)
      setTimeout(() => setSavedSection(null), 2500)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {header ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">{header}</div>
          <LocaleToggle locale={locale} onChange={(l) => {
            if (!confirmDiscard()) return
            setLocale(l)
            cancelEdit()
          }} />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-950">Tartalom szerkesztő</h1>
            <p className="text-sm text-slate-500 mt-1">
              Szekciók vizuális szerkesztése — változtatásaid azonnal megjelennek az oldalon
            </p>
          </div>
          <LocaleToggle locale={locale} onChange={(l) => {
            if (!confirmDiscard()) return
            setLocale(l)
            cancelEdit()
          }} />
        </div>
      )}

      {/* Images slot (per-page) */}
      {imagesSlot}

      {/* Page tabs – only when not locked to a single page */}
      {!lockedToPage && (
        <div className="flex flex-wrap gap-2">
          {PAGES.map((page) => {
            const Icon = page.icon
            return (
              <button
                key={page.id}
                onClick={() => {
                  if (!confirmDiscard()) return
                  setActivePage(page.id)
                  cancelEdit()
                }}
                className={`flex min-h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-bold transition-all ${
                  activePage === page.id
                    ? "bg-teal-50 text-teal-700 border-teal-200"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <Icon className="w-4 h-4" />
                {page.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-3">
        {currentPage?.sections.map((sectionId) => {
          const info = SECTION_INFO[sectionId]
          if (!info) return null
          const sectionContent = localeContent[sectionId] || {}
          const isCustomized = dbSections.includes(`${sectionId}:${locale}`)
          const isEditing = editingSection === sectionId
          const justSaved = savedSection === sectionId

          return (
            <div
              key={sectionId}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm ${
                isEditing
                  ? "border-teal-300 shadow-teal-100"
                  : justSaved
                    ? "border-emerald-300"
                    : "border-slate-200 hover:border-teal-200"
              }`}
            >
              {isEditing && editData ? (
                /* ── Editing mode with live preview ── */
                <div className="bg-white">
                  <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                        <Pencil className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-xl text-slate-950">{info.label}</h3>
                        <p className="text-sm text-slate-500">{locale === "hu" ? "Magyar" : "English"} tartalom szerkesztése</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <button
                        onClick={cancelEdit}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <X className="w-4 h-4" /> Mégse
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 text-sm font-bold text-white hover:bg-teal-700 transition-colors disabled:opacity-50"
                      >
                        {isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Mentés
                      </button>
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-slate-200">
                    {/* Left: edit fields */}
                    <div className="p-5 space-y-5 lg:max-h-[70vh] lg:overflow-y-auto">
                      {renderFields(
                        editData as Record<string, unknown>,
                        [sectionId],
                        updateField,
                        SKIP_FIELDS[sectionId] || [],
                      )}
                    </div>
                    {/* Right: live preview */}
                    <div className="border-t border-slate-200 lg:max-h-[70vh] lg:overflow-y-auto lg:border-t-0">
                      <div className="sticky top-0 z-10 px-5 py-3 bg-white/95 backdrop-blur border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-teal-600" />
                          <span className="text-sm font-bold text-slate-600">Előnézet - olvasói nézet</span>
                        </div>
                      </div>
                      <div className="bg-[#eef1ec]">
                        <LiveSectionPreview
                          sectionId={sectionId}
                          data={editData as Record<string, unknown>}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Preview mode ── */
                <div className="relative group cursor-pointer" onClick={() => startEdit(sectionId)}>
                  <SectionPreview
                    sectionId={sectionId}
                    content={sectionContent}
                    info={info}
                    isCustomized={isCustomized}
                  />

                  {/* Hover overlay */}
                  <div className="absolute bottom-4 right-4 flex items-center justify-center bg-transparent opacity-100 transition-colors md:inset-0 md:bg-black/0 md:opacity-0 md:group-hover:bg-slate-950/20 md:group-hover:opacity-100">
                    <span className="flex min-h-11 items-center gap-2 rounded-2xl bg-teal-600 px-5 text-sm font-bold text-white shadow-sm">
                      <Pencil className="w-4 h-4" /> Szerkesztés
                    </span>
                  </div>

                  {/* Saved indicator */}
                  {justSaved && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                      <Check className="w-3.5 h-3.5" /> Mentve
                    </div>
                  )}

                  {/* Reset button for customized sections */}
                  {isCustomized && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm("Biztosan visszaállítod az alapértelmezett tartalomra?")) {
                          handleReset(sectionId)
                        }
                      }}
                      className="absolute top-3 right-3 flex min-h-10 items-center gap-2 rounded-xl bg-white px-3 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50"
                      title="Visszaállítás alapértelmezettre"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Alapértelmezett
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
