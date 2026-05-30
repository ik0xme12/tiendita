import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { actualizarProducto } from "@/app/actions/productos"
import Link from "next/link"

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/tienda")

  const { id } = await params
  const [producto, categorias] = await Promise.all([
    prisma.producto.findUnique({ where: { id } }),
    prisma.categoria.findMany({ where: { activa: true }, orderBy: { nombre: "asc" } }),
  ])

  if (!producto) notFound()

  const action = actualizarProducto.bind(null, id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-10 pb-16">
        <div className="max-w-lg mx-auto">
          <Link href="/admin/productos" className="text-blue-200 text-sm">← Productos</Link>
          <h1 className="text-2xl font-bold text-white mt-1">Editar producto</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8 pb-10">
        <form action={action} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Nombre *</label>
            <input
              name="nombre"
              required
              defaultValue={producto.nombre}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              rows={2}
              defaultValue={producto.descripcion ?? ""}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Precio *</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-sm">$</span>
                <input
                  name="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={producto.precio}
                  className="w-full pl-7 pr-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Stock *</label>
              <input
                name="stock"
                type="number"
                min="0"
                required
                defaultValue={producto.stock}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Categoría *</label>
            <select
              name="categoriaId"
              required
              defaultValue={producto.categoriaId}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  )
}
