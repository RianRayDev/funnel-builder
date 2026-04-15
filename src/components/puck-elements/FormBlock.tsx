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
        required: { type: "radio", label: "Required", options: [{ value: true, label: "Yes" }, { value: false, label: "No" }] },
      },
    },
    submitLabel: { type: "text", label: "Button Text" },
    submitStyle: {
      type: "select", label: "Button Style",
      options: [
        { value: "primary", label: "Primary" },
        { value: "large", label: "Large" },
        { value: "outline", label: "Outline" },
      ],
    },
    layout: {
      type: "select", label: "Layout",
      options: [
        { value: "stacked", label: "Stacked" },
        { value: "inline", label: "Inline (Email + Button)" },
      ],
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
