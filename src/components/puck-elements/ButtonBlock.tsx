import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"

interface ButtonBlockProps {
  label: string
  link: string
  variant: string
  size: string
  fullWidth: boolean
  alignment: string
  borderRadius: string
}

const variantOptions = [
  { value: "primary", label: "Primary", bg: "#4f46e5", text: "#fff" },
  { value: "dark", label: "Dark", bg: "#0f172a", text: "#fff" },
  { value: "white", label: "White", bg: "#ffffff", text: "#0f172a" },
  { value: "outline", label: "Outline", bg: "transparent", text: "#0f172a" },
  { value: "green", label: "Green", bg: "#059669", text: "#fff" },
  { value: "rose", label: "Rose", bg: "#e11d48", text: "#fff" },
  { value: "amber", label: "Amber", bg: "#d97706", text: "#fff" },
]

const variantClasses: Record<string, string> = {
  primary: "bg-indigo-600 text-white shadow-md hover:bg-indigo-700",
  dark: "bg-slate-900 text-white shadow-md hover:bg-slate-800",
  white: "bg-white text-slate-900 shadow-md hover:bg-gray-50 border border-gray-200",
  outline: "border-2 border-current bg-transparent hover:bg-black/5",
  green: "bg-emerald-600 text-white shadow-md hover:bg-emerald-700",
  rose: "bg-rose-600 text-white shadow-md hover:bg-rose-700",
  amber: "bg-amber-500 text-white shadow-md hover:bg-amber-600",
}

const sizeClasses: Record<string, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-lg",
}

export const ButtonBlock: ComponentConfig<ButtonBlockProps> = {
  label: "Button",
  fields: {
    label: { type: "text", label: "Button Text" },
    link: { type: "text", label: "Link URL" },
    variant: {
      type: "custom",
      label: "Style",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Style</label>
          <div className="flex items-center gap-1.5">
            {variantOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                title={opt.label}
                onClick={() => onChange(opt.value)}
                className={cn(
                  "h-6 w-6 rounded-full border-2 transition-all",
                  value === opt.value ? "border-blue-500 scale-110" : "border-gray-200 hover:border-gray-300",
                )}
                style={{ backgroundColor: opt.bg === "transparent" ? "#f8fafc" : opt.bg }}
              />
            ))}
          </div>
        </div>
      ),
    },
    size: {
      type: "custom",
      label: "Size",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Size</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
      ),
    },
    borderRadius: {
      type: "custom",
      label: "Corners",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Corners</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
          >
            <option value="rounded-lg">Slight</option>
            <option value="rounded-xl">Round</option>
            <option value="rounded-full">Pill</option>
          </select>
        </div>
      ),
    },
    fullWidth: {
      type: "custom",
      label: "Full Width",
      render: ({ value, onChange }) => (
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Full Width</label>
          <button
            type="button"
            onClick={() => onChange(!value)}
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors",
              value ? "bg-blue-500" : "bg-gray-200",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                value && "translate-x-4",
              )}
            />
          </button>
        </div>
      ),
    },
    alignment: {
      type: "custom",
      label: "Alignment",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Alignment</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
          >
            <option value="justify-start">Left</option>
            <option value="justify-center">Center</option>
            <option value="justify-end">Right</option>
          </select>
        </div>
      ),
    },
  },
  defaultProps: {
    label: "Get Started",
    link: "#",
    variant: "primary",
    size: "md",
    fullWidth: false,
    alignment: "justify-start",
    borderRadius: "rounded-xl",
  },
  render: ({ label = "Get Started", link = "#", variant = "primary", size = "md", fullWidth = false, alignment = "justify-start", borderRadius = "rounded-xl" }) => (
    <div className={cn("flex", alignment)}>
      <a
        href={link}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.97]",
          variantClasses[variant],
          sizeClasses[size],
          borderRadius,
          fullWidth && "w-full",
        )}
      >
        {label}
      </a>
    </div>
  ),
}
