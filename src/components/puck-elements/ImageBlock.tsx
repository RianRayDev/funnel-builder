import { useCallback, useRef, useState, useEffect } from "react"
import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { ImageIcon, Upload, Loader2, Grid2x2, X } from "lucide-react"
import { uploadToStorage, deleteFromStorage } from "@/hooks/useStorage"
import { ImageLibrary } from "@/components/ImageLibrary"

interface ImageBlockProps {
  src: string
  alt: string
  borderRadius: string
  height: string
  objectPosition: string
}

const posNameToPercent: Record<string, { x: number; y: number }> = {
  "top left": { x: 0, y: 0 }, "top center": { x: 50, y: 0 }, "top right": { x: 100, y: 0 },
  "center left": { x: 0, y: 50 }, "center center": { x: 50, y: 50 }, "center right": { x: 100, y: 50 },
  "bottom left": { x: 0, y: 100 }, "bottom center": { x: 50, y: 100 }, "bottom right": { x: 100, y: 100 },
}

function parsePosition(pos: string): { x: number; y: number } {
  if (!pos) return { x: 50, y: 50 }
  const named = posNameToPercent[pos]
  if (named) return named
  const match = pos.match(/^([\d.]+)%\s+([\d.]+)%$/)
  if (match) return { x: parseFloat(match[1]), y: parseFloat(match[2]) }
  return { x: 50, y: 50 }
}

const maxHeightMap: Record<string, string> = {
  "max-h-48": "192",
  "max-h-72": "288",
  "max-h-96": "384",
  "max-h-[500px]": "500",
}

function validateFile(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Not an image file"
  if (file.size > 5 * 1024 * 1024) return "Max 5MB"
  return null
}

function ImageUploadField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [mode, setMode] = useState<"upload" | "library">(value ? "library" : "upload")
  const [dragging, setDragging] = useState(false)
  const dragCounter = useRef(0)

  const processFile = useCallback(async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) { setError(validationError); return }

    setUploading(true)
    setError("")

    const result = await uploadToStorage(file)
    setUploading(false)

    if (result.url) {
      onChange(result.url)
      setMode("library")
    } else {
      setError(result.error || "Upload failed")
    }
  }, [onChange])

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    if (fileRef.current) fileRef.current.value = ""
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault(); e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items?.length) setDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault(); e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) setDragging(false)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault(); e.stopPropagation()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); e.stopPropagation()
    setDragging(false); dragCounter.current = 0
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1 rounded-lg bg-gray-100 p-0.5">
        <button type="button" onClick={() => setMode("upload")}
          className={cn("flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all",
            mode === "upload" ? "bg-white shadow-sm text-gray-700" : "text-gray-400")}>
          <Upload className="h-3 w-3" /> Upload
        </button>
        <button type="button" onClick={() => setMode("library")}
          className={cn("flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all",
            mode === "library" ? "bg-white shadow-sm text-gray-700" : "text-gray-400")}>
          <Grid2x2 className="h-3 w-3" /> Library
        </button>
      </div>

      {mode === "upload" ? (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed py-5 text-xs font-medium transition-all disabled:opacity-50",
              dragging
                ? "border-blue-400 bg-blue-50 text-blue-500"
                : "border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500",
            )}
          >
            {uploading ? (
              <><Loader2 className="h-5 w-5 animate-spin" /><span>Uploading...</span></>
            ) : dragging ? (
              <><Upload className="h-5 w-5" /><span>Drop image here</span></>
            ) : (
              <><Upload className="h-5 w-5" /><span>Drag & drop or click to upload</span></>
            )}
          </button>
          <p className="mt-1 text-[10px] text-gray-400">JPG, PNG, WebP, GIF — max 5MB</p>
        </div>
      ) : (
        <ImageLibrary onSelect={onChange} currentValue={value} />
      )}

      {value && (
        <div className="relative">
          <img src={value} alt="Preview" className="h-20 w-full rounded-lg object-cover" />
          <button type="button" onClick={() => { deleteFromStorage(value); onChange("") }}
            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  )
}

export const ImageBlock: ComponentConfig<ImageBlockProps> = {
  label: "Image",
  resolveData: async (data) => {
    const props = { ...data.props }
    if ((props as any).maxHeight && !props.height) {
      props.height = maxHeightMap[(props as any).maxHeight] || ""
      delete (props as any).maxHeight
    }
    if ((props as any).objectFit) {
      delete (props as any).objectFit
    }
    if (props.objectPosition && !props.objectPosition.includes("%")) {
      const parsed = parsePosition(props.objectPosition)
      props.objectPosition = `${parsed.x}% ${parsed.y}%`
    }
    return { props }
  },
  fields: {
    src: {
      type: "custom",
      label: "Image",
      render: ({ value, onChange }) => <ImageUploadField value={value} onChange={onChange} />,
    },
    alt: { type: "text", label: "Alt Text" },
    borderRadius: {
      type: "custom",
      label: "Corners",
      render: ({ value, onChange }) => (
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {[
            { v: "rounded-none", l: "Sharp" },
            { v: "rounded-lg", l: "Round" },
            { v: "rounded-xl", l: "More" },
            { v: "rounded-2xl", l: "Most" },
          ].map((opt) => (
            <button key={opt.v} type="button" onClick={() => onChange(opt.v)}
              className={cn("flex-1 rounded-md py-1.5 text-center text-xs font-medium transition-all",
                value === opt.v ? "bg-white shadow-sm" : "text-gray-400")}>
              {opt.l}
            </button>
          ))}
        </div>
      ),
    },
    objectPosition: {
      type: "custom",
      label: "Focus Point",
      render: ({ value, onChange }) => {
        const gridRef = useRef<HTMLDivElement>(null)
        const [dragging, setDragging] = useState(false)
        const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)

        const getPercent = (e: React.PointerEvent | PointerEvent) => {
          const rect = gridRef.current?.getBoundingClientRect()
          if (!rect) return { x: 50, y: 50 }
          const x = ((e.clientX - rect.left) / rect.width) * 100
          const y = ((e.clientY - rect.top) / rect.height) * 100
          return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
        }

        useEffect(() => {
          if (!dragging) return
          const onMove = (e: PointerEvent) => {
            e.preventDefault()
            setDragPos(getPercent(e))
          }
          const onUp = (e: PointerEvent) => {
            const pos = getPercent(e)
            onChange(`${Math.round(pos.x)}% ${Math.round(pos.y)}%`)
            setDragging(false)
            setDragPos(null)
          }
          window.addEventListener("pointermove", onMove)
          window.addEventListener("pointerup", onUp)
          return () => {
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerup", onUp)
          }
        })

        const current = dragPos || parsePosition(value || "50% 50%")
        const displayValue = dragPos
          ? `${Math.round(dragPos.x)}% ${Math.round(dragPos.y)}%`
          : (value || "50% 50%")

        return (
          <div className="space-y-1.5">
            <div
              ref={gridRef}
              className="relative mx-auto h-16 w-full cursor-crosshair rounded-lg bg-gray-100 overflow-hidden"
              onPointerDown={(e) => {
                e.preventDefault()
                const pos = getPercent(e)
                setDragPos(pos)
                onChange(`${Math.round(pos.x)}% ${Math.round(pos.y)}%`)
                setDragging(true)
              }}
            >
              <div
                className="absolute top-0 bottom-0 w-px bg-blue-400/40 pointer-events-none"
                style={{ left: `${current.x}%` }}
              />
              <div
                className="absolute left-0 right-0 h-px bg-blue-400/40 pointer-events-none"
                style={{ top: `${current.y}%` }}
              />
              <div
                className={cn(
                  "absolute h-3 w-3 rounded-full bg-blue-500 shadow-md ring-2 ring-white pointer-events-none",
                  dragging ? "scale-125" : "transition-all duration-150",
                )}
                style={{
                  left: `${current.x}%`,
                  top: `${current.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[9px] text-gray-400 tabular-nums">{displayValue}</p>
              {value && value !== "50% 50%" && (
                <button
                  type="button"
                  onClick={() => onChange("50% 50%")}
                  className="text-[9px] text-blue-400 hover:text-blue-500 font-medium"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )
      },
    },
    height: {
      type: "custom",
      label: "Height",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Height</label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Auto"
              min={50}
              className="w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 tabular-nums"
            />
            <span className="text-[10px] text-gray-400 shrink-0">px</span>
            {value && (
              <button type="button" onClick={() => onChange("")}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <p className="text-[9px] text-gray-400">Click Edit or double-click image to crop</p>
        </div>
      ),
    },
  },
  defaultProps: {
    src: "",
    alt: "Image",
    borderRadius: "rounded-xl",
    height: "",
    objectPosition: "50% 50%",
  },
  render: ({ src, alt, borderRadius, height, objectPosition }) => {
    if (!src) {
      return (
        <div className={cn("flex h-48 w-full items-center justify-center bg-gray-100", borderRadius)}>
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <ImageIcon className="h-10 w-10" />
            <span className="text-xs font-medium">Upload or pick from library</span>
          </div>
        </div>
      )
    }

    const h = height ? parseInt(height) : null
    const hasHeight = h !== null && h > 0
    return (
      <div
        data-crop-target
        className={cn("relative", borderRadius, hasHeight && "overflow-hidden")}
        style={hasHeight ? { height: `${h}px` } : undefined}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={cn("w-full", borderRadius, hasHeight ? "h-full object-cover" : "")}
          style={hasHeight ? { objectPosition: objectPosition || "50% 50%" } : undefined}
          draggable={false}
        />
      </div>
    )
  },
}
