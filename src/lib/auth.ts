import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authConfig } from "@/lib/auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        telefono: { label: "Teléfono" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.telefono || !credentials?.password) return null

        const usuario = await prisma.usuario.findUnique({
          where: { telefono: credentials.telefono as string },
        })

        if (!usuario || !usuario.activo) return null

        const passwordValido = await bcrypt.compare(
          credentials.password as string,
          usuario.password
        )

        if (!passwordValido) return null

        return {
          id: usuario.id,
          name: usuario.nombre,
          email: usuario.telefono,
          role: usuario.rol,
        }
      },
    }),
  ],
})
