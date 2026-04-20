import { useRef, useState } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Layers, MoreHorizontal, Eye, Copy, Trash2, Download, FileUp,
  Pencil, Search, LogOut, Globe, Link2, Crown, Clock, Hammer,
} from "lucide-react"
import { store } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { templates, type FunnelTemplate } from "@/lib/templates"
import { useAuth } from "@/hooks/useAuth"
import { FunnelThumbnail } from "@/components/FunnelThumbnail"
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Project } from "@/types"

const statusConfig: Record<string, { label: string; text: string; dot: string; ring: string }> = {
  building: { label: "Building", text: "text-amber-500", dot: "bg-amber-400", ring: "" },
  ready: { label: "Pending", text: "text-indigo-500", dot: "bg-indigo-400", ring: "ring-1 ring-indigo-400/25" },
  published: { label: "Live", text: "text-red-500", dot: "bg-red-500", ring: "ring-2 ring-red-500/30" },
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
  const { user, signOut } = useAuth()
  const [projects, setProjects] = useState<Project[]>(store.list())
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<FunnelTemplate>(templates[0])
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [importDragging, setImportDragging] = useState(false)
  const [pendingConfirmId, setPendingConfirmId] = useState<string | null>(null)
  const importDragCounter = useRef(0)

  function refresh() { setProjects(store.list()) }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    const project = store.create(newName.trim())
    if (selectedTemplate.id !== "blank") store.update(project.id, { content: structuredClone(selectedTemplate.data) })
    setNewName(""); setSelectedTemplate(templates[0]); setNewDialogOpen(false)
    navigate(`/funnel-builder/design/${project.is_main ? "main" : project.slug}`)
  }

  function handleDelete(id: string) { store.delete(id); setMenuOpen(null); refresh() }
  function handleDuplicate(id: string) { store.duplicate(id); setMenuOpen(null); refresh() }
  function handleStatusChange(id: string, newStatus: Project["status"]) {
    const update: Partial<Project> = { status: newStatus }
    if (newStatus === "building") update.pending_by = undefined
    store.update(id, update); setMenuOpen(null); refresh()
  }

  async function confirmPending() {
    if (!pendingConfirmId) return

    let currentUser = user
    if (!currentUser) {
      const { data } = await supabase.auth.getUser()
      currentUser = data.user
    }

    const pendingBy = {
      id: currentUser?.id || "local",
      name: currentUser?.user_metadata?.full_name || currentUser?.email?.split("@")[0] || "Local User",
      avatar_url: currentUser?.user_metadata?.avatar_url || null,
      email: currentUser?.email || "",
    }

    const project = store.update(pendingConfirmId, { status: "ready", pending_by: pendingBy })

    if (project) {
      const { error } = await supabase.from("projects").upsert({
        id: project.id,
        owner_id: currentUser?.id || null,
        name: project.name,
        slug: project.slug,
        status: "ready",
        content: project.content,
        pending_by: pendingBy,
        is_main: project.is_main,
        created_at: project.created_at,
        updated_at: project.updated_at,
      })
      if (error) console.error("[Supabase] Save failed:", error.message, error.details)
    }

    setPendingConfirmId(null); refresh()
  }

  function handleExport(project: Project) {
    const blob = new Blob([JSON.stringify(project.content, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = `${project.slug}.json`; a.click()
    URL.revokeObjectURL(url); setMenuOpen(null)
  }

  function processImportFile(file: File) {
    if (!file.name.endsWith(".json")) { alert("Only .json files are supported"); return }
    const reader = new FileReader()
    reader.onload = () => {
      try { const content = JSON.parse(reader.result as string); const name = file.name.replace(/\.json$/, ""); const project = store.create(name); store.update(project.id, { content }); setImportDialogOpen(false); refresh() }
      catch { alert("Invalid JSON file") }
    }
    reader.readAsText(file)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    processImportFile(file)
  }

  function handleImportDrop(e: React.DragEvent) {
    e.preventDefault(); e.stopPropagation(); setImportDragging(false); importDragCounter.current = 0
    const file = e.dataTransfer.files?.[0]
    if (file) processImportFile(file)
  }

  const filtered = projects
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => filter === "all" || p.status === filter)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f8fa] to-[#eeeef2]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-black/[0.04]" style={{ background: "rgba(248,248,250,0.72)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)" }}>
        <div className="mx-auto flex h-[60px] max-w-[1400px] items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, oklch(0.48 0.2 270), oklch(0.38 0.18 250))", boxShadow: "0 2px 8px oklch(0.4 0.2 265 / 0.15)" }}>
              <Layers className="h-[18px] w-[18px] text-white" strokeWidth={2} />
            </div>
            <span className="text-[16px] font-semibold tracking-tight text-[#1d1d1f]">Funnel Builder</span>
          </div>
          <div className="flex items-center">
            <div className="relative mr-3">
              <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#1d1d1f]/25" />
              <input placeholder="Search funnels..." className="h-9 w-56 rounded-full border border-black/[0.06] bg-white/50 pl-10 pr-4 text-[13px] text-[#1d1d1f] placeholder:text-[#1d1d1f]/25 transition-all focus:w-72 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.18_265_/_0.12)] focus:border-transparent" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-0.5">
              <button onClick={() => navigate("/funnel-builder/production")} className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12px] font-medium text-[#1d1d1f]/40 transition-all hover:bg-black/[0.04] hover:text-[#1d1d1f]/70">
                <Globe className="h-3.5 w-3.5" /> Production
              </button>
              <button onClick={() => setImportDialogOpen(true)} className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12px] font-medium text-[#1d1d1f]/40 transition-all hover:bg-black/[0.04] hover:text-[#1d1d1f]/70">
                <FileUp className="h-3.5 w-3.5" /> Import
              </button>
            </div>
            <div className="mx-3 h-5 w-px bg-black/[0.06]" />
            <motion.button onClick={() => setNewDialogOpen(true)} className="flex h-9 items-center gap-1.5 rounded-xl px-5 text-[13px] font-semibold text-white" style={{ background: "linear-gradient(135deg, oklch(0.48 0.2 270), oklch(0.38 0.18 250))", boxShadow: "0 2px 10px oklch(0.4 0.2 265 / 0.25)" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Plus className="h-4 w-4" /> New Funnel
            </motion.button>
            <div className="ml-3">
              <button onClick={async () => { await signOut(); navigate("/auth") }} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.04] text-[#1d1d1f]/30 transition-all hover:bg-black/[0.08] hover:text-[#1d1d1f]/60" title="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-[1400px] px-8 py-10">
        <div className="mb-8">
          <div className="flex items-end justify-between">
            <h1 className="text-[24px] font-bold tracking-tight text-[#1d1d1f]">Your Funnels</h1>
            <span className="text-[13px] text-[#1d1d1f]/25">{filtered.length} project{filtered.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="mt-5 flex items-center gap-1">
            {([
              { key: "all", label: "All" },
              { key: "building", label: "Building", dot: "bg-amber-400" },
              { key: "ready", label: "Pending", dot: "bg-indigo-400" },
              { key: "published", label: "Live", dot: "bg-red-500" },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                  filter === tab.key
                    ? "bg-[#1d1d1f] text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                    : "text-[#1d1d1f]/35 hover:bg-black/[0.04] hover:text-[#1d1d1f]/60"
                }`}
              >
                {"dot" in tab && <span className={`h-1.5 w-1.5 rounded-full ${filter === tab.key ? "bg-white/60" : tab.dot}`} />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <motion.div className="flex flex-col items-center justify-center py-28" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[var(--radius-xl)]" style={{ background: 'linear-gradient(135deg, oklch(0.96 0.02 270), oklch(0.93 0.03 240))' }}>
              <Layers className="h-9 w-9 text-[#1d1d1f]/15" strokeWidth={1.5} />
            </div>
            <h2 className="mb-1.5 text-[17px] font-semibold text-[#1d1d1f]">No funnels yet</h2>
            <p className="mb-7 text-[14px] text-[#1d1d1f]/40">Create your first funnel or import a JSON file</p>
            <motion.button onClick={() => setNewDialogOpen(true)} className="flex h-10 items-center gap-2 rounded-[var(--radius-md)] px-5 text-[14px] font-semibold text-white" style={{ background: "linear-gradient(135deg, oklch(0.48 0.2 270), oklch(0.38 0.18 250))", boxShadow: "0 4px 16px oklch(0.4 0.2 265 / 0.25)" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Plus className="h-4 w-4" /> Create Your First Funnel
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => {
                const status = statusConfig[project.status]
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] } }}
                    className="group relative will-change-transform"
                  >
                    {/* Gradient border — fades in on hover */}
                    <div
                      className="pointer-events-none absolute -inset-[1.5px] rounded-[22px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: 'linear-gradient(135deg, oklch(0.6 0.2 280), oklch(0.55 0.15 220))' }}
                    />

                    {/* Card */}
                    <div
                      className={`relative h-[300px] cursor-pointer rounded-[20px] transition-shadow duration-300 ${status.ring}`}
                      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.06)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)' }}
                      onClick={() => navigate(`/funnel-builder/design/${project.is_main ? "main" : project.slug}`)}
                    >
                      {/* Owner badge — shown for Pending/Live */}
                      {(project.status === "ready" || project.status === "published") && project.pending_by && (
                        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12)]" style={{ background: project.pending_by.avatar_url ? undefined : 'linear-gradient(135deg, oklch(0.55 0.15 270), oklch(0.45 0.12 250))' }}>
                            {project.pending_by.avatar_url ? (
                              <img src={project.pending_by.avatar_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-[10px] font-bold text-white">
                                {project.pending_by.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                              </span>
                            )}
                          </div>
                          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-[#1d1d1f]/60 shadow-[0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                            {project.pending_by.name}
                          </span>
                        </div>
                      )}

                      {/* Thumbnail — fills entire card */}
                      <div className="absolute inset-0 overflow-hidden rounded-[20px]">
                        <FunnelThumbnail data={project.content} />
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
                        <span className="rounded-full bg-white px-6 py-2.5 text-[13px] font-semibold text-[#1d1d1f]" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
                          Open Editor
                        </span>
                      </div>

                      {/* Frosted info bar */}
                      <div
                        className="absolute inset-x-0 bottom-0 rounded-b-[20px] border-t border-white/30 px-5 py-4"
                        style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2.5">
                              <h3 className="truncate text-[15px] font-semibold tracking-tight text-[#1d1d1f]">{project.name}</h3>
                              {project.is_main && (
                                <span className="flex items-center gap-1 rounded-full bg-amber-50/80 px-2 py-0.5" title="Main funnel — homepage">
                                  <Crown className="h-2.5 w-2.5 text-amber-500" />
                                  <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-600">Main</span>
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-[#1d1d1f]/35">
                              {project.is_main ? (
                                <><Globe className="h-3 w-3 text-amber-500/40" /><span className="font-mono text-amber-500/40">/</span></>
                              ) : (
                                <><Link2 className="h-3 w-3" /><span className="truncate font-mono">/{project.slug}</span></>
                              )}
                              <span className="text-[#1d1d1f]/15">·</span>
                              <span>{timeAgo(project.updated_at)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5">
                              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                              <span className={`text-[11px] font-medium ${status.text}`}>{status.label}</span>
                            </span>
                            <div className="relative">
                              <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === project.id ? null : project.id) }} className="flex h-7 w-7 items-center justify-center rounded-lg opacity-0 transition-all group-hover:opacity-100 hover:bg-black/[0.08]">
                                <MoreHorizontal className="h-4 w-4 text-[#1d1d1f]/40" />
                              </button>
                              <AnimatePresence>
                                {menuOpen === project.id && (
                                  <motion.div className="absolute right-0 top-9 z-40 w-48 overflow-hidden rounded-xl border border-black/[0.06] bg-white/95 p-1.5 backdrop-blur-xl" style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)' }} initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.15 }} onClick={(e) => e.stopPropagation()}>
                                    <CtxItem icon={Pencil} label="Edit" onClick={() => { setMenuOpen(null); navigate(`/funnel-builder/design/${project.is_main ? "main" : project.slug}`) }} />
                                    <CtxItem icon={Eye} label="Preview" onClick={(e) => { e.stopPropagation(); setMenuOpen(null); navigate(`/funnel-builder/preview/${project.is_main ? "main" : project.slug}`) }} />
                                    <div className="my-1 border-t border-black/[0.05]" />
                                    {project.status === "building" && (
                                      <CtxItem icon={Clock} label="Set as Pending" highlight onClick={(e) => { e.stopPropagation(); setMenuOpen(null); setPendingConfirmId(project.id) }} />
                                    )}
                                    {project.status === "ready" && (
                                      <CtxItem icon={Hammer} label="Back to Building" onClick={(e) => { e.stopPropagation(); handleStatusChange(project.id, "building") }} />
                                    )}
                                    <CtxItem icon={Copy} label="Duplicate" onClick={(e) => { e.stopPropagation(); handleDuplicate(project.id) }} />
                                    <CtxItem icon={Download} label="Export JSON" onClick={(e) => { e.stopPropagation(); handleExport(project) }} />
                                    {project.status !== "published" && (
                                      <>
                                        <div className="my-1 border-t border-black/[0.05]" />
                                        <CtxItem icon={Trash2} label="Delete" destructive onClick={(e) => { e.stopPropagation(); handleDelete(project.id) }} />
                                      </>
                                    )}
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

            {/* New Funnel card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: filtered.length * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.3 } }}
              className="group will-change-transform"
            >
              <div
                className="flex h-[300px] cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#1d1d1f]/[0.08] transition-all duration-300 group-hover:border-[oklch(0.5_0.18_265)] group-hover:bg-[oklch(0.5_0.18_265_/_0.03)]"
                onClick={() => setNewDialogOpen(true)}
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1d1d1f]/[0.04] transition-colors duration-300 group-hover:bg-[oklch(0.5_0.18_265_/_0.1)]">
                  <Plus className="h-6 w-6 text-[#1d1d1f]/20 transition-colors duration-300 group-hover:text-[oklch(0.5_0.18_265)]" />
                </div>
                <span className="text-[14px] font-medium text-[#1d1d1f]/30 transition-colors duration-300 group-hover:text-[oklch(0.45_0.18_265)]">New Funnel</span>
              </div>
            </motion.div>
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
                <Globe className="h-3 w-3" /> /<span className="font-mono text-white/40">{newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}</span>
              </motion.p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setNewDialogOpen(false)} className="h-9 rounded-[var(--radius-md)] bg-white/[0.06] px-4 text-[13px] font-medium text-white/50 transition-colors hover:bg-white/[0.1] hover:text-white/70">Cancel</button>
            <motion.button type="submit" disabled={!newName.trim()} className="h-9 rounded-[var(--radius-md)] px-5 text-[13px] font-semibold text-white disabled:opacity-30" style={{ background: "linear-gradient(135deg, oklch(0.5 0.2 270), oklch(0.42 0.18 255))" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Create</motion.button>
          </div>
        </form>
      </Dialog>

      {/* Pending Confirmation Dialog */}
      <Dialog open={!!pendingConfirmId} onOpenChange={(open) => { if (!open) setPendingConfirmId(null) }}>
        <DialogHeader>
          <DialogTitle>Save to Database?</DialogTitle>
          <DialogDescription>This will save the funnel to the database and mark it as pending for deployment. Other users will be able to see it.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4">
          <button onClick={() => setPendingConfirmId(null)} className="h-9 rounded-[var(--radius-md)] bg-white/[0.06] px-4 text-[13px] font-medium text-white/50 transition-colors hover:bg-white/[0.1] hover:text-white/70">Cancel</button>
          <motion.button onClick={confirmPending} className="h-9 rounded-[var(--radius-md)] px-5 text-[13px] font-semibold text-white" style={{ background: "linear-gradient(135deg, oklch(0.5 0.15 270), oklch(0.45 0.12 250))" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Save & Set Pending</motion.button>
        </div>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogHeader>
          <DialogTitle>Import Funnel</DialogTitle>
          <DialogDescription>Upload a .json file from this builder or Claude Code</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label
            className={`flex h-36 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed transition-all ${importDragging ? "border-indigo-400/40 bg-indigo-500/[0.06]" : "border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.03]"}`}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); importDragCounter.current++; setImportDragging(true) }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); importDragCounter.current--; if (importDragCounter.current === 0) setImportDragging(false) }}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
            onDrop={handleImportDrop}
          >
            <FileUp className={`mb-2.5 h-6 w-6 ${importDragging ? "text-indigo-400/60" : "text-white/20"}`} />
            <span className={`text-[13px] font-medium ${importDragging ? "text-indigo-300/60" : "text-white/30"}`}>
              {importDragging ? "Drop .json file here" : "Drag & drop or click to select .json"}
            </span>
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
