"use client"

import { useState, useCallback, useRef } from "react"
import Image from "next/image"
import { Upload, FolderOpen, X, ArrowLeft, Check, Loader2, ImageIcon } from "lucide-react"

interface BunnyFile {
  name: string
  path: string
  isDir: boolean
  size: number
  lastChanged: string
  cdnUrl: string | null
}

interface ImagePickerProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
}

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
const MAX_IMAGE_DIMENSION = 2200

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

export function ImagePicker({ value, onChange, folder = "uploads" }: ImagePickerProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"browse" | "upload">("browse")
  const [currentPath, setCurrentPath] = useState("")
  const [files, setFiles] = useState<BunnyFile[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadFiles = useCallback(async (path: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/bunny?path=${encodeURIComponent(path)}`)
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setFiles([])
        setError(data?.error || "Nem sikerült betölteni a Bunny képeket.")
        return
      }
      setFiles(Array.isArray(data) ? data : [])
    } catch {
      setFiles([])
      setError("Nem sikerült kapcsolódni a Bunny Storage-hoz.")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleOpen = () => {
    setOpen(true)
    setTab("browse")
    setCurrentPath("")
    loadFiles("")
  }

  const navigateToDir = (dirName: string) => {
    const cleanDir = dirName.replace(/^\/+|\/+$/g, "")
    const newPath = currentPath ? `${currentPath}${cleanDir}/` : `${cleanDir}/`
    setCurrentPath(newPath)
    loadFiles(newPath)
  }

  const goBack = () => {
    const parts = currentPath.replace(/\/$/, "").split("/")
    parts.pop()
    const newPath = parts.length > 0 ? parts.join("/") + "/" : ""
    setCurrentPath(newPath)
    loadFiles(newPath)
  }

  const selectFile = (file: BunnyFile) => {
    if (file.cdnUrl) {
      onChange(file.cdnUrl)
      setOpen(false)
    }
  }

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return

    setUploading(true)
    setError(null)
    try {
      const uploadableFile = await prepareImageForUpload(file)
      if (uploadableFile.size > MAX_UPLOAD_BYTES) {
        setError("A kép túl nagy. Kérlek tölts fel legfeljebb 4 MB-os képet, vagy tömörítsd kisebbre.")
        return
      }

      const form = new FormData()
      form.append("file", uploadableFile)
      form.append("folder", folder)

      const res = await fetch("/api/bunny", { method: "POST", body: form })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.detail || data?.error || `Nem sikerült feltölteni a képet. HTTP ${res.status}`)
        return
      }
      onChange(data.cdnUrl)
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? `Nem sikerült feltölteni a képet: ${err.message}` : "Nem sikerült feltölteni a képet.")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const imageFiles = files.filter((f) => !f.isDir)
  const dirs = files.filter((f) => f.isDir)

  const isImage = (name: string) =>
    /\.(jpe?g|png|webp|gif|avif)$/i.test(name)

  return (
    <div>
      {/* Trigger + Preview */}
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          <div className="relative w-24 h-24 border border-slate-200 overflow-hidden shrink-0 bg-slate-100 rounded-2xl">
            <Image
              src={value}
              alt="Selected"
              fill
              className="object-cover"
              sizes="80px"
              unoptimized={value.includes("focis.b-cdn.net")}
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-sm"
              aria-label="Kép törlése"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center shrink-0">
            <ImageIcon className="w-7 h-7 text-slate-400" />
          </div>
        )}
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-teal-600 px-5 text-sm font-bold text-white transition-colors hover:bg-teal-700"
        >
          Kép választása
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden rounded-3xl shadow-2xl">
            {/* Header */}
            <div className="flex flex-col gap-3 p-4 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTab("browse")}
                  className={`inline-flex min-h-11 items-center rounded-2xl px-4 text-sm font-bold transition-colors ${
                    tab === "browse"
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <FolderOpen className="w-4 h-4 inline mr-2" />
                  Tallózás
                </button>
                <button
                  type="button"
                  onClick={() => setTab("upload")}
                  className={`inline-flex min-h-11 items-center rounded-2xl px-4 text-sm font-bold transition-colors ${
                    tab === "upload"
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Feltöltés
                </button>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200" aria-label="Bezárás">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {tab === "browse" && (
                <div>
                  {/* Breadcrumb / back */}
                  {currentPath && (
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-700 mb-4 hover:bg-slate-200"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Vissza ({currentPath.replace(/\/$/, "").split("/").pop()})
                    </button>
                  )}

                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-7 h-7 text-teal-600 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {/* Directories */}
                      {dirs.map((d) => (
                        <button
                          key={d.name}
                          type="button"
                          onClick={() => navigateToDir(d.name)}
                          className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-teal-200 hover:bg-teal-50 group"
                        >
                          <FolderOpen className="w-10 h-10 text-teal-600" />
                          <span className="text-slate-700 text-sm font-semibold text-center truncate w-full">{d.name}</span>
                        </button>
                      ))}

                      {/* Image files */}
                      {imageFiles.filter((f) => isImage(f.name)).map((f) => (
                        <button
                          key={f.path}
                          type="button"
                          onClick={() => selectFile(f)}
                          className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 transition-colors hover:border-teal-300 group"
                        >
                          <Image
                            src={`${f.cdnUrl}?width=200&height=200`}
                            alt={f.name}
                            fill
                            className="object-cover"
                            sizes="150px"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                            <Check className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="absolute bottom-0 left-0 right-0 bg-slate-950/75 text-white text-xs px-2 py-1 truncate">
                            {f.name}
                          </span>
                        </button>
                      ))}

                      {dirs.length === 0 && imageFiles.filter((f) => isImage(f.name)).length === 0 && (
                        <p className="col-span-full text-slate-500 text-sm text-center py-8">Üres mappa</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {tab === "upload" && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-colors ${
                    dragOver
                      ? "border-teal-500 bg-teal-50"
                      : "border-slate-300 hover:border-teal-300"
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
                      <p className="text-slate-600 text-base font-medium">Feltöltés...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                      <p className="text-slate-800 text-base font-semibold mb-2">Húzd ide a képet, vagy kattints</p>
                      <p className="text-slate-500 text-sm mb-5">Max 4MB feltöltésenként - a nagy JPG/PNG/WebP képeket automatikusan tömörítjük</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex min-h-11 items-center rounded-2xl bg-teal-600 px-6 text-sm font-bold text-white transition-colors hover:bg-teal-700"
                      >
                        Fájl választása
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
