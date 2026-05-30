import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import EscanerQr from "@/components/EscanerQr"

export default async function ScannerPage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/tienda")

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="px-4 pt-10 pb-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/admin" className="text-gray-400 text-sm">← Panel</Link>
          <h1 className="text-base font-bold text-white">Escanear pedido</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-10 gap-6">
        <p className="text-gray-400 text-sm text-center">
          Apunta la cámara al código QR del pedido
        </p>
        <EscanerQr />
      </div>
    </div>
  )
}
