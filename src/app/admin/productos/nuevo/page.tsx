import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { crearProducto } from "@/app/actions/productos"
import Link from "next/link"

export default async function NuevoProductoPage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/tienda")

  const categorias = await prisma.categoria.findMany({ where: { activa: true }, orderBy: { nombre: "asc" } })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-10 pb-16">
        <div className="max-w-lg mx-auto">
          <Link href="/admin/productos" className="text-blue-200 text-sm">← Productos</Link>
          <h1 className="text-2xl font-bold text-white mt-1">Nuevo producto</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8 pb-10">
        <form action={crearProducto} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Nombre *</label>
            <input
              name="nombre"
              required
              placeholder="Ej. Coca-Cola 600ml"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              rows={2}
              placeholder="Descripción opcional"
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
                  placeholder="0.00"
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
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Categoría *</label>
            {categorias.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
                No hay categorías. <Link href="/admin/categorias" className="font-semibold underline">Crea una primero</Link>.
              </div>
            ) : (
              <select
                name="categoriaId"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Guardar producto
          </button>
        </form>
      </div>
    </div>
  )
}
