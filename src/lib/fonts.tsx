import { cn } from "@/lib/utils"
import { Type, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export const fontOptions = [
  { value: "font-sans", label: "System", family: "system-ui, sans-serif", preview: "Aa" },
  { value: "font-[Poppins]", label: "Poppins", family: "Poppins, sans-serif", preview: "Aa" },
  { value: "font-[Inter]", label: "Inter", family: "Inter, sans-serif", preview: "Aa" },
  { value: "font-['DM_Sans']", label: "DM Sans", family: "DM Sans, sans-serif", preview: "Aa" },
  { value: "font-['Space_Grotesk']", label: "Space Grotesk", family: "Space Grotesk, sans-serif", preview: "Aa" },
  { value: "font-['Playfair_Display']", label: "Playfair", family: "Playfair Display, serif", preview: "Aa" },
]

/** Compact font dropdown — same style as the TypographyPanel font picker */
export function FontPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = fontOptions.find((f) => f.value === value) || fontOptions[0]

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-2 py-1 text-left transition-all hover:border-gray-300"
      >
        <div className="flex items-center gap-1.5">
          <Type className="h-3 w-3 text-gray-400" />
          <span className="text-[11px] font-medium text-gray-700" style={{ fontFamily: selected.family }}>{selected.label}</span>
        </div>
        <ChevronDown className={cn("h-2.5 w-2.5 text-gray-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white py-0.5 shadow-lg">
          {fontOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={cn(
                "flex w-full items-center gap-2 px-2.5 py-1.5 text-left transition-all",
                value === opt.value ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-50 text-gray-600",
              )}
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-100 text-[10px] font-semibold text-gray-500"
                style={{ fontFamily: opt.family }}
              >
                Aa
              </span>
              <span className="text-[11px] font-medium" style={{ fontFamily: opt.family }}>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
