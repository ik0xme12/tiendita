import { CarritoProvider } from "@/components/CarritoProvider"

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return <CarritoProvider>{children}</CarritoProvider>
}
