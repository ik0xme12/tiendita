"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"

export default function QrPedido({ pedidoId, numero }: { pedidoId: string; numero: number }) {
  const [abierto, setAbierto] = useState(false)
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/admin/pedidos/${pedidoId}`

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg">🔲</span>
        Ver código QR del pedido
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setAbierto(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-xs text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-bold text-gray-800">Pedido #{numero}</p>
            <p className="text-xs text-gray-400">Escanea para abrir este pedido</p>
            <div className="flex justify-center p-3 bg-white rounded-2xl border border-gray-100">
              <QRCodeSVG value={url} size={200} level="M" />
            </div>
            <button
              onClick={() => setAbierto(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
