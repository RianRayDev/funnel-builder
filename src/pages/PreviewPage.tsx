import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Render } from "@measured/puck"
import { motion } from "framer-motion"
import { ArrowLeft, Pencil, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { puckConfig } from "@/lib/puck-config"
import { store } from "@/lib/store"

export function PreviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const resolvedSlug = slug || "main"
  const [project] = useState(() => store.getBySlug(resolvedSlug))

  useEffect(() => {
    if (!project) navigate("/funnel-builder", { replace: true })
  }, [project, navigate])

  if (!project) return null

  const designSlug = project.is_main ? "main" : project.slug

  return (
    <div className="min-h-screen bg-white">
      {/* Preview banner */}
      <motion.div
        className="sticky top-0 z-50 flex h-10 items-center justify-between border-b border-black/[0.06] bg-white/90 px-4 backdrop-blur-lg"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
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
            domain.com{project.is_main ? "" : `/${project.slug}`}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[12px]" onClick={() => navigate(`/funnel-builder/design/${designSlug}`)}>
          <Pencil className="h-3 w-3" /> Edit
        </Button>
      </motion.div>

      <div>
        <Render config={puckConfig} data={project.content} />
      </div>
    </div>
  )
}
