/**
 * Galéria mappa (album) feltöltése egy lépésben.
 *
 * Mit csinál:
 *   1. feltölti a megadott könyvtár összes képét és videóját a Bunny Storage-ba
 *      a  gallery/<album-slug>/  mappába,
 *   2. a képekhez GalleryImage sorokat hoz létre az adatbázisban (category = album-slug),
 *      így azonnal megjelennek a weboldal Galéria fülén.
 *
 * A videót csak feltölti (nem kerül DB-be) – annak az URL-jét a
 * lib/gallery-albums.ts fájlban kell beállítani.
 *
 * Futtatás (a projekt gyökeréből):
 *   node scripts/upload-gallery-album.mjs benfica-algyo-2026 "C:/Users/.../web-optimalizalt/nagy"
 *
 * Csak feltöltés, DB írás nélkül:
 *   node scripts/upload-gallery-album.mjs benfica-algyo-2026 "..." --no-db
 *
 * Próbafuttatás (nem tölt fel semmit, csak kiírja mit tenne):
 *   node scripts/upload-gallery-album.mjs benfica-algyo-2026 "..." --dry-run
 *
 * Szükséges .env változók: BUNNY_STORAGE_KEY, BUNNY_STORAGE_ZONE, BUNNY_CDN_URL,
 * és DB íráshoz DATABASE_URL / DIRECT_URL.
 */
import { readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const [, , albumSlug, sourceDir, ...flags] = process.argv
const dryRun = flags.includes("--dry-run")
const skipDb = flags.includes("--no-db")

if (!albumSlug || !sourceDir) {
  console.error("Használat: node scripts/upload-gallery-album.mjs <album-slug> <könyvtár> [--dry-run] [--no-db]")
  process.exit(1)
}

// .env betöltése (Next.js nélkül futunk, ezért kézzel olvassuk be)
for (const envFile of [".env.local", ".env"]) {
  try {
    const raw = await readFile(envFile, "utf8")
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
      if (!match) continue
      const key = match[1]
      if (process.env[key]) continue
      process.env[key] = match[2].trim().replace(/^["']|["']$/g, "")
    }
  } catch {
    /* nincs ilyen fájl – nem baj */
  }
}

const STORAGE_KEY = process.env.BUNNY_STORAGE_KEY
const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE
const STORAGE_HOST = process.env.BUNNY_STORAGE_HOST || "https://storage.bunnycdn.com"
const CDN_URL = (process.env.BUNNY_CDN_URL || "https://focis.b-cdn.net").replace(/\/+$/, "")

if (!STORAGE_KEY || !STORAGE_ZONE) {
  console.error("Hiányzik a BUNNY_STORAGE_KEY vagy a BUNNY_STORAGE_ZONE a .env fájlból.")
  process.exit(1)
}

const IMAGE_RE = /\.(jpe?g|png|webp|avif)$/i
const VIDEO_RE = /\.(mp4|webm|mov)$/i

const entries = (await readdir(sourceDir))
  .filter((f) => IMAGE_RE.test(f) || VIDEO_RE.test(f))
  .sort((a, b) => a.localeCompare(b, "hu"))

if (entries.length === 0) {
  console.error(`Nincs feltölthető fájl itt: ${sourceDir}`)
  process.exit(1)
}

// Alapértelmezés: gallery/<album-slug>. Felülírható: --folder=gallery
const folderFlag = flags.find((f) => f.startsWith("--folder="))
const remoteFolder = (folderFlag ? folderFlag.slice("--folder=".length) : `gallery/${albumSlug}`)
  .replace(/^\/+|\/+$/g, "")
console.log(`Album:   ${albumSlug}`)
console.log(`Forrás:  ${sourceDir}`)
console.log(`Cél:     ${STORAGE_ZONE}/${remoteFolder}/`)
console.log(`Fájlok:  ${entries.length} db${dryRun ? "  (PRÓBAFUTTATÁS)" : ""}\n`)

const uploadedImages = []
const failures = []

for (let i = 0; i < entries.length; i++) {
  const name = entries[i]
  const localPath = path.join(sourceDir, name)
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const remotePath = `${remoteFolder}/${safeName}`
  const cdnUrl = `${CDN_URL}/${remotePath}`
  const size = (await stat(localPath)).size
  const label = `${String(i + 1).padStart(2, "0")}/${entries.length}  ${name}  (${(size / 1048576).toFixed(1)} MB)`

  if (dryRun) {
    console.log(`${label}  ->  ${cdnUrl}`)
    if (IMAGE_RE.test(name)) uploadedImages.push(cdnUrl)
    continue
  }

  try {
    const body = await readFile(localPath)
    const res = await fetch(`${STORAGE_HOST}/${STORAGE_ZONE}/${remotePath}`, {
      method: "PUT",
      headers: { AccessKey: STORAGE_KEY, "Content-Type": "application/octet-stream" },
      body,
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      failures.push(`${name} – HTTP ${res.status} ${detail}`)
      console.log(`${label}  ->  HIBA (${res.status})`)
      continue
    }
    console.log(`${label}  ->  OK`)
    if (IMAGE_RE.test(name)) uploadedImages.push(cdnUrl)
    else console.log(`     videó URL: ${cdnUrl}`)
  } catch (err) {
    failures.push(`${name} – ${err.message}`)
    console.log(`${label}  ->  HIBA (${err.message})`)
  }
}

console.log(`\nFeltöltve: ${entries.length - failures.length}/${entries.length}`)
if (failures.length > 0) {
  console.log("Sikertelen fájlok:")
  failures.forEach((f) => console.log(`  - ${f}`))
}

if (skipDb || dryRun || uploadedImages.length === 0) {
  if (skipDb) console.log("\n--no-db: az adatbázisba nem írtunk.")
  if (dryRun) console.log("\nPróbafuttatás volt, semmi nem történt.")
  process.exit(failures.length > 0 ? 1 : 0)
}

// ─── Adatbázis ───
const { PrismaClient } = await import("@prisma/client")
const prisma = new PrismaClient()
try {
  const existing = await prisma.galleryImage.findMany({
    where: { url: { in: uploadedImages } },
    select: { url: true },
  })
  const existingUrls = new Set(existing.map((e) => e.url))
  const newUrls = uploadedImages.filter((u) => !existingUrls.has(u))

  if (newUrls.length === 0) {
    console.log("\nMinden kép már szerepel az adatbázisban, nem adtunk hozzá újat.")
  } else {
    const last = await prisma.galleryImage.findFirst({
      where: { category: albumSlug },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    })
    const start = (last?.sortOrder ?? 0) + 1

    await prisma.galleryImage.createMany({
      data: newUrls.map((url, i) => ({
        url,
        alt: "",
        category: albumSlug,
        sortOrder: start + i,
      })),
    })
    console.log(`\n${newUrls.length} kép hozzáadva az adatbázishoz (kategória: ${albumSlug}).`)
    console.log(`Nézd meg: /galeria/${albumSlug}`)
  }
} catch (err) {
  console.error("\nAdatbázis hiba:", err.message)
  console.error("A fájlok feltöltődtek a Bunny-ra, de a DB sorok nem jöttek létre.")
  console.error("Ellenőrizd a DATABASE_URL / DIRECT_URL értékeket a .env fájlban.")
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
