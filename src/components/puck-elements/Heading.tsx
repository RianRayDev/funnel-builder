import type { ComponentConfig } from "@measured/puck"
import { usePuck } from "@measured/puck"
import { cn } from "@/lib/utils"
import { createElement, useState, useRef, useEffect } from "react"
import { RichTextField } from "@/components/RichTextField"
import { fontOptions } from "@/lib/fonts"
import { AlignLeft, AlignCenter, AlignRight, Type, ChevronDown, Pencil } from "lucide-react"

type HeadingTypographyValue = {
  font: string
  weight: string
  size: string
  lineHeight: string
  letterSpacing: string
  color: string
  alignment: string
  transform: string
  level?: string
}

interface HeadingProps {
  text: string
  level?: string
  typography: HeadingTypographyValue
}

const defaultTypography: HeadingTypographyValue = {
  font: "font-sans",
  weight: "auto",
  size: "auto",
  lineHeight: "auto",
  letterSpacing: "tracking-tight",
  color: "text-inherit",
  alignment: "text-left",
  transform: "",
}

const levelDefaults: Record<string, { size: string; weight: string; lineHeight: string }> = {
  h1: { size: "text-5xl", weight: "font-bold", lineHeight: "leading-tight" },
  h2: { size: "text-4xl", weight: "font-bold", lineHeight: "leading-tight" },
  h3: { size: "text-3xl", weight: "font-semibold", lineHeight: "leading-snug" },
  h4: { size: "text-2xl", weight: "font-semibold", lineHeight: "leading-snug" },
  h5: { size: "text-xl", weight: "font-medium", lineHeight: "leading-normal" },
  h6: { size: "text-lg", weight: "font-medium", lineHeight: "leading-normal" },
}

const weightOptions = [
  { value: "auto", label: "Auto" },
  { value: "font-light", label: "300" },
  { value: "font-normal", label: "400" },
  { value: "font-medium", label: "500" },
  { value: "font-semibold", label: "600" },
  { value: "font-bold", label: "700" },
  { value: "font-extrabold", label: "800" },
]

const sizeOptions = [
  { value: "auto", label: "Auto" },
  { value: "text-xs", label: "12" },
  { value: "text-sm", label: "14" },
  { value: "text-base", label: "16" },
  { value: "text-lg", label: "18" },
  { value: "text-xl", label: "20" },
  { value: "text-2xl", label: "24" },
  { value: "text-3xl", label: "30" },
  { value: "text-4xl", label: "36" },
  { value: "text-5xl", label: "48" },
]

const heightOptions = [
  { value: "auto", label: "Auto" },
  { value: "leading-none", label: "1.0" },
  { value: "leading-tight", label: "1.25" },
  { value: "leading-snug", label: "1.4" },
  { value: "leading-normal", label: "1.5" },
  { value: "leading-relaxed", label: "1.6" },
  { value: "leading-loose", label: "2.0" },
]

const spacingOptions = [
  { value: "tracking-tighter", label: "-0.05" },
  { value: "tracking-tight", label: "-0.025" },
  { value: "tracking-normal", label: "0" },
  { value: "tracking-wide", label: "0.025" },
  { value: "tracking-wider", label: "0.05" },
]


const colorOptions = [
  { value: "text-inherit", label: "Auto", swatch: "inherit" },
  { value: "text-slate-900", label: "Dark", swatch: "#0f172a" },
  { value: "text-white", label: "White", swatch: "#ffffff" },
  { value: "text-indigo-600", label: "Indigo", swatch: "#4f46e5" },
  { value: "text-blue-600", label: "Blue", swatch: "#2563eb" },
  { value: "text-emerald-600", label: "Green", swatch: "#059669" },
  { value: "text-rose-600", label: "Rose", swatch: "#e11d48" },
  { value: "text-amber-600", label: "Amber", swatch: "#d97706" },
  { value: "text-slate-500", label: "Muted", swatch: "#64748b" },
]

const transformOptions = [
  { value: "", label: "Aa" },
  { value: "uppercase", label: "AB" },
  { value: "lowercase", label: "ab" },
  { value: "capitalize", label: "Ab" },
]

function updateTypographyProp(appState: any, dispatch: any, componentId: string, patch: Partial<HeadingTypographyValue>) {
  const cloned = JSON.parse(JSON.stringify(appState.data))
  const updateInList = (items: any[]) => {
    for (const item of items) {
      if (item.props?.id === componentId) {
        if (!item.props.typography) {
          // Initialize typography from defaults. Preserve the existing top-level
          // level prop so old-format components don't lose their heading level.
          const existingLevel = item.props.level
          item.props.typography = {
            ...defaultTypography,
            ...(existingLevel ? { level: existingLevel } : {}),
          }
        }
        Object.assign(item.props.typography, patch)
        return true
      }
    }
    return false
  }
  if (!updateInList(cloned.content || [])) {
    if (cloned.zones) {
      for (const zone of Object.values(cloned.zones) as any[]) {
        if (updateInList(zone)) break
      }
    }
  }
  dispatch({ type: "setData", data: cloned })
}

function CompactFontSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = fontOptions.find((f) => f.value === value) || fontOptions[0]

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); setOpen((o) => !o) }}
        className={cn(
          "flex h-6 items-center gap-1 rounded-md px-1.5 transition-all text-[10px] font-medium",
          open ? "bg-indigo-100 text-indigo-600" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
        )}
      >
        <Type className="h-3 w-3" />
        <span style={{ fontFamily: selected.family }}>{selected.label}</span>
        <ChevronDown className={cn("h-2 w-2 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-40 rounded-md border border-gray-200 bg-white py-0.5 shadow-lg">
          {fontOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setOpen(false) }}
              className={cn(
                "flex w-full items-center gap-2 px-2 py-1 text-left text-[10px] font-medium transition-all",
                value === opt.value ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50",
              )}
            >
              <span style={{ fontFamily: opt.family }}>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function HeadingTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { selectedItem, dispatch, appState } = usePuck()
  const props = selectedItem?.props as any
  const typo = props?.typography || defaultTypography
  const level = typo.level || props?.level || "h2"
  const font = typo.font || "font-sans"
  const alignment = typo.alignment || "text-left"
  const transform = typo.transform || ""

  const handleLevelChange = (newLevel: string) => {
    if (!props?.id) return
    updateTypographyProp(appState, dispatch, props.id, { level: newLevel })
  }

  const handleFontChange = (v: string) => {
    if (!props?.id) return
    updateTypographyProp(appState, dispatch, props.id, { font: v })
  }

  const handleAlignChange = (v: string) => {
    if (!props?.id) return
    updateTypographyProp(appState, dispatch, props.id, { alignment: v })
  }

  const handleTransformChange = (v: string) => {
    if (!props?.id) return
    updateTypographyProp(appState, dispatch, props.id, { transform: v })
  }

  const secondaryToolbar = (
    <div className="flex items-center gap-1">
      <CompactFontSelect value={font} onChange={handleFontChange} />
      <div className="mx-0.5 h-4 w-px bg-gray-100" />
      {[
        { v: "text-left", Icon: AlignLeft },
        { v: "text-center", Icon: AlignCenter },
        { v: "text-right", Icon: AlignRight },
      ].map(({ v, Icon }) => (
        <button
          key={v}
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleAlignChange(v) }}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md transition-all",
            alignment === v ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600",
          )}
        >
          <Icon className="h-3 w-3" />
        </button>
      ))}
      <div className="mx-0.5 h-4 w-px bg-gray-100" />
      {transformOptions.map((opt) => (
        <button
          key={opt.value || "none"}
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleTransformChange(opt.value) }}
          className={cn(
            "flex h-6 items-center justify-center rounded-md px-1 text-[10px] font-semibold transition-all",
            transform === opt.value ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )

  return (
    <RichTextField
      value={value}
      onChange={onChange}
      headingLevel={level}
      onHeadingLevelChange={handleLevelChange}
      secondaryToolbar={secondaryToolbar}
      placeholder="Your heading..."
    />
  )
}

function MetricField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  const isCustom = typeof value === "string" && value.startsWith("custom:")
  const [inputMode, setInputMode] = useState(isCustom)
  const dropdownRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-w-0 group" ref={dropdownRef}>
      <label className="mb-0.5 block text-[9px] font-semibold uppercase tracking-wider text-gray-400">{label}</label>
      <div className="relative">
        {inputMode ? (
          <>
            <input
              type="text"
              value={isCustom ? value.slice(7) : ""}
              onChange={(e) => onChange(`custom:${e.target.value}`)}
              placeholder={placeholder || "..."}
              className="w-full appearance-none rounded-md border border-indigo-300 bg-white py-1 pl-1.5 pr-5 text-[11px] font-medium text-gray-700 ring-1 ring-indigo-100 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              autoFocus
            />
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setInputMode(false); if (isCustom) onChange(options[0].value) }}
              className="absolute right-0.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-gray-400 transition-colors hover:text-indigo-500"
            >
              <ChevronDown className="h-2.5 w-2.5" />
            </button>
          </>
        ) : (
          <>
            <select
              value={isCustom ? options[0].value : value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-200 bg-white py-1 pl-1.5 pr-5 text-[11px] font-medium text-gray-700 transition-all hover:border-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-100"
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 text-gray-400 transition-opacity group-hover:opacity-0" />
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setInputMode(true) }}
              className="absolute right-0.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-gray-400 opacity-0 transition-all hover:text-indigo-500 group-hover:opacity-100"
            >
              <Pencil className="h-2.5 w-2.5" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function HeadingTypographyPanel({
  value,
  onChange,
}: {
  value: HeadingTypographyValue
  onChange: (next: HeadingTypographyValue) => void
}) {
  // Do not hardcode level here — level is managed exclusively by HeadingTextEditor
  // via updateTypographyProp. If value is undefined (old-format component with no
  // typography prop yet), omit level so the render function resolves it from legacyLevel.
  const current: HeadingTypographyValue = value || { ...defaultTypography }

  const update = (patch: Partial<HeadingTypographyValue>) =>
    onChange({ ...current, ...patch })

  return (
    <div className="space-y-0">
      <div className="grid grid-cols-4 gap-1.5 py-2.5">
        <MetricField label="Weight" value={current.weight || "auto"} onChange={(v) => update({ weight: v })} options={weightOptions} placeholder="700" />
        <MetricField label="Size" value={current.size || "auto"} onChange={(v) => update({ size: v })} options={sizeOptions} placeholder="48px" />
        <MetricField label="Height" value={current.lineHeight || "auto"} onChange={(v) => update({ lineHeight: v })} options={heightOptions} placeholder="1.5" />
        <MetricField label="Spacing" value={current.letterSpacing || "tracking-normal"} onChange={(v) => update({ letterSpacing: v })} options={spacingOptions} placeholder="0.05em" />
      </div>

      <div className="border-t border-gray-100" />

      <div className="pt-2.5">
        <label className="mb-0.5 block text-[9px] font-semibold uppercase tracking-wider text-gray-400">Color</label>
        <div className="flex flex-wrap gap-1.5">
          {colorOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              title={opt.label}
              onClick={() => update({ color: opt.value })}
              className={cn(
                "h-5 w-5 rounded-full border-2 transition-all",
                (current.color || "text-inherit") === opt.value ? "border-indigo-500 scale-110 shadow-sm" : "border-gray-200 hover:border-gray-400",
              )}
              style={{
                backgroundColor: opt.swatch === "inherit" ? "transparent" : opt.swatch,
                backgroundImage: opt.swatch === "inherit" ? "linear-gradient(135deg, #e5e7eb 50%, #4f46e5 50%)" : undefined,
                boxShadow: opt.swatch === "#ffffff" && (current.color || "text-inherit") !== opt.value ? "inset 0 0 0 1px #e5e7eb" : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export const Heading: ComponentConfig<HeadingProps> = {
  label: "Heading",
  fields: {
    text: {
      type: "custom",
      label: "Text",
      render: ({ value, onChange }) => (
        <HeadingTextEditor value={value} onChange={onChange} />
      ),
    },
    typography: {
      type: "custom",
      label: "Style",
      render: ({ value, onChange }) => (
        <HeadingTypographyPanel
          value={(value as HeadingTypographyValue) || { ...defaultTypography }}
          onChange={onChange}
        />
      ),
    },
  },
  defaultProps: {
    text: "Your Headline Here",
    typography: {
      ...defaultTypography,
      level: "h2",
    },
  },
  resolveData: async (data: any) => {
    const props = { ...data.props }
    if (!props.typography || !props.typography.level) {
      props.typography = {
        ...defaultTypography,
        ...props.typography,
        level: props.level || "h2",
        font: props.font || props.typography?.font || "font-sans",
      }
    }
    return { props, readOnly: {} }
  },
  render: ({ text = "", level: legacyLevel, typography, ...legacy }: any) => {
    const level = (typography as any)?.level || legacyLevel || "h2"
    const defaults = levelDefaults[level] || levelDefaults.h2

    const typo: HeadingTypographyValue = typography || {
      ...defaultTypography,
      font: legacy.font || defaultTypography.font,
      color: legacy.color || defaultTypography.color,
      alignment: legacy.alignment || defaultTypography.alignment,
      level,
    }

    const inlineStyle: Record<string, string> = {}

    const resolveClass = (val: string | undefined, fallback: string, styleKey: string): string => {
      if (!val || val === "auto") return fallback
      if (val.startsWith("custom:")) {
        inlineStyle[styleKey] = val.slice(7)
        return ""
      }
      return val
    }

    const weightClass = resolveClass(typo.weight, defaults.weight, "fontWeight")
    const sizeClass = resolveClass(typo.size, defaults.size, "fontSize")
    const lineHeightClass = resolveClass(typo.lineHeight, defaults.lineHeight, "lineHeight")

    let letterSpacingClass = ""
    if (typo.letterSpacing) {
      if (typo.letterSpacing.startsWith("custom:")) {
        inlineStyle.letterSpacing = typo.letterSpacing.slice(7)
      } else {
        letterSpacingClass = typo.letterSpacing
      }
    }

    const resolvedFont = typo.font || legacy.font || "font-sans"
    const raw = typeof text === "string" ? text : String(text || "")
    const unwrapped = raw
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "<br>")
      .replace(/<br>$/, "")

    const elementProps: any = {
      className: cn(
        resolvedFont, weightClass, sizeClass, lineHeightClass,
        letterSpacingClass, typo.alignment, typo.color, typo.transform,
        "[&_a]:underline",
      ),
      dangerouslySetInnerHTML: { __html: unwrapped || "Your Headline Here" },
    }

    if (Object.keys(inlineStyle).length > 0) {
      elementProps.style = inlineStyle
    }

    return createElement(level, elementProps)
  },
}
