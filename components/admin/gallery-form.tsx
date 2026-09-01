"use client"

import { useState } from "react"
import { ImagePicker } from "./image-picker"
import { addGalleryImage } from "@/lib/actions"
import { albumSelectOptions, GALLERY_ALBUMS } from "@/lib/gallery-albums"

export function GalleryForm() {
  const options = albumSelectOptions()
  const [imageUrl, setImageUrl] = useState("")
  const [category, setCategory] = useState(GALLERY_ALBUMS[0]?.slug ?? "general")
  const [submitting, setSubmitting] = useState(false)

  const folder = GALLERY_ALBUMS.some((a) => a.slug === category) ? `gallery/${category}` : "gallery"

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
      <h3 className="text-xl font-bold text-slate-950 mb-2">Egy kép hozzáadása</h3>
      <p className="mb-5 text-base leading-relaxed text-slate-600">
        Válassz ki egy képet, add meg, melyik mappába kerüljön, majd nyomd meg a Hozzáadás gombot.
      </p>
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Kép</label>
          <ImagePicker value={imageUrl} onChange={setImageUrl} folder={folder} />
          <input type="hidden" name="url" value={imageUrl} />
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Leírás</label>
            <input type="text" name="alt" placeholder="Rövid leírás a képhez" className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mappa / kategória</label>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
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
