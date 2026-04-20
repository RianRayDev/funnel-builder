import type { Config } from "@measured/puck"
import { cn } from "@/lib/utils"
import { Section } from "@/components/puck-elements/Section"
import { Heading } from "@/components/puck-elements/Heading"
import { TextBlock } from "@/components/puck-elements/TextBlock"
import { ImageBlock } from "@/components/puck-elements/ImageBlock"
import { ButtonBlock } from "@/components/puck-elements/ButtonBlock"
import { Spacer } from "@/components/puck-elements/Spacer"
import { Columns } from "@/components/puck-elements/Columns"
import { Divider } from "@/components/puck-elements/Divider"
import { VideoEmbed } from "@/components/puck-elements/VideoEmbed"
import { Testimonial } from "@/components/puck-elements/Testimonial"
import { FAQAccordion } from "@/components/puck-elements/FAQAccordion"
import { FeatureList } from "@/components/puck-elements/FeatureList"
import { CountdownTimer } from "@/components/puck-elements/CountdownTimer"
import { FormBlock } from "@/components/puck-elements/FormBlock"
import { TrustBadges } from "@/components/puck-elements/TrustBadges"
import { BulletList } from "@/components/puck-elements/BulletList"
import { PricingTable } from "@/components/puck-elements/PricingTable"
import { HTMLEmbed } from "@/components/puck-elements/HTMLEmbed"
import { ProgressBar } from "@/components/puck-elements/ProgressBar"
import { Banner } from "@/components/puck-elements/Banner"
import { Footer } from "@/components/puck-elements/Footer"

const pageBgOptions = [
  { value: "", label: "White", swatch: "#ffffff" },
  { value: "bg-slate-50", label: "Light", swatch: "#f8fafc" },
  { value: "bg-slate-100", label: "Gray", swatch: "#f1f5f9" },
  { value: "bg-stone-50", label: "Warm", swatch: "#fafaf9" },
  { value: "bg-zinc-900", label: "Dark", swatch: "#18181b" },
  { value: "bg-slate-950", label: "Black", swatch: "#020617" },
]

export const puckConfig: Config = {
  root: {
    fields: {
      title: { type: "text", label: "Page Title" },
      description: { type: "textarea", label: "Meta Description" },
      favicon: { type: "text", label: "Favicon URL" },
      backgroundColor: {
        type: "custom",
        label: "Background",
        render: ({ value, onChange }: any) => (
          <div>
            <label className="mb-1 block text-[9px] font-semibold uppercase tracking-wider text-gray-400">Page Background</label>
            <div className="flex flex-wrap gap-1.5">
              {pageBgOptions.map((opt) => (
                <button key={opt.value} type="button" title={opt.label} onClick={() => onChange(opt.value)}
                  className={cn("h-5 w-5 rounded-full border-2 transition-all",
                    (value || "") === opt.value ? "border-indigo-500 scale-110 shadow-sm" : "border-gray-200 hover:border-gray-400")}
                  style={{ backgroundColor: opt.swatch, boxShadow: opt.swatch === "#ffffff" && (value || "") !== opt.value ? "inset 0 0 0 1px #e5e7eb" : undefined }}
                />
              ))}
            </div>
          </div>
        ),
      },
      customCSS: { type: "textarea", label: "Custom CSS" },
    },
    defaultProps: {
      title: "Untitled Page",
      description: "",
      favicon: "",
      backgroundColor: "",
      customCSS: "",
    },
    render: ({ children, puck, ...props }: any) => {
      const bg = props.backgroundColor || ""
      const dark = bg.includes("900") || bg.includes("950")
      return (
        <div className={cn("min-h-screen", bg, dark && "text-white")}>
          {props.customCSS && <style>{props.customCSS}</style>}
          {children}
        </div>
      )
    },
  },
  categories: {
    layout: {
      title: "Layout",
      components: ["Section", "Banner", "Columns", "Spacer", "Divider", "Footer"],
    },
    content: {
      title: "Content",
      components: ["Heading", "TextBlock", "BulletList", "ImageBlock", "VideoEmbed"],
    },
    interactive: {
      title: "Interactive",
      components: ["ButtonBlock", "FormBlock", "HTMLEmbed"],
    },
    marketing: {
      title: "Marketing",
      components: ["Testimonial", "FeatureList", "FAQAccordion", "PricingTable", "CountdownTimer", "ProgressBar", "TrustBadges"],
    },
  },
  components: {
    Section: Section as any,
    Banner: Banner as any,
    Heading: Heading as any,
    TextBlock: TextBlock as any,
    BulletList: BulletList as any,
    ImageBlock: ImageBlock as any,
    ButtonBlock: ButtonBlock as any,
    Spacer: Spacer as any,
    Columns: Columns as any,
    Divider: Divider as any,
    VideoEmbed: VideoEmbed as any,
    Testimonial: Testimonial as any,
    FAQAccordion: FAQAccordion as any,
    FeatureList: FeatureList as any,
    CountdownTimer: CountdownTimer as any,
    FormBlock: FormBlock as any,
    TrustBadges: TrustBadges as any,
    PricingTable: PricingTable as any,
    HTMLEmbed: HTMLEmbed as any,
    ProgressBar: ProgressBar as any,
    Footer: Footer as any,
  },
}
