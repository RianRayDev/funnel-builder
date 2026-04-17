import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"

interface ColumnsProps {
  columns: string
  gap: string
}

const columnOptions = [
  { value: "grid-cols-2", label: "2 Columns" },
  { value: "grid-cols-3", label: "3 Columns" },
  { value: "grid-cols-4", label: "4 Columns" },
]

const gapOptions = [
  { value: "gap-4", label: "Small (16px)" },
  { value: "gap-6", label: "Medium (24px)" },
  { value: "gap-8", label: "Large (32px)" },
  { value: "gap-12", label: "XL (48px)" },
]

export const Columns: ComponentConfig<ColumnsProps> = {
  fields: {
    columns: {
      type: "custom",
      label: "Columns",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Columns</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
          >
            {columnOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      ),
    },
    gap: {
      type: "custom",
      label: "Gap",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Gap</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
          >
            {gapOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      ),
    },
  },
  defaultProps: {
    columns: "grid-cols-2",
    gap: "gap-6",
  },
  render: ({ columns = "grid-cols-2", gap = "gap-6", puck }) => (
    <div className={cn("grid", columns, gap, "max-sm:grid-cols-1")}>
      {Array.from({ length: parseInt(columns.replace("grid-cols-", "")) }).map((_, i) => (
        <div key={i}>
          {(puck as any).renderDropZone({ zone: `column-${i}` })}
        </div>
      ))}
    </div>
  ),
}
