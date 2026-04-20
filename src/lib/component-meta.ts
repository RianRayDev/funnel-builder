import {
  Layers, LayoutPanelTop, Columns3, MoveVertical, Minus,
  Type, AlignLeft, List, ImageIcon, Play,
  MousePointerClick, FileInput, Code,
  MessageSquareQuote, LayoutList, HelpCircle, DollarSign,
  Timer, TrendingUp, ShieldCheck, PanelBottom,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ComponentMeta {
  icon: LucideIcon
  description: string
}

export const componentMeta: Record<string, ComponentMeta> = {
  // Layout
  Section: { icon: Layers, description: "Container with background & spacing" },
  Banner: { icon: LayoutPanelTop, description: "Hero section with image or gradient" },
  Columns: { icon: Columns3, description: "Multi-column grid layout" },
  Spacer: { icon: MoveVertical, description: "Vertical whitespace" },
  Divider: { icon: Minus, description: "Horizontal line separator" },
  Footer: { icon: PanelBottom, description: "Page footer with 6 layout styles" },

  // Content
  Heading: { icon: Type, description: "Title with rich formatting" },
  TextBlock: { icon: AlignLeft, description: "Rich text paragraph" },
  BulletList: { icon: List, description: "List with custom icons" },
  ImageBlock: { icon: ImageIcon, description: "Image with upload & focus point" },
  VideoEmbed: { icon: Play, description: "YouTube or Vimeo embed" },

  // Interactive
  ButtonBlock: { icon: MousePointerClick, description: "CTA button with variants" },
  FormBlock: { icon: FileInput, description: "Lead capture form" },
  HTMLEmbed: { icon: Code, description: "Custom HTML / embed code" },

  // Marketing
  Testimonial: { icon: MessageSquareQuote, description: "Customer quote with avatar" },
  FeatureList: { icon: LayoutList, description: "Feature grid with icons" },
  FAQAccordion: { icon: HelpCircle, description: "Collapsible Q&A section" },
  PricingTable: { icon: DollarSign, description: "Plan comparison cards" },
  CountdownTimer: { icon: Timer, description: "Urgency countdown clock" },
  ProgressBar: { icon: TrendingUp, description: "Visual percentage bar" },
  TrustBadges: { icon: ShieldCheck, description: "Security & trust icons" },
}
