"use client"

import { useCarrito } from "@/components/CarritoProvider"
import { crearPedido } from "@/app/actions/pedidos"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, total, vaciar } = useCarrito()
  const router = useRouter()
  const [tipoEntrega, setTipoEntrega] = useState<"INMEDIATA" | "PROGRAMADA">("INMEDIATA")
  const [metodoPago, setMetodoPago] = useState<"EFECTIVO" | "TRANSFERENCIA" | "TARJETA">("EFECTIVO")
  const [notas, setNotas] = useState("")
  const [fechaEntrega, setFechaEntrega] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <p className="text-4xl mb-3">🛒</p>
        <p className="text-gray-600 font-medium">Tu carrito está vacío</p>
        <Link href="/tienda" className="mt-4 text-blue-600 font-semibold text-sm">← Volver a la tienda</Link>
      </div>
    )
  }

  async function handleConfirmar() {
    setCargando(true)
    setError("")
    try {
      await crearPedido(items, tipoEntrega, metodoPago, notas, fechaEntrega || undefined)
      vaciar()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al crear el pedido")
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-10 pb-16">
        <div className="max-w-lg mx-auto">
          <Link href="/tienda" className="text-blue-200 text-sm">← Tienda</Link>
          <h1 className="text-2xl font-bold text-white mt-1">Confirmar pedido</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8 pb-10 space-y-4">
        {/* Resumen de productos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Tu pedido</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item.productoId} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.nombre}</p>
                  <p className="text-xs text-gray-400">×{item.cantidad} · ${item.precio.toFixed(2)} c/u</p>
                </div>
                <p className="text-sm font-bold text-gray-800">${(item.precio * item.cantidad).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-gray-50 flex justify-between">
            <span className="text-sm font-semibold text-gray-700">Total</span>
            <span className="text-lg font-bold text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Tipo de entrega */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Entrega</h2>
          <div className="grid grid-cols-2 gap-2">
            {(["INMEDIATA", "PROGRAMADA"] as const).map((tipo) => (
              <button
                key={tipo}
                onClick={() => setTipoEntrega(tipo)}
                className={`py-3 rounded-xl text-sm font-medium border-2 transition-colors ${
                  tipoEntrega === tipo
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {tipo === "INMEDIATA" ? "⚡ Inmediata" : "📅 Programada"}
              </button>
            ))}
          </div>
          {tipoEntrega === "PROGRAMADA" && (
            <input
              type="datetime-local"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        {/* Método de pago */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Pago</h2>
          <div className="grid grid-cols-3 gap-2">
            {([
              { val: "EFECTIVO", label: "💵 Efectivo" },
              { val: "TRANSFERENCIA", label: "🏦 Transfer" },
              { val: "TARJETA", label: "💳 Tarjeta" },
            ] as const).map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setMetodoPago(val)}
                className={`py-3 rounded-xl text-xs font-medium border-2 transition-colors ${
                  metodoPago === val
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2">
          <h2 className="text-sm font-semibold text-gray-700">Notas (opcional)</h2>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={2}
            placeholder="Ej. dejar en la puerta, sin cebolla..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        <button
          onClick={handleConfirmar}
          disabled={cargando || (tipoEntrega === "PROGRAMADA" && !fechaEntrega)}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-colors shadow-md shadow-blue-200"
        >
          {cargando ? "Enviando pedido..." : `Pedir · $${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  )
}
