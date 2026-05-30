import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

const ESTADOS = ["TODOS", "PENDIENTE", "ACEPTADO", "EN_PREPARACION", "LISTO", "ENTREGADO", "CANCELADO"] as const

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

export default async function PedidosAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>
}) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/tienda")

  const { estado } = await searchParams
  const filtro = estado && estado !== "TODOS" ? estado : undefined

  const pedidos = await prisma.pedido.findMany({
    where: filtro ? { estado: filtro as never } : undefined,
    include: {
      usuario: { select: { nombre: true, torre: true, departamento: true } },
      pago: { select: { metodo: true, estado: true } },
    },
    orderBy: { creadoEn: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-10 pb-16">
        <div className="max-w-lg mx-auto flex items-start justify-between">
          <div>
            <Link href="/admin" className="text-blue-200 text-sm">← Panel</Link>
            <h1 className="text-2xl font-bold text-white mt-1">Pedidos</h1>
          </div>
          <Link
            href="/admin/scanner"
            className="mt-1 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1 transition-colors"
          >
            🔲 Escanear
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8 pb-10 space-y-4">
        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {ESTADOS.map((e) => {
              const activo = (e === "TODOS" && !filtro) || e === filtro
              return (
                <Link
                  key={e}
                  href={e === "TODOS" ? "/admin/pedidos" : `/admin/pedidos?estado=${e}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    activo
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {e === "TODOS" ? "Todos" : estadoLabel[e]}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Lista */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {pedidos.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-3xl mb-2">🛒</p>
              <p className="text-sm">Sin pedidos {filtro ? `con estado "${estadoLabel[filtro]}"` : ""}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {pedidos.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/pedidos/${p.id}`}
                  className="px-4 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors block"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">#{p.numero}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${estadoColor[p.estado]}`}>
                        {estadoLabel[p.estado]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{p.usuario.nombre}</p>
                    <p className="text-xs text-gray-400">
                      Torre {p.usuario.torre} · Depto {p.usuario.departamento} ·{" "}
                      {p.tipoEntrega === "INMEDIATA" ? "⚡ Inmediata" : "📅 Programada"}
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-bold text-gray-800">${p.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.pago ? p.pago.metodo.toLowerCase() : "—"}
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {new Date(p.creadoEn).toLocaleDateString("es", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
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
