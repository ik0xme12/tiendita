"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

type EstadoPedido = "PENDIENTE" | "ACEPTADO" | "EN_PREPARACION" | "LISTO" | "ENTREGADO" | "CANCELADO"

async function verificarAdmin() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") throw new Error("No autorizado")
}

export async function actualizarEstadoPedido(pedidoId: string, estado: EstadoPedido) {
  await verificarAdmin()

  await prisma.pedido.update({
    where: { id: pedidoId },
    data: { estado },
  })

  // Si se cancela, devolver stock
  if (estado === "CANCELADO") {
    const detalles = await prisma.detallePedido.findMany({
      where: { pedidoId },
    })
    for (const d of detalles) {
      await prisma.producto.update({
        where: { id: d.productoId },
        data: { stock: { increment: d.cantidad } },
      })
    }
  }

  revalidatePath("/admin/pedidos")
  revalidatePath(`/admin/pedidos/${pedidoId}`)
}

export async function marcarPagado(pedidoId: string) {
  await verificarAdmin()
  await prisma.pago.update({
    where: { pedidoId },
    data: { estado: "PAGADO" },
  })
  revalidatePath(`/admin/pedidos/${pedidoId}`)
}
