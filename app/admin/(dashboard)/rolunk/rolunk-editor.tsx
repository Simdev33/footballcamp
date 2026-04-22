"use client"

import { useState, useTransition } from "react"
import { saveRolunkContent } from "./actions"
import { saveSiteImages } from "../tartalom/image-actions"
import type { RolunkContent } from "@/lib/rolunk-content"
import { SITE_IMAGE_DEFAULTS, SITE_IMAGE_LABELS, type SiteImageKey } from "@/lib/site-images"
import { Save, Check, Eye, Image as ImgIcon, RotateCcw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { ImagePicker } from "@/components/admin/image-picker"

type FieldDef = {
  key: keyof RolunkContent
  label: string
  hint: string
  type: "input" | "textarea" | "rich"
}

const FIELDS: { section: string; description: string; items: FieldDef[] }[] = [
  {
    section: "Fejléc (Hero)",
    description: "A „Rólunk” oldal tetején, a nagy háttérkép előtt jelenik meg.",
    items: [
      { key: "badge", label: "Kis címke a cím fölött", hint: "Pl.: „Rólunk”, „Bemutatkozás”.", type: "input" },
      { key: "heroTitle", label: "Nagy főcím", hint: "Ez a legnagyobb szöveg az oldal tetején.", type: "textarea" },
      { key: "heroText", label: "Rövid bevezető", hint: "1-2 mondatos leírás a cím alatt. Formázhatod: félkövér, dőlt, felsorolás stb.", type: "rich" },
    ],
  },
  {
    section: "Misszió szekció",
    description: "A „Céljaink” / misszió szekció szövege.",
    items: [
      { key: "missionTitle", label: "Szekció címe", hint: "Pl.: „Céljaink”.", type: "input" },
      { key: "missionText", label: "Szekció szövege", hint: "Hosszabb magyarázat a célokról, küldetésről. Használd a formázást (félkövér, lista).", type: "rich" },
    ],
  },
  {
    section: "Idézet szekció",
    description: "Az oldal közepén kiemelt, dőlt betűs idézet és aláírás.",
    items: [
      { key: "quote", label: "Idézet szövege", hint: "Ez jelenik meg nagy idézőjelek között.", type: "rich" },
      { key: "quoteAuthor", label: "Idézet alatti szöveg", hint: "Pl. záró mondat vagy aláírás.", type: "textarea" },
    ],
  },
  {
    section: "„Mi kezdőcsapatunk” szekció",
    description: "Az USP kártyák (11 érv) feletti cím és felirat.",
    items: [
      { key: "uspTitle", label: "Cím", hint: "Pl.: „A mi kezdőcsapatunk”.", type: "input" },
      { key: "uspText", label: "Felirat", hint: "Rövid aláírás a cím alatt.", type: "input" },
    ],
  },
]

// Images specifically relevant to the Rólunk page
const ROLUNK_IMAGE_KEYS: SiteImageKey[] = ["rolunk.hero", "rolunk.mission"]

export function RolunkEditor({
  initial,
  imageOverrides,
}: {
  initial: RolunkContent
  imageOverrides: Partial<Record<SiteImageKey, string>>
}) {
  const [values, setValues] = useState<RolunkContent>(initial)
  const [imgs, setImgs] = useState<Partial<Record<SiteImageKey, string>>>(imageOverrides)
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()

  const update = (key: keyof RolunkContent, value: string) => {
    setValues((v) => ({ ...v, [key]: value }))
  }

  const save = () => {
    startTransition(async () => {
      await saveRolunkContent(values)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  const saveImage = (key: SiteImageKey, url: string) => {
    setImgs((v) => ({ ...v, [key]: url }))
    startTransition(async () => {
      await saveSiteImages({ [key]: url })
    })
  }

  const resetImage = (key: SiteImageKey) => {
    setImgs((v) => {
      const next = { ...v }
      delete next[key]
      return next
    })
    startTransition(async () => {
      await saveSiteImages({ [key]: "" })
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6 rounded-lg">
        <h2 className="font-serif text-2xl font-bold text-white">Rólunk oldal szerkesztése</h2>
        <p className="text-white/60 text-sm mt-2 leading-relaxed">
          Itt szerkesztheted a <strong className="text-[#d4a017]">Rólunk</strong> aloldal összes szövegét és képét.
          A hosszabb szövegmezőket a formázóeszközökkel tudod díszíteni (<strong>félkövér</strong>, <em>dőlt</em>, felsorolás, idézet).
          A módosítások után kattints a <strong className="text-[#d4a017]">Mentés</strong> gombra alul.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Link
            href="/rolunk"
            target="_blank"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-colors rounded"
          >
            <Eye className="w-3.5 h-3.5" />
            Előnézet új lapon
          </Link>
        </div>
      </div>

      {/* Rolunk images */}
      <div className="bg-[#0a1f0a] border border-[#d4a017]/10 rounded-lg p-6 space-y-5">
        <div>
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <ImgIcon className="w-5 h-5 text-[#d4a017]" />
            A Rólunk oldal képei
          </h3>
          <p className="text-white/50 text-sm mt-1">Ezek a képek a Rólunk oldalon jelennek meg. Cseréld ki a „Kép választása” gombbal.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {ROLUNK_IMAGE_KEYS.map((key) => {
            const override = imgs[key]
            const displayUrl = override || SITE_IMAGE_DEFAULTS[key]
            const info = SITE_IMAGE_LABELS[key]
            const isCustom = Boolean(override)
            return (
              <div key={key} className="border border-white/10 rounded-md overflow-hidden bg-black/20">
                <div className="relative aspect-[16/9] bg-black/40">
                  <Image
                    src={displayUrl}
                    alt={info.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                    unoptimized={displayUrl.includes("b-cdn.net")}
                  />
                  {isCustom && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#d4a017] text-[#0a1f0a] text-[10px] font-bold uppercase tracking-wider rounded">
                      Egyedi
                    </span>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <div>
                    <p className="text-white text-sm font-medium">{info.title}</p>
                    <p className="text-white/50 text-xs mt-0.5">{info.hint}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <ImagePicker value={override || ""} onChange={(url) => saveImage(key, url)} folder="site" />
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => resetImage(key)}
                        disabled={pending}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-white/60 hover:text-red-400 border border-white/10 hover:border-red-400/40 transition-colors rounded disabled:opacity-50"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Visszaállítás
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Text fields */}
      {FIELDS.map((group) => (
        <div key={group.section} className="bg-[#0a1f0a] border border-[#d4a017]/10 rounded-lg p-6 space-y-5">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">{group.section}</h3>
            <p className="text-white/50 text-sm mt-1">{group.description}</p>
          </div>

          {group.items.map((item) => (
            <div key={item.key}>
              <label className="block text-white text-sm font-medium mb-1">{item.label}</label>
              <p className="text-white/40 text-xs mb-2">{item.hint}</p>
              {item.type === "rich" ? (
                <RichTextEditor
                  value={values[item.key]}
                  onChange={(v) => update(item.key, v)}
                  minHeight={140}
                />
              ) : item.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={values[item.key]}
                  onChange={(e) => update(item.key, e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/30 border border-[#d4a017]/20 text-white text-sm focus:border-[#d4a017] focus:outline-none rounded-md resize-y"
                />
              ) : (
                <input
                  type="text"
                  value={values[item.key]}
                  onChange={(e) => update(item.key, e.target.value)}
                  className="w-full h-10 px-3 bg-black/30 border border-[#d4a017]/20 text-white text-sm focus:border-[#d4a017] focus:outline-none rounded-md"
                />
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="sticky bottom-4 flex items-center justify-between gap-4 p-4 bg-[#0a1f0a] border border-[#d4a017]/30 rounded-lg shadow-xl z-10">
        <div className="flex items-center gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
              <Check className="w-4 h-4" /> Mentve!
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d4a017] text-[#0a1f0a] font-bold text-sm hover:bg-[#d4a017]/90 transition-colors disabled:opacity-50 rounded"
        >
          <Save className="w-4 h-4" />
          {pending ? "Mentés…" : "Mentés"}
        </button>
      </div>
    </div>
  )
}
