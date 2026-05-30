import { auth } from "./src/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const rutasPublicas = ["/login"]
const rutasAdmin = ["/admin"]

export default async function proxy(req: NextRequest) {
  const session = await auth()
  const path = req.nextUrl.pathname

  const esPublica = rutasPublicas.some((r) => path.startsWith(r))
  const esAdmin = rutasAdmin.some((r) => path.startsWith(r))

  if (!session && !esPublica) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (session && esPublica) {
    const destino = session.user.role === "ADMIN" ? "/admin" : "/tienda"
    return NextResponse.redirect(new URL(destino, req.nextUrl))
  }

  if (esAdmin && session?.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/tienda", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
