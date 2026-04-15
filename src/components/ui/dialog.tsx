import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }

function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[6px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => onOpenChange(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-[440px] overflow-hidden rounded-[var(--radius-xl)] p-7"
              style={{ background: "linear-gradient(145deg, rgba(30,30,50,0.95), rgba(20,20,35,0.98))", backdropFilter: "blur(40px) saturate(140%)", border: "1px solid var(--dark-border)", boxShadow: "var(--shadow-xl)" }}
              initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => onOpenChange(false)} className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-[var(--dark-text-tertiary)] transition-colors hover:bg-[var(--dark-surface)] hover:text-[var(--dark-text-secondary)]">
                <X className="h-4 w-4" />
              </button>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-5 space-y-1", className)} {...props} />
}
function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-[var(--text-lg)] font-semibold tracking-tight text-[var(--dark-text)]", className)} {...props} />
}
function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-[var(--text-sm)] text-[var(--dark-text-tertiary)]", className)} {...props} />
}

export { Dialog, DialogHeader, DialogTitle, DialogDescription }
