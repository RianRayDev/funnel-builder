import { useState } from "react"
import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { Play, ExternalLink, Check, X } from "lucide-react"

interface VideoEmbedProps {
  url: string
  aspectRatio: string
  borderRadius: string
  autoplay: boolean
}

function parseVideoUrl(url: string): { platform: string; id: string; embedUrl: string } | null {
  try {
    const u = new URL(url)
    // YouTube — standard watch, short URLs, shorts, embed
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      let id: string | null = null
      if (u.hostname.includes("youtu.be")) {
        id = u.pathname.slice(1)
      } else if (u.pathname.startsWith("/shorts/")) {
        id = u.pathname.split("/")[2]
      } else if (u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/")[2]
      } else {
        id = u.searchParams.get("v")
      }
      if (id) return { platform: "youtube", id, embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0` }
    }
    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const segments = u.pathname.split("/").filter(Boolean)
      const id = segments.find((s) => /^\d+$/.test(s))
      if (id) return { platform: "vimeo", id, embedUrl: `https://player.vimeo.com/video/${id}` }
    }
  } catch { /* invalid URL */ }
  return null
}

function VideoURLField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [input, setInput] = useState(value)
  const parsed = value ? parseVideoUrl(value) : null

  function handlePaste(url: string) {
    setInput(url)
    if (parseVideoUrl(url)) onChange(url)
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => handlePaste(e.target.value)}
          placeholder="Paste YouTube or Vimeo URL..."
          className="w-full rounded-lg border border-gray-200 py-2 pl-3 pr-8 text-xs focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        {value && (
          <button type="button" onClick={() => { setInput(""); onChange("") }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {parsed && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5">
          <Check className="h-3 w-3 text-green-500" />
          <span className="text-[10px] font-medium text-green-600 capitalize">{parsed.platform} video detected</span>
        </div>
      )}

      {input && !parsed && input.length > 5 && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5">
          <ExternalLink className="h-3 w-3 text-amber-500" />
          <span className="text-[10px] font-medium text-amber-600">Paste a full YouTube or Vimeo URL</span>
        </div>
      )}

      <p className="text-[10px] text-gray-400">Supports YouTube and Vimeo links</p>
    </div>
  )
}

export const VideoEmbed: ComponentConfig<VideoEmbedProps> = {
  label: "Video",
  fields: {
    url: {
      type: "custom",
      label: "Video URL",
      render: ({ value, onChange }) => <VideoURLField value={value} onChange={onChange} />,
    },
    aspectRatio: {
      type: "custom",
      label: "Aspect Ratio",
      render: ({ value, onChange }) => (
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {[
            { v: "aspect-video", l: "16:9" },
            { v: "aspect-[4/3]", l: "4:3" },
            { v: "aspect-square", l: "1:1" },
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
    autoplay: { type: "radio", label: "Autoplay (muted)", options: [{ value: true, label: "Yes" }, { value: false, label: "No" }] },
  },
  defaultProps: { url: "", aspectRatio: "aspect-video", borderRadius: "rounded-xl", autoplay: false },
  render: ({ url, aspectRatio, borderRadius, autoplay }) => {
    const parsed = url ? parseVideoUrl(url) : null
    const embedUrl = parsed ? `${parsed.embedUrl}${autoplay ? (parsed.embedUrl.includes("?") ? "&" : "?") + "autoplay=1&mute=1" : ""}` : null

    if (!embedUrl) {
      return (
        <div className={cn("flex items-center justify-center bg-slate-100", aspectRatio, borderRadius)}>
          <div className="flex flex-col items-center gap-3 text-slate-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
              <Play className="h-7 w-7 text-slate-400" fill="currentColor" />
            </div>
            <span className="text-sm font-medium">Paste a YouTube or Vimeo URL</span>
          </div>
        </div>
      )
    }

    return (
      <div className={cn("overflow-hidden", borderRadius)}>
        <iframe src={embedUrl} className={cn("w-full", aspectRatio)} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen frameBorder="0" loading="lazy" />
      </div>
    )
  },
}
