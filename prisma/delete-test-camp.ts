import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const camps = await prisma.camp.findMany({
    select: { id: true, city: true, slug: true, description: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  })

  console.log("\nJelenlegi táborok:")
  for (const c of camps) {
    console.log(`  - ${c.id}  |  city=${c.city}  slug=${c.slug}`)
    console.log(`    description=${JSON.stringify(c.description).slice(0, 120)}`)
  }

  // Heuristic: match "teszt" / "placeholder" in city, slug, or title JSON.
  const looksLikeTest = camps.filter((c) => {
    const hay = `${c.city} ${c.slug} ${JSON.stringify(c.description)}`.toLowerCase()
    return hay.includes("teszt") || hay.includes("placeholder") || hay.includes("test")
  })

  if (looksLikeTest.length === 0) {
    console.log("\nNem talaltam teszt taborokat.")
    return
  }

  console.log(`\nToroles ${looksLikeTest.length} taborra:`)
  for (const c of looksLikeTest) {
    console.log(`  - ${c.id}  city=${c.city} slug=${c.slug}`)
  }

  for (const c of looksLikeTest) {
    // Delete child records first to avoid FK errors.
    const apps = await prisma.application.findMany({ where: { campId: c.id }, select: { id: true } })
    const appIds = apps.map((a) => a.id)
    if (appIds.length > 0) {
      await prisma.paymentEvent.deleteMany({ where: { applicationId: { in: appIds } } })
      await prisma.application.deleteMany({ where: { id: { in: appIds } } })
      console.log(`    torolve ${appIds.length} jelentkezes (+ payment events)`)
    }
    await prisma.camp.delete({ where: { id: c.id } })
    console.log(`    torolve tabor: ${c.city}`)
  }

  console.log("\nKesz.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
