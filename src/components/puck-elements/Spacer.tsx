import type { ComponentConfig } from "@measured/puck"

interface SpacerProps {
  height: string
}

export const Spacer: ComponentConfig<SpacerProps> = {
  fields: {
    height: {
      type: "select",
      label: "Height",
      options: [
        { value: "h-4", label: "XS (16px)" },
        { value: "h-8", label: "SM (32px)" },
        { value: "h-12", label: "MD (48px)" },
        { value: "h-16", label: "LG (64px)" },
        { value: "h-24", label: "XL (96px)" },
        { value: "h-32", label: "2XL (128px)" },
      ],
    },
  },
  defaultProps: {
    height: "h-8",
  },
  render: ({ height }) => <div className={height} />,
}
