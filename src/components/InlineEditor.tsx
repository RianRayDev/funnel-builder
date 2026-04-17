/**
 * Inline text editor overlay.
 * Renders a Tiptap editor positioned exactly over a component's text on the canvas.
 * Activated by double-clicking a text component (Heading, TextBlock, Banner).
 * Bypasses Puck v0.20.2's broken contentEditable/inline system entirely.
 */
import { useCallback, useEffect, useRef, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import { FancyUnderline } from "@/lib/tiptap-extensions/fancy-underline"
import { FancyHighlight } from "@/lib/tiptap-extensions/fancy-highlight"
import { sanitize } from "@/components/RichTextField"
import { InlineToolbar } from "@/components/InlineToolbar"
import { cn } from "@/lib/utils"

interface InlineEditorProps {
  value: string
  onSave: (html: string) => void
  onClose: () => void
  rect: DOMRect
  className?: string
  style?: React.CSSProperties
}

export function InlineEditor({ value, onSave, onClose, rect, className, style }: InlineEditorProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, bulletList: false, orderedList: false,
        codeBlock: false, code: false, blockquote: false, horizontalRule: false,
      }),
      FancyUnderline,
      FancyHighlight,
      TextAlign.configure({ types: ["paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } }),
    ],
    content: sanitize(value || ""),
    autofocus: "end",
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[1em] px-1",
      },
    },
  })

  const handleSave = useCallback(() => {
    if (!editor) return
    const html = sanitize(editor.getHTML())
    const cleaned = html === "<p></p>" ? "" : html
    onSave(cleaned)
  }, [editor, onSave])

  useEffect(() => {
    setToolbarPos({
      top: rect.top - 52,
      left: rect.left + rect.width / 2,
    })
  }, [rect])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); onClose() }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); handleSave() }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleSave, onClose])

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement
        if (target.closest("[data-inline-toolbar]")) return
        handleSave()
      }
    }
    const timer = setTimeout(() => document.addEventListener("mousedown", handleMouseDown), 100)
    return () => { clearTimeout(timer); document.removeEventListener("mousedown", handleMouseDown) }
  }, [handleSave])

  if (!editor) return null

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-black/5" />

      <div
        data-inline-toolbar
        className="fixed z-[10001]"
        style={{
          top: Math.max(8, toolbarPos.top),
          left: toolbarPos.left,
          transform: "translateX(-50%)",
        }}
      >
        <InlineToolbar editor={editor} onSave={handleSave} onClose={onClose} />
      </div>

      <div
        ref={overlayRef}
        className="fixed z-[9999]"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          minHeight: rect.height + 8,
        }}
      >
        <div
          className={cn("rounded-lg bg-white p-1 ring-2 ring-indigo-500 shadow-lg", className)}
          style={style}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  )
}
