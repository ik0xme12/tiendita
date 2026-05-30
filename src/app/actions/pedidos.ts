"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

type ItemCarrito = {
  productoId: string
  nombre: string
  precio: number
  cantidad: number
}

export async function crearPedido(
  items: ItemCarrito[],
  tipoEntrega: "INMEDIATA" | "PROGRAMADA",
  metodoPago: "EFECTIVO" | "TRANSFERENCIA" | "TARJETA",
  notas: string,
  entregaProgramada?: string
) {
  const session = await auth()
  if (!session) throw new Error("No autenticado")

  if (items.length === 0) throw new Error("El carrito está vacío")

  // Verificar stock de todos los productos
  const productosDB = await prisma.producto.findMany({
    where: { id: { in: items.map((i) => i.productoId) } },
  })

  for (const item of items) {
    const prod = productosDB.find((p) => p.id === item.productoId)
    if (!prod || prod.stock < item.cantidad) {
      throw new Error(`Stock insuficiente para: ${item.nombre}`)
    }
  }

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)

  const pedido = await prisma.pedido.create({
    data: {
      usuarioId: session.user.id,
      total,
      tipoEntrega,
      entregaProgramada: entregaProgramada ? new Date(entregaProgramada) : null,
      notas,
      detalles: {
        create: items.map((i) => ({
          productoId: i.productoId,
          cantidad: i.cantidad,
          precio: i.precio,
        })),
      },
      pago: {
        create: {
          metodo: metodoPago,
          monto: total,
        },
      },
    },
  })

  // Descontar stock
  for (const item of items) {
    await prisma.producto.update({
      where: { id: item.productoId },
      data: { stock: { decrement: item.cantidad } },
    })
  }

  revalidatePath("/tienda")
  redirect(`/tienda/pedido-confirmado?numero=${pedido.numero}`)
}
