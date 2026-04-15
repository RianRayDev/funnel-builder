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
      arrayFields: { text: { type: "text", label: "Text" } },
    },
    icon: {
      type: "select", label: "Icon",
      options: [
        { value: "check", label: "Checkmark" },
        { value: "chevron", label: "Chevron" },
        { value: "circle", label: "Bullet" },
        { value: "star", label: "Star" },
        { value: "arrow", label: "Arrow" },
      ],
    },
    iconColor: {
      type: "select", label: "Icon Color",
      options: [
        { value: "primary", label: "Primary" },
        { value: "green", label: "Green" },
        { value: "blue", label: "Blue" },
        { value: "rose", label: "Rose" },
        { value: "amber", label: "Amber" },
        { value: "muted", label: "Muted" },
      ],
    },
    size: {
      type: "select", label: "Size",
      options: [{ value: "text-sm", label: "Small" }, { value: "text-base", label: "Normal" }, { value: "text-lg", label: "Large" }],
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
