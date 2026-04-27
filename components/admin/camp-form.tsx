"use client"

import { useState } from "react"
import { ImagePicker } from "./image-picker"
import { createCamp, updateCamp } from "@/lib/actions"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Plus, X, Clock, CheckCircle2 } from "lucide-react"
import type { CampTranslation } from "@/lib/camp-translations"

type ScheduleItem = { time: string; activity: string }
type CoachItem = { name: string; role: string; image: string; bio: string }
type FaqItem = { question: string; answer: string }
type CampStepId = "basic" | "media" | "schedule" | "coaches" | "faq" | "english"

type CampData = {
  id: string
  city: string
  venue: string
  dates: string
  priceHuf: number
  priceEur: number
  earlyBirdPriceHuf: number
  earlyBirdPriceEur: number
  earlyBirdUntil: Date | string | null
  depositPercent: number
  totalSpots: number
  remainingSpots: number
  active: boolean
  description: string
  imageUrl: string | null
  clubName: string
  ageRange: string
  includes: string[]
  gallery: string[]
  videoUrl: string | null
  mapEmbedUrl: string | null
  schedule: unknown
  coaches: unknown
  faq: unknown
}

function toDateInput(value: Date | string | null | undefined): string {
  if (!value) return ""
  const d = typeof value === "string" ? new Date(value) : value
  if (isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

function depositAmountInputValue(camp?: CampData): string {
  if (!camp?.depositPercent) return ""
  return String(camp.depositPercent)
}

const DEFAULT_INCLUDES = [
  "Hivatalos klub felszereles (mez, nadrag, sportszar)",
  "Napi haromszori etkezes",
  "Napi 4 edzes",
  "Oklevel es emlektargyak",
]
const labelClass = "block text-sm font-semibold text-slate-700 mb-2"
const smallLabelClass = "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5"
const inputClass = "w-full min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
const textareaClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-relaxed text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 resize-y"
const itemCardClass = "relative space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4"
const addButtonClass = "mt-3 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-teal-50 px-4 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-100"
const removeButtonClass = "inline-flex min-h-10 min-w-10 items-center justify-center rounded-2xl bg-red-50 text-red-700 transition-colors hover:bg-red-100"
const CAMP_STEPS: Array<{ id: CampStepId; title: string; shortTitle: string; desc: string }> = [
  { id: "basic", title: "1. A tábor lényege", shortTitle: "Lényeg", desc: "Hol, mikor, mennyiért és hány gyereknek szól." },
  { id: "media", title: "2. Amit a szülő lát", shortTitle: "Képek", desc: "Főkép, galéria, videó és térkép." },
  { id: "schedule", title: "3. Mit csinálnak napközben?", shortTitle: "Program", desc: "Egyszerű napi menetrend, ha szeretnéd megmutatni." },
  { id: "coaches", title: "4. Kik foglalkoznak velük?", shortTitle: "Edzők", desc: "Edzők neve, szerepe és rövid bemutatása." },
  { id: "faq", title: "5. Szülői kérdések", shortTitle: "Kérdések", desc: "Amit jó előre megválaszolni." },
  { id: "english", title: "6. Angol verzió", shortTitle: "Angol", desc: "Csak akkor kell, ha angolul más szöveg jelenjen meg." },
]

export function CampForm({ camp, campTranslationEn = {} }: { camp?: CampData; campTranslationEn?: CampTranslation }) {
  const isEdit = !!camp
  const [imageUrl, setImageUrl] = useState(camp?.imageUrl || "")
  const [description, setDescription] = useState(camp?.description || "")
  const [descriptionEn, setDescriptionEn] = useState(campTranslationEn.description || "")
  const [includes, setIncludes] = useState<string[]>(
    camp?.includes?.length ? camp.includes : (isEdit ? [] : DEFAULT_INCLUDES)
  )
  const [includesEn, setIncludesEn] = useState<string[]>(campTranslationEn.includes || [])
  const [newItem, setNewItem] = useState("")
  const [newItemEn, setNewItemEn] = useState("")

  // New fields
  const [gallery, setGallery] = useState<string[]>(camp?.gallery || [])
  const [videoUrl, setVideoUrl] = useState(camp?.videoUrl || "")
  const [mapEmbedUrl, setMapEmbedUrl] = useState(camp?.mapEmbedUrl || "")
  const [schedule, setSchedule] = useState<ScheduleItem[]>(
    (camp?.schedule as ScheduleItem[]) || []
  )
  const [scheduleEn, setScheduleEn] = useState<ScheduleItem[]>(
    (campTranslationEn.schedule as ScheduleItem[]) || []
  )
  const [coaches, setCoaches] = useState<CoachItem[]>(
    (camp?.coaches as CoachItem[]) || []
  )
  const [coachesEn, setCoachesEn] = useState<CoachItem[]>(
    (campTranslationEn.coaches as CoachItem[]) || []
  )
  const [faq, setFaq] = useState<FaqItem[]>(
    (camp?.faq as FaqItem[]) || []
  )
  const [faqEn, setFaqEn] = useState<FaqItem[]>(
    (campTranslationEn.faq as FaqItem[]) || []
  )

  const [activeStep, setActiveStep] = useState<CampStepId>("basic")
  const activeStepIndex = CAMP_STEPS.findIndex((step) => step.id === activeStep)
  const currentStep = CAMP_STEPS[activeStepIndex] || CAMP_STEPS[0]
  const isFirstStep = activeStepIndex <= 0
  const isLastStep = activeStepIndex === CAMP_STEPS.length - 1
  const goToStep = (step: CampStepId) => setActiveStep(step)
  const goNext = () => {
    const next = CAMP_STEPS[Math.min(activeStepIndex + 1, CAMP_STEPS.length - 1)]
    if (next) setActiveStep(next.id)
  }
  const goPrevious = () => {
    const previous = CAMP_STEPS[Math.max(activeStepIndex - 1, 0)]
    if (previous) setActiveStep(previous.id)
  }

  const addInclude = () => {
    const trimmed = newItem.trim()
    if (trimmed && !includes.includes(trimmed)) {
      setIncludes([...includes, trimmed])
      setNewItem("")
    }
  }

  const addIncludeEn = () => {
    const trimmed = newItemEn.trim()
    if (trimmed && !includesEn.includes(trimmed)) {
      setIncludesEn([...includesEn, trimmed])
      setNewItemEn("")
    }
  }

  const addGalleryImage = (url: string) => {
    if (url && !gallery.includes(url)) setGallery([...gallery, url])
  }

  const action = isEdit ? updateCamp.bind(null, camp.id) : createCamp

  return (
    <div className="max-w-5xl space-y-6">
      <Link href="/admin/taborok" className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-950">
        <ArrowLeft className="w-4 h-4" /> Vissza
      </Link>

      <div className="rounded-3xl border border-teal-100 bg-gradient-to-br from-white to-teal-50 p-5 shadow-sm md:p-6">
        <p className="text-sm font-bold uppercase tracking-wider text-teal-700">Lépéses tábor szerkesztő</p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-slate-950">
          {isEdit ? `Tábor szerkesztése: ${camp.city}` : "Új tábor létrehozása"}
        </h2>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600">
          Haladj végig a lépéseken balról jobbra. A végén a Mentés gombbal egyszerre mentünk mindent.
        </p>
      </div>

      <form action={action} className="space-y-4" noValidate>
        {/* Hidden fields for state-managed values */}
        <input type="hidden" name="imageUrl" value={imageUrl} />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="descriptionEn" value={descriptionEn} />
        <input type="hidden" name="includes" value={includes.join("\n")} />
        <input type="hidden" name="includesEn" value={includesEn.join("\n")} />
        <input type="hidden" name="gallery" value={gallery.join("\n")} />
        <input type="hidden" name="videoUrl" value={videoUrl} />
        <input type="hidden" name="mapEmbedUrl" value={mapEmbedUrl} />
        <input type="hidden" name="schedule" value={JSON.stringify(schedule)} />
        <input type="hidden" name="scheduleEn" value={JSON.stringify(scheduleEn)} />
        <input type="hidden" name="coaches" value={JSON.stringify(coaches)} />
        <input type="hidden" name="coachesEn" value={JSON.stringify(coachesEn)} />
        <input type="hidden" name="faq" value={JSON.stringify(faq)} />
        <input type="hidden" name="faqEn" value={JSON.stringify(faqEn)} />

        <WizardSteps activeStep={activeStep} onStepChange={goToStep} />

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-teal-700">
            {activeStepIndex + 1}. lépés / {CAMP_STEPS.length}
          </p>
          <h3 className="mt-1 font-serif text-2xl font-bold text-slate-950">{currentStep.title}</h3>
          <p className="mt-1 text-base text-slate-600">{currentStep.desc}</p>
        </div>

        {/* ─── BASIC INFO ─── */}
        <Section title="Amit kötelező kitölteni" id="basic" open={activeStep === "basic"}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Főkép a táborhoz</label>
            <ImagePicker value={imageUrl} onChange={setImageUrl} folder="camps" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Melyik városban lesz?" name="city" required defaultValue={camp?.city} placeholder="pl. Szeged" />
            <Field label="Pontosan hol lesz?" name="venue" required defaultValue={camp?.venue} placeholder="pl. Szegedi Sportközpont" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Melyik klub / partner neve jelenjen meg?" name="clubName" defaultValue={camp?.clubName || "SL Benfica"} placeholder="SL Benfica" />
            <Field label="Milyen korú gyerekeknek szól?" name="ageRange" defaultValue={camp?.ageRange || "7-15"} placeholder="7-15" />
          </div>

          <Field label="Mikor lesz a tábor?" name="dates" required defaultValue={camp?.dates} placeholder="pl. 2026. július 7-11." />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Normál ár forintban" name="priceHuf" type="number" required defaultValue={String(camp?.priceHuf || "")} placeholder="133000" />
            <Field label="EarlyBird ár forintban" name="earlyBirdPriceHuf" type="number" required defaultValue={String(camp?.earlyBirdPriceHuf || "")} placeholder="99000" />
          </div>

          {/* EUR arak - DB mezo marad, UI-n elrejtve, alapertelmezett 0 megy at */}
          <input type="hidden" name="priceEur" value="0" />
          <input type="hidden" name="earlyBirdPriceEur" value="0" />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Meddig él az EarlyBird ár?" name="earlyBirdUntil" type="date" defaultValue={toDateInput(camp?.earlyBirdUntil)} placeholder="" />
            <Field label="Részletfizetés első összege forintban" name="depositPercent" type="number" required defaultValue={depositAmountInputValue(camp)} placeholder="30000" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Összes férőhely" name="totalSpots" type="number" required defaultValue={String(camp?.totalSpots || "")} placeholder="40" />
            {isEdit && (
              <Field label="Mennyi szabad hely maradt?" name="remainingSpots" type="number" required defaultValue={String(camp?.remainingSpots || "")} />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Rövid, szülőknek szóló leírás</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-relaxed text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 resize-y"
              placeholder="Írd le egyszerűen, miért jó ez a tábor a gyereknek..."
            />
          </div>

          {/* Includes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mi van benne az árban?</label>
            <div className="space-y-2 mb-3">
              {includes.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">{item}</span>
                  <button type="button" onClick={() => setIncludes(includes.filter((_, idx) => idx !== i))} className="min-h-11 rounded-2xl bg-red-50 px-3 text-red-700 hover:bg-red-100 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInclude() } }}
                placeholder="pl. napi háromszori étkezés..."
                className="flex-1 min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
              />
              <button type="button" onClick={addInclude} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-teal-50 px-4 text-sm font-bold text-teal-700 hover:bg-teal-100 transition-colors">
                <Plus className="w-4 h-4" /> Hozzáad
              </button>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="active" defaultChecked={camp?.active ?? true} className="w-5 h-5 accent-teal-600" />
            <span className="text-slate-700 text-base font-medium">Látszódjon a weboldalon</span>
          </label>
        </Section>

        {/* ─── ENGLISH CONTENT ─── */}
        <Section title="Angol tartalom" id="english" open={activeStep === "english"}>
          <p className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-800">
            Ezek a mezők az angol nyelvű táboroldalon jelennek meg. Ha valami üresen marad, a magyar alapadatok maradnak irányadók.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Varos angolul" name="cityEn" defaultValue={campTranslationEn.city || ""} placeholder="e.g. Szeged" />
            <Field label="Helyszin angolul" name="venueEn" defaultValue={campTranslationEn.venue || ""} placeholder="e.g. Szeged Sports Centre" />
            <Field label="Datum angolul" name="datesEn" defaultValue={campTranslationEn.dates || ""} placeholder="e.g. 7-11 July 2026" />
          </div>

          <div>
            <label className={labelClass}>Leírás angolul</label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={6}
              className={textareaClass}
              placeholder="Detailed English camp description..."
            />
          </div>

          <div>
            <label className={labelClass}>Mit tartalmaz angolul?</label>
            <div className="space-y-2 mb-3">
              {includesEn.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">{item}</span>
                  <button type="button" onClick={() => setIncludesEn(includesEn.filter((_, idx) => idx !== i))} className={removeButtonClass}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemEn}
                onChange={(e) => setNewItemEn(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addIncludeEn() } }}
                placeholder="Add English item..."
                className={inputClass}
              />
              <button type="button" onClick={addIncludeEn} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-teal-50 px-4 text-sm font-bold text-teal-700 hover:bg-teal-100">
                <Plus className="w-4 h-4" /> Hozzáad
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <label className={labelClass}>Napi program angolul</label>
            <div className="space-y-3">
              {scheduleEn.map((item, i) => (
                <div key={i} className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[auto_8rem_1fr_auto] sm:items-center">
                  <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) => { const s = [...scheduleEn]; s[i] = { ...s[i], time: e.target.value }; setScheduleEn(s) }}
                    placeholder="09:00"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={item.activity}
                    onChange={(e) => { const s = [...scheduleEn]; s[i] = { ...s[i], activity: e.target.value }; setScheduleEn(s) }}
                    placeholder="Morning training, technical drills"
                    className={inputClass}
                  />
                  <button type="button" onClick={() => setScheduleEn(scheduleEn.filter((_, idx) => idx !== i))} className={removeButtonClass}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setScheduleEn([...scheduleEn, { time: "", activity: "" }])}
              className={addButtonClass}
            >
              <Plus className="w-4 h-4" /> Angol programpont
            </button>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <label className={labelClass}>Edzők angolul</label>
            <div className="space-y-4">
              {coachesEn.map((coach, i) => (
                <div key={i} className={itemCardClass}>
                  <button type="button" onClick={() => setCoachesEn(coachesEn.filter((_, idx) => idx !== i))} className={`${removeButtonClass} absolute right-3 top-3`}>
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className={smallLabelClass}>Name</label>
                      <input
                        type="text"
                        value={coach.name}
                        onChange={(e) => { const c = [...coachesEn]; c[i] = { ...c[i], name: e.target.value }; setCoachesEn(c) }}
                        placeholder="John Smith"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={smallLabelClass}>Role</label>
                      <input
                        type="text"
                        value={coach.role}
                        onChange={(e) => { const c = [...coachesEn]; c[i] = { ...c[i], role: e.target.value }; setCoachesEn(c) }}
                        placeholder="Head coach"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <input type="hidden" value={coach.image} readOnly />
                  <div>
                    <label className={smallLabelClass}>Bio</label>
                    <textarea
                      value={coach.bio}
                      onChange={(e) => { const c = [...coachesEn]; c[i] = { ...c[i], bio: e.target.value }; setCoachesEn(c) }}
                      rows={3}
                      placeholder="Short English bio..."
                      className={textareaClass}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCoachesEn([...coachesEn, { name: "", role: "", image: "", bio: "" }])}
              className={addButtonClass}
            >
              <Plus className="w-4 h-4" /> Angol edző
            </button>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <label className={labelClass}>FAQ angolul</label>
            <div className="space-y-3">
              {faqEn.map((item, i) => (
                <div key={i} className={itemCardClass}>
                  <button type="button" onClick={() => setFaqEn(faqEn.filter((_, idx) => idx !== i))} className={`${removeButtonClass} absolute right-3 top-3`}>
                    <X className="w-4 h-4" />
                  </button>
                  <div>
                    <label className={smallLabelClass}>Question</label>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => { const f = [...faqEn]; f[i] = { ...f[i], question: e.target.value }; setFaqEn(f) }}
                      placeholder="What should children bring?"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={smallLabelClass}>Answer</label>
                    <textarea
                      value={item.answer}
                      onChange={(e) => { const f = [...faqEn]; f[i] = { ...f[i], answer: e.target.value }; setFaqEn(f) }}
                      rows={3}
                      placeholder="English answer..."
                      className={textareaClass}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setFaqEn([...faqEn, { question: "", answer: "" }])}
              className={addButtonClass}
            >
              <Plus className="w-4 h-4" /> Angol FAQ
            </button>
          </div>
        </Section>

        {/* ─── MEDIA ─── */}
        <Section title="Média (galéria, videó, térkép)" id="media" open={activeStep === "media"}>
          {/* Gallery */}
          <div>
            <label className={labelClass}>Galéria képek</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
              {gallery.map((url, i) => (
                <div key={i} className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" sizes="200px" unoptimized={url.includes("b-cdn.net")} />
                  <button
                    type="button"
                    onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                    className="absolute right-2 top-2 inline-flex min-h-9 min-w-9 items-center justify-center rounded-2xl bg-red-600 text-white shadow-sm transition-colors hover:bg-red-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3">
                <ImagePicker value="" onChange={addGalleryImage} folder="camps" />
              </div>
            </div>
          </div>

          {/* Video */}
          <div>
            <label className={labelClass}>YouTube videó URL</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className={inputClass}
            />
            {videoUrl && getYouTubeId(videoUrl) && (
              <div className="mt-3 aspect-video max-w-md">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}`}
                  className="h-full w-full rounded-2xl border border-slate-200"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Map */}
          <div>
            <label className={labelClass}>Google Maps beágyazási URL</label>
            <input
              type="url"
              value={mapEmbedUrl}
              onChange={(e) => setMapEmbedUrl(e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className={inputClass}
            />
            {mapEmbedUrl && (
              <div className="mt-3 aspect-video max-w-md">
                <iframe src={mapEmbedUrl} className="h-full w-full rounded-2xl border border-slate-200" allowFullScreen loading="lazy" />
              </div>
            )}
          </div>
        </Section>

        {/* ─── SCHEDULE ─── */}
        <Section title="Napi program" id="schedule" open={activeStep === "schedule"}>
          <div className="space-y-3">
            {schedule.map((item, i) => (
              <div key={i} className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[auto_8rem_1fr_auto] sm:items-center">
                <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                <input
                  type="text"
                  value={item.time}
                  onChange={(e) => { const s = [...schedule]; s[i] = { ...s[i], time: e.target.value }; setSchedule(s) }}
                  placeholder="09:00"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={item.activity}
                  onChange={(e) => { const s = [...schedule]; s[i] = { ...s[i], activity: e.target.value }; setSchedule(s) }}
                  placeholder="Reggeli edzés, technikai gyakorlatok"
                  className={inputClass}
                />
                <button type="button" onClick={() => setSchedule(schedule.filter((_, idx) => idx !== i))} className={removeButtonClass}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSchedule([...schedule, { time: "", activity: "" }])}
            className={addButtonClass}
          >
            <Plus className="w-4 h-4" /> Programpont hozzáadása
          </button>
        </Section>

        {/* ─── COACHES ─── */}
        <Section title="Edzők" id="coaches" open={activeStep === "coaches"}>
          <div className="space-y-4">
            {coaches.map((coach, i) => (
              <div key={i} className={itemCardClass}>
                <button type="button" onClick={() => setCoaches(coaches.filter((_, idx) => idx !== i))} className={`${removeButtonClass} absolute right-3 top-3`}>
                  <X className="w-4 h-4" />
                </button>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className={smallLabelClass}>Név</label>
                    <input
                      type="text"
                      value={coach.name}
                      onChange={(e) => { const c = [...coaches]; c[i] = { ...c[i], name: e.target.value }; setCoaches(c) }}
                      placeholder="Kovács János"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={smallLabelClass}>Szerep / pozíció</label>
                    <input
                      type="text"
                      value={coach.role}
                      onChange={(e) => { const c = [...coaches]; c[i] = { ...c[i], role: e.target.value }; setCoaches(c) }}
                      placeholder="Főedző"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={smallLabelClass}>Kép</label>
                  <ImagePicker value={coach.image} onChange={(url) => { const c = [...coaches]; c[i] = { ...c[i], image: url }; setCoaches(c) }} folder="coaches" />
                </div>
                <div>
                  <label className={smallLabelClass}>Bemutatkozás</label>
                  <textarea
                    value={coach.bio}
                    onChange={(e) => { const c = [...coaches]; c[i] = { ...c[i], bio: e.target.value }; setCoaches(c) }}
                    rows={3}
                    placeholder="Rövid bemutatkozás..."
                    className={textareaClass}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCoaches([...coaches, { name: "", role: "", image: "", bio: "" }])}
            className={addButtonClass}
          >
            <Plus className="w-4 h-4" /> Edző hozzáadása
          </button>
        </Section>

        {/* ─── FAQ ─── */}
        <Section title="Gyakran ismételt kérdések (GYIK)" id="faq" open={activeStep === "faq"}>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <div key={i} className={itemCardClass}>
                <button type="button" onClick={() => setFaq(faq.filter((_, idx) => idx !== i))} className={`${removeButtonClass} absolute right-3 top-3`}>
                  <X className="w-4 h-4" />
                </button>
                <div>
                  <label className={smallLabelClass}>Kérdés</label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => { const f = [...faq]; f[i] = { ...f[i], question: e.target.value }; setFaq(f) }}
                    placeholder="Mit hozzon magával a gyermek?"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={smallLabelClass}>Válasz</label>
                  <textarea
                    value={item.answer}
                    onChange={(e) => { const f = [...faq]; f[i] = { ...f[i], answer: e.target.value }; setFaq(f) }}
                    rows={3}
                    placeholder="Válasz a kérdésre..."
                    className={textareaClass}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setFaq([...faq, { question: "", answer: "" }])}
            className={addButtonClass}
          >
            <Plus className="w-4 h-4" /> Kérdés hozzáadása
          </button>
        </Section>

        <div className="sticky bottom-4 z-10 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-900/10 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={goPrevious}
              disabled={isFirstStep}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-base font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" /> Előző
            </button>

            <p className="text-center text-sm font-semibold text-slate-500">
              {currentStep.shortTitle}: {currentStep.desc}
            </p>

            {isLastStep ? (
              <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 text-base font-bold text-white transition-colors hover:bg-teal-700">
                <CheckCircle2 className="w-4 h-4" />
                {isEdit ? "Minden mentése" : "Tábor létrehozása"}
              </button>
            ) : (
              <button type="button" onClick={goNext} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 text-base font-bold text-white transition-colors hover:bg-teal-700">
                Következő <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

function WizardSteps({
  activeStep,
  onStepChange,
}: {
  activeStep: CampStepId
  onStepChange: (step: CampStepId) => void
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
        {CAMP_STEPS.map((step, index) => {
          const active = activeStep === step.id
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepChange(step.id)}
              className={`flex min-h-16 items-center gap-3 rounded-2xl px-3 text-left transition-colors ${
                active
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-800"
              }`}
            >
              <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                active ? "bg-white text-teal-700" : "bg-white text-slate-500 ring-1 ring-slate-200"
              }`}>
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold">{step.shortTitle}</span>
                <span className={`hidden text-xs leading-tight xl:block ${active ? "text-white/80" : "text-slate-500"}`}>
                  {step.desc}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Section({ title, id, open, children }: {
  title: string; id: string; open: boolean; children: React.ReactNode
}) {
  return (
    <div className={`${open ? "block" : "hidden"} overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm`}>
      <div className="border-b border-slate-100 px-5 py-4 md:px-6">
        <h3 className="text-slate-950 font-bold text-lg">{title}</h3>
      </div>
      <div id={`camp-section-${id}`} className="px-5 py-5 space-y-5 md:px-6">{children}</div>
    </div>
  )
}

function Field({ label, name, type = "text", required = false, defaultValue = "", placeholder = "" }: {
  label: string; name: string; type?: string; required?: boolean; defaultValue?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
      />
    </div>
  )
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/)
  return match?.[1] || null
}
