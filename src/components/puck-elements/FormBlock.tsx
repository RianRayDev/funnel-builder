import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"

interface FormBlockProps {
  fields: { label: string; type: string; placeholder: string; required: boolean }[]
  submitLabel: string
  submitStyle: string
  layout: string
  actionUrl: string
}

export const FormBlock: ComponentConfig<FormBlockProps> = {
  fields: {
    fields: {
      type: "array", label: "Form Fields",
      arrayFields: {
        label: { type: "text", label: "Label" },
        type: {
          type: "select", label: "Type",
          options: [
            { value: "text", label: "Text" },
            { value: "email", label: "Email" },
            { value: "tel", label: "Phone" },
            { value: "textarea", label: "Textarea" },
            { value: "select", label: "Dropdown" },
          ],
        },
        placeholder: { type: "text", label: "Placeholder" },
        required: {
          type: "custom",
          label: "Required",
          render: ({ value, onChange }) => (
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Required</label>
              <button
                type="button"
                onClick={() => onChange(!value)}
                className={cn(
                  "relative h-5 w-9 rounded-full transition-colors",
                  value ? "bg-blue-500" : "bg-gray-200",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                    value && "translate-x-4",
                  )}
                />
              </button>
            </div>
          ),
        },
      },
    },
    submitLabel: { type: "text", label: "Button Text" },
    submitStyle: {
      type: "custom",
      label: "Button Style",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Button Style</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
          >
            <option value="primary">Primary</option>
            <option value="large">Large</option>
            <option value="outline">Outline</option>
          </select>
        </div>
      ),
    },
    layout: {
      type: "custom",
      label: "Layout",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Layout</label>
          <div className="flex gap-1 rounded-lg bg-gray-100 p-0.5">
            {[
              { v: "stacked", l: "Stacked" },
              { v: "inline", l: "Inline" },
            ].map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => onChange(opt.v)}
                className={cn(
                  "flex-1 rounded-md py-1 text-center text-[11px] font-medium transition-all",
                  value === opt.v ? "bg-white shadow-sm text-gray-700" : "text-gray-400",
                )}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    actionUrl: { type: "text", label: "Form Action URL (optional)" },
  },
  defaultProps: {
    fields: [
      { label: "Full Name", type: "text", placeholder: "Enter your name", required: true },
      { label: "Email", type: "email", placeholder: "you@example.com", required: true },
    ],
    submitLabel: "Get Started",
    submitStyle: "primary",
    layout: "stacked",
    actionUrl: "",
  },
  render: ({ fields: formFields, submitLabel, submitStyle, layout, actionUrl }) => {
    const buttonClasses = cn(
      "flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98]",
      submitStyle === "primary" && "h-11 rounded-xl bg-primary text-primary-foreground px-6 shadow-sm hover:brightness-110",
      submitStyle === "large" && "h-13 rounded-xl bg-primary text-primary-foreground px-8 text-lg shadow-md hover:brightness-110",
      submitStyle === "outline" && "h-11 rounded-xl border border-primary text-primary px-6 hover:bg-primary/5",
      layout === "inline" && "shrink-0",
    )

    if (layout === "inline") {
      const emailField = formFields?.find((f) => f.type === "email") || formFields?.[0]
      return (
        <form action={actionUrl || "#"} method="POST" className="flex gap-2" onSubmit={(e) => !actionUrl && e.preventDefault()}>
          <input
            type={emailField?.type || "email"}
            placeholder={emailField?.placeholder || "Enter your email"}
            required={emailField?.required}
            className="flex h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
          <button type="submit" className={buttonClasses}>{submitLabel}</button>
        </form>
      )
    }

    return (
      <form action={actionUrl || "#"} method="POST" className="space-y-4" onSubmit={(e) => !actionUrl && e.preventDefault()}>
        {(formFields || []).map((field, i) => (
          <div key={i} className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="ml-0.5 text-destructive">*</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea placeholder={field.placeholder} required={field.required} rows={3} className="flex w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" />
            ) : (
              <input type={field.type} placeholder={field.placeholder} required={field.required} className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" />
            )}
          </div>
        ))}
        <button type="submit" className={cn(buttonClasses, "w-full")}>{submitLabel}</button>
      </form>
    )
  },
}
