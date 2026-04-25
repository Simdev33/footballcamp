import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const STORAGE_KEY = process.env.BUNNY_STORAGE_KEY!
const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!
const STORAGE_HOST = process.env.BUNNY_STORAGE_HOST || "https://storage.bunnycdn.com"
const CDN_URL = process.env.BUNNY_CDN_URL || "https://focis.b-cdn.net"

function getConfigError() {
  if (!process.env.BUNNY_STORAGE_KEY) return "Missing BUNNY_STORAGE_KEY"
  if (!process.env.BUNNY_STORAGE_ZONE) return "Missing BUNNY_STORAGE_ZONE"
  return null
}

function cleanBunnyPath(path: string) {
  return path
    .replace(/^\/+/, "")
    .replace(/\/{2,}/g, "/")
}

function encodeCdnPath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/")
}

async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}

export async function GET(req: NextRequest) {
  const denied = await requireAuth()
  if (denied) return denied

  const configError = getConfigError()
  if (configError) {
    return NextResponse.json({ error: configError }, { status: 500 })
  }

  const path = req.nextUrl.searchParams.get("path") || ""
  const cleanPath = cleanBunnyPath(path)

  const url = `${STORAGE_HOST}/${STORAGE_ZONE}/${cleanPath}`
  const res = await fetch(url, {
    headers: { AccessKey: STORAGE_KEY, Accept: "application/json" },
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Bunny API error", status: res.status }, { status: res.status })
  }

  const files = await res.json()
  const mapped = files
    .map((f: any) => ({
      name: String(f.ObjectName || "").replace(/\/+$/, ""),
      path: cleanBunnyPath(`${cleanPath}${f.ObjectName || ""}`),
      isDir: f.IsDirectory,
      size: f.Length,
      lastChanged: f.LastChanged,
      cdnUrl: f.IsDirectory ? null : `${CDN_URL}/${encodeCdnPath(cleanBunnyPath(`${cleanPath}${f.ObjectName || ""}`))}`,
    }))

  return NextResponse.json(mapped)
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
const MAX_SIZE = 4 * 1024 * 1024

export async function POST(req: NextRequest) {
  const denied = await requireAuth()
  if (denied) return denied

  const configError = getConfigError()
  if (configError) {
    return NextResponse.json({ error: configError }, { status: 500 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  const folder = (formData.get("folder") as string) || "uploads"

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "A kép túl nagy. Maximum 4 MB tölthető fel egyszerre." }, { status: 400 })
  }

  const cleanFolder = cleanBunnyPath(folder).replace(/\/+$/g, "")
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const timestamp = Date.now()
  const uploadName = `${timestamp}-${safeName}`
  const uploadPath = cleanFolder ? `${cleanFolder}/${uploadName}` : uploadName

  const buffer = await file.arrayBuffer()

  const res = await fetch(`${STORAGE_HOST}/${STORAGE_ZONE}/${uploadPath}`, {
    method: "PUT",
    headers: {
      AccessKey: STORAGE_KEY,
      "Content-Type": "application/octet-stream",
    },
    body: buffer,
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: "Upload failed", detail: text }, { status: res.status })
  }

  const cdnUrl = `${CDN_URL}/${uploadPath}`
  return NextResponse.json({ cdnUrl, path: uploadPath }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAuth()
  if (denied) return denied

  const configError = getConfigError()
  if (configError) {
    return NextResponse.json({ error: configError }, { status: 500 })
  }

  const path = req.nextUrl.searchParams.get("path")
  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 })
  }

  const cleanPath = cleanBunnyPath(path)
  const res = await fetch(`${STORAGE_HOST}/${STORAGE_ZONE}/${cleanPath}`, {
    method: "DELETE",
    headers: { AccessKey: STORAGE_KEY },
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Delete failed" }, { status: res.status })
  }

  return NextResponse.json({ ok: true })
}
