import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { RichTextField, RichTextContent } from "@/components/RichTextField"
import { FontPicker } from "@/lib/fonts"

interface TextBlockProps {
  content: string
  size: string
  color: string
  font: string
}

const sizeOptions = [
  { value: "text-sm", label: "S" },
  { value: "text-base", label: "M" },
  { value: "text-lg", label: "L" },
  { value: "text-xl", label: "XL" },
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
    content: {
      type: "custom",
      label: "Content",
      render: ({ value, onChange }) => (
        <RichTextField value={value} onChange={onChange} showAlign placeholder="Start writing..." />
      ),
    },
    size: {
      type: "custom",
      label: "Size",
      render: ({ value, onChange }) => (
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {sizeOptions.map((opt) => (
            <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
              className={cn("flex-1 rounded-md py-1.5 text-center text-xs font-medium transition-all",
                value === opt.value ? "bg-white shadow-sm" : "text-gray-400")}>
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
    font: {
      type: "custom",
      label: "Font",
      render: ({ value, onChange }) => <FontPicker value={value} onChange={onChange} />,
    },
  },
  defaultProps: {
    content: "",
    size: "text-base",
    color: "text-inherit",
    font: "font-sans",
  },
  render: ({ content, size, color, font }) => {
    if (!content) {
      return (
        <p className={cn("leading-relaxed", size, font, "text-slate-400/60 italic")}>
          Click to add text...
        </p>
      )
    }
    return (
      <div className={cn("leading-relaxed", size, font, color === "text-inherit" ? "opacity-80" : color)}>
        <RichTextContent
          html={content}
          className="[&_p]:mb-2 [&_p:last-child]:mb-0 [&_a]:text-blue-600 [&_a]:underline [&_mark]:bg-yellow-200/60 [&_mark]:px-0.5 [&_mark]:rounded-sm"
        />
      </div>
    )
  },
}
