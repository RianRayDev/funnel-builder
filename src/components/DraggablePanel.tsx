/**
 * Draggable panel wrapper.
 * Adds a 6-dot grip handle that allows the panel to be repositioned by dragging.
 * Used for underline picker, highlight picker, and link input so they don't cover the text being edited.
 */
import { useRef, useState, useCallback, useEffect } from "react"
import { GripVertical } from "lucide-react"

interface DraggablePanelProps {
  children: React.ReactNode
  className?: string
}

export function DraggablePanel({ children, className }: DraggablePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const dragging = useRef(false)
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number }>({ x: 0, y: 0, ox: 0, oy: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragging.current = true
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
  }, [offset])

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!dragging.current) return
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      setOffset({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy })
    }
    function handleMouseUp() {
      dragging.current = false
    }
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <div
      ref={panelRef}
      className={className}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className="mb-1 flex shrink-0 cursor-grab items-center justify-center active:cursor-grabbing"
      >
        <GripVertical className="h-3.5 w-3.5 text-gray-300" />
      </div>
      {children}
    </div>
  )
}
