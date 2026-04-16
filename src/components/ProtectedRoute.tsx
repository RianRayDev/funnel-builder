import { Navigate } from "react-router"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

const DEV_BYPASS = import.meta.env.DEV

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading && !DEV_BYPASS) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-app)]">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--text-tertiary)]" />
      </div>
    )
  }

  if (!user && !DEV_BYPASS) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}
