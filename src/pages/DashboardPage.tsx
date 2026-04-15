import { useState } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Layers, MoreHorizontal, Eye, Copy, Trash2, Download, FileUp,
  Pencil, Search, LogOut, Globe, Link2, Crown,
} from "lucide-react"
import { store } from "@/lib/store"
import { templates, type FunnelTemplate } from "@/lib/templates"
import { useAuth } from "@/hooks/useAuth"
import { FunnelThumbnail } from "@/components/FunnelThumbnail"
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Project } from "@/types"

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  draft: { label: "Draft", bg: "bg-amber-100", text: "text-amber-600", dot: "bg-amber-400" },
  preview: { label: "Preview", bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-400" },
  published: { label: "Live", bg: "bg-emerald-100", text: "text-emerald-600", dot: "bg-emerald-400" },
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [projects, setProjects] = useState<Project[]>(store.list())
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<FunnelTemplate>(templates[0])
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  function refresh() { setProjects(store.list()) }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    const project = store.create(newName.trim())
    if (selectedTemplate.id !== "blank") store.update(project.id, { content: structuredClone(selectedTemplate.data) })
    setNewName(""); setSelectedTemplate(templates[0]); setNewDialogOpen(false)
    navigate(`/design/${project.is_main ? "main" : project.slug}`)
  }

  function handleDelete(id: string) { store.delete(id); setMenuOpen(null); refresh() }
  function handleDuplicate(id: string) { store.duplicate(id); setMenuOpen(null); refresh() }
  function handleSetMain(id: string) { store.setMain(id); setMenuOpen(null); refresh() }
  function handleRemoveMain(id: string) { store.update(id, { is_main: false }); setMenuOpen(null); refresh() }

  function handleExport(project: Project) {
    const blob = new Blob([JSON.stringify(project.content, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = `${project.slug}.json`; a.click()
    URL.revokeObjectURL(url); setMenuOpen(null)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try { const content = JSON.parse(reader.result as string); const name = file.name.replace(/\.json$/, ""); const project = store.create(name); store.update(project.id, { content }); setImportDialogOpen(false); refresh() }
      catch { alert("Invalid JSON file") }
    }
    reader.readAsText(file)
  }

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Header — light frosted glass */}
      <header className="sticky top-0 z-30 border-b border-black/[0.06]" style={{ background: "rgba(245,245,247,0.8)", backdropFilter: "blur(20px) saturate(150%)", WebkitBackdropFilter: "blur(20px) saturate(150%)" }}>
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)]" style={{ background: "linear-gradient(135deg, oklch(0.48 0.2 270), oklch(0.38 0.18 250))" }}>
              <Layers className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">Funnel Builder</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#1d1d1f]/30" />
              <input placeholder="Search..." className="h-8 w-48 rounded-[var(--radius-md)] border border-black/[0.06] bg-white/60 pl-9 pr-3 text-[13px] text-[#1d1d1f] placeholder:text-[#1d1d1f]/30 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.18_265_/_0.15)]" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button onClick={() => navigate("/production")} className="flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] border border-black/[0.06] bg-white/60 px-3 text-[12px] font-medium text-[#1d1d1f]/60 transition-all hover:bg-white hover:text-[#1d1d1f]">
              <Globe className="h-3.5 w-3.5" /> Production
            </button>
            <button onClick={() => setImportDialogOpen(true)} className="flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] border border-black/[0.06] bg-white/60 px-3 text-[12px] font-medium text-[#1d1d1f]/60 transition-all hover:bg-white hover:text-[#1d1d1f]">
              <FileUp className="h-3.5 w-3.5" /> Import
            </button>
            <motion.button onClick={() => setNewDialogOpen(true)} className="flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] px-4 text-[12px] font-semibold text-white" style={{ background: "linear-gradient(135deg, oklch(0.48 0.2 270), oklch(0.38 0.18 250))", boxShadow: "0 2px 8px oklch(0.4 0.2 265 / 0.2)" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Plus className="h-3.5 w-3.5" /> New Funnel
            </motion.button>
            <div className="ml-1 h-4 w-px bg-black/[0.06]" />
            <button onClick={async () => { await signOut(); navigate("/") }} className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-[#1d1d1f]/30 transition-colors hover:bg-black/[0.04] hover:text-[#1d1d1f]/60" title="Sign out">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1d1d1f]/30">Your Funnels</h2>
          <span className="text-[11px] text-[#1d1d1f]/20">{filtered.length} project{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {filtered.length === 0 ? (
          <motion.div className="flex flex-col items-center justify-center py-28" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[var(--radius-xl)] bg-black/[0.03]">
              <Layers className="h-9 w-9 text-[#1d1d1f]/15" strokeWidth={1.5} />
            </div>
            <h2 className="mb-1.5 text-[17px] font-semibold text-[#1d1d1f]">No funnels yet</h2>
            <p className="mb-7 text-[14px] text-[#1d1d1f]/40">Create your first funnel or import a JSON file</p>
            <motion.button onClick={() => setNewDialogOpen(true)} className="flex h-10 items-center gap-2 rounded-[var(--radius-md)] px-5 text-[14px] font-semibold text-white" style={{ background: "linear-gradient(135deg, oklch(0.48 0.2 270), oklch(0.38 0.18 250))", boxShadow: "0 4px 16px oklch(0.4 0.2 265 / 0.25)" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Plus className="h-4 w-4" /> Create Your First Funnel
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => {
                const status = statusConfig[project.status]
                return (
                  <motion.div key={project.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                    <div
                      className="group relative cursor-pointer rounded-[var(--radius-lg)] border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-black/[0.1]"
                      onClick={() => navigate(`/design/${project.is_main ? "main" : project.slug}`)}
                    >
                      {/* Live preview thumbnail */}
                      <div className="relative h-[148px] overflow-hidden rounded-t-[17px] border-b border-black/[0.04] bg-[#fafafa]">
                        <FunnelThumbnail data={project.content} />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                          <span className="rounded-[var(--radius-md)] bg-white px-4 py-2 text-[13px] font-medium text-[#1d1d1f] shadow-lg">Open Editor</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate text-[14px] font-semibold text-[#1d1d1f]">{project.name}</h3>
                              {project.is_main && (
                                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5" title="Main funnel — lives at domain.com">
                                  <Crown className="h-2.5 w-2.5 text-amber-500" />
                                  <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-600">Main</span>
                                </span>
                              )}
                            </div>
                            <div className="mt-1.5 flex items-center gap-1.5">
                              {project.is_main ? (
                                <><Globe className="h-3 w-3 text-amber-500/50" /><span className="text-[11px] font-mono text-amber-600/50">domain.com</span></>
                              ) : (
                                <><Link2 className="h-3 w-3 text-[#1d1d1f]/20" /><span className="truncate text-[11px] font-mono text-[#1d1d1f]/25">domain.com/{project.slug}</span></>
                              )}
                            </div>
                            <p className="mt-1 text-[11px] text-[#1d1d1f]/25">{timeAgo(project.updated_at)}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2 pl-3">
                            <span className={`flex items-center gap-1.5 rounded-full ${status.bg} px-2 py-0.5`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                              <span className={`text-[10px] font-medium ${status.text}`}>{status.label}</span>
                            </span>
                            <div className="relative">
                              <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === project.id ? null : project.id) }} className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] opacity-0 transition-all group-hover:opacity-100 hover:bg-black/[0.05]">
                                <MoreHorizontal className="h-3.5 w-3.5 text-[#1d1d1f]/40" />
                              </button>
                              <AnimatePresence>
                                {menuOpen === project.id && (
                                  <motion.div className="absolute right-0 top-8 z-40 w-48 overflow-hidden rounded-[var(--radius-lg)] border border-black/[0.08] bg-white p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)]" initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.15 }} onClick={(e) => e.stopPropagation()}>
                                    <CtxItem icon={Pencil} label="Edit" onClick={() => { setMenuOpen(null); navigate(`/design/${project.is_main ? "main" : project.slug}`) }} />
                                    <CtxItem icon={Eye} label="Preview" onClick={(e) => { e.stopPropagation(); setMenuOpen(null); navigate(`/preview/${project.is_main ? "main" : project.slug}`) }} />
                                    {project.is_main ? (
                                      <CtxItem icon={Crown} label="Remove as Main" onClick={(e) => { e.stopPropagation(); handleRemoveMain(project.id) }} />
                                    ) : (
                                      <CtxItem icon={Crown} label="Set as Main Page" highlight onClick={(e) => { e.stopPropagation(); handleSetMain(project.id) }} />
                                    )}
                                    <div className="my-1 border-t border-black/[0.05]" />
                                    <CtxItem icon={Copy} label="Duplicate" onClick={(e) => { e.stopPropagation(); handleDuplicate(project.id) }} />
                                    <CtxItem icon={Download} label="Export JSON" onClick={(e) => { e.stopPropagation(); handleExport(project) }} />
                                    <div className="my-1 border-t border-black/[0.05]" />
                                    <CtxItem icon={Trash2} label="Delete" destructive onClick={(e) => { e.stopPropagation(); handleDelete(project.id) }} />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* New Project Dialog */}
      <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
        <DialogHeader>
          <DialogTitle>Create New Funnel</DialogTitle>
          <DialogDescription>Choose a template and name your funnel</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-5">
          <div className="grid grid-cols-2 gap-2">
            {templates.map((tpl) => (
              <button key={tpl.id} type="button" onClick={() => setSelectedTemplate(tpl)}
                className={`flex flex-col items-start rounded-[var(--radius-md)] p-3 text-left transition-all duration-200 ${selectedTemplate.id === tpl.id ? "bg-white/[0.08] ring-1 ring-white/20" : "bg-white/[0.03] hover:bg-white/[0.06]"}`}
                style={{ border: selectedTemplate.id === tpl.id ? "1px solid rgba(139,156,247,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
                <div className={`mb-2 flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] ${selectedTemplate.id === tpl.id ? "text-white" : "text-white/30"}`} style={selectedTemplate.id === tpl.id ? { background: "linear-gradient(135deg, oklch(0.5 0.2 270), oklch(0.42 0.18 255))" } : { background: "rgba(255,255,255,0.06)" }}>
                  <Layers className="h-3 w-3" strokeWidth={2} />
                </div>
                <span className="text-[12px] font-medium text-white/80">{tpl.name}</span>
                <span className="mt-0.5 text-[10px] leading-snug text-white/30">{tpl.description}</span>
              </button>
            ))}
          </div>
          <div>
            <input placeholder="Funnel name..." value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus
              className="flex h-11 w-full rounded-[var(--radius-md)] border-0 px-4 text-[14px] text-white placeholder:text-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.04)" }} />
            {newName.trim() && (
              <motion.p className="mt-2 flex items-center gap-1.5 text-[11px] text-white/25" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Globe className="h-3 w-3" /> domain.com/<span className="font-mono text-white/40">{newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}</span>
              </motion.p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setNewDialogOpen(false)} className="h-9 rounded-[var(--radius-md)] bg-white/[0.06] px-4 text-[13px] font-medium text-white/50 transition-colors hover:bg-white/[0.1] hover:text-white/70">Cancel</button>
            <motion.button type="submit" disabled={!newName.trim()} className="h-9 rounded-[var(--radius-md)] px-5 text-[13px] font-semibold text-white disabled:opacity-30" style={{ background: "linear-gradient(135deg, oklch(0.5 0.2 270), oklch(0.42 0.18 255))" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Create</motion.button>
          </div>
        </form>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogHeader>
          <DialogTitle>Import Funnel</DialogTitle>
          <DialogDescription>Upload a .json file from this builder or Claude Code</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed border-white/[0.08] transition-all hover:border-white/[0.15] hover:bg-white/[0.03]">
            <FileUp className="mb-2.5 h-6 w-6 text-white/20" />
            <span className="text-[13px] font-medium text-white/30">Click to select a .json file</span>
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          <div className="flex justify-end">
            <button onClick={() => setImportDialogOpen(false)} className="h-9 rounded-[var(--radius-md)] bg-white/[0.06] px-4 text-[13px] font-medium text-white/50 transition-colors hover:bg-white/[0.1]">Cancel</button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

function CtxItem({ icon: Icon, label, onClick, destructive = false, highlight = false }: {
  icon: React.ComponentType<{ className?: string }>; label: string; onClick: (e: React.MouseEvent) => void; destructive?: boolean; highlight?: boolean
}) {
  return (
    <button className={`flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-[7px] text-[12px] font-medium transition-colors ${destructive ? "text-red-500 hover:bg-red-50" : highlight ? "text-amber-600 hover:bg-amber-50" : "text-[#1d1d1f]/60 hover:bg-black/[0.04] hover:text-[#1d1d1f]"}`} onClick={onClick}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  )
}
