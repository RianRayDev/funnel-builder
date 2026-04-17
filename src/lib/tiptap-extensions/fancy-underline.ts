import { Mark, mergeAttributes } from "@tiptap/core"
import { buildUnderlineStyle } from "@/lib/decoration-styles"

export interface FancyUnderlineOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fancyUnderline: {
      setFancyUnderline: (attrs?: {
        decoStyle?: string
        color?: string
        thickness?: string
        offset?: string
        animation?: string
      }) => ReturnType
      toggleFancyUnderline: (attrs?: {
        decoStyle?: string
        color?: string
        thickness?: string
        offset?: string
        animation?: string
      }) => ReturnType
      unsetFancyUnderline: () => ReturnType
    }
  }
}

export const FancyUnderline = Mark.create<FancyUnderlineOptions>({
  name: "fancyUnderline",

  addOptions() {
    return { HTMLAttributes: {} }
  },

  addAttributes() {
    return {
      // Named "decoStyle" to avoid conflict with HTML "style" attribute
      decoStyle: {
        default: "solid",
        parseHTML: (el) => el.getAttribute("data-underline") || "solid",
        renderHTML: () => ({}), // handled manually below
      },
      color: {
        default: "auto",
        parseHTML: (el) => el.getAttribute("data-underline-color") || "auto",
        renderHTML: () => ({}),
      },
      thickness: {
        default: "medium",
        parseHTML: (el) => el.getAttribute("data-underline-thickness") || "medium",
        renderHTML: () => ({}),
      },
      offset: {
        default: "normal",
        parseHTML: (el) => el.getAttribute("data-underline-offset") || "normal",
        renderHTML: () => ({}),
      },
      animation: {
        default: "none",
        parseHTML: (el) => el.getAttribute("data-underline-animation") || "none",
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    return [
      { tag: "span[data-underline]" },
      // Backward compat: plain <u> tags
      { tag: "u" },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const inlineStyle = buildUnderlineStyle({
      style: HTMLAttributes.decoStyle,
      color: HTMLAttributes.color,
      thickness: HTMLAttributes.thickness,
      offset: HTMLAttributes.offset,
      animation: HTMLAttributes.animation,
    })

    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-underline": HTMLAttributes.decoStyle,
        "data-underline-color": HTMLAttributes.color,
        "data-underline-thickness": HTMLAttributes.thickness,
        "data-underline-offset": HTMLAttributes.offset,
        "data-underline-animation": HTMLAttributes.animation,
        style: inlineStyle,
      }),
      0,
    ]
  },

  addCommands() {
    return {
      setFancyUnderline:
        (attrs) =>
        ({ commands }) =>
          commands.setMark(this.name, attrs),
      toggleFancyUnderline:
        (attrs) =>
        ({ commands }) =>
          commands.toggleMark(this.name, attrs),
      unsetFancyUnderline:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    }
  },

  addKeyboardShortcuts() {
    return {
      "Mod-u": () => this.editor.commands.toggleFancyUnderline(),
    }
  },
})
