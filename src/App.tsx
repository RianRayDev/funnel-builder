import { Routes, Route } from "react-router"
import { LoginPage } from "./pages/LoginPage"
import { DashboardPage } from "./pages/DashboardPage"
import { DesignerPage } from "./pages/DesignerPage"
import { PreviewPage } from "./pages/PreviewPage"
import { ProductionPage } from "./pages/ProductionPage"
import { PublicFunnelPage } from "./pages/PublicFunnelPage"
import { ProtectedRoute } from "./components/ProtectedRoute"

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/auth" element={<LoginPage />} />

      {/* Builder — protected */}
      <Route path="/funnel-builder" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/funnel-builder/production" element={<ProtectedRoute><ProductionPage /></ProtectedRoute>} />
      <Route path="/funnel-builder/design/main" element={<ProtectedRoute><DesignerPage /></ProtectedRoute>} />
      <Route path="/funnel-builder/design/:slug" element={<ProtectedRoute><DesignerPage /></ProtectedRoute>} />
      <Route path="/funnel-builder/preview/main" element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />
      <Route path="/funnel-builder/preview/:slug" element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />

      {/* Public — published funnels */}
      <Route path="/" element={<PublicFunnelPage />} />
      <Route path="/:slug" element={<PublicFunnelPage />} />
    </Routes>
  )
}
