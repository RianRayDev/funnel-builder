import { useState } from "react"
import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FAQAccordionProps {
  items: { question: string; answer: string }[]
  style: string
}

function FAQItem({ question, answer, style }: { question: string; answer: string; style: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn(
      "overflow-hidden transition-colors",
      style === "card" ? "rounded-xl border border-border/50 bg-card" : "border-b border-border/30",
    )}>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-accent/50">
        <span className="pr-4 text-[15px] font-medium text-foreground">{question}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="px-5 pb-4 text-[14px] leading-relaxed text-muted-foreground">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const FAQAccordion: ComponentConfig<FAQAccordionProps> = {
  fields: {
    items: {
      type: "array", label: "Questions",
      arrayFields: {
        question: { type: "text", label: "Question" },
        answer: { type: "textarea", label: "Answer" },
      },
    },
    style: {
      type: "select", label: "Style",
      options: [{ value: "card", label: "Cards" }, { value: "simple", label: "Simple" }],
    },
  },
  defaultProps: {
    items: [
      { question: "What is included?", answer: "Everything you need to get started, including templates, guides, and priority support." },
      { question: "Can I cancel anytime?", answer: "Yes, absolutely. No contracts, no commitments. Cancel with one click." },
      { question: "Is there a free trial?", answer: "Yes — 14 days, full access, no credit card required." },
    ],
    style: "card",
  },
  render: ({ items, style }) => (
    <div className={cn("space-y-2", style === "simple" && "space-y-0")}>
      {(items || []).map((item, i) => (
        <FAQItem key={i} question={item.question} answer={item.answer} style={style} />
      ))}
    </div>
  ),
}
