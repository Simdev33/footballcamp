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
    if (file.size > 10 * 1024 * 1024) {
      alert("Max 10MB!")
      return
    }

    setUploading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("folder", folder)

      const res = await fetch("/api/bunny", { method: "POST", body: form })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error || data?.detail || "Nem sikerült feltölteni a képet.")
        return
      }
      onChange(data.cdnUrl)
      setOpen(false)
    } catch {
      setError("Nem sikerült feltölteni a képet.")
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
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative w-20 h-20 border border-[#d4a017]/30 overflow-hidden shrink-0 bg-black/20">
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
              className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-20 h-20 border border-dashed border-white/20 flex items-center justify-center shrink-0">
            <ImageIcon className="w-6 h-6 text-white/30" />
          </div>
        )}
        <button
          type="button"
          onClick={handleOpen}
          className="px-4 py-2 bg-[#d4a017] text-[#0a1f0a] text-sm font-semibold hover:bg-[#d4a017]/90 transition-colors"
        >
          Kep valasztasa
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
          <div className="bg-[#0f2b0f] border border-[#d4a017]/30 w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#d4a017]/20">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTab("browse")}
                  className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                    tab === "browse"
                      ? "bg-[#d4a017] text-[#0a1f0a]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <FolderOpen className="w-4 h-4 inline mr-2" />
                  Tallozas
                </button>
                <button
                  type="button"
                  onClick={() => setTab("upload")}
                  className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                    tab === "upload"
                      ? "bg-[#d4a017] text-[#0a1f0a]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Feltoltes
                </button>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {error && (
                <div className="mb-4 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
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
                      className="flex items-center gap-2 text-[#d4a017] text-sm mb-4 hover:underline"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Vissza ({currentPath.replace(/\/$/, "").split("/").pop()})
                    </button>
                  )}

                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 text-[#d4a017] animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {/* Directories */}
                      {dirs.map((d) => (
                        <button
                          key={d.name}
                          type="button"
                          onClick={() => navigateToDir(d.name)}
                          className="flex flex-col items-center gap-2 p-3 border border-white/10 hover:border-[#d4a017]/50 transition-colors group"
                        >
                          <FolderOpen className="w-10 h-10 text-[#d4a017]/60 group-hover:text-[#d4a017]" />
                          <span className="text-white/70 text-xs text-center truncate w-full">{d.name}</span>
                        </button>
                      ))}

                      {/* Image files */}
                      {imageFiles.filter((f) => isImage(f.name)).map((f) => (
                        <button
                          key={f.path}
                          type="button"
                          onClick={() => selectFile(f)}
                          className="relative aspect-square border border-white/10 hover:border-[#d4a017] overflow-hidden group transition-colors"
                        >
                          <Image
                            src={`${f.cdnUrl}?width=200&height=200`}
                            alt={f.name}
                            fill
                            className="object-cover"
                            sizes="150px"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <Check className="w-8 h-8 text-[#d4a017] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-1.5 py-0.5 truncate">
                            {f.name}
                          </span>
                        </button>
                      ))}

                      {dirs.length === 0 && imageFiles.filter((f) => isImage(f.name)).length === 0 && (
                        <p className="col-span-full text-white/40 text-sm text-center py-8">Ures mappa</p>
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
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    dragOver
                      ? "border-[#d4a017] bg-[#d4a017]/10"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-[#d4a017] animate-spin" />
                      <p className="text-white/60 text-sm">Feltoltes...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-[#d4a017]/50 mx-auto mb-4" />
                      <p className="text-white/70 text-sm mb-2">Huzd ide a kepet, vagy kattints</p>
                      <p className="text-white/40 text-xs mb-4">Max 10MB - JPG, PNG, WebP, GIF</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2 bg-[#d4a017] text-[#0a1f0a] text-sm font-semibold hover:bg-[#d4a017]/90 transition-colors"
                      >
                        Fajl valasztasa
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
