import { Routes, Route, Navigate } from "react-router"
import { LoginPage } from "./pages/LoginPage"
import { ResetPasswordPage } from "./pages/ResetPasswordPage"
import { DashboardPage } from "./pages/DashboardPage"
import { DesignerPage } from "./pages/DesignerPage"
import { PreviewPage } from "./pages/PreviewPage"
import { ProductionPage } from "./pages/ProductionPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { ErrorBoundary } from "./components/ErrorBoundary"

export default function App() {
  return (
    <ErrorBoundary fallbackTitle="Something went wrong" showBack>
    <Routes>
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

      {/* Root redirects to builder */}
      <Route path="/" element={<Navigate to="/funnel-builder" replace />} />
      <Route path="*" element={<Navigate to="/funnel-builder" replace />} />
    </Routes>
    </ErrorBoundary>
  )
}
