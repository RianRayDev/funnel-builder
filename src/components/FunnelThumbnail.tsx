import { Render } from "@measured/puck"
import { puckConfig } from "@/lib/puck-config"
import { Layers } from "lucide-react"
import type { Data } from "@measured/puck"

export function FunnelThumbnail({ data }: { data: Data }) {
  const hasContent = data.content && data.content.length > 0

  if (!hasContent) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-black/[0.04]">
          <Layers className="h-5 w-5 text-[#1d1d1f]/15" strokeWidth={1.5} />
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
      {/* Centered, scaled-down render */}
      <div
        className="pointer-events-none shrink-0 select-none"
        style={{
          width: "1280px",
          height: "900px",
          transform: "scale(0.28)",
          transformOrigin: "top center",
          marginTop: "-2px",
        }}
      >
        <div className="bg-white text-[#1a1a2e]">
          <Render config={puckConfig} data={data} />
        </div>
      </div>
      {/* Soft fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
    </div>
  )
}
