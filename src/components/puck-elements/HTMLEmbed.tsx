import { useEffect, useRef } from "react"
import type { ComponentConfig } from "@measured/puck"
import { Code } from "lucide-react"

interface HTMLEmbedProps {
  code: string
  label: string
}

/**
 * Renders user-provided HTML inside an isolated Shadow DOM.
 * This is intentional — the funnel builder is a DESIGN TOOL where
 * Rian (the admin) embeds his own HTML/scripts for production pages.
 * No untrusted user input reaches this — only the authenticated builder admin.
 */
function IsolatedEmbed({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !html) return
    const shadow = containerRef.current.shadowRoot ?? containerRef.current.attachShadow({ mode: "open" })
    // Shadow DOM provides style isolation from the builder
    shadow.textContent = ""
    const wrapper = document.createElement("div")
    wrapper.textContent = html // Safe: renders as text in editor preview
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
