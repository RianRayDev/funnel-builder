import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  UNDERLINE_STYLES, UNDERLINE_COLORS, UNDERLINE_THICKNESS,
  UNDERLINE_OFFSET, UNDERLINE_ANIMATION, underlineColorMap,
} from "@/lib/decoration-styles"
import { DraggablePanel } from "@/components/DraggablePanel"
import { Underline as UnderlineIcon } from "lucide-react"
import type { Editor } from "@tiptap/react"

interface UnderlinePickerProps {
  editor: Editor
  variant?: "light" | "dark"
}

export function UnderlinePicker({ editor, variant = "light" }: UnderlinePickerProps) {
  const isDark = variant === "dark"
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isActive = editor.isActive("fancyUnderline")

  const currentAttrs = isActive
    ? (editor.getAttributes("fancyUnderline") as {
        decoStyle?: string; color?: string; thickness?: string; offset?: string; animation?: string
      })
    : { decoStyle: "solid", color: "auto", thickness: "medium", offset: "normal", animation: "none" }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  function apply(attrs: Record<string, string>) {
    const merged = { ...currentAttrs, ...attrs }
    if (isActive) {
      // Use updateAttributes to reliably replace attrs on the existing mark range
      editor.chain().focus().extendMarkRange("fancyUnderline").updateAttributes("fancyUnderline", merged).run()
    } else {
      editor.chain().focus().setFancyUnderline(merged).run()
    }
  }

  function remove() {
    editor.chain().focus().unsetFancyUnderline().run()
    setOpen(false)
  }

  function PickerLabel({ children }: { children: React.ReactNode }) {
    return <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">{children}</label>
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        title="Underline"
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
        <UnderlineIcon className="h-3 w-3" />
      </button>

      {open && (
        <DraggablePanel className="absolute left-0 top-full z-50 mt-1.5 w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
          {/* Quick toggle */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              if (isActive) { remove() } else { apply(currentAttrs); setOpen(false) }
            }}
            className={cn(
              "mb-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-semibold transition-all",
              isActive ? "bg-indigo-50 text-indigo-600" : "bg-gray-50 text-gray-600 hover:bg-gray-100",
            )}
          >
            <UnderlineIcon className="h-3 w-3" />
            {isActive ? "Remove" : "Apply"}
          </button>

          {/* Style */}
          <PickerLabel>Style</PickerLabel>
          <div className="mb-2.5 grid grid-cols-3 gap-1">
            {UNDERLINE_STYLES.map((s) => (
              <button
                key={s.value}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); apply({ decoStyle: s.value }) }}
                className={cn(
                  "rounded-md px-1.5 py-1 text-[10px] font-medium transition-all",
                  currentAttrs.decoStyle === s.value
                    ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200"
                    : "text-gray-500 hover:bg-gray-50",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Color */}
          <PickerLabel>Color</PickerLabel>
          <div className="mb-2.5 flex gap-1">
            {UNDERLINE_COLORS.map((c) => (
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
                style={{
                  backgroundColor: c.value === "auto" ? "transparent" : underlineColorMap[c.value],
                  backgroundImage: c.value === "auto" ? "linear-gradient(135deg, #e5e7eb 50%, #4f46e5 50%)" : undefined,
                }}
              />
            ))}
          </div>

          {/* Weight + Spacing as dropdowns */}
          <div className="mb-2.5 grid grid-cols-2 gap-2">
            <div>
              <PickerLabel>Weight</PickerLabel>
              <select
                value={currentAttrs.thickness || "medium"}
                onChange={(e) => apply({ thickness: e.target.value })}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-full rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-100"
              >
                {UNDERLINE_THICKNESS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <PickerLabel>Spacing</PickerLabel>
              <select
                value={currentAttrs.offset || "normal"}
                onChange={(e) => apply({ offset: e.target.value })}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-full rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-100"
              >
                {UNDERLINE_OFFSET.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Animation with live preview */}
          <PickerLabel>Animation</PickerLabel>
          <div className="grid grid-cols-3 gap-1">
            {UNDERLINE_ANIMATION.map((a) => (
              <button
                key={a.value}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); apply({ animation: a.value }) }}
                className={cn(
                  "group flex flex-col items-center gap-1 rounded-md px-1 py-1.5 transition-all",
                  currentAttrs.animation === a.value
                    ? "bg-indigo-50 ring-1 ring-indigo-200"
                    : "hover:bg-gray-50",
                )}
              >
                {/* Live preview */}
                <span className="relative text-[10px] font-medium text-gray-600">
                  abc
                  {a.value === "none" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gray-400" />
                  )}
                  {a.value === "grow" && (
                    <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
                  )}
                  {a.value === "fade" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  )}
                </span>
                <span className={cn(
                  "text-[9px] font-medium",
                  currentAttrs.animation === a.value ? "text-indigo-600" : "text-gray-400",
                )}>
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </DraggablePanel>
      )}
    </div>
  )
}
