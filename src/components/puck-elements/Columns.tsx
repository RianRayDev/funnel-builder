import type { ComponentConfig } from "@measured/puck"
import { cn } from "@/lib/utils"

interface ColumnsProps {
  columns: string
  gap: string
}

export const Columns: ComponentConfig<ColumnsProps> = {
  fields: {
    columns: {
      type: "select",
      label: "Columns",
      options: [
        { value: "grid-cols-2", label: "2 Columns" },
        { value: "grid-cols-3", label: "3 Columns" },
        { value: "grid-cols-4", label: "4 Columns" },
      ],
    },
    gap: {
      type: "select",
      label: "Gap",
      options: [
        { value: "gap-4", label: "Small" },
        { value: "gap-6", label: "Medium" },
        { value: "gap-8", label: "Large" },
        { value: "gap-12", label: "Extra Large" },
      ],
    },
  },
  defaultProps: {
    columns: "grid-cols-2",
    gap: "gap-6",
  },
  render: ({ columns, gap, puck }) => (
    <div className={cn("grid", columns, gap, "max-sm:grid-cols-1")}>
      {Array.from({ length: parseInt(columns.replace("grid-cols-", "")) }).map((_, i) => (
        <div key={i}>
          {(puck as any).renderDropZone({ zone: `column-${i}` })}
        </div>
      ))}
    </div>
  ),
}
