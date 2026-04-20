/**
 * Floating component toolbar.
 * Appears above the selected component on the Puck canvas.
 * Shows component type label and context-aware actions.
 */
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Type, Pencil, Copy, Trash2, Image, Layout,
  RectangleHorizontal, ListOrdered, Video, MousePointer,
  FormInput, Code, MessageSquareQuote, Zap, HelpCircle,
  DollarSign, Timer, BarChart3, ShieldCheck, GripVertical,
} from "lucide-react"

interface FloatingToolbarProps {
  /** Component type name (e.g., "Heading", "TextBlock") */
  componentType: string | null
  /** Component ID */
  componentId: string | null
  /** Whether this component supports inline editing */
  isTextComponent: boolean
  /** Callback for "Edit" button (enters inline edit mode) */
  onEdit?: () => void
  /** Callback for duplicate */
  onDuplicate?: () => void
  /** Callback for delete */
  onDelete?: () => void
  /** Bounding rect of the selected component */
  rect: DOMRect | null
}

const TEXT_COMPONENTS = new Set(["Heading", "TextBlock", "Banner"])

const componentIcons: Record<string, typeof Type> = {
  Heading: Type,
  TextBlock: Type,
  Banner: RectangleHorizontal,
  Section: Layout,
  ImageBlock: Image,
  ButtonBlock: MousePointer,
  BulletList: ListOrdered,
  VideoEmbed: Video,
  FormBlock: FormInput,
  HTMLEmbed: Code,
  Testimonial: MessageSquareQuote,
  FeatureList: Zap,
  FAQAccordion: HelpCircle,
  PricingTable: DollarSign,
  CountdownTimer: Timer,
  ProgressBar: BarChart3,
  TrustBadges: ShieldCheck,
}

export function FloatingToolbar({
  componentType,
  componentId,
  isTextComponent,
  onEdit,
  onDuplicate,
  onDelete,
  rect,
}: FloatingToolbarProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  const updatePosition = useCallback(() => {
    if (!rect) {
      setPos(null)
      return
    }
    setPos({
      top: rect.top - 40,
      left: rect.left + rect.width / 2,
    })
  }, [rect])

  useEffect(() => {
    updatePosition()
  }, [updatePosition])

  // Reposition on scroll/resize
  useEffect(() => {
    if (!rect) return
    const handleReposition = () => updatePosition()
    window.addEventListener("scroll", handleReposition, true)
    window.addEventListener("resize", handleReposition)
    return () => {
      window.removeEventListener("scroll", handleReposition, true)
      window.removeEventListener("resize", handleReposition)
    }
  }, [rect, updatePosition])

  if (!componentType || !componentId || !pos) return null

  const Icon = componentIcons[componentType] || Layout

  return (
    <AnimatePresence>
      <motion.div
        key={componentId}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[9990]"
        style={{
          top: Math.max(8, pos.top),
          left: pos.left,
          transform: "translateX(-50%)",
        }}
      >
        <div className="flex items-center gap-1 rounded-full bg-slate-800/95 px-3 py-1.5 shadow-xl backdrop-blur-sm">
          {/* Drag handle */}
          <div className="cursor-grab text-white/30 hover:text-white/60 active:cursor-grabbing" title="Drag to reorder">
            <GripVertical className="h-4 w-4" />
          </div>

          <div className="mx-0.5 h-5 w-px bg-white/15" />

          {/* Component type label */}
          <div className="flex items-center gap-2 px-1">
            <Icon className="h-3.5 w-3.5 text-white/50" />
            <span className="text-[12px] font-medium text-white/80">{componentType}</span>
          </div>

          <div className="mx-1 h-5 w-px bg-white/15" />

          {/* Edit button for text and image components */}
          {onEdit && (
            <button
              type="button"
              title={isTextComponent ? "Edit text (double-click)" : "Edit"}
              onClick={(e) => { e.stopPropagation(); onEdit?.() }}
              className="flex h-7 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          )}

          {/* Duplicate */}
          {onDuplicate && (
            <button
              type="button"
              title="Duplicate"
              onClick={onDuplicate}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition-all hover:bg-white/10 hover:text-white"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Delete */}
          {onDelete && (
            <button
              type="button"
              title="Delete"
              onClick={onDelete}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition-all hover:bg-rose-500/20 hover:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export { TEXT_COMPONENTS }
