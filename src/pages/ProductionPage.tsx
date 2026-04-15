import { useState } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import {
  ArrowLeft, Globe, Download, Check, Clock,
  Copy, Crown, Layers, ArrowUpRight, CircleDot,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { store } from "@/lib/store"
import type { Project } from "@/types"

export function ProductionPage() {
  const navigate = useNavigate()
  const [projects] = useState(() => store.list())
  const [copied, setCopied] = useState<string | null>(null)

  const published = projects.filter((p) => p.status === "published")
  const drafts = projects.filter((p) => p.status !== "published")

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

  function handleMarkPublished(id: string) { store.update(id, { status: "published" }); window.location.reload() }
  function handleUnpublish(id: string) { store.update(id, { status: "draft" }); window.location.reload() }

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-default)]" style={{ background: "rgba(245,245,247,0.8)", backdropFilter: "blur(20px) saturate(150%)" }}>
        <div className="mx-auto flex h-14 max-w-[960px] items-center gap-3 px-6">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-[var(--border-default)]" />
          <span className="text-[var(--text-md)] font-semibold tracking-tight">Production</span>
        </div>
      </header>

      <main className="mx-auto max-w-[960px] px-6 py-10">
        {/* Workflow explanation — editorial, not generic info box */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[var(--text-sm)] font-medium uppercase tracking-[0.12em] text-[var(--text-tertiary)]">Deployment workflow</p>
          <div className="mt-4 flex items-center gap-3">
            {["Export JSON", "Claude Code converts", "You deploy"].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                {i > 0 && <div className="h-px w-8 bg-[var(--border-default)]" />}
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-inset)] text-[10px] font-bold text-[var(--text-secondary)]">{i + 1}</span>
                  <span className="text-[var(--text-sm)] font-medium text-[var(--text-secondary)]">{step}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live section */}
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2.5">
            <CircleDot className="h-4 w-4 text-[var(--status-live-text)]" />
            <h2 className="text-[var(--text-base)] font-semibold text-[var(--text-primary)]">Live</h2>
            <span className="rounded-full bg-[var(--status-live-bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--status-live-text)]">{published.length}</span>
          </div>

          {published.length === 0 ? (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] py-12 text-center">
              <Globe className="mx-auto mb-3 h-8 w-8 text-[var(--text-tertiary)]" />
              <p className="text-[var(--text-sm)] text-[var(--text-tertiary)]">No live funnels yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {published.map((p, i) => (
                <motion.div
                  key={p.id}
                  className="group flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] px-5 py-4 shadow-[var(--shadow-xs)] transition-all hover:shadow-[var(--shadow-sm)]"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--status-live-bg)]">
                      <Globe className="h-4 w-4 text-[var(--status-live-text)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-base)] font-semibold text-[var(--text-primary)]">{p.name}</span>
                        {p.is_main && (
                          <span className="flex items-center gap-1 rounded-full bg-[var(--status-draft-bg)] px-2 py-0.5">
                            <Crown className="h-2.5 w-2.5 text-[var(--status-draft-text)]" />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--status-draft-text)]">Main</span>
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[var(--text-xs)] text-[var(--text-tertiary)]">
                        domain.com{p.is_main ? "" : `/${p.slug}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/preview/${p.is_main ? "main" : p.slug}`)}>
                      <ArrowUpRight className="h-3.5 w-3.5" /> Preview
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(p)}>
                      {copied === p.id ? <Check className="h-3.5 w-3.5 text-[var(--status-live-text)]" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied === p.id ? "Copied" : "JSON"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleExport(p)}>
                      <Download className="h-3.5 w-3.5" /> Export
                    </Button>
                    <div className="ml-1 h-4 w-px bg-[var(--border-default)]" />
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleUnpublish(p.id)}>
                      Unpublish
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Drafts section */}
        <section>
          <div className="mb-4 flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-[var(--text-tertiary)]" />
            <h2 className="text-[var(--text-base)] font-semibold text-[var(--text-primary)]">Not Published</h2>
            <span className="rounded-full bg-[var(--bg-inset)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-tertiary)]">{drafts.length}</span>
          </div>

          {drafts.length === 0 ? (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] py-12 text-center">
              <Check className="mx-auto mb-3 h-8 w-8 text-[var(--status-live-text)]" />
              <p className="text-[var(--text-sm)] text-[var(--text-tertiary)]">All funnels are published</p>
            </div>
          ) : (
            <div className="space-y-2">
              {drafts.map((p, i) => (
                <motion.div
                  key={p.id}
                  className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)]/60 px-5 py-4"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--bg-subtle)]">
                      <Layers className="h-4 w-4 text-[var(--text-tertiary)]" />
                    </div>
                    <div>
                      <span className="text-[var(--text-base)] font-medium text-[var(--text-secondary)]">{p.name}</span>
                      <div className="font-mono text-[var(--text-xs)] text-[var(--text-tertiary)]">
                        domain.com{p.is_main ? "" : `/${p.slug}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/design/${p.is_main ? "main" : p.slug}`)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleExport(p)}>
                      <Download className="h-3.5 w-3.5" /> Export
                    </Button>
                    <Button size="sm" onClick={() => handleMarkPublished(p.id)}>
                      Mark Live
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
