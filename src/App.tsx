import { Routes, Route, Navigate } from "react-router"
import { LoginPage } from "./pages/LoginPage"
import { ResetPasswordPage } from "./pages/ResetPasswordPage"
import { DashboardPage } from "./pages/DashboardPage"
import { DesignerPage } from "./pages/DesignerPage"
import { PreviewPage } from "./pages/PreviewPage"
import { ProductionPage } from "./pages/ProductionPage"
import { PublicFunnelPage } from "./pages/PublicFunnelPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { ErrorBoundary } from "./components/ErrorBoundary"

export default function App() {
  return (
    <ErrorBoundary fallbackTitle="Something went wrong" showBack>
    <Routes>
      {/* Public funnel pages */}
      <Route path="/" element={<PublicFunnelPage />} />
      <Route path="/p/:slug" element={<PublicFunnelPage />} />

      {/* Auth */}
      <Route path="/auth" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Builder — protected */}
      <Route path="/funnel-builder" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/funnel-builder/production" element={<ProtectedRoute><ProductionPage /></ProtectedRoute>} />
      <Route path="/funnel-builder/design/main" element={<ProtectedRoute><DesignerPage /></ProtectedRoute>} />
      <Route path="/funnel-builder/design/:slug" element={<ProtectedRoute><DesignerPage /></ProtectedRoute>} />
      <Route path="/funnel-builder/preview/main" element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />
      <Route path="/funnel-builder/preview/:slug" element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </ErrorBoundary>
  )
}
