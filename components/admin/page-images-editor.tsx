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
    <section className="bg-[#0a1f0a] border border-[#d4a017]/10 rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 px-5 md:px-6 py-4 border-b border-white/5 bg-black/20">
        <div className="w-9 h-9 bg-[#d4a017]/15 text-[#d4a017] flex items-center justify-center rounded-md flex-shrink-0">
          <ImgIcon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-serif text-base font-bold text-white">
            Az oldal képei
            <span className="ml-2 text-white/40 text-sm font-sans font-normal">({items.length})</span>
          </h3>
          <p className="text-white/50 text-xs mt-0.5">
            Ezek a képek jelennek meg ezen az oldalon. Kattints a „Kép választása” gombra a cseréhez.
          </p>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {items.map((item) => {
          const override = values[item.key]
          const displayUrl = override || item.defaultUrl
          const isSaved = savedKey === item.key
          const isCustom = Boolean(override)

          return (
            <div key={item.key} className="p-4 md:p-5 flex flex-col md:flex-row gap-4 md:gap-5 md:items-center">
              <div className="relative w-full md:w-48 lg:w-56 aspect-[16/9] bg-black/40 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                <Image
                  src={displayUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 224px"
                  className="object-cover"
                  unoptimized={displayUrl.includes("b-cdn.net")}
                />
                {isCustom && (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#d4a017] text-[#0a1f0a] text-[9px] font-bold uppercase tracking-wider rounded">
                    Egyedi
                  </span>
                )}
                {isSaved && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-bold uppercase rounded">
                    <Check className="w-2.5 h-2.5" /> Mentve
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-3">
                <div>
                  <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                  <p className="mt-1 flex items-start gap-1.5 text-white/50 text-xs leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-[#d4a017]/70 mt-0.5 flex-shrink-0" />
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
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white/60 hover:text-red-400 border border-white/10 hover:border-red-400/40 transition-colors rounded disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
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
