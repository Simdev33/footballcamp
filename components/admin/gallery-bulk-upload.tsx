"use client"

import { useRef, useState } from "react"
import { CheckCircle2, CloudDownload, FolderPlus, Loader2, Upload } from "lucide-react"
import { addGalleryImages } from "@/lib/actions"
import {
  albumSelectOptions,
  albumStorageFolder,
  fileBelongsToAlbum,
  GALLERY_ALBUMS,
} from "@/lib/gallery-albums"

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
const MAX_IMAGE_DIMENSION = 2200

/** Túl nagy képek átméretezése a böngészőben, feltöltés előtt. */
async function prepareImageForUpload(file: File): Promise<File> {
  if (file.type === "image/gif" || file.size <= MAX_UPLOAD_BYTES) return file

  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = objectUrl
    })

    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height))
    const width = Math.max(1, Math.round(img.width * scale))
    const height = Math.max(1, Math.round(img.height * scale))
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext("2d")
    if (!ctx) return file
    ctx.drawImage(img, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.82)
    })
    if (!blob || blob.size >= file.size) return file

    const baseName = file.name.replace(/\.[^.]+$/, "")
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" })
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export function GalleryBulkUpload() {
  const options = albumSelectOptions()
  const [category, setCategory] = useState(GALLERY_ALBUMS[0]?.slug ?? "general")
  const [alt, setAlt] = useState("")
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [errors, setErrors] = useState<string[]>([])
  const [added, setAdded] = useState(0)
  const [importing, setImporting] = useState(false)
  const [importMsg, setImportMsg] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const albumConfig = GALLERY_ALBUMS.find((a) => a.slug === category)
  const folder = albumConfig ? albumStorageFolder(albumConfig) : "gallery"

  /** A Bunny mappában már fent lévő képek behúzása az adatbázisba. */
  const importFromBunny = async () => {
    if (!albumConfig) {
      setImportMsg("Ez a lehetőség csak a mappákhoz (albumokhoz) érhető el.")
      return
    }

    setImporting(true)
    setImportMsg(null)
    setErrors([])
    setAdded(0)

    try {
      const res = await fetch(`/api/bunny?path=${encodeURIComponent(`${folder}/`)}`)
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setImportMsg(data?.error || `Nem sikerült beolvasni a Bunny mappát. HTTP ${res.status}`)
        return
      }

      const urls: string[] = (Array.isArray(data) ? data : [])
        .filter(
          (f: { isDir: boolean; name: string; cdnUrl: string | null }) =>
            !f.isDir &&
            f.cdnUrl &&
            /\.(jpe?g|png|webp|avif)$/i.test(f.name) &&
            fileBelongsToAlbum(albumConfig, f.name),
        )
        .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, "hu"))
        .map((f: { cdnUrl: string }) => f.cdnUrl)

      if (urls.length === 0) {
        setImportMsg(`Nem találtam képet itt: ${folder}/`)
        return
      }

      const result = await addGalleryImages(urls, category, alt.trim())
      setImportMsg(
        result.added > 0
          ? `${result.added} kép behúzva.${result.skipped ? ` ${result.skipped} kép már korábban be volt téve.` : ""}`
          : `Nem került be új kép – mind a ${result.skipped} már szerepel a galériában.`,
      )
    } catch (err) {
      setImportMsg(err instanceof Error ? `Hiba: ${err.message}` : "Ismeretlen hiba.")
    } finally {
      setImporting(false)
    }
  }

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    const files = Array.from(fileList)
      .filter((f) => f.type.startsWith("image/"))
      .sort((a, b) => a.name.localeCompare(b.name, "hu"))

    if (files.length === 0) return

    setBusy(true)
    setErrors([])
    setAdded(0)
    setProgress({ done: 0, total: files.length })

    const uploaded: string[] = []
    const failed: string[] = []

    for (const file of files) {
      try {
        const prepared = await prepareImageForUpload(file)
        if (prepared.size > MAX_UPLOAD_BYTES) {
          failed.push(`${file.name} – túl nagy (max. 4 MB)`)
        } else {
          const form = new FormData()
          form.append("file", prepared)
          form.append("folder", folder)

          const res = await fetch("/api/bunny", { method: "POST", body: form })
          const data = await res.json().catch(() => null)
          if (!res.ok) {
            failed.push(`${file.name} – ${data?.error || `HTTP ${res.status}`}`)
          } else {
            uploaded.push(data.cdnUrl)
          }
        }
      } catch (err) {
        failed.push(`${file.name} – ${err instanceof Error ? err.message : "ismeretlen hiba"}`)
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }))
    }

    if (uploaded.length > 0) {
      try {
        const result = await addGalleryImages(uploaded, category, alt.trim())
        setAdded(result.added)
      } catch {
        failed.push("A képek feltöltődtek, de az adatbázisba mentés nem sikerült.")
      }
    }

    setErrors(failed)
    setBusy(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="rounded-3xl border border-teal-200 bg-teal-50/40 p-5 shadow-sm md:p-6">
      <div className="flex items-start gap-3">
        <FolderPlus className="mt-0.5 h-6 w-6 shrink-0 text-teal-600" />
        <div>
          <h3 className="text-xl font-bold text-slate-950">Több kép feltöltése egy mappába</h3>
          <p className="mt-1 text-base leading-relaxed text-slate-600">
            Válaszd ki a mappát, majd jelöld ki egyszerre az összes képet. A nagy képeket a böngésző
            automatikusan lekicsinyíti feltöltés előtt.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Mappa</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={busy}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-500">Bunny mappa: {folder}/</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Közös leírás (alt szöveg) – opcionális
          </label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            disabled={busy}
            placeholder="pl. Benfica tábor, Algyő 2026"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
          />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <div className="mt-5 flex flex-col gap-3 lg:flex-row">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy || importing}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 text-base font-bold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          {busy ? `Feltöltés… ${progress.done}/${progress.total}` : "Képek kiválasztása"}
        </button>

        <button
          type="button"
          onClick={importFromBunny}
          disabled={busy || importing || !albumConfig}
          title={`A(z) ${folder}/ mappában már fent lévő képek behúzása`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-teal-300 bg-white px-6 text-base font-bold text-teal-700 transition-colors hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {importing ? <Loader2 className="h-5 w-5 animate-spin" /> : <CloudDownload className="h-5 w-5" />}
          {importing ? "Behúzás…" : "Már feltöltött képek behúzása"}
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        A „behúzás” akkor kell, ha a képeket közvetlenül a Bunny felületén töltötted fel – onnan
        beolvassa a {folder}/ mappát, és felveszi a képeket a galériába.
      </p>

      {importMsg && (
        <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
          {importMsg}
        </p>
      )}

      {busy && progress.total > 0 && (
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-teal-100">
          <div
            className="h-full bg-teal-600 transition-all"
            style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }}
          />
        </div>
      )}

      {!busy && added > 0 && (
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
          <CheckCircle2 className="h-4 w-4" />
          {added} kép hozzáadva a mappához.
        </p>
      )}

      {errors.length > 0 && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-800">
            {errors.length} kép nem sikerült:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-red-700">
            {errors.map((e, i) => (
              <li key={i}>• {e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
