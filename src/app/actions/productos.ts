"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function verificarAdmin() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") throw new Error("No autorizado")
}

export async function crearProducto(formData: FormData) {
  await verificarAdmin()

  const nombre = formData.get("nombre") as string
  const descripcion = formData.get("descripcion") as string
  const precio = parseFloat(formData.get("precio") as string)
  const stock = parseInt(formData.get("stock") as string)
  const categoriaId = formData.get("categoriaId") as string

  await prisma.producto.create({
    data: { nombre, descripcion, precio, stock, categoriaId },
  })

  revalidatePath("/admin/productos")
  revalidatePath("/tienda")
  redirect("/admin/productos")
}

export async function actualizarProducto(id: string, formData: FormData) {
  await verificarAdmin()

  const nombre = formData.get("nombre") as string
  const descripcion = formData.get("descripcion") as string
  const precio = parseFloat(formData.get("precio") as string)
  const stock = parseInt(formData.get("stock") as string)
  const categoriaId = formData.get("categoriaId") as string

  await prisma.producto.update({
    where: { id },
    data: { nombre, descripcion, precio, stock, categoriaId },
  })

  revalidatePath("/admin/productos")
  revalidatePath("/tienda")
  redirect("/admin/productos")
}

export async function toggleProducto(id: string, activo: boolean) {
  await verificarAdmin()
  await prisma.producto.update({ where: { id }, data: { activo: !activo } })
  revalidatePath("/admin/productos")
  revalidatePath("/tienda")
}

export async function crearCategoria(nombre: string) {
  await verificarAdmin()
  const cat = await prisma.categoria.create({ data: { nombre } })
  revalidatePath("/admin/productos")
  return cat
}
