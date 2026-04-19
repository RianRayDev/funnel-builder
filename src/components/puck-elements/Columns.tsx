import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { useResponsiveGrid, responsiveColumns } from "@/hooks/useResponsiveGrid"
import { Monitor, Tablet, Smartphone } from "lucide-react"

interface ColumnsProps {
  columns: string
  tabletColumns: string
  mobileColumns: string
  gap: string
}

const gapOptions = [
  { value: "gap-4", label: "Small (16px)" },
  { value: "gap-6", label: "Medium (24px)" },
  { value: "gap-8", label: "Large (32px)" },
  { value: "gap-12", label: "XL (48px)" },
]

function SegmentedPicker({ icon: Icon, label, value, onChange, options }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-gray-400 shrink-0" title={label}>
        <Icon className="h-3 w-3" />
        <span className="text-[9px] font-semibold uppercase tracking-wider w-10">{label}</span>
      </div>
      <div className="flex flex-1 gap-0.5 rounded-md bg-gray-100 p-0.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 rounded py-1 text-center text-[10px] font-medium transition-all",
              value === opt.value ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-500",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export const Columns: ComponentConfig<ColumnsProps> = {
  fields: {
    columns: {
      type: "custom",
      label: "Desktop Columns",
      render: ({ value, onChange }) => (
        <SegmentedPicker
          icon={Monitor}
          label="Desktop"
          value={value}
          onChange={onChange}
          options={[
            { value: "grid-cols-1", label: "1" },
            { value: "grid-cols-2", label: "2" },
            { value: "grid-cols-3", label: "3" },
            { value: "grid-cols-4", label: "4" },
          ]}
        />
      ),
    },
    tabletColumns: {
      type: "custom",
      label: "Tablet Columns",
      render: ({ value, onChange }) => (
        <SegmentedPicker
          icon={Tablet}
          label="Tablet"
          value={value}
          onChange={onChange}
          options={[
            { value: "auto", label: "Auto" },
            { value: "adaptive", label: "Adaptive" },
          ]}
        />
      ),
    },
    mobileColumns: {
      type: "custom",
      label: "Mobile Columns",
      render: ({ value, onChange }) => (
        <SegmentedPicker
          icon={Smartphone}
          label="Mobile"
          value={value}
          onChange={onChange}
          options={[
            { value: "auto", label: "Auto" },
            { value: "adaptive", label: "Adaptive" },
          ]}
        />
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
    tabletColumns: "auto",
    mobileColumns: "auto",
    gap: "gap-6",
  },
  render: ({ columns = "grid-cols-2", tabletColumns = "auto", mobileColumns = "auto", gap = "gap-6", puck }) => {
    const colCount = parseInt(columns.replace("grid-cols-", ""))
    const { ref, breakpoint } = useResponsiveGrid()
    const cols = responsiveColumns(columns, breakpoint, { tablet: tabletColumns, mobile: mobileColumns })
    return (
      <div ref={ref} className={cn("grid", cols, gap)}>
        {Array.from({ length: colCount }).map((_, i) => (
          <div key={i}>
            {(puck as any).renderDropZone({ zone: `column-${i}` })}
          </div>
        ))}
      </div>
    )
  },
}
