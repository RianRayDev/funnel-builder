import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { createElement } from "react"

interface HeadingProps {
  text: string
  level: string
  alignment: string
  color: string
}

const levelStyles: Record<string, { className: string; preview: string }> = {
  h1: { className: "text-5xl font-bold tracking-tight", preview: "H1 — Page Title" },
  h2: { className: "text-4xl font-bold tracking-tight", preview: "H2 — Section" },
  h3: { className: "text-3xl font-semibold", preview: "H3 — Subsection" },
  h4: { className: "text-2xl font-semibold", preview: "H4 — Card Title" },
  h5: { className: "text-xl font-medium", preview: "H5 — Label" },
  h6: { className: "text-lg font-medium", preview: "H6 — Small" },
}

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

export const Heading: ComponentConfig<HeadingProps> = {
  label: "Heading",
  fields: {
    text: { type: "text", label: "Text" },
    level: {
      type: "custom",
      label: "Heading Level",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          {Object.entries(levelStyles).map(([key, style]) => (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all",
                value === key ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50 border border-transparent",
              )}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-500 uppercase">{key}</span>
              <span className="text-xs text-gray-600">{style.preview}</span>
            </button>
          ))}
        </div>
      ),
    },
    alignment: {
      type: "custom",
      label: "Alignment",
      render: ({ value, onChange }) => (
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {[
            { v: "text-left", icon: "☰", label: "Left" },
            { v: "text-center", icon: "≡", label: "Center" },
            { v: "text-right", icon: "☰", label: "Right" },
          ].map((opt) => (
            <button key={opt.v} type="button" onClick={() => onChange(opt.v)} title={opt.label}
              className={cn("flex-1 rounded-md py-1.5 text-center text-sm transition-all", value === opt.v ? "bg-white shadow-sm font-medium" : "text-gray-400 hover:text-gray-600")}>
              {opt.icon}
            </button>
          ))}
        </div>
      ),
    },
    color: {
      type: "custom",
      label: "Color",
      render: ({ value, onChange }) => (
        <div className="flex flex-wrap gap-1.5">
          {colorOptions.map((opt) => (
            <button key={opt.value} type="button" title={opt.label} onClick={() => onChange(opt.value)}
              className={cn("h-6 w-6 rounded-full border-2 transition-all",
                value === opt.value ? "border-blue-500 scale-110 shadow-sm" : "border-gray-200 hover:border-gray-400")}
              style={{ backgroundColor: opt.swatch === "inherit" ? "transparent" : opt.swatch,
                backgroundImage: opt.swatch === "inherit" ? "linear-gradient(135deg, #e5e7eb 50%, #4f46e5 50%)" : undefined }}
            />
          ))}
        </div>
      ),
    },
  },
  defaultProps: {
    text: "Your Headline Here",
    level: "h2",
    alignment: "text-left",
    color: "text-inherit",
  },
  render: ({ text, level, alignment, color }) =>
    createElement(level, { className: cn(levelStyles[level]?.className, alignment, color) }, text),
}
