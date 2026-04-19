import { useRef, useState, useEffect } from "react"

export type Breakpoint = "mobile" | "tablet" | "desktop"

export function useResponsiveGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w < 640) setBreakpoint("mobile")
      else if (w < 768) setBreakpoint("tablet")
      else setBreakpoint("desktop")
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, breakpoint }
}

export function responsiveColumns(columns: string, breakpoint: Breakpoint): string {
  const colCount = parseInt(columns.replace("grid-cols-", ""))
  if (breakpoint === "mobile") return "grid-cols-1"
  if (breakpoint === "tablet" && colCount > 2) return "grid-cols-2"
  return columns
}
