import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash("admin123", 12)

  const admin = await prisma.usuario.upsert({
    where: { telefono: "0000000000" },
    update: {},
    create: {
      nombre: "Admin",
      telefono: "0000000000",
      password,
      rol: "ADMIN",
    },
  })

  console.log("✅ Usuario admin creado:")
  console.log("   Teléfono:", admin.telefono)
  console.log("   Contraseña: admin123")
  console.log("\n⚠️  Cambia la contraseña después de entrar por primera vez.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
