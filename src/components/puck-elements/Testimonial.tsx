import type { ComponentConfig } from "@measured/puck"
import { Star, Quote } from "lucide-react"

interface TestimonialProps {
  quote: string
  authorName: string
  authorTitle: string
  avatarUrl: string
  rating: string
  style: string
}

export const Testimonial: ComponentConfig<TestimonialProps> = {
  fields: {
    quote: { type: "textarea", label: "Quote" },
    authorName: { type: "text", label: "Author Name" },
    authorTitle: { type: "text", label: "Author Title" },
    avatarUrl: { type: "text", label: "Avatar URL (optional)" },
    rating: {
      type: "select", label: "Star Rating",
      options: [
        { value: "0", label: "No Stars" },
        { value: "3", label: "3 Stars" },
        { value: "4", label: "4 Stars" },
        { value: "5", label: "5 Stars" },
      ],
    },
    style: {
      type: "select", label: "Style",
      options: [
        { value: "card", label: "Card" },
        { value: "minimal", label: "Minimal" },
        { value: "centered", label: "Centered" },
      ],
    },
  },
  defaultProps: {
    quote: "This product completely transformed our workflow. We saw results in the first week.",
    authorName: "Sarah Johnson",
    authorTitle: "Marketing Director",
    avatarUrl: "",
    rating: "5",
    style: "card",
  },
  render: ({ quote, authorName, authorTitle, avatarUrl, rating, style }) => {
    const stars = parseInt(rating)

    if (style === "centered") {
      return (
        <div className="flex flex-col items-center text-center">
          <Quote className="mb-4 h-8 w-8 text-primary/20" />
          <p className="mb-6 max-w-2xl text-xl font-medium italic leading-relaxed text-foreground">"{quote}"</p>
          {stars > 0 && <div className="mb-3 flex gap-0.5">{Array.from({ length: stars }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>}
          <div className="flex items-center gap-3">
            {avatarUrl && <img src={avatarUrl} alt={authorName} className="h-10 w-10 rounded-full object-cover" />}
            <div>
              <p className="text-sm font-semibold text-foreground">{authorName}</p>
              <p className="text-xs text-muted-foreground">{authorTitle}</p>
            </div>
          </div>
        </div>
      )
    }

    if (style === "minimal") {
      return (
        <div className="border-l-2 border-primary/20 pl-5">
          <p className="mb-4 text-base italic leading-relaxed text-muted-foreground">"{quote}"</p>
          <div className="flex items-center gap-3">
            {avatarUrl && <img src={avatarUrl} alt={authorName} className="h-8 w-8 rounded-full object-cover" />}
            <div>
              <span className="text-sm font-semibold text-foreground">{authorName}</span>
              <span className="mx-2 text-muted-foreground/30">·</span>
              <span className="text-sm text-muted-foreground">{authorTitle}</span>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        {stars > 0 && <div className="mb-3 flex gap-0.5">{Array.from({ length: stars }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>}
        <p className="mb-5 text-base leading-relaxed text-muted-foreground">"{quote}"</p>
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt={authorName} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {authorName.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-foreground">{authorName}</p>
            <p className="text-xs text-muted-foreground">{authorTitle}</p>
          </div>
        </div>
      </div>
    )
  },
}
