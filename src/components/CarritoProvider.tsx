"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

export type ItemCarrito = {
  productoId: string
  nombre: string
  precio: number
  cantidad: number
}

type CarritoContextType = {
  items: ItemCarrito[]
  agregar: (item: Omit<ItemCarrito, "cantidad">) => void
  quitar: (productoId: string) => void
  cambiarCantidad: (productoId: string, cantidad: number) => void
  vaciar: () => void
  total: number
  totalItems: number
}

const CarritoContext = createContext<CarritoContextType | null>(null)

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([])

  useEffect(() => {
    const guardado = localStorage.getItem("carrito")
    if (guardado) setItems(JSON.parse(guardado))
  }, [])

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(items))
  }, [items])

  const agregar = useCallback((item: Omit<ItemCarrito, "cantidad">) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.productoId === item.productoId)
      if (existe) {
        return prev.map((i) =>
          i.productoId === item.productoId ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      }
      return [...prev, { ...item, cantidad: 1 }]
    })
  }, [])

  const quitar = useCallback((productoId: string) => {
    setItems((prev) => prev.filter((i) => i.productoId !== productoId))
  }, [])

  const cambiarCantidad = useCallback((productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      setItems((prev) => prev.filter((i) => i.productoId !== productoId))
    } else {
      setItems((prev) =>
        prev.map((i) => (i.productoId === productoId ? { ...i, cantidad } : i))
      )
    }
  }, [])

  const vaciar = useCallback(() => setItems([]), [])

  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0)
  const totalItems = items.reduce((s, i) => s + i.cantidad, 0)

  return (
    <CarritoContext.Provider value={{ items, agregar, quitar, cambiarCantidad, vaciar, total, totalItems }}>
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  const ctx = useContext(CarritoContext)
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider")
  return ctx
}
