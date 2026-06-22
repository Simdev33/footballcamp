/**
 * LoginRateLimit tábla létrehozása (ha még nincs).
 * Futtatás: node scripts/ensure-login-rate-limit-table.mjs
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

try {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "LoginRateLimit" (
      "key" TEXT NOT NULL,
      "failCount" INTEGER NOT NULL DEFAULT 0,
      "windowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "lockedUntil" TIMESTAMP(3),
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "LoginRateLimit_pkey" PRIMARY KEY ("key")
    );
  `)
  console.log("LoginRateLimit tábla OK.")
} catch (e) {
  console.error("Hiba:", e.message)
  process.exit(1)
} finally {
  await prisma.$disconnect()
}
