import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"

interface TextBlockProps {
  content: string
  alignment: string
  size: string
  color: string
}

const sizeOptions = [
  { value: "text-sm", label: "Small", preview: "Aa" },
  { value: "text-base", label: "Normal", preview: "Aa" },
  { value: "text-lg", label: "Large", preview: "Aa" },
  { value: "text-xl", label: "X-Large", preview: "Aa" },
]

const colorOptions = [
  { value: "text-inherit", label: "Auto", swatch: "inherit" },
  { value: "text-slate-600", label: "Body", swatch: "#475569" },
  { value: "text-slate-900", label: "Dark", swatch: "#0f172a" },
  { value: "text-white", label: "White", swatch: "#ffffff" },
  { value: "text-white/70", label: "White Muted", swatch: "rgba(255,255,255,0.7)" },
  { value: "text-slate-400", label: "Muted", swatch: "#94a3b8" },
]

export const TextBlock: ComponentConfig<TextBlockProps> = {
  label: "Text",
  fields: {
    content: { type: "textarea", label: "Content" },
    alignment: {
      type: "custom",
      label: "Alignment",
      render: ({ value, onChange }) => (
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {[
            { v: "text-left", label: "Left", icon: "☰" },
            { v: "text-center", label: "Center", icon: "≡" },
            { v: "text-right", label: "Right", icon: "☰" },
          ].map((opt) => (
            <button key={opt.v} type="button" onClick={() => onChange(opt.v)} title={opt.label}
              className={cn("flex-1 rounded-md py-1.5 text-center text-sm transition-all", value === opt.v ? "bg-white shadow-sm font-medium" : "text-gray-400 hover:text-gray-600")}>
              {opt.icon}
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
          {sizeOptions.map((opt) => (
            <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
              className={cn("flex-1 rounded-md py-1.5 text-center transition-all",
                value === opt.value ? "bg-white shadow-sm" : "hover:bg-gray-50",
                opt.value === "text-sm" && "text-[10px]",
                opt.value === "text-base" && "text-xs",
                opt.value === "text-lg" && "text-sm",
                opt.value === "text-xl" && "text-base",
              )}>
              {opt.label}
            </button>
          ))}
        </div>
      ),
    },
    color: {
      type: "custom",
      label: "Color",
      render: ({ value, onChange }) => (
        <div className="flex flex-wrap gap-1.5">
          {colorOptions.map((opt) => (
            <button key={opt.value} type="button" title={opt.label} onClick={() => onChange(opt.value)}
              className={cn("h-6 w-6 rounded-full border-2 transition-all",
                value === opt.value ? "border-blue-500 scale-110 shadow-sm" : "border-gray-200 hover:border-gray-400")}
              style={{ backgroundColor: opt.swatch === "inherit" ? "transparent" : opt.swatch,
                backgroundImage: opt.swatch === "inherit" ? "linear-gradient(135deg, #e5e7eb 50%, #475569 50%)" : undefined,
                border: opt.swatch === "#ffffff" ? "2px solid #e5e7eb" : undefined }}
            />
          ))}
        </div>
      ),
    },
  },
  defaultProps: {
    content: "Add your text content here. This can be a paragraph, description, or any body text for your funnel page.",
    alignment: "text-left",
    size: "text-base",
    color: "text-inherit",
  },
  render: ({ content, alignment, size, color }) => (
    <p className={cn("leading-relaxed", alignment, size, color === "text-inherit" ? "opacity-80" : color)}>{content}</p>
  ),
}
