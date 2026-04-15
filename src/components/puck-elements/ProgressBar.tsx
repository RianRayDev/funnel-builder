import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  percentage: number
  label: string
  showPercentage: boolean
  color: string
  size: string
}

const colorClasses: Record<string, string> = {
  primary: "bg-indigo-600",
  green: "bg-emerald-500",
  blue: "bg-blue-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
}

export const ProgressBar: ComponentConfig<ProgressBarProps> = {
  label: "Progress Bar",
  fields: {
    percentage: { type: "number", label: "Percentage (0-100)" },
    label: { type: "text", label: "Label" },
    showPercentage: { type: "radio", label: "Show %", options: [{ value: true, label: "Yes" }, { value: false, label: "No" }] },
    color: {
      type: "select", label: "Color",
      options: [
        { value: "primary", label: "Primary" },
        { value: "green", label: "Green" },
        { value: "blue", label: "Blue" },
        { value: "rose", label: "Rose" },
        { value: "amber", label: "Amber" },
      ],
    },
    size: {
      type: "select", label: "Size",
      options: [{ value: "h-2", label: "Thin" }, { value: "h-3", label: "Normal" }, { value: "h-5", label: "Thick" }],
    },
  },
  defaultProps: {
    percentage: 65,
    label: "",
    showPercentage: true,
    color: "primary",
    size: "h-3",
  },
  render: ({ percentage, label, showPercentage, color, size }) => {
    const clamped = Math.min(100, Math.max(0, percentage))
    return (
      <div>
        {(label || showPercentage) && (
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-inherit">{label}</span>
            {showPercentage && <span className="text-sm font-semibold text-inherit">{clamped}%</span>}
          </div>
        )}
        <div className={cn("w-full overflow-hidden rounded-full bg-gray-200", size)}>
          <div className={cn("rounded-full transition-all duration-500", size, colorClasses[color])} style={{ width: `${clamped}%` }} />
        </div>
      </div>
    )
  },
}
