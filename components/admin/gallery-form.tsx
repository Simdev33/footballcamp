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
      <h3 className="text-white font-medium mb-4">Uj kep hozzaadasa</h3>
      <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Kep</label>
          <ImagePicker value={imageUrl} onChange={setImageUrl} folder="gallery" />
          <input type="hidden" name="url" value={imageUrl} />
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Leiras</label>
            <input type="text" name="alt" placeholder="Kep rovid leirasa" className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm" />
          </div>
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Kategoria</label>
            <select name="category" className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white focus:border-[#d4a017] focus:outline-none transition-colors text-sm">
              <option value="general">Altalanos</option>
              <option value="training">Edzes</option>
              <option value="match">Merkozes</option>
              <option value="team">Csapat</option>
              <option value="event">Esemeny</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={!imageUrl || submitting}
          className="h-10 px-6 bg-[#d4a017] text-[#0a1f0a] text-sm font-semibold hover:bg-[#d4a017]/90 transition-colors disabled:opacity-40"
        >
          {submitting ? "Mentes..." : "Hozzaadas"}
        </button>
      </div>
    </form>
  )
}
