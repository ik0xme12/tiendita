import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const categorias = ["Bebidas", "Snacks", "Lácteos", "Abarrotes", "Higiene"]

  for (let i = 0; i < categorias.length; i++) {
    await prisma.categoria.upsert({
      where: { nombre: categorias[i] },
      update: {},
      create: { nombre: categorias[i], orden: i },
    })
  }

  console.log("✅ Categorías creadas:", categorias.join(", "))
}

main().catch(console.error).finally(() => prisma.$disconnect())
