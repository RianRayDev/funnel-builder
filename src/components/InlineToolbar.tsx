/**
 * Toolbar for the inline text editor.
 * Extracted as a standalone component so Vite HMR works (hooks in nested functions break HMR).
 */
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { UnderlinePicker } from "@/components/UnderlinePicker"
import { HighlightPicker } from "@/components/HighlightPicker"
import { DraggablePanel } from "@/components/DraggablePanel"
import {
  Bold, Italic, Link2, AlignLeft, AlignCenter, AlignRight,
  RemoveFormatting, X, Check,
} from "lucide-react"
import type { Editor } from "@tiptap/react"

function Btn({
  active, onClick, children, title,
}: {
  active?: boolean; onClick: () => void; children: React.ReactNode; title: string
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md transition-all",
        active ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10 hover:text-white",
      )}
    >
      {children}
    </button>
  )
}

export function InlineToolbar({ editor, onSave, onClose }: { editor: Editor; onSave: () => void; onClose: () => void }) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const linkInputRef = useRef<HTMLInputElement>(null)

  function handleLinkClick() {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run()
    } else {
      setShowLinkInput(true)
      setLinkUrl("https://")
      setTimeout(() => linkInputRef.current?.focus(), 50)
    }
  }

  function applyLink() {
    if (linkUrl && linkUrl !== "https://") {
      editor.chain().focus().setLink({ href: linkUrl, target: "_blank" }).run()
    }
    setShowLinkInput(false)
    setLinkUrl("")
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-0.5 rounded-xl bg-slate-800/95 px-2 py-1 shadow-xl backdrop-blur-sm">
        <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
          <Bold className="h-3.5 w-3.5" strokeWidth={2.5} />
        </Btn>
        <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
          <Italic className="h-3.5 w-3.5" />
        </Btn>

        <div className="mx-1 h-4 w-px bg-white/20" />

        <UnderlinePicker editor={editor} variant="dark" />
        <HighlightPicker editor={editor} variant="dark" />

        <div className="mx-1 h-4 w-px bg-white/20" />

        <Btn active={editor.isActive("link")} onClick={handleLinkClick} title="Link">
          <Link2 className="h-3.5 w-3.5" />
        </Btn>
        <Btn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Left">
          <AlignLeft className="h-3.5 w-3.5" />
        </Btn>
        <Btn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Center">
          <AlignCenter className="h-3.5 w-3.5" />
        </Btn>
        <Btn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Right">
          <AlignRight className="h-3.5 w-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear">
          <RemoveFormatting className="h-3.5 w-3.5" />
        </Btn>

        <div className="mx-1 h-4 w-px bg-white/20" />

        <button
          type="button"
          title="Save (Cmd+Enter)"
          onMouseDown={(e) => { e.preventDefault(); onSave() }}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/80 text-white transition-all hover:bg-emerald-500"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          title="Cancel (Esc)"
          onMouseDown={(e) => { e.preventDefault(); onClose() }}
          className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition-all hover:bg-white/10 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {showLinkInput && (
        <DraggablePanel className="flex items-center gap-1 rounded-lg bg-slate-800/95 px-2 py-1 shadow-xl backdrop-blur-sm [&>div:first-child]:mb-0 [&>div:first-child]:mr-1 [&_svg]:text-white/30">
          <input
            ref={linkInputRef}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") applyLink(); if (e.key === "Escape") setShowLinkInput(false) }}
            placeholder="https://..."
            className="w-48 rounded-md bg-white/10 px-2 py-1 text-[12px] text-white placeholder-white/30 outline-none focus:bg-white/15"
          />
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyLink() }}
            className="flex h-6 items-center rounded-md bg-indigo-500 px-2 text-[11px] font-medium text-white hover:bg-indigo-400"
          >
            Apply
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setShowLinkInput(false) }}
            className="flex h-6 w-6 items-center justify-center rounded-md text-white/40 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </DraggablePanel>
      )}
    </div>
  )
}
