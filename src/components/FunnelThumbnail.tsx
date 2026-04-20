import { Component } from "react"
import { Render } from "@measured/puck"
import { puckConfig } from "@/lib/puck-config"
import { Layers } from "lucide-react"
import type { Data } from "@measured/puck"
import type { ReactNode } from "react"

function EmptyThumbnail() {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ background: 'linear-gradient(135deg, oklch(0.96 0.02 270), oklch(0.93 0.03 240))' }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm">
        <Layers className="h-6 w-6 text-[#1d1d1f]/20" strokeWidth={1.5} />
      </div>
    </div>
  )
}

class ThumbnailBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <EmptyThumbnail /> : this.props.children }
}

export function FunnelThumbnail({ data }: { data: Data }) {
  const hasContent = data.content && data.content.length > 0

  if (!hasContent) return <EmptyThumbnail />

  return (
    <ThumbnailBoundary>
      <div className="absolute inset-0 flex items-start justify-center overflow-hidden bg-white">
        <div
          className="pointer-events-none shrink-0 select-none"
          style={{
            width: "1280px",
            height: "900px",
            transform: "scale(0.42)",
            transformOrigin: "top center",
          }}
        >
          <div className="bg-white text-[#1a1a2e]">
            <Render config={puckConfig} data={data} />
          </div>
        </div>
      </div>
    </ThumbnailBoundary>
  )
}
