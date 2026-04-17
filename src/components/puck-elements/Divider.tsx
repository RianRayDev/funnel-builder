import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"

interface DividerProps {
  style: string
  color: string
}

const styleOptions = [
  { value: "border-solid", label: "Solid" },
  { value: "border-dashed", label: "Dashed" },
  { value: "border-dotted", label: "Dotted" },
]

const colorOptions = [
  { value: "border-border", label: "Default", swatch: "#e5e7eb" },
  { value: "border-muted-foreground/20", label: "Light", swatch: "#d1d5db" },
  { value: "border-primary/30", label: "Primary", swatch: "#818cf8" },
]

export const Divider: ComponentConfig<DividerProps> = {
  fields: {
    style: {
      type: "custom",
      label: "Style",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Style</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
          >
            {styleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      ),
    },
    color: {
      type: "custom",
      label: "Color",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Color</label>
          <div className="flex items-center gap-2">
            {colorOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                title={opt.label}
                onClick={() => onChange(opt.value)}
                className={cn(
                  "h-6 w-6 rounded-full border-2 transition-all",
                  value === opt.value ? "border-blue-500 scale-110" : "border-gray-200 hover:border-gray-300",
                )}
                style={{ backgroundColor: opt.swatch }}
              />
            ))}
          </div>
        </div>
      ),
    },
  },
  defaultProps: {
    style: "border-solid",
    color: "border-border",
  },
  render: ({ style = "border-solid", color = "border-border" }) => (
    <hr className={cn("border-t", style, color)} />
  ),
}
