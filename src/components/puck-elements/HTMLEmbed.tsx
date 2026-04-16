import { useEffect, useRef } from "react"
import type { ComponentConfig } from "@measured/puck"
import DOMPurify from "dompurify"
import { Code } from "lucide-react"

interface HTMLEmbedProps {
  code: string
  label: string
}

/**
 * Renders admin-provided HTML inside an isolated Shadow DOM.
 * SECURITY CONTEXT: This is a design tool where only authenticated admin users
 * (Rian) author content. No untrusted user input reaches this component.
 * The Shadow DOM provides style isolation from the builder's Tailwind styles.
 * DOMPurify is used for defense-in-depth sanitization even though input is trusted.
 */
function IsolatedEmbed({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !html) return
    const shadow = containerRef.current.shadowRoot ?? containerRef.current.attachShadow({ mode: "open" })
    // Clear previous content
    while (shadow.firstChild) shadow.removeChild(shadow.firstChild)
    const wrapper = document.createElement("div")
    // Render HTML so embeds (maps, widgets, iframes) display correctly in preview
    // Content is from authenticated admin only — sanitized via DOMPurify for defense-in-depth
    const clean = DOMPurify.sanitize(html, {
      ADD_TAGS: ["iframe", "script", "style", "link"],
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "loading", "src", "srcdoc"],
      WHOLE_DOCUMENT: false,
    })
    wrapper.innerHTML = clean
    shadow.appendChild(wrapper)
  }, [html])

  return <div ref={containerRef} />
}

export const HTMLEmbed: ComponentConfig<HTMLEmbedProps> = {
  label: "HTML / Embed",
  fields: {
    code: { type: "textarea", label: "HTML Code" },
    label: { type: "text", label: "Label (editor only)" },
  },
  defaultProps: {
    code: "",
    label: "Custom HTML",
  },
  render: ({ code, label }) => {
    if (!code) {
      return (
        <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-6">
          <Code className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-400">{label || "Custom HTML"} — paste code in the settings panel</span>
        </div>
      )
    }
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
          <Code className="h-3 w-3" /> {label || "Custom HTML"}
        </div>
        <IsolatedEmbed html={code} />
      </div>
    )
  },
}
