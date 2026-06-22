/**
 * Támadó admin törlése + új super_admin létrehozása.
 * Futtatás: node scripts/reset-admin-user.mjs
 */
import { PrismaClient } from "@prisma/client"
import { hashSync } from "bcryptjs"
import crypto from "crypto"

const ATTACKER_EMAIL = "Ciganyvagyok12312412@gmail.com"
const ADMIN_EMAIL = "admin@benficacamp.hu"

const prisma = new PrismaClient()

try {
  const removed = await prisma.user.deleteMany({ where: { email: ATTACKER_EMAIL } })
  console.log(`Törölve támadó fiók: ${removed.count}`)

  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } })
  if (existing) {
    console.log(`${ADMIN_EMAIL} már létezik – jelszót nem írtunk felül.`)
  } else {
    const password = crypto.randomBytes(12).toString("base64url")
    await prisma.user.create({
      data: {
        name: "Admin",
        email: ADMIN_EMAIL,
        password: hashSync(password, 12),
        role: "super_admin",
      },
    })
    console.log(`Új admin létrehozva: ${ADMIN_EMAIL}`)
    console.log(`Ideiglenes jelszó (mentsd el, aztán cseréld): ${password}`)
  }

  const users = await prisma.user.findMany({
    select: { email: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  })
  console.log("\nMaradék felhasználók:")
  for (const u of users) console.log(`  - ${u.email} (${u.role})`)
} finally {
  await prisma.$disconnect()
}
