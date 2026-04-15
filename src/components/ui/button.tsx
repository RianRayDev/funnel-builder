import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "rounded-[var(--radius-md)] bg-[var(--brand)] text-[var(--text-inverse)] shadow-[var(--shadow-xs)] hover:bg-[var(--brand-hover)]",
        destructive: "rounded-[var(--radius-md)] bg-red-600 text-white shadow-[var(--shadow-xs)] hover:bg-red-700",
        outline: "rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-[var(--shadow-xs)] hover:bg-[var(--bg-subtle)]",
        secondary: "rounded-[var(--radius-md)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-inset)]",
        ghost: "rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]",
        link: "text-[var(--brand)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 text-[var(--text-sm)]",
        sm: "h-8 px-3 text-[var(--text-xs)]",
        lg: "h-11 px-6 text-[var(--text-md)]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  ),
)
Button.displayName = "Button"

export { Button, buttonVariants }
