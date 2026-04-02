import { PrismaClient } from "@prisma/client"
import { hashSync } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: "admin@benficacamp.hu" } })
  if (existing) {
    console.log("Admin user already exists, skipping seed.")
    return
  }

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@benficacamp.hu",
      password: hashSync("admin123", 12),
      role: "super_admin",
    },
  })

  await prisma.camp.createMany({
    data: [
      {
        city: "Szeged",
        venue: "Szegedi Sportközpont",
        dates: "2026. július 7-11.",
        price: "159.000 Ft",
        earlyBirdPrice: "139.000 Ft",
        totalSpots: 40,
        remainingSpots: 28,
        active: true,
      },
      {
        city: "Kecskemét",
        venue: "Kecskeméti Futball Aréna",
        dates: "2026. július 14-18.",
        price: "159.000 Ft",
        earlyBirdPrice: "139.000 Ft",
        totalSpots: 40,
        remainingSpots: 35,
        active: true,
      },
    ],
  })

  console.log("Seed completed: admin user + 2 camps created.")
  console.log("Login: admin@benficacamp.hu / admin123")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
