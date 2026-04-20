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
import { createPortal } from "react-dom"
import { Undo2, Redo2, X } from "lucide-react"
import { usePuck } from "@measured/puck"
import { FloatingToolbar, TEXT_COMPONENTS } from "@/components/FloatingToolbar"
import { InlineEditor } from "@/components/InlineEditor"

const CROPPABLE_TYPES = new Set(["ImageBlock", "Spacer"])
import { ViewportContext } from "@/hooks/useResponsiveGrid"
import type { Breakpoint } from "@/hooks/useResponsiveGrid"
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

/** Find a component's index and zone compound key for Puck dispatch actions */
function findComponentLocation(data: Data, id: string): { index: number; zone: string } | null {
  const ROOT_ZONE = "root:default-zone"
  for (let i = 0; i < (data.content || []).length; i++) {
    if (data.content[i].props?.id === id) return { index: i, zone: ROOT_ZONE }
  }
  if ((data as any).zones) {
    for (const [zoneKey, zoneItems] of Object.entries((data as any).zones) as [string, any[]][]) {
      for (let i = 0; i < zoneItems.length; i++) {
        if (zoneItems[i].props?.id === id) return { index: i, zone: zoneKey }
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

const viewportWidths = { desktop: "100%", tablet: "768px", mobile: "375px" }

export function CanvasOverlay({ children, viewport = "desktop" }: { children: React.ReactNode; viewport?: "desktop" | "tablet" | "mobile" }) {
  const { selectedItem, dispatch, appState, history } = usePuck()
  const [selectedRect, setSelectedRect] = useState<DOMRect | null>(null)
  const [inlineEdit, setInlineEdit] = useState<InlineEditState | null>(null)
  const [undoSlot, setUndoSlot] = useState<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUndoSlot(document.getElementById("puck-nav-undo-slot"))
  }, [])

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

      if (CROPPABLE_TYPES.has(componentType)) {
        e.preventDefault()
        e.stopPropagation()
        setCropMode((prev) => !prev)
        return
      }

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
    const loc = findComponentLocation(appState.data as Data, selectedId)
    if (!loc) return
    dispatch({ type: "duplicate", sourceIndex: loc.index, sourceZone: loc.zone } as any)
  }, [selectedId, appState.data, dispatch])

  // Delete via Puck dispatch
  const handleDelete = useCallback(() => {
    if (!selectedId) return
    const loc = findComponentLocation(appState.data as Data, selectedId)
    if (!loc) return
    dispatch({ type: "remove", index: loc.index, zone: loc.zone } as any)
  }, [selectedId, appState.data, dispatch])

  const [cropMode, setCropMode] = useState(false)
  const [cropLocalHeight, setCropLocalHeight] = useState<number | null>(null)
  const [cropResizing, setCropResizing] = useState(false)
  const cropStartY = useRef(0)
  const cropStartH = useRef(0)
  const appStateRef = useRef(appState)
  appStateRef.current = appState
  const clipboardRef = useRef<any>(null)

  useEffect(() => {
    if (!selectedType || !CROPPABLE_TYPES.has(selectedType)) setCropMode(false)
  }, [selectedType, selectedId])

  const handleCropToggle = useCallback(() => {
    if (selectedType && CROPPABLE_TYPES.has(selectedType)) setCropMode((prev) => !prev)
  }, [selectedType])

  function commitCropHeight(height: number) {
    const state = appStateRef.current
    const sel = state.ui.itemSelector
    if (!sel) return
    const data = JSON.parse(JSON.stringify(state.data))
    const content = sel.zone ? (data.zones?.[sel.zone] ?? []) : data.content
    const item = content[sel.index]
    if (!item || !CROPPABLE_TYPES.has(item.type)) return
    item.props.height = String(height)
    dispatch({ type: "setData", data })
  }

  function handleCropResizeStart(e: React.PointerEvent, direction: "top" | "bottom") {
    e.preventDefault()
    e.stopPropagation()
    if (!selectedRect) return
    cropStartY.current = e.clientY
    const currentH = (selectedItem?.props as any)?.height ? parseInt((selectedItem.props as any).height) : Math.round(selectedRect.height)
    cropStartH.current = currentH
    setCropResizing(true)
    setCropLocalHeight(currentH)

    const el = selectedId ? findComponentElement(selectedId) : null
    const container = el?.querySelector("[data-crop-target]") as HTMLElement | null
    const img = container?.querySelector("img") as HTMLElement | null

    if (container) { container.style.overflow = "hidden"; container.style.transition = "none" }
    if (img) { img.style.height = "100%"; img.style.objectFit = "cover"; img.style.transition = "none" }

    const multiplier = direction === "bottom" ? 1 : -1

    const onMove = (ev: PointerEvent) => {
      ev.preventDefault()
      const delta = (ev.clientY - cropStartY.current) * multiplier
      const newH = Math.max(8, Math.round(cropStartH.current + delta))
      setCropLocalHeight(newH)
      if (container) container.style.height = `${newH}px`
    }
    const onUp = (ev: PointerEvent) => {
      const delta = (ev.clientY - cropStartY.current) * multiplier
      const finalH = Math.max(8, Math.round(cropStartH.current + delta))
      commitCropHeight(finalH)
      setCropLocalHeight(null)
      setCropResizing(false)
      if (container) { container.style.height = ""; container.style.overflow = ""; container.style.transition = "" }
      if (img) { img.style.height = ""; img.style.objectFit = ""; img.style.transition = "" }
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  function handleCropReset() {
    const state = appStateRef.current
    const sel = state.ui.itemSelector
    if (!sel) return
    const data = JSON.parse(JSON.stringify(state.data))
    const content = sel.zone ? (data.zones?.[sel.zone] ?? []) : data.content
    const item = content[sel.index]
    if (!item) return
    item.props.height = item.type === "Spacer" ? "32" : ""
    dispatch({ type: "setData", data })
    setCropMode(false)
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey
      if (!isMod) return

      if (e.key === "c" && selectedItem && selectedId) {
        e.preventDefault()
        const loc = findComponentLocation(appState.data as Data, selectedId)
        if (!loc) return
        const content = loc.zone ? ((appState.data as Data).zones?.[loc.zone] ?? []) : (appState.data as Data).content
        clipboardRef.current = JSON.parse(JSON.stringify(content[loc.index]))
      }

      if (e.key === "v" && clipboardRef.current) {
        e.preventDefault()
        const clone = JSON.parse(JSON.stringify(clipboardRef.current))
        clone.props = { ...clone.props, id: `${clone.type}-${Date.now()}` }
        const data = JSON.parse(JSON.stringify(appState.data))
        if (selectedId) {
          const loc = findComponentLocation(data as Data, selectedId)
          if (loc) {
            const content = loc.zone ? (data.zones?.[loc.zone] ?? []) : data.content
            content.splice(loc.index + 1, 0, clone)
          } else {
            data.content.push(clone)
          }
        } else {
          data.content.push(clone)
        }
        dispatch({ type: "setData", data })
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedItem, selectedId, appState.data, dispatch])

  // Hide the original component DOM while inline editing so the overlay
  // shows the text without a ghosted duplicate underneath.
  useEffect(() => {
    if (!inlineEdit) return
    const el = findComponentElement(inlineEdit.componentId)
    if (!el) return
    const prevVisibility = el.style.visibility
    el.style.visibility = "hidden"
    return () => { el.style.visibility = prevVisibility }
  }, [inlineEdit, findComponentElement])

  const isConstrained = viewport !== "desktop"
  const viewportBreakpoint: Breakpoint | null = isConstrained ? (viewport as Breakpoint) : null

  return (
    <div ref={canvasRef} className="relative funnel-viewport">
      <div
        className={isConstrained ? "mx-auto overflow-hidden bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" : undefined}
        style={isConstrained ? { width: viewportWidths[viewport], maxWidth: "100%" } : undefined}
      >
        <ViewportContext.Provider value={viewportBreakpoint}>
          {children}
        </ViewportContext.Provider>
      </div>

      {/* Undo / Redo — portaled into nav slot */}
      {undoSlot && createPortal(
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Undo"
            disabled={!history.hasPast}
            onClick={() => history.back()}
            className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[12px] font-medium text-[#1d1d1f]/60 transition-colors hover:bg-black/[0.04] hover:text-[#1d1d1f] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Undo
          </button>
          <button
            type="button"
            title="Redo"
            disabled={!history.hasFuture}
            onClick={() => history.forward()}
            className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[12px] font-medium text-[#1d1d1f]/60 transition-colors hover:bg-black/[0.04] hover:text-[#1d1d1f] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Redo2 className="h-3.5 w-3.5" />
            Redo
          </button>
        </div>,
        undoSlot,
      )}

      {/* Floating toolbar — only when NOT inline editing */}
      {!inlineEdit && selectedType && (
        <FloatingToolbar
          componentType={selectedType}
          componentId={selectedId}
          isTextComponent={TEXT_COMPONENTS.has(selectedType)}
          onEdit={TEXT_COMPONENTS.has(selectedType) ? handleEdit : CROPPABLE_TYPES.has(selectedType) ? handleCropToggle : undefined}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          rect={selectedRect}
        />
      )}

      {/* Crop overlay — ImageBlock + Spacer */}
      {cropMode && selectedType && CROPPABLE_TYPES.has(selectedType) && selectedRect && (() => {
        const h = cropLocalHeight ?? ((selectedItem?.props as any)?.height ? parseInt((selectedItem.props as any).height) : Math.round(selectedRect.height))
        const r = cropResizing ? { ...selectedRect, height: h } : selectedRect
        return (
          <>
            <div
              className="fixed pointer-events-none"
              style={{ top: r.top, left: r.left, width: r.width, height: r.height, zIndex: 9988, borderRadius: 12, boxShadow: "inset 0 0 0 2.5px #3b82f6, 0 0 0 1px rgba(59,130,246,0.15), 0 4px 24px rgba(59,130,246,0.1)" }}
            />
            {(["top", "bottom"] as const).map((pos) => (
              <div
                key={pos}
                className="fixed flex items-center justify-center cursor-ns-resize"
                style={{ top: pos === "top" ? r.top - 8 : r.top + r.height - 8, left: r.left, width: r.width, height: 16, zIndex: 9991 }}
                onPointerDown={(e) => handleCropResizeStart(e, pos)}
              >
                <div className="h-[5px] w-16 rounded-full bg-blue-500" style={{ boxShadow: "0 0 0 2.5px white, 0 2px 8px rgba(0,0,0,0.2)" }} />
              </div>
            ))}
            <div
              className="fixed flex items-center gap-1.5"
              style={{ top: r.top + r.height / 2 - 14, left: r.left + r.width / 2 - 44, zIndex: 9991 }}
            >
              <span className="rounded-full bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 text-[11px] font-semibold text-white tabular-nums shadow-xl">
                {h}px
              </span>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); handleCropReset() }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-white/70 hover:bg-red-500 hover:text-white transition-colors shadow-xl backdrop-blur-sm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )
      })()}

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
