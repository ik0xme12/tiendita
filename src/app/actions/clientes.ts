"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"

async function verificarAdmin() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") throw new Error("No autorizado")
}

export async function crearCliente(formData: FormData) {
  await verificarAdmin()

  const nombre = formData.get("nombre") as string
  const telefono = formData.get("telefono") as string
  const torre = formData.get("torre") as string
  const departamento = formData.get("departamento") as string
  const password = formData.get("password") as string

  const existe = await prisma.usuario.findUnique({ where: { telefono } })
  if (existe) throw new Error("Ya existe un usuario con ese teléfono")

  const hash = await bcrypt.hash(password, 12)

  await prisma.usuario.create({
    data: { nombre, telefono, torre, departamento, password: hash, rol: "CLIENTE" },
  })

  revalidatePath("/admin/clientes")
  redirect("/admin/clientes")
}

export async function toggleCliente(id: string, activo: boolean) {
  await verificarAdmin()
  await prisma.usuario.update({ where: { id }, data: { activo: !activo } })
  revalidatePath("/admin/clientes")
}

export async function resetPassword(id: string, formData: FormData) {
  await verificarAdmin()
  const password = formData.get("password") as string
  const hash = await bcrypt.hash(password, 12)
  await prisma.usuario.update({ where: { id }, data: { password: hash } })
  revalidatePath(`/admin/clientes/${id}`)
}
