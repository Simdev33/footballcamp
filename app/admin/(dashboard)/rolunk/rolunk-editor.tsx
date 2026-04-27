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
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wider text-teal-700">Rólunk oldal</p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-slate-950">Rólunk oldal szerkesztése</h2>
        <p className="mt-2 text-base leading-relaxed text-slate-600">
          Itt szerkesztheted a <strong className="text-teal-700">Rólunk</strong> aloldal összes szövegét és képét.
          A hosszabb szövegmezőket a formázóeszközökkel tudod díszíteni (<strong>félkövér</strong>, <em>dőlt</em>, felsorolás, idézet).
          A módosítások után kattints a <strong className="text-teal-700">Mentés</strong> gombra alul.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Link
            href="/rolunk"
            target="_blank"
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-teal-50 px-4 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-100"
          >
            <Eye className="w-4 h-4" />
            Előnézet új lapon
          </Link>
        </div>
      </div>

      {/* Rolunk images */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-5 shadow-sm md:p-6">
        <div>
          <h3 className="flex items-center gap-2 font-serif text-2xl font-bold text-slate-950">
            <ImgIcon className="w-5 h-5 text-teal-600" />
            A Rólunk oldal képei
          </h3>
          <p className="mt-1 text-base text-slate-600">Ezek a képek a Rólunk oldalon jelennek meg. Cseréld ki a „Kép választása” gombbal.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {ROLUNK_IMAGE_KEYS.map((key) => {
            const override = imgs[key]
            const displayUrl = override || SITE_IMAGE_DEFAULTS[key]
            const info = SITE_IMAGE_LABELS[key]
            const isCustom = Boolean(override)
            return (
              <div key={key} className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                <div className="relative aspect-[16/9] bg-slate-100">
                  <Image
                    src={displayUrl}
                    alt={info.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                    unoptimized={displayUrl.includes("b-cdn.net")}
                  />
                  {isCustom && (
                    <span className="absolute top-2 left-2 rounded-full bg-teal-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      Egyedi
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-base font-bold text-slate-950">{info.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{info.where}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <ImagePicker value={override || ""} onChange={(url) => saveImage(key, url)} folder="site" />
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => resetImage(key)}
                        disabled={pending}
                        className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-3 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
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
        <div key={group.section} className="rounded-3xl border border-slate-200 bg-white p-5 space-y-5 shadow-sm md:p-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-slate-950">{group.section}</h3>
            <p className="mt-1 text-base text-slate-600">{group.description}</p>
          </div>

          {group.items.map((item) => (
            <div key={item.key}>
              <label className="mb-1 block text-sm font-bold text-slate-700">{item.label}</label>
              <p className="mb-2 text-sm leading-relaxed text-slate-500">{item.hint}</p>
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
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-relaxed text-slate-950 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 resize-y"
                />
              ) : (
                <input
                  type="text"
                  value={values[item.key]}
                  onChange={(e) => update(item.key, e.target.value)}
                  className="w-full min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
                />
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-900/10 backdrop-blur">
        <div className="flex items-center gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
              <Check className="w-4 h-4" /> Mentve!
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-teal-600 px-6 text-base font-bold text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {pending ? "Mentés…" : "Mentés"}
        </button>
      </div>
    </div>
  )
}
