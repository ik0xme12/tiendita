import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import BtnLogout from "@/components/BtnLogout"

export default async function AdminPage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/tienda")

  const [totalProductos, totalPedidos, pedidosPendientes, totalClientes] = await Promise.all([
    prisma.producto.count({ where: { activo: true } }),
    prisma.pedido.count(),
    prisma.pedido.count({ where: { estado: "PENDIENTE" } }),
    prisma.usuario.count({ where: { rol: "CLIENTE", activo: true } }),
  ])

  const pedidosRecientes = await prisma.pedido.findMany({
    take: 5,
    orderBy: { creadoEn: "desc" },
    include: { usuario: { select: { nombre: true, torre: true, departamento: true } } },
  })

  const estadoColor: Record<string, string> = {
    PENDIENTE: "bg-amber-100 text-amber-700 border-amber-200",
    ACEPTADO: "bg-blue-100 text-blue-700 border-blue-200",
    EN_PREPARACION: "bg-purple-100 text-purple-700 border-purple-200",
    LISTO: "bg-orange-100 text-orange-700 border-orange-200",
    ENTREGADO: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CANCELADO: "bg-red-100 text-red-700 border-red-200",
  }

  const estadoLabel: Record<string, string> = {
    PENDIENTE: "Pendiente",
    ACEPTADO: "Aceptado",
    EN_PREPARACION: "Preparando",
    LISTO: "Listo",
    ENTREGADO: "Entregado",
    CANCELADO: "Cancelado",
  }

  const metricas = [
    { label: "Productos", value: totalProductos, emoji: "📦", color: "from-blue-500 to-blue-600" },
    { label: "Clientes", value: totalClientes, emoji: "👥", color: "from-emerald-500 to-emerald-600" },
    { label: "Pedidos", value: totalPedidos, emoji: "🛒", color: "from-purple-500 to-purple-600" },
    { label: "Pendientes", value: pedidosPendientes, emoji: "⏳", color: "from-amber-500 to-amber-600" },
  ]

  const accesos = [
    { label: "Pedidos", href: "/admin/pedidos", emoji: "🛒", desc: "Gestionar pedidos" },
    { label: "Escanear QR", href: "/admin/scanner", emoji: "🔲", desc: "Abrir pedido por QR" },
    { label: "Productos", href: "/admin/productos", emoji: "📦", desc: "Catálogo y precios" },
    { label: "Clientes", href: "/admin/clientes", emoji: "👥", desc: "Vecinos registrados" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-10 pb-16 safe-top">
        <div className="max-w-lg mx-auto flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-sm">Panel de administración</p>
            <h1 className="text-2xl font-bold text-white mt-1">La Tiendita 🛍️</h1>
          </div>
          <BtnLogout className="mt-1 text-blue-200 hover:text-white text-sm transition-colors" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8 space-y-5 pb-10">
        {/* Métricas */}
        <div className="grid grid-cols-2 gap-3">
          {metricas.map((m) => (
            <div key={m.label} className={`bg-gradient-to-br ${m.color} rounded-2xl p-4 text-white shadow-md`}>
              <span className="text-2xl">{m.emoji}</span>
              <p className="text-3xl font-bold mt-2">{m.value}</p>
              <p className="text-white/80 text-xs mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Accesos rápidos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Acceso rápido</h2>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-gray-50">
            {accesos.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="p-4 flex flex-col gap-1 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">{a.emoji}</span>
                <span className="text-sm font-medium text-gray-800 mt-1">{a.label}</span>
                <span className="text-xs text-gray-400">{a.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Pedidos recientes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Pedidos recientes</h2>
            <Link href="/admin/pedidos" className="text-xs text-blue-600 font-medium">Ver todos</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {pedidosRecientes.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p className="text-3xl mb-2">🛒</p>
                <p className="text-sm">Sin pedidos aún</p>
              </div>
            ) : (
              pedidosRecientes.map((pedido) => (
                <div key={pedido.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      #{pedido.numero} · {pedido.usuario.nombre}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Torre {pedido.usuario.torre} — Depto {pedido.usuario.departamento}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${estadoColor[pedido.estado]}`}>
                      {estadoLabel[pedido.estado]}
                    </span>
                    <p className="text-sm font-bold text-gray-800">${pedido.total.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
