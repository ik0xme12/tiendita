import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProductoCard from "@/components/ProductoCard"
import BarraCarrito from "@/components/BarraCarrito"
import BtnLogout from "@/components/BtnLogout"
import CategoriasNav from "@/components/CategoriasNav"

export default async function TiendaPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const categorias = await prisma.categoria.findMany({
    where: { activa: true },
    include: {
      productos: {
        where: { activo: true, stock: { gt: 0 } },
        orderBy: { nombre: "asc" },
      },
    },
    orderBy: { orden: "asc" },
  })

  const nombre = session.user.name?.split(" ")[0] ?? "Vecino"
  const catsConProductos = categorias.filter((c) => c.productos.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-10 pb-16 safe-top">
        <div className="max-w-lg mx-auto flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-sm">Hola, {nombre} 👋</p>
            <h1 className="text-2xl font-bold text-white mt-1">¿Qué necesitas hoy?</h1>
          </div>
          <BtnLogout className="mt-1 text-blue-200 hover:text-white text-sm transition-colors" />
        </div>
      </div>

      {/* Menú de categorías sticky */}
      {catsConProductos.length > 0 && (
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="max-w-lg mx-auto">
            <CategoriasNav categorias={catsConProductos.map((c) => ({ id: c.id, nombre: c.nombre }))} />
          </div>
        </div>
      )}

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-8">
        {catsConProductos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-gray-500 font-medium">Sin productos disponibles</p>
            <p className="text-gray-400 text-sm mt-1">Vuelve más tarde</p>
          </div>
        ) : (
          catsConProductos.map((cat) => (
            <section key={cat.id} id={`cat-${cat.id}`}>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">
                {cat.nombre}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {cat.productos.map((producto) => (
                  <ProductoCard
                    key={producto.id}
                    id={producto.id}
                    nombre={producto.nombre}
                    precio={producto.precio}
                    stock={producto.stock}
                    imagen={producto.imagen}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <BarraCarrito />
    </div>
  )
}
