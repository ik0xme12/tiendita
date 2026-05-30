"use client"

import { useCarrito } from "@/components/CarritoProvider"

type Props = {
  id: string
  nombre: string
  precio: number
  stock: number
  imagen: string | null
}

export default function ProductoCard({ id, nombre, precio, stock, imagen }: Props) {
  const { agregar, items } = useCarrito()
  const enCarrito = items.find((i) => i.productoId === id)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="h-28 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-4xl">
        {imagen ? (
          <img src={imagen} alt={nombre} className="h-full w-full object-cover" />
        ) : (
          "📦"
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-800 leading-tight line-clamp-2">{nombre}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-blue-600 font-bold text-base">${precio.toFixed(2)}</p>
          {enCarrito ? (
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
              ×{enCarrito.cantidad}
            </span>
          ) : null}
        </div>
        <button
          onClick={() => agregar({ productoId: id, nombre, precio })}
          disabled={stock === 0}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold py-2 rounded-xl transition-all"
        >
          {stock === 0 ? "Sin stock" : enCarrito ? "Agregar otro" : "Agregar"}
        </button>
      </div>
    </div>
  )
}
