import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { Check, ChevronRight, Circle, Star, ArrowRight } from "lucide-react"

interface BulletListProps {
  items: { text: string }[]
  icon: string
  iconColor: string
  size: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  check: Check, chevron: ChevronRight, circle: Circle, star: Star, arrow: ArrowRight,
}

const iconColorMap: Record<string, string> = {
  primary: "text-indigo-600", green: "text-emerald-500", blue: "text-blue-500",
  rose: "text-rose-500", amber: "text-amber-500", muted: "text-slate-400",
}

export const BulletList: ComponentConfig<BulletListProps> = {
  label: "Bullet List",
  fields: {
    items: {
      type: "array", label: "Items",
      arrayFields: { text: { type: "textarea", label: "Text" } },
    },
    icon: {
      type: "custom", label: "Icon",
      render: ({ value, onChange }) => (
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {[
            { v: "check", l: "✓" },
            { v: "chevron", l: "›" },
            { v: "circle", l: "●" },
            { v: "star", l: "★" },
            { v: "arrow", l: "→" },
          ].map((opt) => (
            <button key={opt.v} type="button" onClick={() => onChange(opt.v)}
              className={cn("flex-1 rounded-md py-1.5 text-center text-xs transition-all",
                value === opt.v ? "bg-white shadow-sm font-medium" : "text-gray-400")}>
              {opt.l}
            </button>
          ))}
        </div>
      ),
    },
    iconColor: {
      type: "custom", label: "Icon Color",
      render: ({ value, onChange }) => (
        <div className="flex flex-wrap gap-1.5">
          {[
            { v: "primary", swatch: "#4f46e5" },
            { v: "green", swatch: "#10b981" },
            { v: "blue", swatch: "#3b82f6" },
            { v: "rose", swatch: "#f43f5e" },
            { v: "amber", swatch: "#f59e0b" },
            { v: "muted", swatch: "#94a3b8" },
          ].map((opt) => (
            <button key={opt.v} type="button" onClick={() => onChange(opt.v)}
              className={cn("h-6 w-6 rounded-full border-2 transition-all",
                value === opt.v ? "border-blue-500 scale-110 shadow-sm" : "border-gray-200")}
              style={{ backgroundColor: opt.swatch }}
            />
          ))}
        </div>
      ),
    },
    size: {
      type: "custom", label: "Size",
      render: ({ value, onChange }) => (
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {[{ v: "text-sm", l: "S" }, { v: "text-base", l: "M" }, { v: "text-lg", l: "L" }].map((opt) => (
            <button key={opt.v} type="button" onClick={() => onChange(opt.v)}
              className={cn("flex-1 rounded-md py-1.5 text-center text-xs font-medium transition-all",
                value === opt.v ? "bg-white shadow-sm" : "text-gray-400")}>
              {opt.l}
            </button>
          ))}
        </div>
      ),
    },
  },
  defaultProps: {
    items: [
      { text: "First benefit or feature" },
      { text: "Second benefit or feature" },
      { text: "Third benefit or feature" },
    ],
    icon: "check",
    iconColor: "green",
    size: "text-base",
  },
  render: ({ items, icon, iconColor, size }) => {
    const Icon = iconMap[icon] || Check
    return (
      <ul className="space-y-3">
        {(items || []).map((item, i) => (
          <li key={i} className={cn("flex items-start gap-3", size)}>
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconColorMap[iconColor])} />
            <span className="text-inherit">{item.text}</span>
          </li>
        ))}
      </ul>
    )
  },
}
