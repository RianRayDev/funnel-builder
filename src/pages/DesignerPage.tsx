import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Puck } from "@measured/puck"
import "@measured/puck/puck.css"
import { motion } from "framer-motion"
import { ArrowLeft, Eye, Download, Save, Check, Loader2, Crown, CircleDot, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { puckConfig } from "@/lib/puck-config"
import { store } from "@/lib/store"
import { cn } from "@/lib/utils"
import type { Data } from "@measured/puck"
import type { Project } from "@/types"

type SaveState = "saved" | "saving" | "unsaved"

const statusMeta: Record<Project["status"], { label: string; icon: typeof CircleDot; color: string; bg: string }> = {
  building: { label: "Building", icon: CircleDot, color: "text-amber-500", bg: "bg-amber-50" },
  ready: { label: "Ready", icon: Rocket, color: "text-blue-500", bg: "bg-blue-50" },
  published: { label: "Live", icon: Check, color: "text-emerald-500", bg: "bg-emerald-50" },
}

export function DesignerPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const resolvedSlug = slug || "main"
  const [project, setProject] = useState(() => store.getBySlug(resolvedSlug))
  const [saveState, setSaveState] = useState<SaveState>("saved")
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!project) navigate("/funnel-builder", { replace: true })
  }, [project, navigate])

  // Cleanup save timer on unmount to prevent stale writes
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  const handleChange = useCallback(
    (data: Data) => {
      if (!project) return
      setSaveState("unsaved")
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        setSaveState("saving")
        store.update(project.id, { content: data })
        setProject(store.get(project.id))
        setTimeout(() => setSaveState("saved"), 400)
      }, 500)
    },
    [project],
  )

  function handleSave() {
    if (!project) return
    store.update(project.id, { content: project.content })
    setSaveState("saved")
  }

  function handleExportJSON() {
    if (!project) return
    const blob = new Blob([JSON.stringify(project.content, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `${project.slug}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  function toggleStatus() {
    if (!project) return
    const next: Record<string, Project["status"]> = { building: "ready", ready: "building" }
    const newStatus = next[project.status]
    if (!newStatus) return // Published can only be changed from production page
    store.update(project.id, { status: newStatus })
    setProject(store.get(project.id))
  }

  const previewSlug = project?.is_main ? "main" : project?.slug

  if (!project) return null

  const status = statusMeta[project.status]
  const StatusIcon = status.icon

  return (
    <div className="flex h-screen flex-col bg-[var(--background)]">
      {/* Toolbar */}
      <motion.header
        className="flex h-12 shrink-0 items-center justify-between border-b border-black/[0.06] bg-white/80 px-3 backdrop-blur-xl"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/funnel-builder")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-black/[0.06]" />
          <span className="text-[13px] font-semibold tracking-tight">{project.name}</span>
          {project.is_main && (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5">
              <Crown className="h-2.5 w-2.5 text-amber-500" />
              <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-600">Main</span>
            </span>
          )}
          <span className="ml-1 flex items-center gap-1 text-[12px]">
            {saveState === "saved" && <motion.span className="flex items-center gap-1 text-emerald-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Check className="h-3 w-3" /> Saved</motion.span>}
            {saveState === "saving" && <span className="flex items-center gap-1 text-[#1d1d1f]/40"><Loader2 className="h-3 w-3 animate-spin" /> Saving</span>}
            {saveState === "unsaved" && <span className="text-amber-500">Unsaved</span>}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Status toggle */}
          {project.status !== "published" && (
            <button
              onClick={toggleStatus}
              className={cn("flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[10px] font-semibold uppercase tracking-wider transition-all", status.bg, status.color)}
            >
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </button>
          )}
          {project.status === "published" && (
            <span className={cn("flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[10px] font-semibold uppercase tracking-wider", status.bg, status.color)}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
          )}

          <div className="h-4 w-px bg-black/[0.06]" />

          <span className="rounded-md bg-black/[0.04] px-2 py-0.5 font-mono text-[10px] text-[#1d1d1f]/40">
            /{project.is_main ? "" : project.slug}
          </span>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-[12px]" onClick={() => navigate(`/funnel-builder/preview/${previewSlug}`)}>
            <Eye className="h-3.5 w-3.5" /> Preview
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-[12px]" onClick={handleExportJSON}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <div className="h-4 w-px bg-black/[0.06]" />
          <Button size="sm" className="h-8 gap-1.5 text-[12px]" onClick={handleSave}>
            <Save className="h-3.5 w-3.5" /> Save
          </Button>
        </div>
      </motion.header>

      <div className="flex-1 overflow-hidden">
        <Puck
          config={puckConfig}
          data={project.content}
          onChange={handleChange}
          onPublish={handleSave}
          overrides={{
            header: () => <div style={{ display: "none" }} />,
            headerActions: () => <div style={{ display: "none" }} />,
          }}
        />
      </div>
    </div>
  )
}
