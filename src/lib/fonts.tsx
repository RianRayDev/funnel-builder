import { cn } from "@/lib/utils"

export const fontOptions = [
  { value: "font-sans", label: "System", family: "system-ui, sans-serif", preview: "Aa" },
  { value: "font-[Poppins]", label: "Poppins", family: "Poppins, sans-serif", preview: "Aa" },
  { value: "font-[Inter]", label: "Inter", family: "Inter, sans-serif", preview: "Aa" },
  { value: "font-['DM_Sans']", label: "DM Sans", family: "DM Sans, sans-serif", preview: "Aa" },
  { value: "font-['Space_Grotesk']", label: "Space Grotesk", family: "Space Grotesk, sans-serif", preview: "Aa" },
  { value: "font-['Playfair_Display']", label: "Playfair", family: "Playfair Display, serif", preview: "Aa" },
]

export function FontPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      {fontOptions.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all",
            value === opt.value
              ? "bg-blue-50 border border-blue-200"
              : "hover:bg-gray-50 border border-transparent",
          )}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-sm font-semibold text-gray-500"
            style={{ fontFamily: opt.family }}
          >
            {opt.preview}
          </span>
          <span className="text-xs text-gray-600">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
