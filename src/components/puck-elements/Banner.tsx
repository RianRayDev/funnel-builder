import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { RichTextField, RichTextContent } from "@/components/RichTextField"
import { TypographyPanel, defaultTypography, type TypographyValue } from "@/components/TypographyPanel"
import { FontPicker } from "@/lib/fonts"

interface BannerProps {
  font: string
  heading: string
  subheading: string
  buttonLabel: string
  buttonLink: string
  buttonVariant: string
  backgroundImage: string
  backgroundGradient: string
  overlayOpacity: string
  minHeight: string
  alignment: string
  typography: TypographyValue
}

const gradientOptions = [
  { value: "", label: "None", swatch: "transparent" },
  { value: "bg-gradient-to-br from-slate-900 to-slate-800", label: "Dark", swatch: "#1e293b" },
  { value: "bg-gradient-to-br from-indigo-600 to-violet-700", label: "Indigo", swatch: "#4f46e5" },
  { value: "bg-gradient-to-br from-blue-600 to-cyan-500", label: "Ocean", swatch: "#2563eb" },
  { value: "bg-gradient-to-br from-emerald-500 to-teal-600", label: "Forest", swatch: "#059669" },
  { value: "bg-gradient-to-br from-rose-500 to-pink-600", label: "Rose", swatch: "#e11d48" },
  { value: "bg-gradient-to-br from-amber-500 to-orange-600", label: "Warm", swatch: "#d97706" },
  { value: "bg-gradient-to-br from-slate-50 to-white", label: "Light", swatch: "#f8fafc" },
]

const btnClasses: Record<string, string> = {
  primary: "bg-white text-slate-900 shadow-lg hover:bg-gray-100",
  outline: "border-2 border-white text-white hover:bg-white/10",
  dark: "bg-slate-900 text-white shadow-lg hover:bg-slate-800",
}

export const Banner: ComponentConfig<BannerProps> = {
  label: "Banner",
  fields: {
    font: {
      type: "custom",
      label: "Font",
      render: ({ value, onChange }) => <FontPicker value={value || "font-sans"} onChange={onChange} />,
    },
    heading: {
      type: "custom", label: "Heading",
      render: ({ value, onChange }) => (
        <RichTextField value={value} onChange={onChange} minimal showAlign placeholder="Your hero headline..." />
      ),
    },
    subheading: {
      type: "custom", label: "Subheading",
      render: ({ value, onChange }) => (
        <RichTextField value={value} onChange={onChange} showAlign placeholder="Supporting text..." />
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
          showAlignment={false}
          showSize={false}
          showLineHeight={false}
        />
      ),
    },
    buttonLabel: { type: "text", label: "Button Text" },
    buttonLink: { type: "text", label: "Button Link" },
    buttonVariant: {
      type: "custom", label: "Button Style",
      render: ({ value, onChange }) => (
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {[{ v: "primary", l: "White" }, { v: "outline", l: "Outline" }, { v: "dark", l: "Dark" }].map((opt) => (
            <button key={opt.v} type="button" onClick={() => onChange(opt.v)}
              className={cn("flex-1 rounded-md py-1.5 text-center text-xs font-medium transition-all",
                value === opt.v ? "bg-white shadow-sm" : "text-gray-400")}>
              {opt.l}
            </button>
          ))}
        </div>
      ),
    },
    backgroundImage: { type: "text", label: "Background Image URL" },
    backgroundGradient: {
      type: "custom", label: "Background Gradient",
      render: ({ value, onChange }) => (
        <div className="grid grid-cols-4 gap-1.5">
          {gradientOptions.map((opt) => (
            <button key={opt.value} type="button" title={opt.label} onClick={() => onChange(opt.value)}
              className={cn("h-7 rounded-md border-2 transition-all",
                value === opt.value ? "border-blue-500 scale-105 shadow-sm" : "border-transparent hover:border-gray-300")}
              style={{ backgroundColor: opt.swatch, border: opt.swatch === "transparent" ? "2px dashed #d1d5db" : undefined }}
            />
          ))}
        </div>
      ),
    },
    overlayOpacity: {
      type: "custom", label: "Overlay Darkness",
      render: ({ value, onChange }) => (
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {[
            { v: "bg-black/0", l: "None" },
            { v: "bg-black/20", l: "Light" },
            { v: "bg-black/40", l: "Medium" },
            { v: "bg-black/60", l: "Heavy" },
          ].map((opt) => (
            <button key={opt.v} type="button" onClick={() => onChange(opt.v)}
              className={cn("flex-1 rounded-md py-1.5 text-center text-xs font-medium transition-all",
                value === opt.v ? "bg-white shadow-sm" : "text-gray-400")}>
              {opt.l}
            </button>
          ))}
        </div>
      ),
    },
    minHeight: {
      type: "custom", label: "Height",
      render: ({ value, onChange }) => (
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {[
            { v: "min-h-[300px]", l: "S" },
            { v: "min-h-[450px]", l: "M" },
            { v: "min-h-[600px]", l: "L" },
            { v: "min-h-screen", l: "Full" },
          ].map((opt) => (
            <button key={opt.v} type="button" onClick={() => onChange(opt.v)}
              className={cn("flex-1 rounded-md py-1.5 text-center text-xs font-medium transition-all",
                value === opt.v ? "bg-white shadow-sm" : "text-gray-400")}>
              {opt.l}
            </button>
          ))}
        </div>
      ),
    },
    alignment: {
      type: "custom", label: "Content Alignment",
      render: ({ value, onChange }) => (
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {[{ v: "items-start text-left", l: "Left" }, { v: "items-center text-center", l: "Center" }, { v: "items-end text-right", l: "Right" }].map((opt) => (
            <button key={opt.v} type="button" onClick={() => onChange(opt.v)}
              className={cn("flex-1 rounded-md py-1.5 text-center text-xs font-medium transition-all",
                value === opt.v ? "bg-white shadow-sm" : "text-gray-400")}>
              {opt.l}
            </button>
          ))}
        </div>
      ),
    },
  },
  defaultProps: {
    font: "font-sans",
    heading: "Build Something People Love",
    subheading: "The all-in-one platform to create, launch, and grow your online presence.",
    buttonLabel: "Get Started Free",
    buttonLink: "#",
    buttonVariant: "primary",
    backgroundImage: "",
    backgroundGradient: "bg-gradient-to-br from-indigo-600 to-violet-700",
    overlayOpacity: "bg-black/0",
    minHeight: "min-h-[450px]",
    alignment: "items-center text-center",
    typography: {
      ...defaultTypography,
      weight: "font-bold",
    },
  },
  render: ({ font = "font-sans", heading = "", subheading = "", buttonLabel = "Get Started Free", buttonLink = "#", buttonVariant = "primary", backgroundImage = "", backgroundGradient = "bg-gradient-to-br from-indigo-600 to-violet-700", overlayOpacity = "bg-black/0", minHeight = "min-h-[450px]", alignment = "items-center text-center", typography, ...legacy }: any) => {
    const typo = typography || {
      ...defaultTypography,
      font: legacy.font || font || defaultTypography.font,
      weight: "font-bold",
    }
    const hasImage = !!backgroundImage
    const isLightGradient = backgroundGradient.includes("slate-50") || backgroundGradient.includes("white")
    const textColor = isLightGradient && !hasImage ? "text-slate-900" : "text-white"

    return (
      <div className={cn("relative flex w-full flex-col justify-center overflow-hidden px-6 py-16", minHeight, alignment, !hasImage && backgroundGradient)}>
        {hasImage && (
          <img src={backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        {hasImage && backgroundGradient && (
          <div className={cn("absolute inset-0 opacity-80", backgroundGradient)} />
        )}
        <div className={cn("absolute inset-0", overlayOpacity)} />

        <div className={cn("relative z-10 mx-auto w-full max-w-3xl", font || typo.font, typo.transform)}>
          <RichTextContent
            html={heading}
            className={cn(
              "mb-4 text-4xl tracking-tight sm:text-5xl [&_p]:mb-0 [&_a]:underline",
              typo.weight,
              typo.letterSpacing,
              textColor,
            )}
          />
          <RichTextContent
            html={subheading}
            className={cn("mb-8 text-lg leading-relaxed opacity-80 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_a]:underline", textColor)}
          />
          {buttonLabel && (
            <a
              href={buttonLink || "#"}
              className={cn("inline-flex h-12 items-center justify-center rounded-xl px-8 text-base font-semibold transition-all active:scale-[0.97]", btnClasses[buttonVariant] || btnClasses.primary)}
            >
              {buttonLabel}
            </a>
          )}
        </div>
      </div>
    )
  },
}
