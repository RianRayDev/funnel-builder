import { Mark, mergeAttributes } from "@tiptap/core"
import { buildHighlightStyle } from "@/lib/decoration-styles"

export interface FancyHighlightOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fancyHighlight: {
      setFancyHighlight: (attrs?: {
        color?: string
        radius?: string
        padding?: string
        highlightStyle?: string
      }) => ReturnType
      toggleFancyHighlight: (attrs?: {
        color?: string
        radius?: string
        padding?: string
        highlightStyle?: string
      }) => ReturnType
      unsetFancyHighlight: () => ReturnType
    }
  }
}

export const FancyHighlight = Mark.create<FancyHighlightOptions>({
  name: "fancyHighlight",

  addOptions() {
    return { HTMLAttributes: {} }
  },

  addAttributes() {
    return {
      color: {
        default: "yellow",
        parseHTML: (el) => el.getAttribute("data-highlight-color") || "yellow",
        renderHTML: () => ({}),
      },
      radius: {
        default: "sm",
        parseHTML: (el) => el.getAttribute("data-highlight-radius") || "sm",
        renderHTML: () => ({}),
      },
      padding: {
        default: "normal",
        parseHTML: (el) => el.getAttribute("data-highlight-padding") || "normal",
        renderHTML: () => ({}),
      },
      highlightStyle: {
        default: "solid",
        parseHTML: (el) => el.getAttribute("data-highlight-style") || "solid",
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    return [
      { tag: "mark[data-highlight-color]" },
      // Backward compat: plain <mark> tags
      { tag: "mark" },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const inlineStyle = buildHighlightStyle({
      color: HTMLAttributes.color,
      radius: HTMLAttributes.radius,
      padding: HTMLAttributes.padding,
      highlightStyle: HTMLAttributes.highlightStyle,
    })

    return [
      "mark",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-highlight-color": HTMLAttributes.color,
        "data-highlight-radius": HTMLAttributes.radius,
        "data-highlight-padding": HTMLAttributes.padding,
        "data-highlight-style": HTMLAttributes.highlightStyle,
        style: inlineStyle,
      }),
      0,
    ]
  },

  addCommands() {
    return {
      setFancyHighlight:
        (attrs) =>
        ({ commands }) =>
          commands.setMark(this.name, attrs),
      toggleFancyHighlight:
        (attrs) =>
        ({ commands }) =>
          commands.toggleMark(this.name, attrs),
      unsetFancyHighlight:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    }
  },
})
