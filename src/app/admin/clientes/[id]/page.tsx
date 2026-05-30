import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { toggleCliente, resetPassword } from "@/app/actions/clientes"

const estadoColor: Record<string, string> = {
  PENDIENTE: "text-amber-600",
  ACEPTADO: "text-blue-600",
  EN_PREPARACION: "text-purple-600",
  LISTO: "text-orange-600",
  ENTREGADO: "text-emerald-600",
  CANCELADO: "text-red-500",
}

const estadoLabel: Record<string, string> = {
  PENDIENTE: "Pendiente",
  ACEPTADO: "Aceptado",
  EN_PREPARACION: "Preparando",
  LISTO: "Listo",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
}

export default async function DetalleClientePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/tienda")

  const { id } = await params
  const cliente = await prisma.usuario.findUnique({
    where: { id, rol: "CLIENTE" },
    include: {
      pedidos: {
        orderBy: { creadoEn: "desc" },
        take: 10,
        include: { pago: { select: { metodo: true, estado: true } } },
      },
    },
  })

  if (!cliente) notFound()

  const totalGastado = cliente.pedidos
    .filter((p) => p.estado === "ENTREGADO")
    .reduce((s, p) => s + p.total, 0)

  const resetAction = resetPassword.bind(null, id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-10 pb-16">
        <div className="max-w-lg mx-auto flex items-start justify-between">
          <div>
            <Link href="/admin/clientes" className="text-blue-200 text-sm">← Clientes</Link>
            <h1 className="text-2xl font-bold text-white mt-1">{cliente.nombre}</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              Torre {cliente.torre} · Depto {cliente.departamento}
            </p>
          </div>
          <div className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full ${cliente.activo ? "bg-emerald-400/20 text-emerald-200" : "bg-red-400/20 text-red-200"}`}>
            {cliente.activo ? "Activo" : "Inactivo"}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8 pb-10 space-y-4">
        {/* Info y métricas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📱</span><span>{cliente.telefono}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>🏠</span><span>Torre {cliente.torre} · Depto {cliente.departamento}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📅</span>
              <span>Registrado el {new Date(cliente.creadoEn).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x border-t border-gray-50">
            <div className="px-4 py-3 text-center">
              <p className="text-xl font-bold text-gray-800">{cliente.pedidos.length}</p>
              <p className="text-xs text-gray-400">pedidos</p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-xl font-bold text-emerald-600">${totalGastado.toFixed(0)}</p>
              <p className="text-xs text-gray-400">total gastado</p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</p>
          </div>
          <div className="divide-y divide-gray-50">
            <form action={toggleCliente.bind(null, id, cliente.activo)}>
              <button type="submit" className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left hover:bg-gray-50 transition-colors ${cliente.activo ? "text-red-600" : "text-emerald-600"}`}>
                <span>{cliente.activo ? "🚫" : "✅"}</span>
                {cliente.activo ? "Desactivar cliente" : "Activar cliente"}
              </button>
            </form>
          </div>
        </div>

        {/* Reset contraseña */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cambiar contraseña</p>
          </div>
          <form action={resetAction} className="px-4 py-4 flex gap-3">
            <input
              name="password"
              type="text"
              required
              minLength={6}
              placeholder="Nueva contraseña"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
            >
              Guardar
            </button>
          </form>
        </div>

        {/* Historial de pedidos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Últimos pedidos</p>
          </div>
          {cliente.pedidos.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <p className="text-2xl mb-1">🛒</p>
              <p className="text-sm">Sin pedidos aún</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {cliente.pedidos.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/pedidos/${p.id}`}
                  className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors block"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">Pedido #{p.numero}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(p.creadoEn).toLocaleDateString("es", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-semibold ${estadoColor[p.estado]}`}>{estadoLabel[p.estado]}</p>
                    <p className="text-sm font-bold text-gray-800 mt-0.5">${p.total.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
