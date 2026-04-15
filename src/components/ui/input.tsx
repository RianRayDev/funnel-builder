import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-card)] px-3.5 py-2 text-[var(--text-base)] transition-all duration-150 ease-out placeholder:text-[var(--text-tertiary)] focus-visible:outline-none focus-visible:border-[var(--border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--brand-subtle)] disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
Input.displayName = "Input"

export { Input }
