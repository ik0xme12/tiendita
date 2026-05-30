"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setCargando(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const result = await signIn("credentials", {
      telefono: form.get("telefono"),
      password: form.get("password"),
      redirect: false,
    })

    if (result?.error) {
      setError("Teléfono o contraseña incorrectos")
      setCargando(false)
      return
    }

    router.push("/tienda")
    router.refresh()
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800 p-4 safe-top safe-bottom">
      <div className="w-full max-w-sm">
        {/* Logo / Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 text-3xl">
            🛍️
          </div>
          <h1 className="text-3xl font-bold text-white">La Tiendita</h1>
          <p className="text-blue-200 mt-1 text-sm">Tu tienda del condominio</p>
        </div>

        {/* Tarjeta */}
        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Bienvenido</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-600">
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                required
                placeholder="555-123-4567"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white placeholder-gray-400"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white placeholder-gray-400"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm shadow-md shadow-blue-200"
            >
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
