import { useRef, useState } from "react"
import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { ImageIcon, Upload, Loader2, Link2, X } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ImageBlockProps {
  src: string
  alt: string
  borderRadius: string
  objectFit: string
  maxHeight: string
}

const BUCKET = "funnel-assets"

async function uploadFile(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop()
  const name = `images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { data, error } = await supabase.storage.from(BUCKET).upload(name, file, { cacheControl: "3600", upsert: false })
  if (error) return null
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
  return urlData.publicUrl
}

function ImageUploadField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [mode, setMode] = useState<"upload" | "url">(value ? "url" : "upload")

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { setError("Not an image file"); return }
    if (file.size > 5 * 1024 * 1024) { setError("Max 5MB"); return }

    setUploading(true)
    setError("")
    const url = await uploadFile(file)
    setUploading(false)

    if (url) {
      onChange(url)
      setMode("url")
    } else {
      setError("Upload failed — check Supabase bucket exists")
    }
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
        <button type="button" onClick={() => setMode("url")}
          className={cn("flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all",
            mode === "url" ? "bg-white shadow-sm text-gray-700" : "text-gray-400")}>
          <Link2 className="h-3 w-3" /> URL
        </button>
      </div>

      {mode === "upload" ? (
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 py-4 text-xs font-medium text-gray-400 transition-colors hover:border-blue-300 hover:text-blue-500 disabled:opacity-50"
          >
            {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4" /> Click to upload image</>}
          </button>
          <p className="mt-1 text-[10px] text-gray-400">JPG, PNG, WebP, GIF — max 5MB</p>
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      )}

      {/* Preview */}
      {value && (
        <div className="relative">
          <img src={value} alt="Preview" className="h-20 w-full rounded-lg object-cover" />
          <button type="button" onClick={() => onChange("")}
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
  },
  defaultProps: {
    src: "",
    alt: "Image",
    borderRadius: "rounded-xl",
    objectFit: "object-cover",
    maxHeight: "",
  },
  render: ({ src, alt, borderRadius, objectFit, maxHeight }) =>
    src ? (
      <img src={src} alt={alt} loading="lazy" className={cn("w-full", borderRadius, objectFit, maxHeight)} />
    ) : (
      <div className={cn("flex h-48 w-full items-center justify-center bg-gray-100", borderRadius)}>
        <div className="flex flex-col items-center gap-2 text-gray-300">
          <ImageIcon className="h-10 w-10" />
          <span className="text-xs font-medium">Upload or paste image URL</span>
        </div>
      </div>
    ),
}
