import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface PricingTableProps {
  plans: {
    name: string
    price: string
    period: string
    description: string
    features: string
    buttonText: string
    buttonLink: string
    highlighted: boolean
  }[]
}

export const PricingTable: ComponentConfig<PricingTableProps> = {
  label: "Pricing Table",
  fields: {
    plans: {
      type: "array", label: "Plans",
      arrayFields: {
        name: { type: "text", label: "Plan Name" },
        price: { type: "text", label: "Price (e.g. $29)" },
        period: { type: "text", label: "Period (e.g. /month)" },
        description: { type: "text", label: "Description" },
        features: { type: "textarea", label: "Features (one per line)" },
        buttonText: { type: "text", label: "Button Text" },
        buttonLink: { type: "text", label: "Button Link" },
        highlighted: { type: "radio", label: "Featured?", options: [{ value: true, label: "Yes" }, { value: false, label: "No" }] },
      },
    },
  },
  defaultProps: {
    plans: [
      { name: "Starter", price: "$19", period: "/month", description: "Perfect for getting started", features: "1 funnel\n1,000 visitors\nEmail support\nBasic analytics", buttonText: "Get Started", buttonLink: "#", highlighted: false },
      { name: "Pro", price: "$49", period: "/month", description: "For growing businesses", features: "Unlimited funnels\n50,000 visitors\nPriority support\nAdvanced analytics\nA/B testing\nCustom domains", buttonText: "Go Pro", buttonLink: "#", highlighted: true },
      { name: "Enterprise", price: "$99", period: "/month", description: "For large teams", features: "Everything in Pro\nUnlimited visitors\nDedicated support\nWhite label\nAPI access", buttonText: "Contact Us", buttonLink: "#", highlighted: false },
    ],
  },
  render: ({ plans }) => (
    <div className={cn("grid gap-6 rc-grid", (plans?.length ?? 0) > 2 && "rc-grid-tablet", plans?.length === 2 ? "grid-cols-2" : plans?.length === 3 ? "grid-cols-3" : "grid-cols-1")}>
      {(plans || []).map((plan, i) => (
        <div key={i} className={cn(
          "relative flex flex-col rounded-2xl border p-6",
          plan.highlighted
            ? "border-indigo-600 bg-indigo-600 text-white shadow-xl scale-105 rc-scale-reset"
            : "border-gray-200 bg-white"
        )}>
          {plan.highlighted && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-0.5 text-xs font-bold text-amber-900">
              Most Popular
            </span>
          )}
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className={cn("mt-1 text-sm", plan.highlighted ? "text-white/70" : "text-slate-500")}>{plan.description}</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-4xl font-bold">{plan.price}</span>
            <span className={cn("text-sm", plan.highlighted ? "text-white/60" : "text-slate-400")}>{plan.period}</span>
          </div>
          <ul className="mt-6 flex-1 space-y-3">
            {plan.features.split("\n").filter(Boolean).map((feat, j) => (
              <li key={j} className="flex items-start gap-2 text-sm">
                <Check className={cn("mt-0.5 h-4 w-4 shrink-0", plan.highlighted ? "text-white/80" : "text-emerald-500")} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
          <a href={plan.buttonLink} className={cn(
            "mt-6 flex h-11 items-center justify-center rounded-xl font-semibold transition-all active:scale-[0.97]",
            plan.highlighted
              ? "bg-white text-indigo-600 hover:bg-gray-50 shadow-md"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
          )}>
            {plan.buttonText}
          </a>
        </div>
      ))}
    </div>
  ),
}
