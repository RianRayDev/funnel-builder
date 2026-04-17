import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { RichTextField, RichTextContent } from "@/components/RichTextField"
import { TypographyPanel, defaultTypography, type TypographyValue } from "@/components/TypographyPanel"
import { FontPicker } from "@/lib/fonts"

interface TextBlockProps {
  font: string
  content: string
  typography: TypographyValue
}

export const TextBlock: ComponentConfig<TextBlockProps> = {
  label: "Text",
  fields: {
    font: {
      type: "custom",
      label: "Font",
      render: ({ value, onChange }) => <FontPicker value={value || "font-sans"} onChange={onChange} />,
    },
    content: {
      type: "custom",
      label: "Content",
      render: ({ value, onChange }) => (
        <RichTextField value={value} onChange={onChange} showAlign placeholder="Start writing..." />
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
        />
      ),
    },
  },
  defaultProps: {
    font: "font-sans",
    content: "",
    typography: {
      ...defaultTypography,
      lineHeight: "leading-relaxed",
    },
  },
  render: ({ font = "font-sans", content = "", typography, ...legacy }: any) => {
    const typo = typography || {
      ...defaultTypography,
      font: legacy.font || font || defaultTypography.font,
      color: legacy.color || defaultTypography.color,
      size: legacy.size || defaultTypography.size,
      lineHeight: "leading-relaxed",
    }
    // Top-level font prop takes priority
    const resolvedFont = font || typo.font || "font-sans"

    if (!content) {
      return (
        <p className={cn(resolvedFont, typo.size, typo.lineHeight, "text-slate-400/60 italic")}>
          Click to add text...
        </p>
      )
    }

    return (
      <div className={cn(
        resolvedFont,
        typo.weight,
        typo.size,
        typo.lineHeight,
        typo.letterSpacing,
        typo.alignment,
        typo.color === "text-inherit" ? "opacity-80" : typo.color,
        typo.transform,
      )}>
        <RichTextContent
          html={content}
          className="[&_p]:mb-2 [&_p:last-child]:mb-0 [&_a]:text-blue-600 [&_a]:underline"
        />
      </div>
    )
  },
}
