import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { Shield, Lock, CreditCard, Award, CheckCircle } from "lucide-react"

interface TrustBadgesProps {
  badges: string[]
  alignment: string
  size: string
}

const badgeIcons: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  secure: { icon: Shield, label: "100% Secure" },
  encrypted: { icon: Lock, label: "SSL Encrypted" },
  guarantee: { icon: Award, label: "Money-Back Guarantee" },
  payment: { icon: CreditCard, label: "Secure Payment" },
  verified: { icon: CheckCircle, label: "Verified" },
}

export const TrustBadges: ComponentConfig<TrustBadgesProps> = {
  fields: {
    badges: {
      type: "array", label: "Badges",
      arrayFields: {
        value: {
          type: "select", label: "Badge",
          options: [
            { value: "secure", label: "100% Secure" },
            { value: "encrypted", label: "SSL Encrypted" },
            { value: "guarantee", label: "Money-Back Guarantee" },
            { value: "payment", label: "Secure Payment" },
            { value: "verified", label: "Verified" },
          ],
        },
      },
    },
    alignment: {
      type: "select", label: "Alignment",
      options: [
        { value: "justify-start", label: "Left" },
        { value: "justify-center", label: "Center" },
        { value: "justify-end", label: "Right" },
      ],
    },
    size: {
      type: "select", label: "Size",
      options: [{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }],
    },
  },
  defaultProps: {
    badges: ["secure", "guarantee", "payment"] as any,
    alignment: "justify-center",
    size: "sm",
  },
  render: ({ badges, alignment, size }) => {
    const items = (Array.isArray(badges) ? badges : []).map((b: any) => typeof b === "string" ? b : b?.value).filter(Boolean)

    return (
      <div className={cn("flex flex-wrap gap-4", alignment)}>
        {items.map((key) => {
          const badge = badgeIcons[key as string]
          if (!badge) return null
          const Icon = badge.icon
          return (
            <div key={key as string} className={cn("flex items-center gap-1.5 text-muted-foreground", size === "sm" ? "text-xs" : "text-sm")}>
              <Icon className={cn(size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} />
              <span className="font-medium">{badge.label}</span>
            </div>
          )
        })}
      </div>
    )
  },
}
