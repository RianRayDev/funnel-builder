/**
 * Canvas interaction layer.
 * Rendered inside Puck's preview override.
 * Provides:
 * - Floating toolbar on component selection
 * - Inline text editing on double-click
 *
 * Uses usePuck() to read selection state and dispatch data updates.
 */
import { useCallback, useEffect, useRef, useState } from "react"
import { usePuck } from "@measured/puck"
import { FloatingToolbar, TEXT_COMPONENTS } from "@/components/FloatingToolbar"
import { InlineEditor } from "@/components/InlineEditor"
import type { Data, ComponentData } from "@measured/puck"

/** Which prop holds the primary text for each text component */
const TEXT_PROP_MAP: Record<string, string> = {
  Heading: "text",
  TextBlock: "content",
  Banner: "heading",
}

interface InlineEditState {
  componentId: string
  componentType: string
  propName: string
  value: string
  rect: DOMRect
  className?: string
  style?: React.CSSProperties
}

/** Find a component in Puck's data by its ID */
function findComponentById(data: Data, id: string): ComponentData | null {
  for (const item of data.content || []) {
    if (item.props?.id === id) return item
  }
  if ((data as any).zones) {
    for (const zone of Object.values((data as any).zones) as any[]) {
      for (const item of zone) {
        if (item.props?.id === id) return item
      }
    }
  }
  return null
}

/** Update a component's prop in the data tree (deep clone first) */
function updateComponentProp(data: Data, componentId: string, propName: string, value: string): Data {
  const cloned = JSON.parse(JSON.stringify(data)) as Data
  for (const item of cloned.content || []) {
    if (item.props?.id === componentId) {
      ;(item.props as any)[propName] = value
      return cloned
    }
  }
  if ((cloned as any).zones) {
    for (const zone of Object.values((cloned as any).zones) as any[]) {
      for (const item of zone) {
        if (item.props?.id === componentId) {
          ;(item.props as any)[propName] = value
          return cloned
        }
      }
    }
  }
  return cloned
}

export function CanvasOverlay({ children }: { children: React.ReactNode }) {
  const { selectedItem, dispatch, appState } = usePuck()
  const [selectedRect, setSelectedRect] = useState<DOMRect | null>(null)
  const [inlineEdit, setInlineEdit] = useState<InlineEditState | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const selectedType = selectedItem?.type || null
  const selectedId = (selectedItem as any)?.props?.id || null

  // Find the DOM element for a component by its Puck ID
  const findComponentElement = useCallback((id: string): HTMLElement | null => {
    if (!canvasRef.current) return null
    // data-puck-component stores the component ID
    return canvasRef.current.querySelector(`[data-puck-component="${id}"]`) as HTMLElement | null
  }, [])

  // Update selected component rect
  useEffect(() => {
    if (!selectedId || inlineEdit) {
      setSelectedRect(null)
      return
    }

    const updateRect = () => {
      const el = findComponentElement(selectedId)
      if (el) {
        setSelectedRect(el.getBoundingClientRect())
      } else {
        setSelectedRect(null)
      }
    }

    updateRect()
    const timer = setInterval(updateRect, 300)
    window.addEventListener("scroll", updateRect, true)
    window.addEventListener("resize", updateRect)

    return () => {
      clearInterval(timer)
      window.removeEventListener("scroll", updateRect, true)
      window.removeEventListener("resize", updateRect)
    }
  }, [selectedId, findComponentElement, inlineEdit])

  // Handle double-click for inline editing
  useEffect(() => {
    if (!canvasRef.current) return

    function handleDblClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const componentEl = target.closest("[data-puck-component]") as HTMLElement | null
      if (!componentEl) return

      // data-puck-component stores the component ID, not the type
      const componentId = componentEl.getAttribute("data-puck-component")
      if (!componentId) return

      // Look up the component data from Puck's state to get its type
      const data = appState.data as Data
      const componentData = findComponentById(data, componentId)
      if (!componentData) return

      const componentType = componentData.type
      if (!TEXT_COMPONENTS.has(componentType)) return

      const propName = TEXT_PROP_MAP[componentType]
      if (!propName) return

      e.preventDefault()
      e.stopPropagation()

      const rect = componentEl.getBoundingClientRect()
      const computedStyle = window.getComputedStyle(componentEl)

      setInlineEdit({
        componentId,
        componentType,
        propName,
        value: (componentData.props as any)[propName] || "",
        rect,
        style: {
          fontFamily: computedStyle.fontFamily,
          fontSize: computedStyle.fontSize,
          fontWeight: computedStyle.fontWeight,
          lineHeight: computedStyle.lineHeight,
          letterSpacing: computedStyle.letterSpacing,
          textAlign: computedStyle.textAlign as any,
          color: computedStyle.color,
        },
      })
    }

    const el = canvasRef.current
    el.addEventListener("dblclick", handleDblClick)
    return () => el.removeEventListener("dblclick", handleDblClick)
  }, [appState.data])

  // Save inline edit
  const handleInlineSave = useCallback((html: string) => {
    if (!inlineEdit) return

    const updatedData = updateComponentProp(
      appState.data as Data,
      inlineEdit.componentId,
      inlineEdit.propName,
      html,
    )

    dispatch({ type: "setData", data: updatedData })
    setInlineEdit(null)
  }, [inlineEdit, appState.data, dispatch])

  // Close inline editor
  const handleInlineClose = useCallback(() => {
    setInlineEdit(null)
  }, [])

  // Enter inline edit from floating toolbar
  const handleEdit = useCallback(() => {
    if (!selectedItem || !selectedId || !selectedType) return
    if (!TEXT_COMPONENTS.has(selectedType)) return

    const propName = TEXT_PROP_MAP[selectedType]
    if (!propName) return

    const el = findComponentElement(selectedId)
    if (!el) return

    const rect = el.getBoundingClientRect()
    const computedStyle = window.getComputedStyle(el)

    setInlineEdit({
      componentId: selectedId,
      componentType: selectedType,
      propName,
      value: ((selectedItem.props as any)[propName] || ""),
      rect,
      style: {
        fontFamily: computedStyle.fontFamily,
        fontSize: computedStyle.fontSize,
        fontWeight: computedStyle.fontWeight,
        lineHeight: computedStyle.lineHeight,
        letterSpacing: computedStyle.letterSpacing,
        textAlign: computedStyle.textAlign as any,
        color: computedStyle.color,
      },
    })
  }, [selectedItem, selectedId, selectedType, findComponentElement])

  // Duplicate via Puck dispatch
  const handleDuplicate = useCallback(() => {
    if (!selectedId) return
    dispatch({ type: "duplicate", sourceId: selectedId } as any)
  }, [selectedId, dispatch])

  // Delete via Puck dispatch
  const handleDelete = useCallback(() => {
    if (!selectedId) return
    dispatch({ type: "remove", id: selectedId } as any)
  }, [selectedId, dispatch])

  return (
    <div ref={canvasRef} className="relative">
      {children}

      {/* Floating toolbar — only when NOT inline editing */}
      {!inlineEdit && selectedType && (
        <FloatingToolbar
          componentType={selectedType}
          componentId={selectedId}
          isTextComponent={TEXT_COMPONENTS.has(selectedType)}
          onEdit={TEXT_COMPONENTS.has(selectedType) ? handleEdit : undefined}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          rect={selectedRect}
        />
      )}

      {/* Inline editor overlay */}
      {inlineEdit && (
        <InlineEditor
          value={inlineEdit.value}
          onSave={handleInlineSave}
          onClose={handleInlineClose}
          rect={inlineEdit.rect}
          style={inlineEdit.style}
        />
      )}
    </div>
  )
}
