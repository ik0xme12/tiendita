"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Html5Qrcode } from "html5-qrcode"

export default function EscanerQr() {
  const router = useRouter()
  const regionId = "qr-region"
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [error, setError] = useState("")
  const [escaneando, setEscaneando] = useState(false)

  useEffect(() => {
    const scanner = new Html5Qrcode(regionId)
    scannerRef.current = scanner

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (texto) => {
          // Valida que sea una URL de pedido de esta app
          const match = texto.match(/\/admin\/pedidos\/([a-z0-9]+)$/i)
          if (match) {
            scanner.stop().catch(() => {})
            router.push(`/admin/pedidos/${match[1]}`)
          } else {
            setError("QR no válido. Usa el QR de un pedido.")
          }
        },
        () => {}
      )
      .then(() => setEscaneando(true))
      .catch((e) => setError(`No se pudo acceder a la cámara: ${e}`))

    return () => {
      scanner.stop().catch(() => {})
    }
  }, [router])

  return (
    <div className="w-full max-w-sm space-y-4">
      {/* Visor de la cámara */}
      <div className="relative rounded-3xl overflow-hidden bg-black aspect-square">
        <div id={regionId} className="w-full h-full" />

        {/* Marco del escáner */}
        {escaneando && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-56 h-56 border-2 border-white/80 rounded-2xl relative">
              <span className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-xl" />
              <span className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-xl" />
              <span className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-xl" />
              <span className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-xl" />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-2xl text-center">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        Al escanear el QR de un pedido se abre automáticamente
      </p>
    </div>
  )
}
