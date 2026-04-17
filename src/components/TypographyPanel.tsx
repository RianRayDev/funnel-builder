/**
 * Webflow-style typography panel.
 * Compact layout: Font → Weight|Size|Height|Spacing → Color → Align|Transform
 */
import { cn } from "@/lib/utils"
import { fontOptions } from "@/lib/fonts"
import {
  AlignLeft, AlignCenter, AlignRight,
  Type, ChevronDown,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

// ─── Options ───────────────────────────────────────────────

const weightOptions = [
  { value: "font-light", label: "Light", short: "300" },
  { value: "font-normal", label: "Regular", short: "400" },
  { value: "font-medium", label: "Medium", short: "500" },
  { value: "font-semibold", label: "Semi", short: "600" },
  { value: "font-bold", label: "Bold", short: "700" },
  { value: "font-extrabold", label: "Extra", short: "800" },
]

const sizeOptions = [
  { value: "text-xs", label: "12", px: 12 },
  { value: "text-sm", label: "14", px: 14 },
  { value: "text-base", label: "16", px: 16 },
  { value: "text-lg", label: "18", px: 18 },
  { value: "text-xl", label: "20", px: 20 },
  { value: "text-2xl", label: "24", px: 24 },
  { value: "text-3xl", label: "30", px: 30 },
  { value: "text-4xl", label: "36", px: 36 },
  { value: "text-5xl", label: "48", px: 48 },
]

const lineHeightOptions = [
  { value: "leading-none", label: "1.0" },
  { value: "leading-tight", label: "1.25" },
  { value: "leading-snug", label: "1.4" },
  { value: "leading-normal", label: "1.5" },
  { value: "leading-relaxed", label: "1.6" },
  { value: "leading-loose", label: "2.0" },
]

const letterSpacingOptions = [
  { value: "tracking-tighter", label: "-0.05" },
  { value: "tracking-tight", label: "-0.025" },
  { value: "tracking-normal", label: "0" },
  { value: "tracking-wide", label: "0.025" },
  { value: "tracking-wider", label: "0.05" },
]

const transformOptions = [
  { value: "normal-case", label: "Aa" },
  { value: "uppercase", label: "AB" },
  { value: "lowercase", label: "ab" },
  { value: "capitalize", label: "Ab" },
]

const colorOptions = [
  { value: "text-inherit", label: "Auto", swatch: "inherit" },
  { value: "text-slate-900", label: "Dark", swatch: "#0f172a" },
  { value: "text-white", label: "White", swatch: "#ffffff" },
  { value: "text-indigo-600", label: "Indigo", swatch: "#4f46e5" },
  { value: "text-blue-600", label: "Blue", swatch: "#2563eb" },
  { value: "text-emerald-600", label: "Green", swatch: "#059669" },
  { value: "text-rose-600", label: "Rose", swatch: "#e11d48" },
  { value: "text-amber-600", label: "Amber", swatch: "#d97706" },
  { value: "text-slate-500", label: "Muted", swatch: "#64748b" },
]

const alignOptions = [
  { value: "text-left", icon: AlignLeft, label: "Left" },
  { value: "text-center", icon: AlignCenter, label: "Center" },
  { value: "text-right", icon: AlignRight, label: "Right" },
]

// ─── Sub-components ────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-0.5 block text-[9px] font-semibold uppercase tracking-wider text-gray-400">{children}</label>
}

function Divider() {
  return <div className="border-t border-gray-100" />
}

/** Compact select that looks like a mini input */
function MiniSelect({
  value, onChange, options, label,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  label: string
}) {
  return (
    <div className="min-w-0">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-gray-700 transition-all hover:border-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-100"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function FontDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
      <Label>Font</Label>
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

// ─── Main component ────────────────────────────────────────

export interface TypographyValue {
  font: string
  weight: string
  size: string
  lineHeight: string
  letterSpacing: string
  color: string
  alignment: string
  transform: string
}

export const defaultTypography: TypographyValue = {
  font: "font-sans",
  weight: "font-normal",
  size: "text-base",
  lineHeight: "leading-relaxed",
  letterSpacing: "tracking-normal",
  color: "text-inherit",
  alignment: "text-left",
  transform: "normal-case",
}

export function TypographyPanel({
  value,
  onChange,
  showFont = true,
  showSize = true,
  showWeight = true,
  showLineHeight = true,
  showLetterSpacing = true,
  showColor = true,
  showAlignment = true,
  showTransform = true,
}: {
  value: TypographyValue
  onChange: (v: TypographyValue) => void
  showFont?: boolean
  showSize?: boolean
  showWeight?: boolean
  showLineHeight?: boolean
  showLetterSpacing?: boolean
  showColor?: boolean
  showAlignment?: boolean
  showTransform?: boolean
}) {
  function update(key: keyof TypographyValue, val: string) {
    onChange({ ...value, [key]: val })
  }

  const row2Count = [showWeight, showSize, showLineHeight, showLetterSpacing].filter(Boolean).length
  const row2GridCols: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }

  return (
    <div className="space-y-0">
      {/* ── Row 1: Font ── */}
      {showFont && (
        <div className="pb-2.5">
          <FontDropdown value={value.font} onChange={(v) => update("font", v)} />
        </div>
      )}

      {/* ── Row 2: Weight | Size | Height | Spacing — all in one row ── */}
      {(showWeight || showSize || showLineHeight || showLetterSpacing) && (
        <>
          <Divider />
          <div className={cn("grid gap-1.5 py-2.5", row2GridCols[row2Count] || "grid-cols-4")}>
            {showWeight && (
              <MiniSelect
                label="Weight"
                value={value.weight}
                onChange={(v) => update("weight", v)}
                options={weightOptions.map((w) => ({ value: w.value, label: w.short }))}
              />
            )}
            {showSize && (
              <MiniSelect
                label="Size"
                value={value.size}
                onChange={(v) => update("size", v)}
                options={sizeOptions.map((s) => ({ value: s.value, label: String(s.px) }))}
              />
            )}
            {showLineHeight && (
              <MiniSelect
                label="Height"
                value={value.lineHeight}
                onChange={(v) => update("lineHeight", v)}
                options={lineHeightOptions}
              />
            )}
            {showLetterSpacing && (
              <MiniSelect
                label="Spacing"
                value={value.letterSpacing}
                onChange={(v) => update("letterSpacing", v)}
                options={letterSpacingOptions}
              />
            )}
          </div>
        </>
      )}

      {/* ── Row 3: Align | Transform ── */}
      {(showAlignment || showTransform) && (
        <>
          <Divider />
          <div className="grid grid-cols-2 gap-2 py-2.5">
            {showAlignment && (
              <div>
                <Label>Align</Label>
                <div className="flex gap-0.5 rounded-md bg-gray-100 p-0.5">
                  {alignOptions.map((opt) => {
                    const Icon = opt.icon
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        title={opt.label}
                        onClick={() => update("alignment", opt.value)}
                        className={cn(
                          "flex flex-1 items-center justify-center rounded py-1 transition-all",
                          value.alignment === opt.value ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-500",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            {showTransform && (
              <div>
                <Label>Transform</Label>
                <div className="flex gap-0.5 rounded-md bg-gray-100 p-0.5">
                  {transformOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update("transform", opt.value)}
                      className={cn(
                        "flex-1 rounded py-1 text-center text-[11px] font-medium transition-all",
                        value.transform === opt.value ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-500",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Row 4: Color (last) ── */}
      {showColor && (
        <>
          <Divider />
          <div className="pt-2.5">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-1.5">
              {colorOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  title={opt.label}
                  onClick={() => update("color", opt.value)}
                  className={cn(
                    "h-5 w-5 rounded-full border-2 transition-all",
                    value.color === opt.value ? "border-indigo-500 scale-110 shadow-sm" : "border-gray-200 hover:border-gray-400",
                  )}
                  style={{
                    backgroundColor: opt.swatch === "inherit" ? "transparent" : opt.swatch,
                    backgroundImage: opt.swatch === "inherit" ? "linear-gradient(135deg, #e5e7eb 50%, #4f46e5 50%)" : undefined,
                    boxShadow: opt.swatch === "#ffffff" && value.color !== opt.value ? "inset 0 0 0 1px #e5e7eb" : undefined,
                  }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
