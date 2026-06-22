/**
 * Visszaállítás vandalizmus / illetéktelen admin módosítás után.
 *
 * Futtatás:
 *   node scripts/restore-site.mjs audit
 *   node scripts/restore-site.mjs restore-content
 *   node scripts/restore-site.mjs restore-camps
 *   node scripts/restore-site.mjs restore-all
 *
 * Előfeltétel: .env fájl a projekt gyökerében DATABASE_URL + DIRECT_URL értékekkel
 * (ugyanaz, amit Vercel / Supabase használ).
 */
import { PrismaClient } from "@prisma/client"

const VANDAL_MARKERS = [
  "juracsik",
  "40tb",
  "daniel 911",
  "vercel.app/admin",
]

const prisma = new PrismaClient()

function looksVandalized(text) {
  if (!text) return false
  const hay = String(text).toLowerCase()
  return VANDAL_MARKERS.some((m) => hay.includes(m))
}

function campLooksVandalized(camp) {
  const blob = JSON.stringify({
    city: camp.city,
    venue: camp.venue,
    dates: camp.dates,
    price: camp.price,
    description: camp.description,
    slug: camp.slug,
  })
  return looksVandalized(blob)
}

async function audit() {
  console.log("\n=== AUDIT ===\n")

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    orderBy: { createdAt: "asc" },
  })
  console.log(`Admin felhasználók (${users.length}):`)
  for (const u of users) {
    console.log(`  - ${u.email} (${u.role})  létrehozva: ${u.createdAt.toISOString()}`)
  }

  const siteRows = await prisma.siteContent.findMany({
    select: { section: true, locale: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  })
  console.log(`\nSiteContent felülírások (${siteRows.length}):`)
  for (const row of siteRows.slice(0, 30)) {
    console.log(`  - ${row.section}:${row.locale}  módosítva: ${row.updatedAt.toISOString()}`)
  }
  if (siteRows.length > 30) console.log(`  ... és még ${siteRows.length - 30} sor`)

  const camps = await prisma.camp.findMany({ orderBy: { createdAt: "asc" } })
  console.log(`\nTáborok (${camps.length}):`)
  for (const c of camps) {
    const flag = campLooksVandalized(c) ? " ⚠ VANDALIZÁLT" : ""
    console.log(`  - ${c.city} (${c.slug})  ${c.dates}  ${c.price}${flag}`)
  }

  const galleryCount = await prisma.galleryImage.count()
  const blogCount = await prisma.blogPost.count({ where: { published: true } })
  console.log(`\nGaléria képek: ${galleryCount}, publikált blog/hír: ${blogCount}`)
  console.log("\nA szövegek alapértelmezéshez: node scripts/restore-site.mjs restore-content")
  console.log("Gyanús táborok törléséhez: node scripts/restore-site.mjs restore-camps")
}

async function restoreContent() {
  const count = await prisma.siteContent.count()
  if (count === 0) {
    console.log("SiteContent már üres – a szövegek a kódbeli alapértelmezéseket használják.")
    return
  }

  const deleted = await prisma.siteContent.deleteMany()
  console.log(`Törölve ${deleted.count} SiteContent sor.`)
  console.log("A weboldal szövegei és képei visszaállnak a lib/i18n.ts és lib/site-images.ts alapértelmezéseire.")
  console.log("(A Next.js cache miatt 1-2 percig tarthat, amíg a Vercel újra renderel.)")
}

async function deleteCampWithApplications(campId, label) {
  const apps = await prisma.application.findMany({
    where: { campId },
    select: { id: true },
  })
  const appIds = apps.map((a) => a.id)
  if (appIds.length > 0) {
    await prisma.paymentEvent.deleteMany({ where: { applicationId: { in: appIds } } })
    await prisma.application.deleteMany({ where: { id: { in: appIds } } })
    console.log(`    ${appIds.length} jelentkezés törölve (${label})`)
  }
  await prisma.camp.delete({ where: { id: campId } })
}

async function restoreCamps() {
  const camps = await prisma.camp.findMany()
  const vandalized = camps.filter(campLooksVandalized)

  if (vandalized.length === 0) {
    console.log("Nem találtam vandalizált tábort (JURACSIK / 911 / admin URL minták alapján).")
    return
  }

  console.log(`${vandalized.length} gyanús tábor törlése:`)
  for (const c of vandalized) {
    console.log(`  - ${c.city} (${c.slug})`)
    await deleteCampWithApplications(c.id, c.city)
  }
  console.log("Kész. Az érintetlen táborok (pl. Algyő) megmaradtak.")
}

async function restoreAll() {
  await restoreContent()
  await restoreCamps()
  console.log("\n=== Visszaállítás kész ===")
  console.log("Ellenőrizd: https://kickoffcamps.hu")
  console.log("Admin biztonság: node scripts/list-admin-users.mjs")
}

const cmd = process.argv[2] || "audit"

try {
  if (cmd === "audit") await audit()
  else if (cmd === "restore-content") await restoreContent()
  else if (cmd === "restore-camps") await restoreCamps()
  else if (cmd === "restore-all") await restoreAll()
  else {
    console.error(`Ismeretlen parancs: ${cmd}`)
    console.error("Használat: audit | restore-content | restore-camps | restore-all")
    process.exit(1)
  }
} catch (e) {
  console.error("Hiba:", e.message)
  console.error("\nEllenőrizd a .env fájlban a DATABASE_URL és DIRECT_URL értékeket.")
  process.exit(1)
} finally {
  await prisma.$disconnect()
}
