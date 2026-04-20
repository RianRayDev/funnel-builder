import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { isDarkBg } from "@/components/puck-elements/Section"
import { Shield, Lock, CreditCard, Award, CheckCircle } from "lucide-react"

interface FooterProps {
  layout: string
  siteName: string
  tagline: string
  privacyUrl: string
  termsUrl: string
  ctaText: string
  ctaLink: string
  backgroundColor: string
  showPoweredBy: string
}

const bgOptions = [
  { value: "bg-white", label: "White", swatch: "#ffffff" },
  { value: "bg-slate-50", label: "Light", swatch: "#f8fafc" },
  { value: "bg-slate-100", label: "Gray", swatch: "#f1f5f9" },
  { value: "bg-blue-50", label: "Blue", swatch: "#eff6ff" },
  { value: "bg-amber-50", label: "Warm", swatch: "#fffbeb" },
  { value: "bg-slate-800", label: "Dark", swatch: "#1e293b" },
  { value: "bg-slate-900", label: "Darker", swatch: "#0f172a" },
  { value: "bg-slate-950", label: "Black", swatch: "#020617" },
  { value: "bg-indigo-600", label: "Indigo", swatch: "#4f46e5" },
  { value: "bg-blue-600", label: "Blue", swatch: "#2563eb" },
  { value: "bg-emerald-600", label: "Green", swatch: "#059669" },
  { value: "bg-rose-600", label: "Rose", swatch: "#e11d48" },
]

function PoweredBy({ dark }: { dark: boolean }) {
  return (
    <div className="mt-4 text-center">
      <a
        href="https://rianray.dev"
        target="_blank"
        rel="noopener noreferrer"
        className={cn("text-[10px] transition-opacity", dark ? "text-white/15 hover:text-white/30" : "text-slate-400/40 hover:text-slate-400/60")}
      >
        Powered by rianray.dev
      </a>
    </div>
  )
}

function FooterLinks({ privacyUrl, termsUrl, textMuted, textLink }: { privacyUrl: string; termsUrl: string; textMuted: string; textLink: string }) {
  return (
    <>
      <span className={cn("hidden sm:inline", textMuted)}>·</span>
      <a href={privacyUrl} className={cn("text-sm transition-colors", textLink)}>Privacy Policy</a>
      <span className={cn("hidden sm:inline", textMuted)}>·</span>
      <a href={termsUrl} className={cn("text-sm transition-colors", textLink)}>Terms of Service</a>
    </>
  )
}

export const Footer: ComponentConfig<FooterProps> = {
  fields: {
    layout: {
      type: "select",
      label: "Footer Style",
      options: [
        { value: "minimal", label: "Minimal Legal" },
        { value: "cta", label: "CTA + Legal" },
        { value: "brand", label: "Brand + Tagline" },
        { value: "two-column", label: "Two Column" },
        { value: "social-proof", label: "Social Proof" },
        { value: "powered-by", label: "Simple (Powered By)" },
      ],
    },
    siteName: { type: "text", label: "Site Name" },
    tagline: { type: "text", label: "Tagline" },
    ctaText: { type: "text", label: "CTA Button Text" },
    ctaLink: { type: "text", label: "CTA Button Link" },
    privacyUrl: { type: "text", label: "Privacy Policy URL" },
    termsUrl: { type: "text", label: "Terms URL" },
    backgroundColor: {
      type: "custom",
      label: "Background",
      render: ({ value, onChange }: any) => (
        <div>
          <label className="mb-1 block text-[9px] font-semibold uppercase tracking-wider text-gray-400">Background</label>
          <div className="flex flex-wrap gap-1.5">
            {bgOptions.map((opt) => (
              <button key={opt.value} type="button" title={opt.label} onClick={() => onChange(opt.value)}
                className={cn("h-5 w-5 rounded-full border-2 transition-all",
                  value === opt.value ? "border-indigo-500 scale-110 shadow-sm" : "border-gray-200 hover:border-gray-400")}
                style={{ backgroundColor: opt.swatch, boxShadow: opt.swatch === "#ffffff" && value !== opt.value ? "inset 0 0 0 1px #e5e7eb" : undefined }}
              />
            ))}
          </div>
        </div>
      ),
    },
    showPoweredBy: {
      type: "select",
      label: "Powered By Badge",
      options: [
        { value: "yes", label: "Show" },
        { value: "no", label: "Hide" },
      ],
    },
  },
  defaultProps: {
    layout: "powered-by",
    siteName: "Your Brand",
    tagline: "Building the future, one page at a time.",
    privacyUrl: "#privacy",
    termsUrl: "#terms",
    ctaText: "Get Started Now",
    ctaLink: "#",
    backgroundColor: "bg-slate-900",
    showPoweredBy: "yes",
  },
  render: ({ layout, siteName, tagline, privacyUrl, termsUrl, ctaText, ctaLink, backgroundColor, showPoweredBy }) => {
    const year = new Date().getFullYear()
    const dark = isDarkBg(backgroundColor || "")
    const textBase = dark ? "text-white" : "text-slate-900"
    const textMuted = dark ? "text-white/40" : "text-slate-500"
    const textLink = dark ? "text-white/60 hover:text-white" : "text-slate-600 hover:text-slate-900"
    const borderColor = dark ? "border-white/10" : "border-slate-200"
    const powered = showPoweredBy === "yes"

    if (layout === "minimal") {
      return (
        <footer className={cn("px-6 py-6", backgroundColor)}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
            <span className={cn("text-sm", textMuted)}>© {year} {siteName}</span>
            <FooterLinks privacyUrl={privacyUrl} termsUrl={termsUrl} textMuted={textMuted} textLink={textLink} />
          </div>
          {powered && <PoweredBy dark={dark} />}
        </footer>
      )
    }

    if (layout === "cta") {
      return (
        <footer className={cn("px-6 py-14", backgroundColor)}>
          <div className="mx-auto max-w-2xl text-center">
            <h3 className={cn("text-2xl font-bold tracking-tight", textBase)}>Ready to get started?</h3>
            <p className={cn("mt-2 text-base", textMuted)}>{tagline}</p>
            <a href={ctaLink} className="mt-6 inline-flex h-12 items-center rounded-lg bg-indigo-600 px-8 text-base font-semibold text-white shadow-lg transition-colors hover:bg-indigo-700">
              {ctaText}
            </a>
            <div className={cn("mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t pt-6 text-sm", borderColor, textMuted)}>
              <span>© {year} {siteName}</span>
              <FooterLinks privacyUrl={privacyUrl} termsUrl={termsUrl} textMuted={textMuted} textLink={textLink} />
            </div>
          </div>
          {powered && <PoweredBy dark={dark} />}
        </footer>
      )
    }

    if (layout === "brand") {
      return (
        <footer className={cn("px-6 py-10", backgroundColor)}>
          <div className="mx-auto max-w-6xl text-center">
            <p className={cn("text-lg font-bold tracking-tight", textBase)}>{siteName}</p>
            <p className={cn("mt-1.5 text-sm", textMuted)}>{tagline}</p>
            <div className={cn("mt-6 border-t pt-5", borderColor)}>
              <div className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm", textMuted)}>
                <span>© {year} {siteName}</span>
                <FooterLinks privacyUrl={privacyUrl} termsUrl={termsUrl} textMuted={textMuted} textLink={textLink} />
              </div>
            </div>
          </div>
          {powered && <PoweredBy dark={dark} />}
        </footer>
      )
    }

    if (layout === "two-column") {
      return (
        <footer className={cn("px-6 py-10", backgroundColor)}>
          <div className={cn("mx-auto max-w-6xl border-t pt-8", borderColor)}>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className={cn("text-base font-bold tracking-tight", textBase)}>{siteName}</p>
                <p className={cn("mt-1 text-sm", textMuted)}>{tagline}</p>
              </div>
              <div className={cn("flex flex-wrap items-center gap-4 text-sm", textMuted)}>
                <a href={privacyUrl} className={cn("transition-colors", textLink)}>Privacy</a>
                <a href={termsUrl} className={cn("transition-colors", textLink)}>Terms</a>
              </div>
            </div>
            <p className={cn("mt-6 text-sm", textMuted)}>© {year} {siteName}. All rights reserved.</p>
          </div>
          {powered && <PoweredBy dark={dark} />}
        </footer>
      )
    }

    if (layout === "social-proof") {
      const badges = [
        { icon: Shield, label: "100% Secure" },
        { icon: Lock, label: "SSL Encrypted" },
        { icon: Award, label: "Money-Back Guarantee" },
        { icon: CreditCard, label: "Secure Payment" },
        { icon: CheckCircle, label: "Verified" },
      ]
      return (
        <footer className={cn("px-6 py-10", backgroundColor)}>
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {badges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className={cn("h-4 w-4", textMuted)} />
                  <span className={cn("text-xs font-medium", textMuted)}>{label}</span>
                </div>
              ))}
            </div>
            <div className={cn("mt-6 border-t pt-5 text-center text-sm", borderColor, textMuted)}>
              <p>© {year} {siteName}. All rights reserved.</p>
            </div>
          </div>
          {powered && <PoweredBy dark={dark} />}
        </footer>
      )
    }

    return (
      <footer className={cn("px-6 py-8", backgroundColor)}>
        <div className="mx-auto max-w-6xl text-center">
          <p className={cn("text-sm", textMuted)}>© {year} {siteName}</p>
          <a
            href="https://rianray.dev"
            target="_blank"
            rel="noopener noreferrer"
            className={cn("mt-2 inline-block text-xs transition-opacity", dark ? "text-white/20 hover:text-white/40" : "text-slate-400/50 hover:text-slate-400")}
          >
            Powered by rianray.dev
          </a>
        </div>
      </footer>
    )
  },
}
