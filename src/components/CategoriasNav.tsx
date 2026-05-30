"use client"

import { useEffect, useRef, useState } from "react"

type Categoria = { id: string; nombre: string }

export default function CategoriasNav({ categorias }: { categorias: Categoria[] }) {
  const [activa, setActiva] = useState(categorias[0]?.id ?? "")
  const navRef = useRef<HTMLDivElement>(null)

  // Detecta qué sección es visible con IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    categorias.forEach((cat) => {
      const el = document.getElementById(`cat-${cat.id}`)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiva(cat.id)
        },
        { rootMargin: "-40% 0px -50% 0px" }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [categorias])

  // Centra el tab activo en el scroll horizontal
  useEffect(() => {
    const nav = navRef.current
    const btn = nav?.querySelector(`[data-id="${activa}"]`) as HTMLElement
    if (nav && btn) {
      const offset = btn.offsetLeft - nav.clientWidth / 2 + btn.clientWidth / 2
      nav.scrollTo({ left: offset, behavior: "smooth" })
    }
  }, [activa])

  function irA(id: string) {
    setActiva(id)
    const el = document.getElementById(`cat-${id}`)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  return (
    <div
      ref={navRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3"
      style={{ scrollbarWidth: "none" }}
    >
      {categorias.map((cat) => (
        <button
          key={cat.id}
          data-id={cat.id}
          onClick={() => irA(cat.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            activa === cat.id
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {cat.nombre}
        </button>
      ))}
    </div>
  )
}
