import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { HIGHLIGHT_COLORS, HIGHLIGHT_RADIUS, HIGHLIGHT_PADDING, HIGHLIGHT_STYLE } from "@/lib/decoration-styles"
import { DraggablePanel } from "@/components/DraggablePanel"
import { Highlighter } from "lucide-react"
import type { Editor } from "@tiptap/react"

interface HighlightPickerProps {
  editor: Editor
  variant?: "light" | "dark"
}

export function HighlightPicker({ editor, variant = "light" }: HighlightPickerProps) {
  const isDark = variant === "dark"
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isActive = editor.isActive("fancyHighlight")

  const currentAttrs = isActive
    ? (editor.getAttributes("fancyHighlight") as { color?: string; radius?: string; padding?: string; highlightStyle?: string })
    : { color: "yellow", radius: "sm", padding: "normal", highlightStyle: "solid" }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  function apply(attrs: { color?: string; radius?: string; padding?: string; highlightStyle?: string }) {
    const merged = { ...currentAttrs, ...attrs }
    if (isActive) {
      // Use updateAttributes to reliably replace attrs on the existing mark range
      editor.chain().focus().extendMarkRange("fancyHighlight").updateAttributes("fancyHighlight", merged).run()
    } else {
      editor.chain().focus().setFancyHighlight(merged).run()
    }
  }

  function remove() {
    editor.chain().focus().unsetFancyHighlight().run()
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        title="Highlight"
        onMouseDown={(e) => {
          e.preventDefault()
          setOpen(!open)
        }}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-md transition-all",
          isDark
            ? isActive ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
            : isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600",
        )}
      >
        <Highlighter className="h-3 w-3" />
      </button>

      {open && (
        <DraggablePanel className="absolute left-0 top-full z-50 mt-1.5 w-52 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
          {/* Quick toggle */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              if (isActive) { remove() } else { apply(currentAttrs); setOpen(false) }
            }}
            className={cn(
              "mb-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-semibold transition-all",
              isActive
                ? "bg-indigo-50 text-indigo-600"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100",
            )}
          >
            <Highlighter className="h-3 w-3" />
            {isActive ? "Remove" : "Apply"}
          </button>

          {/* Color */}
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Color</label>
          <div className="mb-2.5 flex gap-1.5">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onMouseDown={(e) => { e.preventDefault(); apply({ color: c.value }) }}
                className={cn(
                  "h-5 w-5 rounded-full border-2 transition-all",
                  currentAttrs.color === c.value
                    ? "border-indigo-500 scale-110"
                    : "border-gray-200 hover:border-gray-400",
                )}
                style={{ backgroundColor: c.swatch }}
              />
            ))}
          </div>

          {/* Style */}
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Style</label>
          <div className="mb-2.5 flex gap-0.5 rounded-lg bg-gray-100 p-0.5">
            {HIGHLIGHT_STYLE.map((s) => (
              <button
                key={s.value}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); apply({ highlightStyle: s.value }) }}
                className={cn(
                  "flex-1 rounded-md py-1 text-center text-[10px] font-medium transition-all",
                  currentAttrs.highlightStyle === s.value ? "bg-white shadow-sm text-gray-700" : "text-gray-400",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Corners */}
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Corners</label>
          <div className="mb-2.5 flex gap-0.5 rounded-lg bg-gray-100 p-0.5">
            {HIGHLIGHT_RADIUS.map((r) => (
              <button
                key={r.value}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); apply({ radius: r.value }) }}
                className={cn(
                  "flex-1 rounded-md py-1 text-center text-[10px] font-medium transition-all",
                  currentAttrs.radius === r.value ? "bg-white shadow-sm text-gray-700" : "text-gray-400",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Padding */}
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Padding</label>
          <div className="flex gap-0.5 rounded-lg bg-gray-100 p-0.5">
            {HIGHLIGHT_PADDING.map((p) => (
              <button
                key={p.value}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); apply({ padding: p.value }) }}
                className={cn(
                  "flex-1 rounded-md py-1 text-center text-[10px] font-medium transition-all",
                  currentAttrs.padding === p.value ? "bg-white shadow-sm text-gray-700" : "text-gray-400",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </DraggablePanel>
      )}
    </div>
  )
}
