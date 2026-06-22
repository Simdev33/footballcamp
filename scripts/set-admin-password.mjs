/**
 * Admin jelszó csere.
 * Futtatás: node scripts/set-admin-password.mjs
 * Opcionális: node scripts/set-admin-password.mjs "SajatJelszo123"
 */
import { PrismaClient } from "@prisma/client"
import { hashSync } from "bcryptjs"
import crypto from "crypto"

const MIN_LENGTH = 12
const ADMIN_EMAIL = "admin@benficacamp.hu"

function validatePassword(password) {
  if (!password || password.length < MIN_LENGTH) {
    return `A jelszónak legalább ${MIN_LENGTH} karakter hosszúnak kell lennie.`
  }
  if (!/[a-z]/.test(password)) return "A jelszónak tartalmaznia kell kisbetűt."
  if (!/[A-Z]/.test(password)) return "A jelszónak tartalmaznia kell nagybetűt."
  if (!/[0-9]/.test(password)) return "A jelszónak tartalmaznia kell számot."
  return null
}

const password = process.argv[2] || crypto.randomBytes(16).toString("base64url")
const policyError = validatePassword(password)
if (policyError) {
  console.error("Jelszó nem elég erős:", policyError)
  process.exit(1)
}

const prisma = new PrismaClient()

try {
  const user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } })
  if (!user) {
    console.error(`Nincs ilyen felhasználó: ${ADMIN_EMAIL}`)
    process.exit(1)
  }

  await prisma.user.update({
    where: { email: ADMIN_EMAIL },
    data: { password: hashSync(password, 12) },
  })

  console.log(`Jelszó frissítve: ${ADMIN_EMAIL}`)
  console.log(`Új jelszó: ${password}`)
} finally {
  await prisma.$disconnect()
}
