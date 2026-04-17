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
  { value: "bg-white", label: "White", swatch: "#ffffff" },
  { value: "bg-slate-50", label: "Light", swatch: "#f8fafc" },
  { value: "bg-slate-100", label: "Gray", swatch: "#f1f5f9" },
  { value: "bg-blue-50", label: "Blue", swatch: "#eff6ff" },
  { value: "bg-amber-50", label: "Warm", swatch: "#fffbeb" },
  { value: "bg-slate-800", label: "Dark", swatch: "#1e293b" },
  { value: "bg-slate-900", label: "Darker", swatch: "#0f172a" },
  { value: "bg-slate-950", label: "Black", swatch: "#020617" },
  { value: "bg-indigo-600", label: "Indigo", swatch: "#4f46e5" },
  { value: "bg-blue-600", label: "Blue", swatch: "#2563eb" },
  { value: "bg-emerald-600", label: "Green", swatch: "#059669" },
  { value: "bg-rose-600", label: "Rose", swatch: "#e11d48" },
]

const darkBgs = new Set(["bg-slate-800", "bg-slate-900", "bg-slate-950", "bg-indigo-600", "bg-blue-600", "bg-emerald-600", "bg-rose-600"])
export function isDarkBg(bg: string) { return darkBgs.has(bg) }

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-0.5 block text-[9px] font-semibold uppercase tracking-wider text-gray-400">{children}</label>
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="min-w-0">
      <Label>{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-gray-700 hover:border-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-100">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
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
        <div>
          <Label>Background</Label>
          <div className="flex flex-wrap gap-1.5">
            {bgOptions.map((opt) => (
              <button key={opt.value} type="button" title={opt.label} onClick={() => onChange(opt.value)}
                className={cn("h-5 w-5 rounded-full border-2 transition-all",
                  value === opt.value ? "border-indigo-500 scale-110 shadow-sm" : "border-gray-200 hover:border-gray-400")}
                style={{ backgroundColor: opt.swatch, boxShadow: opt.swatch === "#ffffff" && value !== opt.value ? "inset 0 0 0 1px #e5e7eb" : undefined }}
              />
            ))}
          </div>
        </div>
      ),
    },
    paddingY: {
      type: "custom",
      label: "Spacing",
      render: ({ value, onChange }) => (
        <Select label="Padding" value={value} onChange={onChange} options={[
          { value: "py-4", label: "XS" }, { value: "py-8", label: "S" }, { value: "py-12", label: "M" },
          { value: "py-16", label: "L" }, { value: "py-24", label: "XL" }, { value: "py-32", label: "2XL" },
        ]} />
      ),
    },
    maxWidth: {
      type: "custom",
      label: "Width",
      render: ({ value, onChange }) => (
        <Select label="Width" value={value} onChange={onChange} options={[
          { value: "max-w-3xl", label: "Narrow" }, { value: "max-w-5xl", label: "Medium" },
          { value: "max-w-6xl", label: "Wide" }, { value: "max-w-7xl", label: "X-Wide" }, { value: "max-w-full", label: "Full" },
        ]} />
      ),
    },
    direction: {
      type: "custom",
      label: "Direction",
      render: ({ value, onChange }) => (
        <div>
          <Label>Direction</Label>
          <div className="flex gap-0.5 rounded-md bg-gray-100 p-0.5">
            {[{ value: "flex-col", label: "Column" }, { value: "flex-row", label: "Row" }].map((o) => (
              <button key={o.value} type="button" onClick={() => onChange(o.value)}
                className={cn("flex-1 rounded py-1 text-center text-[10px] font-medium transition-all",
                  value === o.value ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-500")}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    distribute: {
      type: "custom",
      label: "Distribute",
      render: ({ value, onChange }) => (
        <Select label="Distribute" value={value} onChange={onChange} options={[
          { value: "justify-start", label: "Start" }, { value: "justify-center", label: "Center" },
          { value: "justify-between", label: "Between" }, { value: "justify-around", label: "Around" }, { value: "justify-evenly", label: "Even" },
        ]} />
      ),
    },
    align: {
      type: "custom",
      label: "Align",
      render: ({ value, onChange }) => (
        <Select label="Align" value={value} onChange={onChange} options={[
          { value: "items-stretch", label: "Stretch" }, { value: "items-start", label: "Start" },
          { value: "items-center", label: "Center" }, { value: "items-end", label: "End" },
        ]} />
      ),
    },
    gap: {
      type: "custom",
      label: "Gap",
      render: ({ value, onChange }) => (
        <Select label="Gap" value={value} onChange={onChange} options={[
          { value: "", label: "None" }, { value: "gap-2", label: "Small" },
          { value: "gap-4", label: "Medium" }, { value: "gap-6", label: "Large" }, { value: "gap-8", label: "XL" },
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
