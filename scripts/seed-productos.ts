import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const cats = await prisma.categoria.findMany()
  const get = (nombre: string) => cats.find((c) => c.nombre === nombre)!.id

  const productos = [
    // Bebidas
    { nombre: "Coca-Cola 600ml", precio: 18, stock: 20, categoriaId: get("Bebidas") },
    { nombre: "Agua natural 1L", precio: 12, stock: 30, categoriaId: get("Bebidas") },
    { nombre: "Jugo de naranja 1L", precio: 28, stock: 15, categoriaId: get("Bebidas") },
    { nombre: "Café soluble 50g", precio: 35, stock: 10, categoriaId: get("Bebidas") },
    // Snacks
    { nombre: "Sabritas Original", precio: 20, stock: 25, categoriaId: get("Snacks") },
    { nombre: "Doritos Nacho", precio: 20, stock: 20, categoriaId: get("Snacks") },
    { nombre: "Galletas Marías", precio: 15, stock: 18, categoriaId: get("Snacks") },
    { nombre: "Chocolisto 200g", precio: 22, stock: 12, categoriaId: get("Snacks") },
    // Lácteos
    { nombre: "Leche entera 1L", precio: 24, stock: 15, categoriaId: get("Lácteos") },
    { nombre: "Yogurt natural 1kg", precio: 38, stock: 8, categoriaId: get("Lácteos") },
    { nombre: "Queso manchego 250g", precio: 55, stock: 6, categoriaId: get("Lácteos") },
    // Abarrotes
    { nombre: "Arroz 1kg", precio: 22, stock: 20, categoriaId: get("Abarrotes") },
    { nombre: "Frijoles negros 1kg", precio: 28, stock: 15, categoriaId: get("Abarrotes") },
    { nombre: "Aceite vegetal 1L", precio: 42, stock: 10, categoriaId: get("Abarrotes") },
    { nombre: "Sal 1kg", precio: 10, stock: 20, categoriaId: get("Abarrotes") },
    // Higiene
    { nombre: "Jabón de baño", precio: 18, stock: 15, categoriaId: get("Higiene") },
    { nombre: "Shampoo 400ml", precio: 52, stock: 8, categoriaId: get("Higiene") },
    { nombre: "Papel higiénico x4", precio: 38, stock: 12, categoriaId: get("Higiene") },
  ]

  for (const p of productos) {
    await prisma.producto.create({ data: p })
  }

  console.log(`✅ ${productos.length} productos creados`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
