import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"

interface SectionProps {
  backgroundColor: string
  paddingY: string
  maxWidth: string
  direction: string
  distribute: string
  align: string
  gap: string
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

function SegmentedField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <div className="flex gap-0.5 rounded-lg bg-gray-100 p-0.5">
      {options.map((opt) => (
        <button key={opt.v} type="button" onClick={() => onChange(opt.v)}
          className={cn("flex-1 rounded-md py-1.5 text-center text-[10px] font-medium transition-all",
            value === opt.v ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-500")}>
          {opt.l}
        </button>
      ))}
    </div>
  )
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
      type: "custom",
      label: "Vertical Padding",
      render: ({ value, onChange }) => (
        <SegmentedField value={value} onChange={onChange} options={[
          { v: "py-8", l: "S" }, { v: "py-12", l: "M" }, { v: "py-16", l: "L" }, { v: "py-24", l: "XL" }, { v: "py-32", l: "2XL" },
        ]} />
      ),
    },
    maxWidth: {
      type: "custom",
      label: "Content Width",
      render: ({ value, onChange }) => (
        <SegmentedField value={value} onChange={onChange} options={[
          { v: "max-w-3xl", l: "Narrow" }, { v: "max-w-5xl", l: "Med" }, { v: "max-w-6xl", l: "Wide" }, { v: "max-w-7xl", l: "XWide" }, { v: "max-w-full", l: "Full" },
        ]} />
      ),
    },
    direction: {
      type: "custom",
      label: "Direction",
      render: ({ value, onChange }) => (
        <SegmentedField value={value} onChange={onChange} options={[
          { v: "flex-col", l: "Column" }, { v: "flex-row", l: "Row" },
        ]} />
      ),
    },
    distribute: {
      type: "custom",
      label: "Distribute",
      render: ({ value, onChange }) => (
        <SegmentedField value={value} onChange={onChange} options={[
          { v: "justify-start", l: "Start" }, { v: "justify-center", l: "Center" }, { v: "justify-between", l: "Between" }, { v: "justify-around", l: "Around" }, { v: "justify-evenly", l: "Even" },
        ]} />
      ),
    },
    align: {
      type: "custom",
      label: "Align",
      render: ({ value, onChange }) => (
        <SegmentedField value={value} onChange={onChange} options={[
          { v: "items-stretch", l: "Stretch" }, { v: "items-start", l: "Start" }, { v: "items-center", l: "Center" }, { v: "items-end", l: "End" },
        ]} />
      ),
    },
    gap: {
      type: "custom",
      label: "Gap",
      render: ({ value, onChange }) => (
        <SegmentedField value={value} onChange={onChange} options={[
          { v: "", l: "None" }, { v: "gap-2", l: "S" }, { v: "gap-4", l: "M" }, { v: "gap-6", l: "L" }, { v: "gap-8", l: "XL" },
        ]} />
      ),
    },
  },
  defaultProps: {
    backgroundColor: "bg-white",
    paddingY: "py-16",
    maxWidth: "max-w-6xl",
    direction: "flex-col",
    distribute: "justify-start",
    align: "items-stretch",
    gap: "",
  },
  render: ({ backgroundColor, paddingY, maxWidth, direction, distribute, align, gap, puck }) => {
    const dark = isDarkBg(backgroundColor)
    return (
      <section className={cn("w-full px-6", backgroundColor, paddingY, dark && "text-white")}>
        <div className={cn("mx-auto flex", maxWidth, direction, distribute, align, gap)}>
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
