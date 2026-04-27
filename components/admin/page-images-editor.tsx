"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { ImagePicker } from "@/components/admin/image-picker"
import { saveSiteImages } from "@/app/admin/(dashboard)/tartalom/image-actions"
import { RotateCcw, Check, Image as ImgIcon, MapPin } from "lucide-react"
import type { SiteImageKey } from "@/lib/site-images"

export type PageImageItem = {
  key: SiteImageKey
  title: string
  where: string
  defaultUrl: string
  currentUrl: string
}

/**
 * Inline image-section editor for a single admin page.
 * Shows all images relevant to the current page with live save.
 */
export function PageImagesEditor({ items }: { items: PageImageItem[] }) {
  const initial = Object.fromEntries(items.map((i) => [i.key, i.currentUrl])) as Record<SiteImageKey, string>
  const [values, setValues] = useState<Record<SiteImageKey, string>>(initial)
  const [savedKey, setSavedKey] = useState<SiteImageKey | null>(null)
  const [pending, startTransition] = useTransition()

  const saveOne = (key: SiteImageKey, url: string) => {
    setValues((v) => ({ ...v, [key]: url }))
    startTransition(async () => {
      await saveSiteImages({ [key]: url })
      setSavedKey(key)
      setTimeout(() => setSavedKey(null), 1500)
    })
  }

  const resetOne = (key: SiteImageKey) => {
    setValues((v) => ({ ...v, [key]: "" }))
    startTransition(async () => {
      await saveSiteImages({ [key]: "" })
      setSavedKey(key)
      setTimeout(() => setSavedKey(null), 1500)
    })
  }

  if (items.length === 0) return null

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-slate-100 bg-slate-50">
        <div className="w-12 h-12 bg-teal-50 text-teal-700 flex items-center justify-center rounded-2xl flex-shrink-0 ring-1 ring-teal-100">
          <ImgIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-slate-950">
            Az oldal képei
            <span className="ml-2 text-slate-400 text-base font-sans font-normal">({items.length})</span>
          </h3>
          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
            Ezek a képek jelennek meg ezen az oldalon. Kattints a „Kép választása” gombra a cseréhez.
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item) => {
          const override = values[item.key]
          const displayUrl = override || item.defaultUrl
          const isSaved = savedKey === item.key
          const isCustom = Boolean(override)

          return (
            <div key={item.key} className="p-4 md:p-5 flex flex-col md:flex-row gap-4 md:gap-5 md:items-center">
              <div className="relative w-full md:w-48 lg:w-56 aspect-[16/9] bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200">
                <Image
                  src={displayUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 224px"
                  className="object-cover"
                  unoptimized={displayUrl.includes("b-cdn.net")}
                />
                {isCustom && (
                  <span className="absolute top-2 left-2 rounded-full bg-teal-600 px-2 py-1 text-xs font-bold text-white">
                    Egyedi
                  </span>
                )}
                {isSaved && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-1 text-xs font-bold text-white">
                    <Check className="w-3 h-3" /> Mentve
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-3">
                <div>
                  <h4 className="text-slate-950 font-bold text-base">{item.title}</h4>
                  <p className="mt-1 flex items-start gap-1.5 text-slate-600 text-sm leading-relaxed">
                    <MapPin className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span>{item.where}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <ImagePicker value={override || ""} onChange={(url) => saveOne(item.key, url)} folder="site" />
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => resetOne(item.key)}
                      disabled={pending}
                      className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 text-sm font-bold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Eredeti kép visszaállítása
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
