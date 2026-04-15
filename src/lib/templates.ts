import type { Data } from "@measured/puck"

export interface FunnelTemplate {
  id: string
  name: string
  description: string
  category: "starter" | "lead-capture" | "sales" | "webinar" | "coming-soon"
  thumbnail: string
  data: Data
}

export const templates: FunnelTemplate[] = [
  {
    id: "blank",
    name: "Blank Canvas",
    description: "Start from scratch with a clean page",
    category: "starter",
    thumbnail: "blank",
    data: {
      content: [],
      root: { props: { title: "Untitled Page" } },
    },
  },
  {
    id: "default-starter",
    name: "Starter Page",
    description: "Hero, benefits, testimonials, and CTA — everything you need",
    category: "starter",
    thumbnail: "starter",
    data: {
      content: [
        {
          type: "Section",
          props: {
            id: "hero-section",
            backgroundColor: "bg-white",
            paddingY: "py-24",
            maxWidth: "max-w-6xl",
          },
        },
        {
          type: "Heading",
          props: {
            id: "hero-heading",
            text: "Build Something People Actually Want",
            level: "h1",
            alignment: "text-center",
            color: "text-foreground",
          },
        },
        {
          type: "Spacer",
          props: { id: "spacer-1", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: {
            id: "hero-subtext",
            content: "Stop guessing what works. Start with a proven framework that converts visitors into customers — designed for speed and clarity.",
            alignment: "text-center",
            size: "text-lg",
          },
        },
        {
          type: "Spacer",
          props: { id: "spacer-2", height: "h-8" },
        },
        {
          type: "ButtonBlock",
          props: {
            id: "hero-cta",
            label: "Get Started Free",
            link: "#",
            variant: "primary",
            size: "lg",
            fullWidth: false,
            alignment: "justify-center",
          },
        },
        {
          type: "Spacer",
          props: { id: "spacer-3", height: "h-16" },
        },
        {
          type: "Divider",
          props: { id: "divider-1", style: "border-solid", color: "border-muted-foreground/20" },
        },
        {
          type: "Spacer",
          props: { id: "spacer-4", height: "h-16" },
        },
        {
          type: "Heading",
          props: {
            id: "benefits-heading",
            text: "Why Choose Us",
            level: "h2",
            alignment: "text-center",
            color: "text-foreground",
          },
        },
        {
          type: "Spacer",
          props: { id: "spacer-5", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: {
            id: "benefits-subtext",
            content: "Everything you need to launch, grow, and scale — without the complexity.",
            alignment: "text-center",
            size: "text-base",
          },
        },
        {
          type: "Spacer",
          props: { id: "spacer-6", height: "h-12" },
        },
        {
          type: "Columns",
          props: { id: "benefits-cols", columns: "grid-cols-3", gap: "gap-8" },
        },
        {
          type: "Spacer",
          props: { id: "spacer-7", height: "h-16" },
        },
        {
          type: "Section",
          props: {
            id: "testimonial-section",
            backgroundColor: "bg-slate-50",
            paddingY: "py-16",
            maxWidth: "max-w-6xl",
          },
        },
        {
          type: "Heading",
          props: {
            id: "testimonial-heading",
            text: "What Our Customers Say",
            level: "h2",
            alignment: "text-center",
            color: "text-foreground",
          },
        },
        {
          type: "Spacer",
          props: { id: "spacer-8", height: "h-8" },
        },
        {
          type: "TextBlock",
          props: {
            id: "testimonial-1",
            content: "\"This completely transformed how we approach our business. The results speak for themselves — 3x more conversions in the first month.\"",
            alignment: "text-center",
            size: "text-lg",
          },
        },
        {
          type: "Spacer",
          props: { id: "spacer-9", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: {
            id: "testimonial-author",
            content: "— Sarah Johnson, Marketing Director",
            alignment: "text-center",
            size: "text-sm",
          },
        },
        {
          type: "Spacer",
          props: { id: "spacer-10", height: "h-16" },
        },
        {
          type: "Divider",
          props: { id: "divider-2", style: "border-solid", color: "border-muted-foreground/20" },
        },
        {
          type: "Spacer",
          props: { id: "spacer-11", height: "h-16" },
        },
        {
          type: "Heading",
          props: {
            id: "final-cta-heading",
            text: "Ready to Get Started?",
            level: "h2",
            alignment: "text-center",
            color: "text-foreground",
          },
        },
        {
          type: "Spacer",
          props: { id: "spacer-12", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: {
            id: "final-cta-text",
            content: "Join thousands of businesses already using our platform. No credit card required.",
            alignment: "text-center",
            size: "text-base",
          },
        },
        {
          type: "Spacer",
          props: { id: "spacer-13", height: "h-8" },
        },
        {
          type: "ButtonBlock",
          props: {
            id: "final-cta-button",
            label: "Start Building Today",
            link: "#",
            variant: "primary",
            size: "lg",
            fullWidth: false,
            alignment: "justify-center",
          },
        },
        {
          type: "Spacer",
          props: { id: "spacer-14", height: "h-24" },
        },
      ],
      root: { props: { title: "Starter Page" } },
    },
  },
  {
    id: "lead-capture",
    name: "Lead Capture",
    description: "Optimized for email opt-ins with a hero, benefits, and form",
    category: "lead-capture",
    thumbnail: "lead",
    data: {
      content: [
        {
          type: "Section",
          props: {
            id: "lc-hero-section",
            backgroundColor: "bg-white",
            paddingY: "py-24",
            maxWidth: "max-w-4xl",
          },
        },
        {
          type: "Heading",
          props: {
            id: "lc-heading",
            text: "Get Your Free Guide to 10x Conversions",
            level: "h1",
            alignment: "text-center",
            color: "text-foreground",
          },
        },
        {
          type: "Spacer",
          props: { id: "lc-spacer-1", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: {
            id: "lc-subtext",
            content: "Learn the exact strategies top companies use to turn visitors into paying customers. Free download, no spam.",
            alignment: "text-center",
            size: "text-lg",
          },
        },
        {
          type: "Spacer",
          props: { id: "lc-spacer-2", height: "h-8" },
        },
        {
          type: "ButtonBlock",
          props: {
            id: "lc-cta",
            label: "Download Free Guide",
            link: "#",
            variant: "primary",
            size: "lg",
            fullWidth: false,
            alignment: "justify-center",
          },
        },
        {
          type: "Spacer",
          props: { id: "lc-spacer-3", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: {
            id: "lc-trust",
            content: "Trusted by 10,000+ businesses worldwide",
            alignment: "text-center",
            size: "text-sm",
          },
        },
        {
          type: "Spacer",
          props: { id: "lc-spacer-4", height: "h-16" },
        },
        {
          type: "Divider",
          props: { id: "lc-divider", style: "border-solid", color: "border-muted-foreground/20" },
        },
        {
          type: "Spacer",
          props: { id: "lc-spacer-5", height: "h-16" },
        },
        {
          type: "Heading",
          props: {
            id: "lc-benefits-title",
            text: "What You'll Learn",
            level: "h2",
            alignment: "text-center",
            color: "text-foreground",
          },
        },
        {
          type: "Spacer",
          props: { id: "lc-spacer-6", height: "h-8" },
        },
        {
          type: "Columns",
          props: { id: "lc-benefits-cols", columns: "grid-cols-3", gap: "gap-6" },
        },
        {
          type: "Spacer",
          props: { id: "lc-spacer-7", height: "h-16" },
        },
        {
          type: "Section",
          props: {
            id: "lc-final",
            backgroundColor: "bg-slate-50",
            paddingY: "py-16",
            maxWidth: "max-w-4xl",
          },
        },
        {
          type: "Heading",
          props: {
            id: "lc-final-heading",
            text: "Don't Miss Out",
            level: "h2",
            alignment: "text-center",
            color: "text-foreground",
          },
        },
        {
          type: "Spacer",
          props: { id: "lc-spacer-8", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: {
            id: "lc-final-text",
            content: "This free guide is available for a limited time. Grab your copy before it's gone.",
            alignment: "text-center",
            size: "text-base",
          },
        },
        {
          type: "Spacer",
          props: { id: "lc-spacer-9", height: "h-8" },
        },
        {
          type: "ButtonBlock",
          props: {
            id: "lc-final-cta",
            label: "Get Instant Access",
            link: "#",
            variant: "primary",
            size: "lg",
            fullWidth: false,
            alignment: "justify-center",
          },
        },
        {
          type: "Spacer",
          props: { id: "lc-spacer-10", height: "h-16" },
        },
      ],
      root: { props: { title: "Lead Capture" } },
    },
  },
  {
    id: "sales-page",
    name: "Sales Page",
    description: "Long-form sales page with social proof, features, and pricing",
    category: "sales",
    thumbnail: "sales",
    data: {
      content: [
        {
          type: "Section",
          props: { id: "sp-hero", backgroundColor: "bg-white", paddingY: "py-24", maxWidth: "max-w-6xl" },
        },
        {
          type: "Heading",
          props: { id: "sp-h1", text: "The Only Tool You'll Ever Need to Grow Your Business", level: "h1", alignment: "text-center", color: "text-foreground" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s1", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: { id: "sp-sub", content: "Join 50,000+ businesses that scaled to 6 figures using our proven system. See why industry leaders call it a game-changer.", alignment: "text-center", size: "text-lg" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s2", height: "h-8" },
        },
        {
          type: "ButtonBlock",
          props: { id: "sp-cta1", label: "Start Your Free Trial", link: "#", variant: "primary", size: "lg", fullWidth: false, alignment: "justify-center" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s3", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: { id: "sp-trust1", content: "30-day money-back guarantee. No questions asked.", alignment: "text-center", size: "text-sm" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s4", height: "h-16" },
        },
        {
          type: "Divider",
          props: { id: "sp-d1", style: "border-solid", color: "border-muted-foreground/20" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s5", height: "h-16" },
        },
        {
          type: "Heading",
          props: { id: "sp-problem", text: "Tired of Guessing What Works?", level: "h2", alignment: "text-center", color: "text-foreground" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s6", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: { id: "sp-problem-text", content: "Most businesses waste months and thousands of dollars on strategies that don't convert. You deserve better.", alignment: "text-center", size: "text-base" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s7", height: "h-16" },
        },
        {
          type: "Heading",
          props: { id: "sp-features", text: "Everything You Get", level: "h2", alignment: "text-center", color: "text-foreground" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s8", height: "h-8" },
        },
        {
          type: "Columns",
          props: { id: "sp-feature-cols", columns: "grid-cols-3", gap: "gap-8" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s9", height: "h-16" },
        },
        {
          type: "Section",
          props: { id: "sp-social", backgroundColor: "bg-slate-50", paddingY: "py-16", maxWidth: "max-w-6xl" },
        },
        {
          type: "Heading",
          props: { id: "sp-social-h", text: "Real Results from Real People", level: "h2", alignment: "text-center", color: "text-foreground" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s10", height: "h-8" },
        },
        {
          type: "TextBlock",
          props: { id: "sp-testimonial-1", content: "\"We increased our conversion rate by 340% in just 60 days. This is the real deal.\"", alignment: "text-center", size: "text-lg" },
        },
        {
          type: "TextBlock",
          props: { id: "sp-author-1", content: "— Mark Chen, CEO at TechStart", alignment: "text-center", size: "text-sm" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s11", height: "h-16" },
        },
        {
          type: "Heading",
          props: { id: "sp-pricing-h", text: "Simple, Transparent Pricing", level: "h2", alignment: "text-center", color: "text-foreground" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s12", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: { id: "sp-pricing-sub", content: "No hidden fees. Cancel anytime.", alignment: "text-center", size: "text-base" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s13", height: "h-8" },
        },
        {
          type: "ButtonBlock",
          props: { id: "sp-cta2", label: "Get Started — $29/month", link: "#", variant: "primary", size: "lg", fullWidth: false, alignment: "justify-center" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s14", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: { id: "sp-guarantee", content: "30-day money-back guarantee. Zero risk.", alignment: "text-center", size: "text-sm" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s15", height: "h-16" },
        },
        {
          type: "Heading",
          props: { id: "sp-faq-h", text: "Frequently Asked Questions", level: "h2", alignment: "text-center", color: "text-foreground" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s16", height: "h-8" },
        },
        {
          type: "TextBlock",
          props: { id: "sp-faq-1", content: "Q: Can I cancel anytime?\nA: Yes, absolutely. No contracts, no commitments.", alignment: "text-left", size: "text-base" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s17", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: { id: "sp-faq-2", content: "Q: Is there a free trial?\nA: Yes — 14 days, full access, no credit card required.", alignment: "text-left", size: "text-base" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s18", height: "h-16" },
        },
        {
          type: "Section",
          props: { id: "sp-final", backgroundColor: "bg-slate-900", paddingY: "py-16", maxWidth: "max-w-6xl" },
        },
        {
          type: "Heading",
          props: { id: "sp-final-h", text: "Start Growing Today", level: "h2", alignment: "text-center", color: "text-white" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s19", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: { id: "sp-final-text", content: "Every day you wait is another day your competitors are getting ahead.", alignment: "text-center", size: "text-base" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s20", height: "h-8" },
        },
        {
          type: "ButtonBlock",
          props: { id: "sp-final-cta", label: "Claim Your Spot Now", link: "#", variant: "primary", size: "lg", fullWidth: false, alignment: "justify-center" },
        },
        {
          type: "Spacer",
          props: { id: "sp-s21", height: "h-8" },
        },
      ],
      root: { props: { title: "Sales Page" } },
    },
  },
  {
    id: "coming-soon",
    name: "Coming Soon",
    description: "Pre-launch landing page to build anticipation and collect emails",
    category: "coming-soon",
    thumbnail: "soon",
    data: {
      content: [
        {
          type: "Spacer",
          props: { id: "cs-s1", height: "h-32" },
        },
        {
          type: "Heading",
          props: { id: "cs-h1", text: "Something Amazing is Coming", level: "h1", alignment: "text-center", color: "text-foreground" },
        },
        {
          type: "Spacer",
          props: { id: "cs-s2", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: { id: "cs-sub", content: "We're building something that will change everything. Be the first to know when we launch.", alignment: "text-center", size: "text-lg" },
        },
        {
          type: "Spacer",
          props: { id: "cs-s3", height: "h-8" },
        },
        {
          type: "ButtonBlock",
          props: { id: "cs-cta", label: "Notify Me on Launch", link: "#", variant: "primary", size: "lg", fullWidth: false, alignment: "justify-center" },
        },
        {
          type: "Spacer",
          props: { id: "cs-s4", height: "h-4" },
        },
        {
          type: "TextBlock",
          props: { id: "cs-note", content: "No spam. Just a single email when we're ready.", alignment: "text-center", size: "text-sm" },
        },
        {
          type: "Spacer",
          props: { id: "cs-s5", height: "h-32" },
        },
      ],
      root: { props: { title: "Coming Soon" } },
    },
  },
]
