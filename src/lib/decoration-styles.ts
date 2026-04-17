/**
 * Decoration style constants and helpers for the rich underline/highlight system.
 * Used by Tiptap extensions, picker UIs, and component render functions.
 */

// ─── Underline ───────────────────────────────────────────────

export const UNDERLINE_STYLES = [
  { value: "solid", label: "Solid" },
  { value: "double", label: "Double" },
  { value: "dotted", label: "Dotted" },
  { value: "dashed", label: "Dashed" },
  { value: "wavy", label: "Wavy" },
  { value: "brush", label: "Brush" },
] as const

export const UNDERLINE_COLORS = [
  { value: "auto", label: "Auto", swatch: "currentColor" },
  { value: "indigo", label: "Indigo", swatch: "#4f46e5" },
  { value: "blue", label: "Blue", swatch: "#2563eb" },
  { value: "green", label: "Green", swatch: "#059669" },
  { value: "rose", label: "Rose", swatch: "#e11d48" },
  { value: "amber", label: "Amber", swatch: "#d97706" },
  { value: "slate", label: "Slate", swatch: "#64748b" },
] as const

export const UNDERLINE_THICKNESS = [
  { value: "thin", label: "Thin", px: "1px" },
  { value: "medium", label: "Medium", px: "2px" },
  { value: "thick", label: "Thick", px: "3px" },
] as const

export const UNDERLINE_OFFSET = [
  { value: "close", label: "Close", px: "1px" },
  { value: "normal", label: "Normal", px: "3px" },
  { value: "far", label: "Far", px: "6px" },
] as const

export const UNDERLINE_ANIMATION = [
  { value: "none", label: "None" },
  { value: "grow", label: "Grow" },
  { value: "fade", label: "Fade" },
] as const

export const underlineOffsetMap: Record<string, string> = {
  close: "1px",
  normal: "3px",
  far: "6px",
}

/** Map underline color names to CSS color values */
export const underlineColorMap: Record<string, string> = {
  auto: "currentColor",
  indigo: "#4f46e5",
  blue: "#2563eb",
  green: "#059669",
  rose: "#e11d48",
  amber: "#d97706",
  slate: "#64748b",
}

/** Map thickness to px */
export const underlineThicknessMap: Record<string, string> = {
  thin: "1px",
  medium: "2px",
  thick: "3px",
}

/**
 * Generate brush stroke SVG data URI.
 * A hand-drawn wavy line effect, colorized per underline color.
 */
export function brushStrokeSvg(color: string): string {
  const strokeColor = encodeURIComponent(underlineColorMap[color] || "currentColor")
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 8' preserveAspectRatio='none'%3E%3Cpath d='M0,6 C10,2 20,1 30,4 C40,7 55,3 65,2 C75,1 85,5 100,6 C115,7 125,3 135,2 C145,1 160,5 175,6 C185,7 195,4 200,3' fill='none' stroke='${strokeColor}' stroke-width='2.5' stroke-linecap='round' opacity='0.85'/%3E%3C/svg%3E")`
}

/**
 * Build inline CSS styles for a fancy underline span.
 * Used in both the Tiptap extension renderHTML and in component render functions.
 */
export function buildUnderlineStyle(attrs: {
  style?: string
  color?: string
  thickness?: string
  offset?: string
  animation?: string
}): string {
  const { style = "solid", color = "auto", thickness = "medium", offset = "normal", animation = "none" } = attrs
  const colorVal = underlineColorMap[color] || "currentColor"
  const thicknessVal = underlineThicknessMap[thickness] || "2px"
  const offsetVal = underlineOffsetMap[offset] || "3px"

  // Animated underlines use background-image approach (text-decoration can't animate)
  if (animation === "grow") {
    return [
      "text-decoration:none",
      `background-image:linear-gradient(${colorVal}, ${colorVal})`,
      "background-position:0% 100%",
      "background-repeat:no-repeat",
      `background-size:0% ${thicknessVal}`,
      "transition:background-size 0.3s ease",
      `padding-bottom:${offsetVal}`,
    ].join(";")
  }

  if (animation === "fade") {
    return [
      "text-decoration:underline",
      `text-decoration-style:${style === "brush" ? "solid" : style}`,
      `text-decoration-color:transparent`,
      `text-decoration-thickness:${thicknessVal}`,
      `text-underline-offset:${offsetVal}`,
      "transition:text-decoration-color 0.3s ease",
      `--underline-color:${colorVal}`,
    ].join(";")
  }

  if (style === "brush") {
    return [
      "text-decoration:none",
      `background-image:${brushStrokeSvg(color)}`,
      "background-position:bottom center",
      "background-repeat:repeat-x",
      "background-size:auto 6px",
      `padding-bottom:${offsetVal}`,
    ].join(";")
  }

  return [
    "text-decoration:underline",
    `text-decoration-style:${style}`,
    `text-decoration-color:${colorVal}`,
    `text-decoration-thickness:${thicknessVal}`,
    `text-underline-offset:${offsetVal}`,
  ].join(";")
}

// ─── Highlight ───────────────────────────────────────────────

export const HIGHLIGHT_COLORS = [
  { value: "yellow", label: "Yellow", swatch: "#fde047", bg: "rgba(253,224,71,0.4)" },
  { value: "green", label: "Green", swatch: "#86efac", bg: "rgba(134,239,172,0.4)" },
  { value: "blue", label: "Blue", swatch: "#93c5fd", bg: "rgba(147,197,253,0.4)" },
  { value: "pink", label: "Pink", swatch: "#f9a8d4", bg: "rgba(249,168,212,0.4)" },
  { value: "purple", label: "Purple", swatch: "#c4b5fd", bg: "rgba(196,181,253,0.4)" },
  { value: "orange", label: "Orange", swatch: "#fdba74", bg: "rgba(253,186,116,0.4)" },
] as const

export const HIGHLIGHT_RADIUS = [
  { value: "none", label: "Sharp", css: "0" },
  { value: "sm", label: "S", css: "2px" },
  { value: "md", label: "M", css: "4px" },
  { value: "lg", label: "L", css: "8px" },
] as const

export const HIGHLIGHT_PADDING = [
  { value: "tight", label: "Tight", css: "0 2px" },
  { value: "normal", label: "Normal", css: "2px 4px" },
  { value: "wide", label: "Wide", css: "2px 8px" },
] as const

export const HIGHLIGHT_STYLE = [
  { value: "solid", label: "Solid" },
  { value: "gradient", label: "Gradient" },
  { value: "outline", label: "Outline" },
] as const

/** Map highlight color names to CSS background values */
export const highlightColorMap: Record<string, string> = {
  yellow: "rgba(253,224,71,0.4)",
  green: "rgba(134,239,172,0.4)",
  blue: "rgba(147,197,253,0.4)",
  pink: "rgba(249,168,212,0.4)",
  purple: "rgba(196,181,253,0.4)",
  orange: "rgba(253,186,116,0.4)",
}

/** Map highlight color to gradient */
export const highlightGradientMap: Record<string, string> = {
  yellow: "linear-gradient(120deg, rgba(253,224,71,0.4) 0%, rgba(253,224,71,0) 100%)",
  green: "linear-gradient(120deg, rgba(134,239,172,0.4) 0%, rgba(134,239,172,0) 100%)",
  blue: "linear-gradient(120deg, rgba(147,197,253,0.4) 0%, rgba(147,197,253,0) 100%)",
  pink: "linear-gradient(120deg, rgba(249,168,212,0.4) 0%, rgba(249,168,212,0) 100%)",
  purple: "linear-gradient(120deg, rgba(196,181,253,0.4) 0%, rgba(196,181,253,0) 100%)",
  orange: "linear-gradient(120deg, rgba(253,186,116,0.4) 0%, rgba(253,186,116,0) 100%)",
}

/** Map highlight color to outline border */
export const highlightOutlineMap: Record<string, string> = {
  yellow: "rgba(253,224,71,0.7)",
  green: "rgba(134,239,172,0.7)",
  blue: "rgba(147,197,253,0.7)",
  pink: "rgba(249,168,212,0.7)",
  purple: "rgba(196,181,253,0.7)",
  orange: "rgba(253,186,116,0.7)",
}

/**
 * Build inline CSS styles for a fancy highlight mark.
 */
export function buildHighlightStyle(attrs: {
  color?: string
  radius?: string
  padding?: string
  highlightStyle?: string
}): string {
  const { color = "yellow", radius = "sm", padding = "normal", highlightStyle = "solid" } = attrs
  const radiusVal = HIGHLIGHT_RADIUS.find((r) => r.value === radius)?.css || "2px"
  const paddingVal = HIGHLIGHT_PADDING.find((p) => p.value === padding)?.css || "2px 4px"

  const parts = [
    `border-radius:${radiusVal}`,
    `padding:${paddingVal}`,
    "box-decoration-break:clone",
    "-webkit-box-decoration-break:clone",
  ]

  if (highlightStyle === "gradient") {
    parts.push(`background:${highlightGradientMap[color] || highlightGradientMap.yellow}`)
  } else if (highlightStyle === "outline") {
    parts.push("background:transparent")
    parts.push(`border:1.5px solid ${highlightOutlineMap[color] || highlightOutlineMap.yellow}`)
  } else {
    parts.push(`background-color:${highlightColorMap[color] || highlightColorMap.yellow}`)
  }

  return parts.join(";")
}
