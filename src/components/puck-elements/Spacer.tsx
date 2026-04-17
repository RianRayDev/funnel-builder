import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"

interface SpacerProps {
  height: string
  backgroundColor: string
}

const heightOptions = [
  { value: "h-4", label: "XS — 16px" },
  { value: "h-8", label: "SM — 32px" },
  { value: "h-12", label: "MD — 48px" },
  { value: "h-16", label: "LG — 64px" },
  { value: "h-24", label: "XL — 96px" },
  { value: "h-32", label: "2XL — 128px" },
]

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

export const Spacer: ComponentConfig<SpacerProps> = {
  fields: {
    height: {
      type: "custom",
      label: "Height",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Height</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
          >
            {heightOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      ),
    },
    backgroundColor: {
      type: "custom",
      label: "Background",
      render: ({ value, onChange }) => (
        <div>
          <label className="mb-0.5 block text-[9px] font-semibold uppercase tracking-wider text-gray-400">Background</label>
          <div className="flex flex-wrap gap-1.5">
            {bgOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                title={opt.label}
                onClick={() => onChange(opt.value)}
                className={cn(
                  "h-5 w-5 rounded-full border-2 transition-all",
                  value === opt.value ? "border-indigo-500 scale-110 shadow-sm" : "border-gray-200 hover:border-gray-400",
                )}
                style={{
                  backgroundColor: opt.swatch,
                  boxShadow: opt.swatch === "#ffffff" && value !== opt.value ? "inset 0 0 0 1px #e5e7eb" : undefined,
                }}
              />
            ))}
          </div>
        </div>
      ),
    },
  },
  defaultProps: {
    height: "h-8",
    backgroundColor: "bg-white",
  },
  render: ({ height = "h-8", backgroundColor = "bg-white" }) => <div className={cn(height, backgroundColor)} />,
}
