import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { Check, Star, Zap, Shield, Heart, Award } from "lucide-react"

interface FeatureListProps {
  items: { title: string; description: string }[]
  icon: string
  columns: string
  style: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  check: Check, star: Star, zap: Zap, shield: Shield, heart: Heart, award: Award,
}

export const FeatureList: ComponentConfig<FeatureListProps> = {
  fields: {
    items: {
      type: "array", label: "Features",
      arrayFields: {
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
      },
    },
    icon: {
      type: "select", label: "Icon",
      options: [
        { value: "check", label: "Checkmark" },
        { value: "star", label: "Star" },
        { value: "zap", label: "Lightning" },
        { value: "shield", label: "Shield" },
        { value: "heart", label: "Heart" },
        { value: "award", label: "Award" },
      ],
    },
    columns: {
      type: "select", label: "Columns",
      options: [
        { value: "grid-cols-1", label: "1 Column" },
        { value: "grid-cols-2", label: "2 Columns" },
        { value: "grid-cols-3", label: "3 Columns" },
      ],
    },
    style: {
      type: "select", label: "Style",
      options: [
        { value: "cards", label: "Cards" },
        { value: "list", label: "List" },
        { value: "inline", label: "Inline Icons" },
      ],
    },
  },
  defaultProps: {
    items: [
      { title: "Easy to Use", description: "Get started in minutes with our intuitive interface." },
      { title: "Blazing Fast", description: "Optimized for speed with sub-second load times." },
      { title: "Secure by Default", description: "Enterprise-grade security with end-to-end encryption." },
    ],
    icon: "check",
    columns: "grid-cols-3",
    style: "cards",
  },
  render: ({ items, icon, columns, style }) => {
    const Icon = iconMap[icon] || Check

    if (style === "list") {
      return (
        <div className="space-y-4">
          {(items || []).map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-foreground">{item.title}</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (style === "inline") {
      return (
        <div className={cn("grid gap-6 max-sm:grid-cols-1", columns)}>
          {(items || []).map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-[15px] font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className={cn("grid gap-4 max-sm:grid-cols-1", columns)}>
        {(items || []).map((item, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-[15px] font-semibold text-foreground">{item.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    )
  },
}
