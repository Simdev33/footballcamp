"use client"

import { useState } from "react"
import { ImagePicker } from "./image-picker"
import { createCamp, updateCamp } from "@/lib/actions"
import Link from "next/link"
import { ArrowLeft, Plus, X } from "lucide-react"

type CampData = {
  id: string
  city: string
  venue: string
  dates: string
  price: string
  earlyBirdPrice: string
  totalSpots: number
  remainingSpots: number
  active: boolean
  description: string
  imageUrl: string | null
  clubName: string
  ageRange: string
  includes: string[]
}

const DEFAULT_INCLUDES = [
  "Hivatalos klub felszereles (mez, nadrag, sportszar)",
  "Napi haromszori etkezes",
  "Napi 4 edzes",
  "Oklevel es emlektargyak",
]

export function CampForm({ camp }: { camp?: CampData }) {
  const isEdit = !!camp
  const [imageUrl, setImageUrl] = useState(camp?.imageUrl || "")
  const [description, setDescription] = useState(camp?.description || "")
  const [includes, setIncludes] = useState<string[]>(
    camp?.includes?.length ? camp.includes : (isEdit ? [] : DEFAULT_INCLUDES)
  )
  const [newItem, setNewItem] = useState("")

  const addItem = () => {
    const trimmed = newItem.trim()
    if (trimmed && !includes.includes(trimmed)) {
      setIncludes([...includes, trimmed])
      setNewItem("")
    }
  }

  const removeItem = (index: number) => {
    setIncludes(includes.filter((_, i) => i !== index))
  }

  const action = isEdit ? updateCamp.bind(null, camp.id) : createCamp

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/taborok" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Vissza
      </Link>

      <h2 className="text-xl font-bold text-white">
        {isEdit ? `Tabor szerkesztese: ${camp.city}` : "Uj tabor letrehozasa"}
      </h2>

      <form action={action} className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6 space-y-6">
        {/* Hidden fields for state-managed values */}
        <input type="hidden" name="imageUrl" value={imageUrl} />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="includes" value={includes.join("\n")} />

        {/* Image */}
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Tabor kepe</label>
          <ImagePicker value={imageUrl} onChange={setImageUrl} folder="camps" />
        </div>

        {/* City + Venue */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Varos" name="city" required defaultValue={camp?.city} placeholder="pl. Szeged" />
          <Field label="Helyszin" name="venue" required defaultValue={camp?.venue} placeholder="pl. Szegedi Sportkozpont" />
        </div>

        {/* Club + Age */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Klub neve" name="clubName" defaultValue={camp?.clubName || "SL Benfica"} placeholder="SL Benfica" />
          <Field label="Korosztaly" name="ageRange" defaultValue={camp?.ageRange || "6-15"} placeholder="6-15" />
        </div>

        {/* Dates */}
        <Field label="Datumok" name="dates" required defaultValue={camp?.dates} placeholder="pl. 2026. julius 7-11." />

        {/* Prices */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Ar" name="price" required defaultValue={camp?.price} placeholder="pl. 159.000 Ft" />
          <Field label="Early Bird ar" name="earlyBirdPrice" required defaultValue={camp?.earlyBirdPrice} placeholder="pl. 139.000 Ft" />
        </div>

        {/* Spots */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Osszes hely" name="totalSpots" type="number" required defaultValue={String(camp?.totalSpots || "")} placeholder="40" />
          {isEdit && (
            <Field label="Szabad helyek" name="remainingSpots" type="number" required defaultValue={String(camp?.remainingSpots || "")} />
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Leiras</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm resize-none"
            placeholder="A tabor reszletes leirasa..."
          />
        </div>

        {/* Includes */}
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Mit tartalmaz a tabor</label>
          <div className="space-y-2 mb-3">
            {includes.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white text-sm">{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="w-8 h-8 flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
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
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem() } }}
              placeholder="Uj elem hozzaadasa..."
              className="flex-1 h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm"
            />
            <button
              type="button"
              onClick={addItem}
              className="h-10 px-4 bg-[#d4a017]/20 text-[#d4a017] text-sm font-medium hover:bg-[#d4a017]/30 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Hozzaad
            </button>
          </div>
        </div>

        {/* Active */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="active" defaultChecked={camp?.active ?? true} className="w-5 h-5 accent-[#d4a017]" />
          <span className="text-white text-sm">Aktiv (megjelenik a publikus oldalon)</span>
        </label>

        <button type="submit" className="w-full h-11 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:bg-[#d4a017]/90 transition-colors">
          {isEdit ? "Mentes" : "Tabor letrehozasa"}
        </button>
      </form>
    </div>
  )
}

function Field({ label, name, type = "text", required = false, defaultValue = "", placeholder = "" }: {
  label: string; name: string; type?: string; required?: boolean; defaultValue?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full h-11 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm"
      />
    </div>
  )
}
