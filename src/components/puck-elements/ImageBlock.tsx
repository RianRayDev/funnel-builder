import { useCallback, useRef, useState } from "react"
import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { ImageIcon, Upload, Loader2, Grid2x2, X } from "lucide-react"
import { uploadToStorage, deleteFromStorage } from "@/hooks/useStorage"
import { ImageLibrary } from "@/components/ImageLibrary"

interface ImageBlockProps {
  src: string
  alt: string
  borderRadius: string
  objectFit: string
  maxHeight: string
  objectPosition: string
}

const positionOptions = [
  { v: "top left", r: 0, c: 0 },
  { v: "top center", r: 0, c: 1 },
  { v: "top right", r: 0, c: 2 },
  { v: "center left", r: 1, c: 0 },
  { v: "center center", r: 1, c: 1 },
  { v: "center right", r: 1, c: 2 },
  { v: "bottom left", r: 2, c: 0 },
  { v: "bottom center", r: 2, c: 1 },
  { v: "bottom right", r: 2, c: 2 },
]

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
      {/* Mode toggle */}
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

      {/* Preview */}
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
    objectFit: {
      type: "select", label: "Fit",
      options: [
        { value: "object-cover", label: "Cover" },
        { value: "object-contain", label: "Contain" },
        { value: "object-fill", label: "Fill" },
      ],
    },
    maxHeight: {
      type: "select", label: "Max Height",
      options: [
        { value: "", label: "Auto" },
        { value: "max-h-48", label: "Small (192px)" },
        { value: "max-h-72", label: "Medium (288px)" },
        { value: "max-h-96", label: "Large (384px)" },
        { value: "max-h-[500px]", label: "XL (500px)" },
      ],
    },
    objectPosition: {
      type: "custom",
      label: "Focus Point",
      render: ({ value, onChange }) => (
        <div className="space-y-1.5">
          <div className="mx-auto grid w-20 grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1.5">
            {positionOptions.map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => onChange(opt.v)}
                className={cn(
                  "h-5 w-5 rounded-full border-2 transition-all",
                  value === opt.v
                    ? "border-blue-500 bg-blue-500 scale-110"
                    : "border-gray-300 bg-white hover:border-gray-400",
                )}
              />
            ))}
          </div>
          <p className="text-center text-[9px] text-gray-400">{value || "center center"}</p>
        </div>
      ),
    },
  },
  defaultProps: {
    src: "",
    alt: "Image",
    borderRadius: "rounded-xl",
    objectFit: "object-cover",
    maxHeight: "",
    objectPosition: "center center",
  },
  render: ({ src, alt, borderRadius, objectFit, maxHeight, objectPosition }) =>
    src ? (
      <img src={src} alt={alt} loading="lazy" className={cn("w-full", borderRadius, objectFit, maxHeight)} style={{ objectPosition: objectPosition || "center center" }} />
    ) : (
      <div className={cn("flex h-48 w-full items-center justify-center bg-gray-100", borderRadius)}>
        <div className="flex flex-col items-center gap-2 text-gray-300">
          <ImageIcon className="h-10 w-10" />
          <span className="text-xs font-medium">Upload or pick from library</span>
        </div>
      </div>
    ),
}
