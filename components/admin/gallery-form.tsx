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
    <form action={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h3 className="text-xl font-bold text-slate-950 mb-2">Új kép hozzáadása</h3>
      <p className="mb-5 text-base leading-relaxed text-slate-600">
        Válassz ki egy képet, adj hozzá rövid leírást, majd nyomd meg a Hozzáadás gombot.
      </p>
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Kép</label>
          <ImagePicker value={imageUrl} onChange={setImageUrl} folder="gallery" />
          <input type="hidden" name="url" value={imageUrl} />
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Leírás</label>
            <input type="text" name="alt" placeholder="Rövid leírás a képhez" className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kategória</label>
            <select
              name="category"
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
            >
              <option value="general">Általános</option>
              <option value="training">Edzés</option>
              <option value="match">Mérkőzés</option>
              <option value="team">Csapat</option>
              <option value="event">Esemény</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={!imageUrl || submitting}
          className="min-h-12 w-full rounded-2xl bg-teal-600 px-6 text-base font-bold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40 lg:w-auto"
        >
          {submitting ? "Mentés…" : "Hozzáadás"}
        </button>
      </div>
    </form>
  )
}
