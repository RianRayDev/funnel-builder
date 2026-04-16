import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Lock, Trash2, Loader2, Clock, X, Check, AlertTriangle } from "lucide-react"
import {
  listUserImages,
  deleteFromStorage,
  reauthenticate,
  type StorageFile,
} from "@/hooks/useStorage"
import { scanUsedImages } from "@/lib/image-scanner"

interface ImageLibraryProps {
  onSelect: (url: string) => void
  currentValue?: string
}

interface EnrichedFile extends StorageFile {
  isLocked: boolean
  usedIn: string[]
  daysUntilDelete: number | null // null = locked, number = days left for unused
}

export function ImageLibrary({ onSelect, currentValue }: ImageLibraryProps) {
  const [files, setFiles] = useState<EnrichedFile[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<EnrichedFile | null>(null)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [rawFiles, { usedUrls, urlToProjects }] = await Promise.all([
      listUserImages(),
      Promise.resolve(scanUsedImages()),
    ])

    const now = Date.now()
    const enriched: EnrichedFile[] = rawFiles.map((f) => {
      const isLocked = usedUrls.has(f.publicUrl)
      const usedIn = urlToProjects.get(f.publicUrl) || []
      const ageMs = now - new Date(f.createdAt).getTime()
      const ageDays = ageMs / (24 * 60 * 60 * 1000)
      const daysUntilDelete = isLocked ? null : Math.max(0, Math.ceil(7 - ageDays))

      return { ...f, isLocked, usedIn, daysUntilDelete }
    })

    setFiles(enriched)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleDelete(file: EnrichedFile) {
    if (file.isLocked) {
      // Requires re-auth
      setDeleteTarget(file)
      setPassword("")
      setAuthError("")
      return
    }
    // Unused — delete directly
    setDeleting(true)
    await deleteFromStorage(file.publicUrl)
    setDeleting(false)
    load()
  }

  async function handleAuthDelete() {
    if (!deleteTarget) return
    setAuthError("")
    setDeleting(true)

    const ok = await reauthenticate(password)
    if (!ok) {
      setAuthError("Incorrect password")
      setDeleting(false)
      return
    }

    await deleteFromStorage(deleteTarget.publicUrl)
    setDeleting(false)
    setDeleteTarget(null)
    setPassword("")
    load()
  }

  const locked = files.filter((f) => f.isLocked)
  const unused = files.filter((f) => !f.isLocked)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-[11px] text-gray-400">No uploads yet</p>
        <p className="mt-1 text-[10px] text-gray-300">Upload an image to see it here</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Auth confirmation modal */}
      {deleteTarget && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
            <span className="text-[11px] font-semibold text-red-600">Delete locked image</span>
          </div>
          <p className="text-[10px] text-red-500/70">
            Used in: {deleteTarget.usedIn.join(", ")}
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuthDelete()}
            placeholder="Enter your password to confirm"
            className="w-full rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-[11px] focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-200"
            autoFocus
          />
          {authError && <p className="text-[10px] text-red-500">{authError}</p>}
          <div className="flex gap-1.5">
            <button
              onClick={() => { setDeleteTarget(null); setPassword("") }}
              className="flex-1 rounded-md bg-white border border-gray-200 py-1.5 text-[10px] font-medium text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAuthDelete}
              disabled={!password || deleting}
              className="flex-1 flex items-center justify-center gap-1 rounded-md bg-red-500 py-1.5 text-[10px] font-semibold text-white hover:bg-red-600 disabled:opacity-50"
            >
              {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Locked images */}
      {locked.length > 0 && (
        <div>
          <div className="mb-1.5 flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-amber-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              In use ({locked.length})
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {locked.map((file) => (
              <ImageTile
                key={file.path}
                file={file}
                isSelected={currentValue === file.publicUrl}
                onSelect={() => onSelect(file.publicUrl)}
                onDelete={() => handleDelete(file)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Unused images */}
      {unused.length > 0 && (
        <div>
          <div className="mb-1.5 flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-gray-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Unused ({unused.length})
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {unused.map((file) => (
              <ImageTile
                key={file.path}
                file={file}
                isSelected={currentValue === file.publicUrl}
                onSelect={() => onSelect(file.publicUrl)}
                onDelete={() => handleDelete(file)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ImageTile({
  file,
  isSelected,
  onSelect,
  onDelete,
}: {
  file: EnrichedFile
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const [hover, setHover] = useState(false)

  return (
    <div
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
        isSelected
          ? "border-blue-500 shadow-sm"
          : "border-transparent hover:border-gray-200",
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onSelect}
    >
      <img
        src={file.publicUrl}
        alt={file.name}
        className="h-16 w-full object-cover"
        loading="lazy"
      />

      {/* Selected check */}
      {isSelected && (
        <div className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
      )}

      {/* Lock badge */}
      {file.isLocked && (
        <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400/90">
          <Lock className="h-2 w-2 text-white" />
        </div>
      )}

      {/* Days remaining for unused */}
      {!file.isLocked && file.daysUntilDelete !== null && (
        <div className="absolute right-1 top-1 rounded-full bg-black/50 px-1.5 py-0.5">
          <span className="text-[8px] font-medium text-white">{file.daysUntilDelete}d</span>
        </div>
      )}

      {/* Hover overlay with delete */}
      {hover && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1 pt-4">
          <span className="truncate text-[8px] text-white/70">{file.name}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-red-500"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </div>
      )}

      {/* Funnel name tooltip for locked */}
      {hover && file.isLocked && file.usedIn.length > 0 && (
        <div className="absolute inset-x-0 top-full z-10 mt-0.5 rounded-md bg-gray-900 px-2 py-1 text-[9px] text-white shadow-lg">
          {file.usedIn.join(", ")}
        </div>
      )}
    </div>
  )
}
