import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { createElement } from "react"
import { RichTextField, sanitize } from "@/components/RichTextField"
import { TypographyPanel, defaultTypography, type TypographyValue } from "@/components/TypographyPanel"
import { FontPicker } from "@/lib/fonts"

interface HeadingProps {
  font: string
  text: string
  level: string
  typography: TypographyValue
}

const levelOptions = [
  { value: "h1", label: "H1 — Page Title" },
  { value: "h2", label: "H2 — Section" },
  { value: "h3", label: "H3 — Subsection" },
  { value: "h4", label: "H4 — Card Title" },
  { value: "h5", label: "H5 — Label" },
  { value: "h6", label: "H6 — Small" },
]

export const Heading: ComponentConfig<HeadingProps> = {
  label: "Heading",
  fields: {
    font: {
      type: "custom",
      label: "Font",
      render: ({ value, onChange }) => <FontPicker value={value || "font-sans"} onChange={onChange} />,
    },
    text: {
      type: "custom",
      label: "Text",
      render: ({ value, onChange }) => (
        <RichTextField value={value} onChange={onChange} minimal placeholder="Your heading..." />
      ),
    },
    level: {
      type: "custom",
      label: "Heading Level",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          {levelOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all",
                value === opt.value ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50 border border-transparent",
              )}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-500 uppercase">{opt.value}</span>
              <span className="text-xs text-gray-600">{opt.label}</span>
            </button>
          ))}
        </div>
      ),
    },
    typography: {
      type: "custom",
      label: "Style",
      render: ({ value, onChange }) => (
        <TypographyPanel
          value={value || defaultTypography}
          onChange={onChange}
          showFont={false}
          showSize={false}
          showLineHeight={false}
        />
      ),
    },
  },
  defaultProps: {
    font: "font-sans",
    text: "Your Headline Here",
    level: "h2",
    typography: {
      ...defaultTypography,
      weight: "font-bold",
      size: "text-4xl",
      lineHeight: "leading-tight",
      letterSpacing: "tracking-tight",
    },
  },
  render: ({ font, text, level, typography, ...legacy }: any) => {
    // Level determines the visual size — this is the semantic mapping
    const levelSize: Record<string, { size: string; weight: string; leading: string }> = {
      h1: { size: "text-5xl", weight: "font-bold", leading: "leading-tight" },
      h2: { size: "text-4xl", weight: "font-bold", leading: "leading-tight" },
      h3: { size: "text-3xl", weight: "font-semibold", leading: "leading-snug" },
      h4: { size: "text-2xl", weight: "font-semibold", leading: "leading-snug" },
      h5: { size: "text-xl", weight: "font-medium", leading: "leading-normal" },
      h6: { size: "text-lg", weight: "font-medium", leading: "leading-normal" },
    }
    const defaults = levelSize[level] || levelSize.h2

    const typo = typography || {
      ...defaultTypography,
      font: legacy.font || font || defaultTypography.font,
      color: legacy.color || defaultTypography.color,
      alignment: legacy.alignment || defaultTypography.alignment,
      weight: defaults.weight,
      letterSpacing: "tracking-tight",
    }
    const resolvedFont = font || typo.font || "font-sans"
    const raw = typeof text === "string" ? text : String(text || "")
    const clean = sanitize(raw)
    const unwrapped = clean
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "<br>")
      .replace(/<br>$/, "")
    return createElement(level, {
      className: cn(
        resolvedFont,
        typo.weight || defaults.weight,
        defaults.size,
        defaults.leading,
        typo.letterSpacing,
        typo.alignment,
        typo.color,
        typo.transform,
        "[&_a]:underline",
      ),
      dangerouslySetInnerHTML: { __html: unwrapped || "Your Headline Here" },
    })
  },
}
