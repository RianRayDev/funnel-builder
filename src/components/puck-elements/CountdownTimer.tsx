import { useEffect, useState } from "react"
import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  targetDate: string
  label: string
  style: string
  size: string
}

function useCountdown(target: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false })

  useEffect(() => {
    function update() {
      const diff = new Date(target).getTime() - Date.now()
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }); return }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        expired: false,
      })
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [target])

  return time
}

function pad(n: number) { return String(n).padStart(2, "0") }

export const CountdownTimer: ComponentConfig<CountdownTimerProps> = {
  fields: {
    targetDate: { type: "text", label: "Target Date (YYYY-MM-DD HH:MM)" },
    label: { type: "text", label: "Label Above" },
    style: {
      type: "select", label: "Style",
      options: [
        { value: "boxes", label: "Boxes" },
        { value: "inline", label: "Inline" },
        { value: "minimal", label: "Minimal" },
      ],
    },
    size: {
      type: "select", label: "Size",
      options: [
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
      ],
    },
  },
  defaultProps: {
    targetDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 16).replace("T", " "),
    label: "Offer expires in",
    style: "boxes",
    size: "md",
  },
  render: ({ targetDate, label, style, size }) => {
    const { days, hours, minutes, seconds, expired } = useCountdown(targetDate)

    const sizeClasses = {
      sm: { num: "text-lg", label: "text-[10px]", gap: "gap-2", pad: "px-3 py-2" },
      md: { num: "text-2xl", label: "text-[11px]", gap: "gap-3", pad: "px-4 py-3" },
      lg: { num: "text-4xl", label: "text-xs", gap: "gap-4", pad: "px-5 py-4" },
    }[size] || { num: "text-2xl", label: "text-[11px]", gap: "gap-3", pad: "px-4 py-3" }

    if (expired) {
      return <div className="py-4 text-center text-sm font-medium text-muted-foreground">This offer has expired</div>
    }

    const units = [
      { value: days, label: "Days" },
      { value: hours, label: "Hours" },
      { value: minutes, label: "Min" },
      { value: seconds, label: "Sec" },
    ]

    if (style === "minimal") {
      return (
        <div className="text-center">
          {label && <p className="mb-2 text-sm font-medium text-muted-foreground">{label}</p>}
          <p className={cn("font-mono font-bold tabular-nums text-foreground", sizeClasses.num)}>
            {pad(days)}:{pad(hours)}:{pad(minutes)}:{pad(seconds)}
          </p>
        </div>
      )
    }

    if (style === "inline") {
      return (
        <div className="text-center">
          {label && <p className="mb-2 text-sm font-medium text-muted-foreground">{label}</p>}
          <div className={cn("inline-flex items-baseline", sizeClasses.gap)}>
            {units.map((u) => (
              <span key={u.label} className="flex items-baseline gap-1">
                <span className={cn("font-mono font-bold tabular-nums text-foreground", sizeClasses.num)}>{pad(u.value)}</span>
                <span className={cn("font-medium text-muted-foreground", sizeClasses.label)}>{u.label}</span>
              </span>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="text-center">
        {label && <p className="mb-3 text-sm font-medium text-muted-foreground">{label}</p>}
        <div className={cn("flex justify-center", sizeClasses.gap)}>
          {units.map((u) => (
            <div key={u.label} className={cn("flex flex-col items-center rounded-xl bg-card border border-border/50 shadow-sm", sizeClasses.pad)}>
              <span className={cn("font-mono font-bold tabular-nums text-foreground", sizeClasses.num)}>{pad(u.value)}</span>
              <span className={cn("mt-1 font-medium uppercase tracking-wider text-muted-foreground", sizeClasses.label)}>{u.label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
}
