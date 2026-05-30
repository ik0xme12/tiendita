import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { crearCliente } from "@/app/actions/clientes"
import Link from "next/link"

export default async function NuevoClientePage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/tienda")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-10 pb-16">
        <div className="max-w-lg mx-auto">
          <Link href="/admin/clientes" className="text-blue-200 text-sm">← Clientes</Link>
          <h1 className="text-2xl font-bold text-white mt-1">Nuevo cliente</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8 pb-10">
        <form action={crearCliente} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Nombre completo *</label>
            <input
              name="nombre"
              required
              placeholder="Ej. María García"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Teléfono *</label>
            <input
              name="telefono"
              type="tel"
              required
              placeholder="Ej. 5551234567"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">Este será su usuario para iniciar sesión</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Torre *</label>
              <input
                name="torre"
                required
                placeholder="Ej. A"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Departamento *</label>
              <input
                name="departamento"
                required
                placeholder="Ej. 301"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Contraseña inicial *</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">Compártela con el cliente para que pueda entrar</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Registrar cliente
          </button>
        </form>
      </div>
    </div>
  )
}
