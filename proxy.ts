import NextAuth from "next-auth"
import { authConfig } from "./src/lib/auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

const rutasPublicas = ["/login"]
const rutasAdmin = ["/admin"]

export default auth(function proxy(req: NextRequest) {
  const session = (req as NextRequest & { auth?: { user?: { role?: string } } }).auth
  const path = req.nextUrl.pathname

  const esPublica = rutasPublicas.some((r) => path.startsWith(r))
  const esAdmin = rutasAdmin.some((r) => path.startsWith(r))

  if (!session && !esPublica) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (session && esPublica) {
    const destino = session.user?.role === "ADMIN" ? "/admin" : "/tienda"
    return NextResponse.redirect(new URL(destino, req.nextUrl))
  }

  if (esAdmin && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/tienda", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
