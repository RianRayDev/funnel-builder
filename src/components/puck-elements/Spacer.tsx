import type { ComponentConfig } from "@measured/puck"

interface SpacerProps {
  height: string
}

const heightOptions = [
  { value: "h-4", label: "XS — 16px" },
  { value: "h-8", label: "SM — 32px" },
  { value: "h-12", label: "MD — 48px" },
  { value: "h-16", label: "LG — 64px" },
  { value: "h-24", label: "XL — 96px" },
  { value: "h-32", label: "2XL — 128px" },
]

export const Spacer: ComponentConfig<SpacerProps> = {
  fields: {
    height: {
      type: "custom",
      label: "Height",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Height</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
          >
            {heightOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      ),
    },
  },
  defaultProps: {
    height: "h-8",
  },
  render: ({ height = "h-8" }) => <div className={height} />,
}
