import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ClientesAdminPage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/tienda")

  const clientes = await prisma.usuario.findMany({
    where: { rol: "CLIENTE" },
    include: { _count: { select: { pedidos: true } } },
    orderBy: [{ torre: "asc" }, { departamento: "asc" }],
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-10 pb-16">
        <div className="max-w-lg mx-auto flex items-start justify-between">
          <div>
            <Link href="/admin" className="text-blue-200 text-sm">← Panel</Link>
            <h1 className="text-2xl font-bold text-white mt-1">Clientes</h1>
            <p className="text-blue-200 text-sm mt-0.5">{clientes.length} vecinos registrados</p>
          </div>
          <Link
            href="/admin/clientes/nuevo"
            className="mt-1 bg-white text-blue-600 font-semibold text-sm px-4 py-2 rounded-xl shadow"
          >
            + Nuevo
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8 pb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {clientes.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-3xl mb-2">👥</p>
              <p className="text-sm">Sin clientes aún.</p>
              <Link href="/admin/clientes/nuevo" className="mt-3 inline-block text-blue-600 font-medium text-sm">
                Registra el primero →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {clientes.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/clientes/${c.id}`}
                  className={`px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors block ${!c.activo ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                      {c.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{c.nombre}</p>
                      <p className="text-xs text-gray-400">
                        Torre {c.torre} · Depto {c.departamento}
                      </p>
                      <p className="text-xs text-gray-400">📱 {c.telefono}</p>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-bold text-gray-700">{c._count.pedidos}</p>
                    <p className="text-xs text-gray-400">pedidos</p>
                    {!c.activo && (
                      <span className="text-xs text-red-500 font-medium">Inactivo</span>
                    )}
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
