"use client"

import { useCarrito } from "@/components/CarritoProvider"
import Link from "next/link"

export default function BarraCarrito() {
  const { totalItems, total } = useCarrito()

  if (totalItems === 0) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-lg mx-auto safe-bottom">
      <Link
        href="/tienda/checkout"
        className="flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white px-5 py-4 rounded-2xl shadow-xl shadow-blue-300/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="bg-white text-blue-600 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
          <span className="text-sm font-semibold">Ver carrito</span>
        </div>
        <span className="text-sm font-bold">${total.toFixed(2)}</span>
      </Link>
    </div>
  )
}
