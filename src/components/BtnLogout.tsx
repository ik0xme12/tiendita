"use client"

import { signOut } from "next-auth/react"

export default function BtnLogout({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={className}
    >
      Salir
    </button>
  )
}
