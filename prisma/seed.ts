import { PrismaClient } from "@prisma/client"
import { hashAdminPassword } from "../lib/auth"

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: "admin@benficacamp.hu" } })
  if (existing) {
    console.log("Admin user already exists, skipping seed.")
    return
  }

  const seedPassword = process.env.ADMIN_SEED_PASSWORD
  if (!seedPassword || seedPassword.length < 12) {
    console.error(
      "ADMIN_SEED_PASSWORD környezeti változó kötelező (min. 12 karakter, kis- és nagybetű, szám).",
    )
    console.error("Példa: ADMIN_SEED_PASSWORD='ErősJelszó2026!' npx tsx prisma/seed.ts")
    process.exit(1)
  }

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@benficacamp.hu",
      password: hashAdminPassword(seedPassword),
      role: "super_admin",
    },
  })

  const campCount = await prisma.camp.count()
  if (campCount === 0) {
    await prisma.camp.createMany({
      data: [
        {
          slug: "szeged-2026",
          city: "Szeged",
          venue: "Szegedi Sportközpont",
          dates: "2026. július 7-11.",
          price: "159.000 Ft",
          totalSpots: 40,
          remainingSpots: 28,
          active: true,
        },
        {
          slug: "kecskemet-2026",
          city: "Kecskemét",
          venue: "Kecskeméti Futball Aréna",
          dates: "2026. július 14-18.",
          price: "159.000 Ft",
          totalSpots: 40,
          remainingSpots: 35,
          active: true,
        },
      ],
    })
  }

  console.log("Seed completed: admin user created.")
  console.log("Login: admin@benficacamp.hu + az ADMIN_SEED_PASSWORD értéke")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
