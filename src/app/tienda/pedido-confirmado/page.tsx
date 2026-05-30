import Link from "next/link"

export default async function PedidoConfirmadoPage({
  searchParams,
}: {
  searchParams: Promise<{ numero?: string }>
}) {
  const { numero } = await searchParams

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-sm w-full space-y-4">
        <div className="text-6xl">✅</div>
        <h1 className="text-xl font-bold text-gray-900">¡Pedido enviado!</h1>
        {numero && (
          <p className="text-gray-500 text-sm">
            Tu pedido <span className="font-bold text-gray-800">#{numero}</span> fue recibido y está siendo procesado.
          </p>
        )}
        <p className="text-xs text-gray-400">Te avisamos cuando esté listo.</p>
        <Link
          href="/tienda"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-2"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  )
}
