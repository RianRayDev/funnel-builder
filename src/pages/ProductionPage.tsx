import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import {
  ArrowLeft, Globe, Download, Check, Clock,
  Copy, Crown, Layers, ArrowUpRight, CircleDot,
  Pencil, Rocket, ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { store } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import type { Project } from "@/types"

export function ProductionPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState(() => store.list())
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    supabase.from("projects").select("*").then(({ data: rows }) => {
      if (!rows) return
      for (const row of rows) {
        const local = store.get(row.id)
        if (local) {
          if (local.status !== row.status || local.is_main !== row.is_main) {
            store.update(row.id, { status: row.status as any, is_main: row.is_main })
          }
        } else {
          const content = typeof row.content === "string" ? JSON.parse(row.content) : row.content
          const all = store.list()
          const raw = JSON.parse(localStorage.getItem("funnel-builder-projects") || "[]")
          raw.push({ id: row.id, name: row.name, slug: row.slug, status: row.status, is_main: row.is_main, thumbnail_url: null, content, pending_by: row.pending_by, created_at: row.created_at, updated_at: row.updated_at })
          localStorage.setItem("funnel-builder-projects", JSON.stringify(raw))
        }
      }
      setProjects(store.list())
    })
  }, [])

  const published = projects.filter((p) => p.status === "published")
  const ready = projects.filter((p) => p.status === "ready")
  const building = projects.filter((p) => p.status === "building")

  function refresh() { setProjects(store.list()) }

  function handleExport(project: Project) {
    const blob = new Blob([JSON.stringify(project.content, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = `${project.slug}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  function handleCopy(project: Project) {
    navigator.clipboard.writeText(JSON.stringify(project.content, null, 2))
    setCopied(project.id)
    setTimeout(() => setCopied(null), 2000)
  }

  async function handlePublishToSite(id: string) {
    const project = store.get(id)
    if (!project) return
    await supabase.from("projects").update({ is_main: false }).eq("is_main", true)
    const { error } = await supabase.from("projects").upsert({
      id: project.id,
      name: project.name,
      slug: project.slug,
      status: "published",
      content: project.content,
      pending_by: (project as any).pending_by || null,
      is_main: true,
      created_at: project.created_at,
      updated_at: new Date().toISOString(),
    })
    if (error) { console.error("[Supabase] Publish failed:", error.message); alert("Publish failed: " + error.message); return }
    store.update(id, { status: "published", is_main: true })
    projects.filter((p) => p.id !== id && p.is_main).forEach((p) => store.update(p.id, { is_main: false }))
    refresh()
  }

  function handleUnpublish(id: string) { store.update(id, { status: "ready" }); refresh() }

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border-default)]" style={{ background: "rgba(245,245,247,0.8)", backdropFilter: "blur(20px) saturate(150%)" }}>
        <div className="mx-auto flex h-14 max-w-[960px] items-center gap-3 px-6">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/funnel-builder")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-[var(--border-default)]" />
          <span className="text-[var(--text-md)] font-semibold tracking-tight">Production</span>
        </div>
      </header>

      <main className="mx-auto max-w-[960px] px-6 py-10">
        {/* Workflow */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[var(--text-sm)] font-medium uppercase tracking-[0.12em] text-[var(--text-tertiary)]">Deployment workflow</p>
          <div className="mt-4 flex items-center gap-2">
            {["Set as Pending", "Review in Preview", "Publish to Site", "Live at /"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="h-3 w-3 text-[var(--text-tertiary)]" />}
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-inset)] text-[10px] font-bold text-[var(--text-secondary)]">{i + 1}</span>
                  <span className="text-[var(--text-sm)] font-medium text-[var(--text-secondary)]">{step}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live */}
        <Section
          icon={<CircleDot className="h-4 w-4 text-red-500" />}
          title="Live"
          count={published.length}
          countClass="bg-red-50 text-red-600"
          emptyIcon={<Globe className="mx-auto mb-3 h-8 w-8 text-[var(--text-tertiary)]" />}
          emptyText="No live funnels — publish from Ready to Deploy"
          titleClass="text-red-600"
        >
          {published.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} variant="published">
              <span className="flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Live at /
              </span>
              <Button variant="ghost" size="sm" onClick={() => window.open("/", "_blank")}>
                <ArrowUpRight className="h-3.5 w-3.5" /> View Site
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(p)}>
                {copied === p.id ? <Check className="h-3.5 w-3.5 text-red-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied === p.id ? "Copied" : "JSON"}
              </Button>
              <div className="ml-1 h-4 w-px bg-red-200" />
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleUnpublish(p.id)}>
                Unpublish
              </Button>
            </ProjectRow>
          ))}
        </Section>

        {/* Ready */}
        <Section
          icon={<Rocket className="h-4 w-4 text-[var(--status-preview-text)]" />}
          title="Ready to Deploy"
          count={ready.length}
          countClass="bg-[var(--status-preview-bg)] text-[var(--status-preview-text)]"
          emptyIcon={<Layers className="mx-auto mb-3 h-8 w-8 text-[var(--text-tertiary)]" />}
          emptyText="No funnels ready — mark funnels as Ready in the editor"
        >
          {ready.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} variant="ready">
              <Button variant="ghost" size="sm" onClick={() => navigate(`/funnel-builder/preview/${p.is_main ? "main" : p.slug}`)}>
                <ArrowUpRight className="h-3.5 w-3.5" /> Preview
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(p)}>
                {copied === p.id ? <Check className="h-3.5 w-3.5 text-[var(--status-live-text)]" /> : <Copy className="h-3.5 w-3.5" />}
                {copied === p.id ? "Copied" : "JSON"}
              </Button>
              <Button size="sm" className="gap-1.5" onClick={() => handleExport(p)}>
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
              <div className="ml-1 h-4 w-px bg-[var(--border-default)]" />
              <Button size="sm" className="gap-1.5 bg-red-500 hover:bg-red-600 text-white" onClick={() => handlePublishToSite(p.id)}>
                <Rocket className="h-3.5 w-3.5" /> Publish to Site
              </Button>
            </ProjectRow>
          ))}
        </Section>

        {/* Building */}
        <Section
          icon={<Clock className="h-4 w-4 text-[var(--status-draft-text)]" />}
          title="Building"
          count={building.length}
          countClass="bg-[var(--status-draft-bg)] text-[var(--status-draft-text)]"
          emptyIcon={<Check className="mx-auto mb-3 h-8 w-8 text-[var(--status-live-text)]" />}
          emptyText="All funnels are ready or published"
          last
        >
          {building.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} variant="building">
              <Button variant="ghost" size="sm" onClick={() => navigate(`/funnel-builder/design/${p.is_main ? "main" : p.slug}`)}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleExport(p)}>
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
            </ProjectRow>
          ))}
        </Section>
      </main>
    </div>
  )
}

function Section({ icon, title, count, countClass, emptyIcon, emptyText, children, last, titleClass }: {
  icon: React.ReactNode; title: string; count: number; countClass: string
  emptyIcon: React.ReactNode; emptyText: string; children: React.ReactNode; last?: boolean; titleClass?: string
}) {
  return (
    <section className={last ? "" : "mb-10"}>
      <div className="mb-4 flex items-center gap-2.5">
        {icon}
        <h2 className={`text-[var(--text-base)] font-semibold ${titleClass || "text-[var(--text-primary)]"}`}>{title}</h2>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${countClass}`}>{count}</span>
      </div>
      {count === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] py-12 text-center">
          {emptyIcon}
          <p className="text-[var(--text-sm)] text-[var(--text-tertiary)]">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </section>
  )
}

const variantStyles = {
  published: { iconBg: "bg-red-50", iconColor: "text-red-500", Icon: Globe, cardBg: "bg-red-50/50 ring-1 ring-red-200/60", textColor: "text-[var(--text-primary)]" },
  ready: { iconBg: "bg-[var(--status-preview-bg)]", iconColor: "text-[var(--status-preview-text)]", Icon: Rocket, cardBg: "bg-[var(--bg-card)]", textColor: "text-[var(--text-primary)]" },
  building: { iconBg: "bg-[var(--bg-subtle)]", iconColor: "text-[var(--text-tertiary)]", Icon: Layers, cardBg: "bg-[var(--bg-card)]/60", textColor: "text-[var(--text-secondary)]" },
}

function ProjectRow({ project: p, index, variant, children }: {
  project: Project; index: number; variant: keyof typeof variantStyles; children: React.ReactNode
}) {
  const s = variantStyles[variant]
  return (
    <motion.div
      className={`group flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--border-default)] ${s.cardBg} px-5 py-4 ${variant !== "building" ? "shadow-[var(--shadow-xs)] transition-all hover:shadow-[var(--shadow-sm)]" : ""}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] ${s.iconBg}`}>
          <s.Icon className={`h-4 w-4 ${s.iconColor}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[var(--text-base)] font-semibold ${s.textColor}`}>{p.name}</span>
            {p.is_main && (
              <span className="flex items-center gap-1 rounded-full bg-[var(--status-draft-bg)] px-2 py-0.5">
                <Crown className="h-2.5 w-2.5 text-[var(--status-draft-text)]" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--status-draft-text)]">Main</span>
              </span>
            )}
          </div>
          <span className="font-mono text-[var(--text-xs)] text-[var(--text-tertiary)]">{p.slug}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">{children}</div>
    </motion.div>
  )
}
