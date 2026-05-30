import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { toggleProducto } from "@/app/actions/productos"

export default async function ProductosAdminPage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/tienda")

  const productos = await prisma.producto.findMany({
    include: { categoria: true },
    orderBy: [{ activo: "desc" }, { nombre: "asc" }],
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-10 pb-16">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-blue-200 text-sm">← Panel</Link>
            <h1 className="text-2xl font-bold text-white mt-1">Productos</h1>
          </div>
          <Link
            href="/admin/productos/nuevo"
            className="bg-white text-blue-600 font-semibold text-sm px-4 py-2 rounded-xl shadow"
          >
            + Nuevo
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8 pb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {productos.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-3xl mb-2">📦</p>
              <p className="text-sm">Sin productos. Agrega el primero.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {productos.map((p) => (
                <div key={p.id} className={`px-4 py-3 flex items-center justify-between ${!p.activo ? "opacity-50" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.nombre}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.categoria.nombre} · ${p.precio.toFixed(2)} · Stock: {p.stock}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Link
                      href={`/admin/productos/${p.id}/editar`}
                      className="text-xs text-blue-600 font-medium px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      Editar
                    </Link>
                    <form action={toggleProducto.bind(null, p.id, p.activo)}>
                      <button
                        type="submit"
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                          p.activo
                            ? "text-red-600 bg-red-50 hover:bg-red-100"
                            : "text-green-600 bg-green-50 hover:bg-green-100"
                        }`}
                      >
                        {p.activo ? "Pausar" : "Activar"}
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
