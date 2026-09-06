import type { ReactNode } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
