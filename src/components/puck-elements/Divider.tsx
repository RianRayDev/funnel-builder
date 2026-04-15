import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"

interface DividerProps {
  style: string
  color: string
}

export const Divider: ComponentConfig<DividerProps> = {
  fields: {
    style: {
      type: "select",
      label: "Style",
      options: [
        { value: "border-solid", label: "Solid" },
        { value: "border-dashed", label: "Dashed" },
        { value: "border-dotted", label: "Dotted" },
      ],
    },
    color: {
      type: "select",
      label: "Color",
      options: [
        { value: "border-border", label: "Default" },
        { value: "border-muted-foreground/20", label: "Light" },
        { value: "border-primary/30", label: "Primary" },
      ],
    },
  },
  defaultProps: {
    style: "border-solid",
    color: "border-border",
  },
  render: ({ style, color }) => (
    <hr className={cn("border-t", style, color)} />
  ),
}
