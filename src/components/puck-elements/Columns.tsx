import { useSyncExternalStore } from "react"
import type { ComponentConfig } from "@measured/puck"
import { usePuck } from "@measured/puck"
import { cn } from "@/lib/utils"
import { useResponsiveGrid, responsiveColumns } from "@/hooks/useResponsiveGrid"
import { Monitor, Tablet, Smartphone } from "lucide-react"

let _selectedCol = 0
const _listeners = new Set<() => void>()
function setSelectedCol(col: number) {
  _selectedCol = col
  _listeners.forEach((l) => l())
}
function useSelectedCol() {
  return useSyncExternalStore(
    (cb) => { _listeners.add(cb); return () => _listeners.delete(cb) },
    () => _selectedCol,
  )
}

interface ColumnsProps {
  columns: string
  tabletColumns: string
  mobileColumns: string
  gap: string
  arrangement: Record<number, string>
}

const gapOptions = [
  { value: "gap-4", label: "Small (16px)" },
  { value: "gap-6", label: "Medium (24px)" },
  { value: "gap-8", label: "Large (32px)" },
  { value: "gap-12", label: "XL (48px)" },
]

const colArrangeCSS = `
[data-col-arrange] { display: flex; flex-direction: column; height: 100%; }
[data-col-arrange] > * { flex: 1; display: flex; flex-direction: column; }
[data-col-arrange="top"] > * { justify-content: flex-start; }
[data-col-arrange="middle"] > * { justify-content: center; }
[data-col-arrange="center"] > * { justify-content: center; align-items: center; }
[data-col-arrange="space-between"] > * { justify-content: space-between; }
[data-col-arrange="space-around"] > * { justify-content: space-around; }
`

function SegmentedPicker({ icon: Icon, label, value, onChange, options }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-gray-400 shrink-0" title={label}>
        <Icon className="h-3 w-3" />
        <span className="text-[9px] font-semibold uppercase tracking-wider w-10">{label}</span>
      </div>
      <div className="flex flex-1 gap-0.5 rounded-md bg-gray-100 p-0.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 rounded py-1 text-center text-[10px] font-medium transition-all",
              value === opt.value ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-500",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function ArrangementPicker({ value, onChange }: {
  value: Record<number, string>
  onChange: (v: Record<number, string>) => void
}) {
  const { appState } = usePuck()
  const selectedCol = useSelectedCol()

  const sel = appState.ui.itemSelector
  let colCount = 2
  if (sel) {
    const zone = sel.zone
    const index = sel.index
    const zoneContent = zone ? (appState.data.zones?.[zone] ?? []) : appState.data.content
    const item = zoneContent[index]
    if (item?.props?.columns) {
      colCount = parseInt(item.props.columns.replace("grid-cols-", ""))
    }
  }

  const activeCol = selectedCol >= colCount ? 0 : selectedCol
  const currentArrangement = value?.[activeCol] ?? "top"

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-gray-400">
        <Monitor className="h-3 w-3" />
        <span className="text-[9px] font-semibold uppercase tracking-wider">Arrange</span>
      </div>
      <div className="flex gap-0.5 rounded-md bg-gray-100 p-0.5">
        {Array.from({ length: colCount }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedCol(i)}
            className={cn(
              "flex-1 rounded py-1 text-center text-[10px] font-medium transition-all",
              activeCol === i ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-500",
            )}
          >
            {`Col ${i + 1}`}
          </button>
        ))}
      </div>
      <div className="flex gap-0.5 rounded-md bg-gray-100 p-0.5">
        {[
          { value: "top", label: "Top" },
          { value: "middle", label: "Middle" },
          { value: "center", label: "Center" },
          { value: "space-between", label: "Between" },
          { value: "space-around", label: "Around" },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange({ ...value, [activeCol]: opt.value })}
            className={cn(
              "flex-1 rounded py-1 text-center text-[10px] font-medium transition-all",
              currentArrangement === opt.value ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-500",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export const Columns: ComponentConfig<ColumnsProps> = {
  fields: {
    columns: {
      type: "custom",
      label: "Desktop Columns",
      render: ({ value, onChange }) => (
        <SegmentedPicker
          icon={Monitor}
          label="Desktop"
          value={value}
          onChange={onChange}
          options={[
            { value: "grid-cols-1", label: "1" },
            { value: "grid-cols-2", label: "2" },
            { value: "grid-cols-3", label: "3" },
            { value: "grid-cols-4", label: "4" },
          ]}
        />
      ),
    },
    tabletColumns: {
      type: "custom",
      label: "Tablet Columns",
      render: ({ value, onChange }) => (
        <SegmentedPicker
          icon={Tablet}
          label="Tablet"
          value={value}
          onChange={onChange}
          options={[
            { value: "auto", label: "Auto" },
            { value: "adaptive", label: "Adaptive" },
          ]}
        />
      ),
    },
    mobileColumns: {
      type: "custom",
      label: "Mobile Columns",
      render: ({ value, onChange }) => (
        <SegmentedPicker
          icon={Smartphone}
          label="Mobile"
          value={value}
          onChange={onChange}
          options={[
            { value: "auto", label: "Auto" },
            { value: "adaptive", label: "Adaptive" },
          ]}
        />
      ),
    },
    gap: {
      type: "custom",
      label: "Gap",
      render: ({ value, onChange }) => (
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Gap</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
          >
            {gapOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      ),
    },
    arrangement: {
      type: "custom",
      label: "Arrangement",
      render: ({ value, onChange }) => (
        <ArrangementPicker value={value} onChange={onChange} />
      ),
    },
  },
  defaultProps: {
    columns: "grid-cols-2",
    tabletColumns: "auto",
    mobileColumns: "auto",
    gap: "gap-6",
    arrangement: {},
  },
  render: ({ columns = "grid-cols-2", tabletColumns = "auto", mobileColumns = "auto", gap = "gap-6", arrangement = {}, puck }) => {
    const colCount = parseInt(columns.replace("grid-cols-", ""))
    const { ref, breakpoint } = useResponsiveGrid()
    const cols = responsiveColumns(columns, breakpoint, { tablet: tabletColumns, mobile: mobileColumns })
    const activeCol = useSelectedCol()
    const isDesktop = breakpoint === "desktop"
    return (
      <div ref={ref} className={cn("grid", cols, gap)}>
        <style>{colArrangeCSS}</style>
        {Array.from({ length: colCount }).map((_, i) => {
          const colArrangement = (arrangement as Record<number, string>)?.[i] ?? "top"
          const isSelected = i === activeCol
          return (
            <div
              key={i}
              data-col-arrange={isDesktop ? colArrangement : undefined}
              onClick={(e) => { e.stopPropagation(); setSelectedCol(i) }}
              className={cn(
                "min-h-[60px] relative transition-all cursor-pointer",
                isSelected
                  ? "ring-2 ring-blue-400 ring-inset rounded-sm bg-blue-50/20"
                  : "ring-1 ring-dashed ring-gray-200/60 hover:ring-gray-300",
              )}
            >
              {isSelected && (
                <span className="absolute -top-2.5 left-2 z-10 rounded bg-blue-400 px-1.5 py-0.5 text-[9px] font-semibold text-white leading-none">
                  {`Col ${i + 1}`}
                </span>
              )}
              {(puck as any).renderDropZone({ zone: `column-${i}` })}
            </div>
          )
        })}
      </div>
    )
  },
}
