import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { actualizarEstadoPedido, marcarPagado } from "@/app/actions/pedidos-admin"
import QrPedido from "@/components/QrPedido"

const estadoColor: Record<string, string> = {
  PENDIENTE: "bg-amber-100 text-amber-700",
  ACEPTADO: "bg-blue-100 text-blue-700",
  EN_PREPARACION: "bg-purple-100 text-purple-700",
  LISTO: "bg-orange-100 text-orange-700",
  ENTREGADO: "bg-emerald-100 text-emerald-700",
  CANCELADO: "bg-red-100 text-red-700",
}

const estadoLabel: Record<string, string> = {
  PENDIENTE: "Pendiente",
  ACEPTADO: "Aceptado",
  EN_PREPARACION: "En preparación",
  LISTO: "Listo para entregar",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
}

// Siguientes estados posibles desde cada estado
const siguientes: Record<string, { estado: string; label: string; color: string }[]> = {
  PENDIENTE: [
    { estado: "ACEPTADO", label: "✅ Aceptar", color: "bg-blue-600 text-white" },
    { estado: "CANCELADO", label: "✕ Cancelar", color: "bg-red-100 text-red-700 border border-red-200" },
  ],
  ACEPTADO: [
    { estado: "EN_PREPARACION", label: "🍳 Preparando", color: "bg-purple-600 text-white" },
    { estado: "CANCELADO", label: "✕ Cancelar", color: "bg-red-100 text-red-700 border border-red-200" },
  ],
  EN_PREPARACION: [
    { estado: "LISTO", label: "🔔 Marcar listo", color: "bg-orange-500 text-white" },
  ],
  LISTO: [
    { estado: "ENTREGADO", label: "🏠 Entregado", color: "bg-emerald-600 text-white" },
  ],
  ENTREGADO: [],
  CANCELADO: [],
}

const metodoPagoLabel: Record<string, string> = {
  EFECTIVO: "💵 Efectivo",
  TRANSFERENCIA: "🏦 Transferencia",
  TARJETA: "💳 Tarjeta",
}

export default async function DetallePedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/tienda")

  const { id } = await params
  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: {
      usuario: true,
      detalles: { include: { producto: { select: { nombre: true } } } },
      pago: true,
    },
  })

  if (!pedido) notFound()

  const acciones = siguientes[pedido.estado] ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-10 pb-16">
        <div className="max-w-lg mx-auto">
          <Link href="/admin/pedidos" className="text-blue-200 text-sm">← Pedidos</Link>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold text-white">Pedido #{pedido.numero}</h1>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${estadoColor[pedido.estado]}`}>
              {estadoLabel[pedido.estado]}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8 pb-10 space-y-4">
        {/* Acciones de estado */}
        {acciones.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cambiar estado</p>
            <div className="flex gap-2 flex-wrap">
              {acciones.map((a) => (
                <form key={a.estado} action={actualizarEstadoPedido.bind(null, id, a.estado as never)}>
                  <button
                    type="submit"
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-75 ${a.color}`}
                  >
                    {a.label}
                  </button>
                </form>
              ))}
            </div>
          </div>
        )}

        {/* Info del cliente */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</p>
          </div>
          <div className="px-4 py-3 space-y-1">
            <p className="text-sm font-semibold text-gray-800">{pedido.usuario.nombre}</p>
            <p className="text-sm text-gray-500">
              Torre {pedido.usuario.torre} · Depto {pedido.usuario.departamento}
            </p>
            <p className="text-sm text-gray-500">📱 {pedido.usuario.telefono}</p>
          </div>
        </div>

        {/* Entrega */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Entrega</p>
          </div>
          <div className="px-4 py-3 space-y-1">
            <p className="text-sm font-medium text-gray-800">
              {pedido.tipoEntrega === "INMEDIATA" ? "⚡ Entrega inmediata" : "📅 Entrega programada"}
            </p>
            {pedido.entregaProgramada && (
              <p className="text-sm text-gray-500">
                {new Date(pedido.entregaProgramada).toLocaleString("es", {
                  weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
                })}
              </p>
            )}
            {pedido.notas && (
              <p className="text-sm text-gray-400 italic">"{pedido.notas}"</p>
            )}
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Productos</p>
          </div>
          <div className="divide-y divide-gray-50">
            {pedido.detalles.map((d) => (
              <div key={d.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{d.producto.nombre}</p>
                  <p className="text-xs text-gray-400">×{d.cantidad} · ${d.precio.toFixed(2)} c/u</p>
                </div>
                <p className="text-sm font-bold text-gray-800">${(d.precio * d.cantidad).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-gray-50 flex justify-between">
            <span className="text-sm font-semibold text-gray-700">Total</span>
            <span className="text-lg font-bold text-blue-600">${pedido.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Pago */}
        {pedido.pago && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pago</p>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {metodoPagoLabel[pedido.pago.metodo]}
                </p>
                <p className={`text-xs font-semibold mt-0.5 ${pedido.pago.estado === "PAGADO" ? "text-emerald-600" : "text-amber-600"}`}>
                  {pedido.pago.estado === "PAGADO" ? "✅ Pagado" : "⏳ Pendiente de pago"}
                </p>
              </div>
              {pedido.pago.estado !== "PAGADO" && (
                <form action={marcarPagado.bind(null, id)}>
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    Marcar pagado
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* QR del pedido */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <QrPedido pedidoId={id} numero={pedido.numero} />
        </div>

        {/* Fecha */}
        <p className="text-center text-xs text-gray-400">
          Pedido realizado el{" "}
          {new Date(pedido.creadoEn).toLocaleString("es", {
            weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  )
}
