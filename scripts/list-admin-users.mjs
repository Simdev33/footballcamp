/**
 * Futtatás: npx node scripts/list-admin-users.mjs
 * Megmutatja, hogy az app .env DATABASE_URL-je alatt van-e User sor.
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
try {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, name: true },
  })
  console.log(`User sorok száma: ${users.length}`)
  users.forEach((u) => console.log(`  - ${u.email} (${u.role}) id=${u.id}`))
  if (users.length === 0) {
    console.log("\nÜres a User tábla. Futtasd: npx tsx prisma/seed.ts (vagy SQL a Supabase-ben).")
  }
} catch (e) {
  console.error("Prisma / DB hiba:", e.message)
  console.error("\nEllenőrizd a .env fájlban a DATABASE_URL-t és a DIRECT_URL-t.")
} finally {
  await prisma.$disconnect()
}
