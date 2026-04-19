import { createContext, useContext, useRef, useState, useEffect } from "react"

export type Breakpoint = "mobile" | "tablet" | "desktop"

export const ViewportContext = createContext<Breakpoint | null>(null)

export function useResponsiveGrid() {
  const override = useContext(ViewportContext)
  const ref = useRef<HTMLDivElement>(null)
  const [measured, setMeasured] = useState<Breakpoint>("desktop")

  useEffect(() => {
    if (override) return
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w < 500) setMeasured("mobile")
      else if (w < 750) setMeasured("tablet")
      else setMeasured("desktop")
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [override])

  return { ref, breakpoint: override ?? measured }
}

export function responsiveColumns(
  columns: string,
  breakpoint: Breakpoint,
  overrides?: { tablet?: string; mobile?: string },
): string {
  if (breakpoint === "mobile") {
    const mobile = overrides?.mobile ?? "auto"
    if (mobile === "adaptive") return "grid-cols-1"
    if (mobile === "auto") return "grid-cols-1"
    return mobile
  }
  if (breakpoint === "tablet") {
    const tablet = overrides?.tablet ?? "auto"
    if (tablet === "adaptive") return "grid-cols-1"
    if (tablet === "auto") {
      const desktopCols = parseInt(columns.replace("grid-cols-", "")) || 2
      return `grid-cols-${Math.max(1, desktopCols - 1)}`
    }
    return tablet
  }
  return columns
}
