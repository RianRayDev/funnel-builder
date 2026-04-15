import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"

interface SectionProps {
  backgroundColor: string
  paddingY: string
  maxWidth: string
}

const bgOptions = [
  { value: "bg-white", label: "White" },
  { value: "bg-slate-50", label: "Light Gray" },
  { value: "bg-slate-100", label: "Gray" },
  { value: "bg-blue-50", label: "Light Blue" },
  { value: "bg-amber-50", label: "Warm" },
  { value: "bg-slate-800", label: "Dark" },
  { value: "bg-slate-900", label: "Darker" },
  { value: "bg-slate-950", label: "Darkest" },
  { value: "bg-indigo-600", label: "Indigo" },
  { value: "bg-blue-600", label: "Blue" },
  { value: "bg-emerald-600", label: "Green" },
  { value: "bg-rose-600", label: "Rose" },
]

const darkBgs = new Set(["bg-slate-800", "bg-slate-900", "bg-slate-950", "bg-indigo-600", "bg-blue-600", "bg-emerald-600", "bg-rose-600"])

export function isDarkBg(bg: string) {
  return darkBgs.has(bg)
}

export const Section: ComponentConfig<SectionProps> = {
  label: "Section",
  fields: {
    backgroundColor: {
      type: "custom",
      label: "Background",
      render: ({ value, onChange }) => (
        <div className="grid grid-cols-6 gap-1.5">
          {bgOptions.map((opt) => {
            const isSelected = value === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                title={opt.label}
                onClick={() => onChange(opt.value)}
                className={cn(
                  "h-7 w-full rounded-md border-2 transition-all",
                  isSelected ? "border-blue-500 scale-110 shadow-sm" : "border-transparent hover:border-gray-300",
                )}
                style={{ backgroundColor: getSwatchColor(opt.value) }}
              />
            )
          })}
        </div>
      ),
    },
    paddingY: {
      type: "select",
      label: "Vertical Padding",
      options: [
        { value: "py-8", label: "Small" },
        { value: "py-12", label: "Medium" },
        { value: "py-16", label: "Large" },
        { value: "py-24", label: "Extra Large" },
        { value: "py-32", label: "Huge" },
      ],
    },
    maxWidth: {
      type: "select",
      label: "Content Width",
      options: [
        { value: "max-w-3xl", label: "Narrow" },
        { value: "max-w-5xl", label: "Medium" },
        { value: "max-w-6xl", label: "Wide" },
        { value: "max-w-7xl", label: "Extra Wide" },
        { value: "max-w-full", label: "Full Width" },
      ],
    },
  },
  defaultProps: {
    backgroundColor: "bg-white",
    paddingY: "py-16",
    maxWidth: "max-w-6xl",
  },
  render: ({ backgroundColor, paddingY, maxWidth, puck }) => {
    const dark = isDarkBg(backgroundColor)
    return (
      <section className={cn("w-full px-6", backgroundColor, paddingY, dark && "text-white")}>
        <div className={cn("mx-auto", maxWidth)}>
          {(puck as any).renderDropZone({ zone: "content" })}
        </div>
      </section>
    )
  },
}

function getSwatchColor(value: string): string {
  const map: Record<string, string> = {
    "bg-white": "#ffffff",
    "bg-slate-50": "#f8fafc",
    "bg-slate-100": "#f1f5f9",
    "bg-blue-50": "#eff6ff",
    "bg-amber-50": "#fffbeb",
    "bg-slate-800": "#1e293b",
    "bg-slate-900": "#0f172a",
    "bg-slate-950": "#020617",
    "bg-indigo-600": "#4f46e5",
    "bg-blue-600": "#2563eb",
    "bg-emerald-600": "#059669",
    "bg-rose-600": "#e11d48",
  }
  return map[value] || "#ffffff"
}
