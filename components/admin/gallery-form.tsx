"use client"

import { useState } from "react"
import { ImagePicker } from "./image-picker"
import { addGalleryImage } from "@/lib/actions"

export function GalleryForm() {
  const [imageUrl, setImageUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    if (!imageUrl) return
    setSubmitting(true)
    formData.set("url", imageUrl)
    await addGalleryImage(formData)
    setImageUrl("")
    setSubmitting(false)
  }

  return (
    <form action={handleSubmit} className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6">
      <h3 className="text-white font-medium mb-4">Új kép hozzáadása</h3>
      <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Kép</label>
          <ImagePicker value={imageUrl} onChange={setImageUrl} folder="gallery" />
          <input type="hidden" name="url" value={imageUrl} />
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Leírás</label>
            <input type="text" name="alt" placeholder="Rövid leírás a képhez" className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm" />
          </div>
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Kategória</label>
            <select
              name="category"
              className="w-full h-10 px-3 rounded border border-white/10 bg-[#111811] text-white focus:border-[#d4a017] focus:outline-none transition-colors text-sm [color-scheme:dark]"
            >
              <option value="general" className="bg-[#0a1f0a] text-white">
                Általános
              </option>
              <option value="training" className="bg-[#0a1f0a] text-white">
                Edzés
              </option>
              <option value="match" className="bg-[#0a1f0a] text-white">
                Mérkőzés
              </option>
              <option value="team" className="bg-[#0a1f0a] text-white">
                Csapat
              </option>
              <option value="event" className="bg-[#0a1f0a] text-white">
                Esemény
              </option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={!imageUrl || submitting}
          className="h-10 px-6 bg-[#d4a017] text-[#0a1f0a] text-sm font-semibold hover:bg-[#d4a017]/90 transition-colors disabled:opacity-40"
        >
          {submitting ? "Mentés…" : "Hozzáadás"}
        </button>
      </div>
    </form>
  )
}
