import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import SessionProvider from "@/components/SessionProvider"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
  title: "La Tiendita",
  description: "Tu tienda del condominio",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "La Tiendita",
  },
}

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",   // respeta el notch en iPhone
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable}`}>
      <body className="bg-gray-50 font-sans antialiased min-h-dvh">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
