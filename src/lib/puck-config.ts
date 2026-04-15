import type { Config } from "@measured/puck"
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

export const puckConfig: Config = {
  categories: {
    layout: {
      title: "Layout",
      components: ["Section", "Columns", "Spacer", "Divider"],
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
  },
}
