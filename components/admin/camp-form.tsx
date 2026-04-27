"use client"

import { useState } from "react"
import { ImagePicker } from "./image-picker"
import { createCamp, updateCamp } from "@/lib/actions"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus, X, Clock, GripVertical, ChevronDown, ChevronUp } from "lucide-react"
import type { CampTranslation } from "@/lib/camp-translations"

type ScheduleItem = { time: string; activity: string }
type CoachItem = { name: string; role: string; image: string; bio: string }
type FaqItem = { question: string; answer: string }

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

  // Collapsible sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true, english: false, media: false, schedule: false, coaches: false, faq: false,
  })
  const toggle = (key: string) => setOpenSections(p => ({ ...p, [key]: !p[key] }))

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

      <h2 className="font-serif text-3xl font-bold text-slate-950">
        {isEdit ? `Tábor szerkesztése: ${camp.city}` : "Új tábor létrehozása"}
      </h2>

      <form action={action} className="space-y-4">
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

        {/* ─── BASIC INFO ─── */}
        <Section title="Alap adatok" id="basic" open={openSections.basic} onToggle={() => toggle("basic")}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tábor képe</label>
            <ImagePicker value={imageUrl} onChange={setImageUrl} folder="camps" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Város" name="city" required defaultValue={camp?.city} placeholder="pl. Szeged" />
            <Field label="Helyszín" name="venue" required defaultValue={camp?.venue} placeholder="pl. Szegedi Sportközpont" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Klub neve" name="clubName" defaultValue={camp?.clubName || "SL Benfica"} placeholder="SL Benfica" />
            <Field label="Korosztály" name="ageRange" defaultValue={camp?.ageRange || "7-15"} placeholder="7-15" />
          </div>

          <Field label="Dátumok" name="dates" required defaultValue={camp?.dates} placeholder="pl. 2026. július 7-11." />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Teljes ár (Ft)" name="priceHuf" type="number" required defaultValue={String(camp?.priceHuf || "")} placeholder="133000" />
            <Field label="Early Bird ár (Ft)" name="earlyBirdPriceHuf" type="number" required defaultValue={String(camp?.earlyBirdPriceHuf || "")} placeholder="99000" />
          </div>

          {/* EUR arak - DB mezo marad, UI-n elrejtve, alapertelmezett 0 megy at */}
          <input type="hidden" name="priceEur" value="0" />
          <input type="hidden" name="earlyBirdPriceEur" value="0" />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Early Bird lejárati dátum" name="earlyBirdUntil" type="date" defaultValue={toDateInput(camp?.earlyBirdUntil)} placeholder="" />
            <Field label="Első részlet fix ára (Ft)" name="depositPercent" type="number" required defaultValue={depositAmountInputValue(camp)} placeholder="30000" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Összes hely" name="totalSpots" type="number" required defaultValue={String(camp?.totalSpots || "")} placeholder="40" />
            {isEdit && (
              <Field label="Szabad helyek" name="remainingSpots" type="number" required defaultValue={String(camp?.remainingSpots || "")} />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Leírás</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-relaxed text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 resize-y"
              placeholder="A tábor részletes leírása..."
            />
          </div>

          {/* Includes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mit tartalmaz a tábor?</label>
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
                placeholder="Új elem hozzáadása..."
                className="flex-1 min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
              />
              <button type="button" onClick={addInclude} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-teal-50 px-4 text-sm font-bold text-teal-700 hover:bg-teal-100 transition-colors">
                <Plus className="w-4 h-4" /> Hozzáad
              </button>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="active" defaultChecked={camp?.active ?? true} className="w-5 h-5 accent-teal-600" />
            <span className="text-slate-700 text-base font-medium">Aktív (megjelenik a publikus oldalon)</span>
          </label>
        </Section>

        {/* ─── ENGLISH CONTENT ─── */}
        <Section title="Angol tartalom" id="english" open={openSections.english} onToggle={() => toggle("english")}>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Varos angolul" name="cityEn" defaultValue={campTranslationEn.city || ""} placeholder="e.g. Szeged" />
            <Field label="Helyszin angolul" name="venueEn" defaultValue={campTranslationEn.venue || ""} placeholder="e.g. Szeged Sports Centre" />
            <Field label="Datum angolul" name="datesEn" defaultValue={campTranslationEn.dates || ""} placeholder="e.g. 7-11 July 2026" />
          </div>

          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Leiras angolul</label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm resize-none"
              placeholder="Detailed English camp description..."
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Mit tartalmaz angolul</label>
            <div className="space-y-2 mb-3">
              {includesEn.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white text-sm">{item}</span>
                  <button type="button" onClick={() => setIncludesEn(includesEn.filter((_, idx) => idx !== i))} className="w-8 h-8 flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors">
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
                className="flex-1 h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm"
              />
              <button type="button" onClick={addIncludeEn} className="h-10 px-4 bg-[#d4a017]/20 text-[#d4a017] text-sm font-medium hover:bg-[#d4a017]/30 transition-colors flex items-center gap-1">
                <Plus className="w-4 h-4" /> Hozzaad
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-3">Napi program angolul</label>
            <div className="space-y-3">
              {scheduleEn.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#d4a017]/40 shrink-0" />
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) => { const s = [...scheduleEn]; s[i] = { ...s[i], time: e.target.value }; setScheduleEn(s) }}
                    placeholder="09:00"
                    className="w-24 h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none text-sm text-center"
                  />
                  <input
                    type="text"
                    value={item.activity}
                    onChange={(e) => { const s = [...scheduleEn]; s[i] = { ...s[i], activity: e.target.value }; setScheduleEn(s) }}
                    placeholder="Morning training, technical drills"
                    className="flex-1 h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none text-sm"
                  />
                  <button type="button" onClick={() => setScheduleEn(scheduleEn.filter((_, idx) => idx !== i))} className="w-8 h-8 flex items-center justify-center text-red-400/60 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setScheduleEn([...scheduleEn, { time: "", activity: "" }])}
              className="mt-3 h-10 px-4 bg-[#d4a017]/20 text-[#d4a017] text-sm font-medium hover:bg-[#d4a017]/30 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Angol programpont
            </button>
          </div>

          <div className="border-t border-white/10 pt-5">
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-3">Edzok angolul</label>
            <div className="space-y-4">
              {coachesEn.map((coach, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 space-y-3 relative">
                  <button type="button" onClick={() => setCoachesEn(coachesEn.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Name</label>
                      <input
                        type="text"
                        value={coach.name}
                        onChange={(e) => { const c = [...coachesEn]; c[i] = { ...c[i], name: e.target.value }; setCoachesEn(c) }}
                        placeholder="John Smith"
                        className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Role</label>
                      <input
                        type="text"
                        value={coach.role}
                        onChange={(e) => { const c = [...coachesEn]; c[i] = { ...c[i], role: e.target.value }; setCoachesEn(c) }}
                        placeholder="Head coach"
                        className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                  <input type="hidden" value={coach.image} readOnly />
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Bio</label>
                    <textarea
                      value={coach.bio}
                      onChange={(e) => { const c = [...coachesEn]; c[i] = { ...c[i], bio: e.target.value }; setCoachesEn(c) }}
                      rows={3}
                      placeholder="Short English bio..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none text-sm resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCoachesEn([...coachesEn, { name: "", role: "", image: "", bio: "" }])}
              className="mt-3 h-10 px-4 bg-[#d4a017]/20 text-[#d4a017] text-sm font-medium hover:bg-[#d4a017]/30 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Angol edzo
            </button>
          </div>

          <div className="border-t border-white/10 pt-5">
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-3">FAQ angolul</label>
            <div className="space-y-3">
              {faqEn.map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 space-y-3 relative">
                  <button type="button" onClick={() => setFaqEn(faqEn.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Question</label>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => { const f = [...faqEn]; f[i] = { ...f[i], question: e.target.value }; setFaqEn(f) }}
                      placeholder="What should children bring?"
                      className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Answer</label>
                    <textarea
                      value={item.answer}
                      onChange={(e) => { const f = [...faqEn]; f[i] = { ...f[i], answer: e.target.value }; setFaqEn(f) }}
                      rows={3}
                      placeholder="English answer..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none text-sm resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setFaqEn([...faqEn, { question: "", answer: "" }])}
              className="mt-3 h-10 px-4 bg-[#d4a017]/20 text-[#d4a017] text-sm font-medium hover:bg-[#d4a017]/30 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Angol FAQ
            </button>
          </div>
        </Section>

        {/* ─── MEDIA ─── */}
        <Section title="Media (galeria, video, terkep)" id="media" open={openSections.media} onToggle={() => toggle("media")}>
          {/* Gallery */}
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Galeria kepek</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
              {gallery.map((url, i) => (
                <div key={i} className="relative aspect-video border border-white/10 overflow-hidden group">
                  <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" sizes="200px" unoptimized={url.includes("b-cdn.net")} />
                  <button
                    type="button"
                    onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="aspect-video border border-dashed border-white/20 flex items-center justify-center">
                <ImagePicker value="" onChange={addGalleryImage} folder="camps" />
              </div>
            </div>
          </div>

          {/* Video */}
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">YouTube video URL</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full h-11 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm"
            />
            {videoUrl && getYouTubeId(videoUrl) && (
              <div className="mt-3 aspect-video max-w-md">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}`}
                  className="w-full h-full border border-white/10"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Map */}
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Google Maps Embed URL</label>
            <input
              type="url"
              value={mapEmbedUrl}
              onChange={(e) => setMapEmbedUrl(e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full h-11 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm"
            />
            {mapEmbedUrl && (
              <div className="mt-3 aspect-video max-w-md">
                <iframe src={mapEmbedUrl} className="w-full h-full border border-white/10" allowFullScreen loading="lazy" />
              </div>
            )}
          </div>
        </Section>

        {/* ─── SCHEDULE ─── */}
        <Section title="Napi program" id="schedule" open={openSections.schedule} onToggle={() => toggle("schedule")}>
          <div className="space-y-3">
            {schedule.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#d4a017]/40 shrink-0" />
                <input
                  type="text"
                  value={item.time}
                  onChange={(e) => { const s = [...schedule]; s[i] = { ...s[i], time: e.target.value }; setSchedule(s) }}
                  placeholder="09:00"
                  className="w-24 h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none text-sm text-center"
                />
                <input
                  type="text"
                  value={item.activity}
                  onChange={(e) => { const s = [...schedule]; s[i] = { ...s[i], activity: e.target.value }; setSchedule(s) }}
                  placeholder="Reggeli edzés, technikai gyakorlatok"
                  className="flex-1 h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none text-sm"
                />
                <button type="button" onClick={() => setSchedule(schedule.filter((_, idx) => idx !== i))} className="w-8 h-8 flex items-center justify-center text-red-400/60 hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSchedule([...schedule, { time: "", activity: "" }])}
            className="mt-3 h-10 px-4 bg-[#d4a017]/20 text-[#d4a017] text-sm font-medium hover:bg-[#d4a017]/30 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Programpont hozzaadasa
          </button>
        </Section>

        {/* ─── COACHES ─── */}
        <Section title="Edzok" id="coaches" open={openSections.coaches} onToggle={() => toggle("coaches")}>
          <div className="space-y-4">
            {coaches.map((coach, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-4 space-y-3 relative">
                <button type="button" onClick={() => setCoaches(coaches.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Nev</label>
                    <input
                      type="text"
                      value={coach.name}
                      onChange={(e) => { const c = [...coaches]; c[i] = { ...c[i], name: e.target.value }; setCoaches(c) }}
                      placeholder="Kovacs Janos"
                      className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Szerep / Pozicio</label>
                    <input
                      type="text"
                      value={coach.role}
                      onChange={(e) => { const c = [...coaches]; c[i] = { ...c[i], role: e.target.value }; setCoaches(c) }}
                      placeholder="Foedzo"
                      className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Kep</label>
                  <ImagePicker value={coach.image} onChange={(url) => { const c = [...coaches]; c[i] = { ...c[i], image: url }; setCoaches(c) }} folder="coaches" />
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Bemutatkozas</label>
                  <textarea
                    value={coach.bio}
                    onChange={(e) => { const c = [...coaches]; c[i] = { ...c[i], bio: e.target.value }; setCoaches(c) }}
                    rows={3}
                    placeholder="Rovid bemutatkozas..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none text-sm resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCoaches([...coaches, { name: "", role: "", image: "", bio: "" }])}
            className="mt-3 h-10 px-4 bg-[#d4a017]/20 text-[#d4a017] text-sm font-medium hover:bg-[#d4a017]/30 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Edzo hozzaadasa
          </button>
        </Section>

        {/* ─── FAQ ─── */}
        <Section title="Gyakran Ismételt Kerdesek (GYIK)" id="faq" open={openSections.faq} onToggle={() => toggle("faq")}>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-4 space-y-3 relative">
                <button type="button" onClick={() => setFaq(faq.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Kerdes</label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => { const f = [...faq]; f[i] = { ...f[i], question: e.target.value }; setFaq(f) }}
                    placeholder="Mi a tornacipo szabaly?"
                    className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Valasz</label>
                  <textarea
                    value={item.answer}
                    onChange={(e) => { const f = [...faq]; f[i] = { ...f[i], answer: e.target.value }; setFaq(f) }}
                    rows={3}
                    placeholder="Valasz a kerdesre..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none text-sm resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setFaq([...faq, { question: "", answer: "" }])}
            className="mt-3 h-10 px-4 bg-[#d4a017]/20 text-[#d4a017] text-sm font-medium hover:bg-[#d4a017]/30 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Kerdes hozzaadasa
          </button>
        </Section>

        {/* Submit */}
        <button type="submit" className="w-full min-h-14 rounded-3xl bg-teal-600 text-lg font-bold text-white transition-colors hover:bg-teal-700">
          {isEdit ? "Mentés" : "Tábor létrehozása"}
        </button>
      </form>
    </div>
  )
}

function Section({ title, id, open, onToggle, children }: {
  title: string; id: string; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex min-h-16 items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors md:px-6"
        aria-expanded={open}
        aria-controls={`camp-section-${id}`}
      >
        <span className="text-slate-950 font-bold text-lg">{title}</span>
        {open ? <ChevronUp className="w-5 h-5 text-teal-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      {open && <div id={`camp-section-${id}`} className="border-t border-slate-100 px-5 py-5 space-y-5 md:px-6">{children}</div>}
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
