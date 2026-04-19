import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Render } from "@measured/puck"
import { motion } from "framer-motion"
import { ArrowLeft, Pencil, Crown, Monitor, Tablet, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { puckConfig } from "@/lib/puck-config"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { store } from "@/lib/store"

export function PreviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const resolvedSlug = slug || "main"
  const [project] = useState(() => store.getBySlug(resolvedSlug))
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const viewportWidths: Record<typeof viewport, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  }

  useEffect(() => {
    if (!project) navigate("/funnel-builder", { replace: true })
  }, [project, navigate])

  if (!project) return null

  const designSlug = project.is_main ? "main" : project.slug

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Preview banner */}
      <motion.div
        className="sticky top-0 z-50 flex h-10 items-center justify-between border-b border-black/[0.06] bg-white/90 px-4 backdrop-blur-lg"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Left cluster */}
        <div className="flex items-center gap-2.5">
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[12px]" onClick={() => navigate("/funnel-builder")}>
            <ArrowLeft className="h-3 w-3" /> Dashboard
          </Button>
          <div className="h-3.5 w-px bg-black/[0.06]" />
          <span className="text-[12px] text-[#1d1d1f]/40">Preview</span>
          <span className="text-[12px] font-medium text-[#1d1d1f]/60">{project.name}</span>
          {project.is_main && (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5">
              <Crown className="h-2 w-2 text-amber-500" />
              <span className="text-[8px] font-semibold uppercase tracking-wider text-amber-600">Main</span>
            </span>
          )}
          <span className="rounded-md bg-black/[0.04] px-2 py-0.5 font-mono text-[10px] text-[#1d1d1f]/30">
            /{project.is_main ? "" : project.slug}
          </span>
        </div>

        {/* Center — viewport segmented control (absolute so it's truly centered) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5 rounded-lg bg-black/[0.04] p-0.5">
          {[
            { value: "desktop", icon: Monitor, label: "Desktop" },
            { value: "tablet", icon: Tablet, label: "Tablet" },
            { value: "mobile", icon: Smartphone, label: "Mobile" },
          ].map((opt) => {
            const Icon = opt.icon
            const active = viewport === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                title={opt.label}
                onClick={() => setViewport(opt.value as typeof viewport)}
                className={cn(
                  "flex h-6 w-7 items-center justify-center rounded-md transition-all",
                  active
                    ? "bg-white shadow-sm text-[#1d1d1f]"
                    : "text-[#1d1d1f]/40 hover:text-[#1d1d1f]/70"
                )}
              >
                <Icon className="h-3 w-3" />
              </button>
            )
          })}
        </div>

        {/* Right — Edit button */}
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[12px]" onClick={() => navigate(`/funnel-builder/design/${designSlug}`)}>
          <Pencil className="h-3 w-3" /> Edit
        </Button>
      </motion.div>

      {/* Viewport frame */}
      <div className="flex justify-center bg-[#f5f5f7]">
        <motion.div
          layout
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white shadow-sm funnel-viewport"
          style={{ width: viewportWidths[viewport], maxWidth: "100%" }}
        >
          <ErrorBoundary fallbackTitle="Preview failed to render" showBack>
            <Render config={puckConfig} data={project.content} />
          </ErrorBoundary>
        </motion.div>
      </div>
    </div>
  )
}
