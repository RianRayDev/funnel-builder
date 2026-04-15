import { Routes, Route, Navigate } from "react-router"
import { LoginPage } from "./pages/LoginPage"
import { DashboardPage } from "./pages/DashboardPage"
import { DesignerPage } from "./pages/DesignerPage"
import { PreviewPage } from "./pages/PreviewPage"
import { ProductionPage } from "./pages/ProductionPage"
import { ProtectedRoute } from "./components/ProtectedRoute"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/production" element={<ProtectedRoute><ProductionPage /></ProtectedRoute>} />
      <Route path="/design/main" element={<ProtectedRoute><DesignerPage /></ProtectedRoute>} />
      <Route path="/design/:slug" element={<ProtectedRoute><DesignerPage /></ProtectedRoute>} />
      <Route path="/preview/main" element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />
      <Route path="/preview/:slug" element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
