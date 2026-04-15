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
        <div className="grid grid-cols-4 gap-1.5">
          {variantOptions.map((opt) => (
            <button key={opt.value} type="button" onClick={() => onChange(opt.value)} title={opt.label}
              className={cn("flex h-8 items-center justify-center rounded-lg text-[10px] font-semibold transition-all",
                value === opt.value ? "ring-2 ring-blue-500 ring-offset-1" : "hover:opacity-80")}
              style={{ backgroundColor: opt.bg, color: opt.text, border: opt.bg === "transparent" ? "2px solid #94a3b8" : undefined }}>
              {opt.label}
            </button>
          ))}
        </div>
      ),
    },
    size: {
      type: "custom",
      label: "Size",
      render: ({ value, onChange }) => (
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {[{ v: "sm", l: "S" }, { v: "md", l: "M" }, { v: "lg", l: "L" }].map((opt) => (
            <button key={opt.v} type="button" onClick={() => onChange(opt.v)}
              className={cn("flex-1 rounded-md py-1.5 text-center text-xs font-medium transition-all", value === opt.v ? "bg-white shadow-sm" : "text-gray-400")}>
              {opt.l}
            </button>
          ))}
        </div>
      ),
    },
    borderRadius: {
      type: "custom",
      label: "Corners",
      render: ({ value, onChange }) => (
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {[
            { v: "rounded-lg", l: "Slight" },
            { v: "rounded-xl", l: "Round" },
            { v: "rounded-full", l: "Pill" },
          ].map((opt) => (
            <button key={opt.v} type="button" onClick={() => onChange(opt.v)}
              className={cn("flex-1 rounded-md py-1.5 text-center text-xs font-medium transition-all", value === opt.v ? "bg-white shadow-sm" : "text-gray-400")}>
              {opt.l}
            </button>
          ))}
        </div>
      ),
    },
    fullWidth: { type: "radio", label: "Full Width", options: [{ value: true, label: "Yes" }, { value: false, label: "No" }] },
    alignment: {
      type: "custom",
      label: "Alignment",
      render: ({ value, onChange }) => (
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {[
            { v: "justify-start", l: "Left" },
            { v: "justify-center", l: "Center" },
            { v: "justify-end", l: "Right" },
          ].map((opt) => (
            <button key={opt.v} type="button" onClick={() => onChange(opt.v)}
              className={cn("flex-1 rounded-md py-1.5 text-center text-xs font-medium transition-all", value === opt.v ? "bg-white shadow-sm" : "text-gray-400")}>
              {opt.l}
            </button>
          ))}
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
  render: ({ label, link, variant, size, fullWidth, alignment, borderRadius }) => (
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
