import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { DraggablePanel } from "@/components/DraggablePanel"
import { Paintbrush } from "lucide-react"
import type { Editor } from "@tiptap/react"

interface TextColorPickerProps {
  editor: Editor
  variant?: "light" | "dark"
}

const COLORS = [
  { label: "Indigo",  value: "#4f46e5" },
  { label: "Blue",   value: "#2563eb" },
  { label: "Green",  value: "#059669" },
  { label: "Rose",   value: "#e11d48" },
  { label: "Amber",  value: "#d97706" },
  { label: "Slate",  value: "#64748b" },
  { label: "White",  value: "#ffffff" },
  { label: "Black",  value: "#0f172a" },
]

export function TextColorPicker({ editor, variant = "light" }: TextColorPickerProps) {
  const isDark = variant === "dark"
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentColor: string | undefined = editor.getAttributes("textStyle").color

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  function apply(color: string) {
    if (editor.state.selection.empty) return
    const isTextStyleActive = editor.isActive("textStyle")
    if (isTextStyleActive) {
      editor.chain().focus().extendMarkRange("textStyle").setColor(color).run()
    } else {
      editor.chain().focus().setColor(color).run()
    }
    setOpen(false)
  }

  function reset() {
    editor.chain().focus().unsetColor().run()
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        title="Text Color"
        onMouseDown={(e) => {
          e.preventDefault()
          setOpen(!open)
        }}
        className={cn(
          "flex h-6 w-6 flex-col items-center justify-center gap-0 rounded-md transition-all",
          isDark
            ? currentColor ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
            : currentColor ? "text-gray-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600",
        )}
      >
        <Paintbrush className="h-3 w-3" />
        <span
          className="mt-px h-[2px] w-3 rounded-full transition-colors"
          style={{ backgroundColor: currentColor || (isDark ? "rgba(255,255,255,0.4)" : "#9ca3af") }}
        />
      </button>

      {open && (
        <DraggablePanel
          className="fixed z-[9999] w-44 rounded-xl border border-gray-200 bg-white p-3 shadow-xl"
          style={(() => {
            const r = ref.current?.getBoundingClientRect()
            return { top: (r?.bottom ?? 0) + 6, left: Math.max(8, Math.min(r?.left ?? 0, window.innerWidth - 184)) }
          })()}
        >
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Text Color</label>

          <div className="mb-3 grid grid-cols-4 gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onMouseDown={(e) => { e.preventDefault(); apply(c.value) }}
                className={cn(
                  "h-6 w-6 rounded-full border-2 transition-all hover:scale-110",
                  currentColor === c.value
                    ? "border-indigo-500 scale-110"
                    : "border-gray-200 hover:border-gray-400",
                  c.value === "#ffffff" && "border-gray-300",
                )}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>

          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); reset() }}
            className="flex w-full items-center justify-center rounded-lg bg-gray-50 py-1.5 text-[11px] font-semibold text-gray-500 transition-all hover:bg-gray-100"
          >
            Reset to default
          </button>
        </DraggablePanel>
      )}
    </div>
  )
}
