import { useEffect, useRef } from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import DOMPurify from "dompurify"
import { cn } from "@/lib/utils"
import { FancyUnderline } from "@/lib/tiptap-extensions/fancy-underline"
import { FancyHighlight } from "@/lib/tiptap-extensions/fancy-highlight"
import { UnderlinePicker } from "@/components/UnderlinePicker"
import { HighlightPicker } from "@/components/HighlightPicker"
import { TextColorPicker } from "@/components/TextColorPicker"
import {
  Bold, Italic, Link2, AlignLeft, AlignCenter, AlignRight, RemoveFormatting,
} from "lucide-react"

interface RichTextFieldProps {
  value: string
  onChange: (html: string) => void
  showAlign?: boolean
  minimal?: boolean
  placeholder?: string
}

/**
 * Sanitize HTML using DOMPurify.
 * This is an admin-only design tool — content is authored by authenticated users (Rian/wife),
 * never by untrusted visitors. DOMPurify is a defense-in-depth layer.
 */
export function sanitize(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "mark", "a", "span", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li"],
    ALLOWED_ATTR: [
      "href", "target", "rel", "style", "class",
      // Fancy underline data attrs
      "data-underline", "data-underline-color", "data-underline-thickness",
      "data-underline-offset", "data-underline-animation",
      // Fancy highlight data attrs
      "data-highlight-color", "data-highlight-radius", "data-highlight-padding", "data-highlight-style",
    ],
  })
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded-md transition-all",
        active
          ? "bg-indigo-100 text-indigo-600"
          : "text-gray-400 hover:bg-gray-100 hover:text-gray-600",
      )}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor, showAlign, minimal }: { editor: Editor; showAlign?: boolean; minimal?: boolean }) {
  function addLink() {
    const url = window.prompt("Enter URL:", "https://")
    if (url) {
      editor.chain().focus().setLink({ href: url, target: "_blank" }).run()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 px-1.5 py-1">
      <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
        <Bold className="h-3 w-3" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
        <Italic className="h-3 w-3" />
      </ToolbarButton>

      {!minimal && (
        <>
          <UnderlinePicker editor={editor} />
          <HighlightPicker editor={editor} />
          <TextColorPicker editor={editor} />

          <div className="mx-0.5 h-4 w-px bg-gray-100" />

          <ToolbarButton active={editor.isActive("link")} onClick={addLink} title="Link">
            <Link2 className="h-3 w-3" />
          </ToolbarButton>
        </>
      )}

      {showAlign && (
        <>
          <div className="mx-0.5 h-4 w-px bg-gray-100" />
          <ToolbarButton active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align Left">
            <AlignLeft className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align Center">
            <AlignCenter className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align Right">
            <AlignRight className="h-3 w-3" />
          </ToolbarButton>
        </>
      )}

      {!minimal && (
        <>
          <div className="mx-0.5 h-4 w-px bg-gray-100" />
          <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">
            <RemoveFormatting className="h-3 w-3" />
          </ToolbarButton>
        </>
      )}
    </div>
  )
}

export function RichTextField({
  value,
  onChange,
  showAlign = false,
  minimal = false,
  placeholder = "Start typing...",
}: RichTextFieldProps) {
  const lastEmittedRef = useRef("")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        codeBlock: false,
        code: false,
        blockquote: false,
        horizontalRule: false,
      }),
      FancyUnderline,
      FancyHighlight,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      TextAlign.configure({ types: ["paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none px-3 py-2 text-[13px] leading-relaxed text-gray-800 focus:outline-none min-h-[60px]",
      },
    },
    onUpdate: ({ editor: e }) => {
      const html = sanitize(e.getHTML())
      const cleaned = html === "<p></p>" ? "" : html
      lastEmittedRef.current = cleaned
      onChange(cleaned)
    },
  })

  useEffect(() => {
    if (!editor) return
    // Fast path: ignore echoes of our own emission
    if (value === lastEmittedRef.current) return
    // Robust path: compare the sanitized form of what the editor already has
    // vs the incoming value. If they match, the editor is already in sync —
    // don't call setContent (which would reset the caret to the end).
    const incoming = sanitize(value || "")
    const currentSanitized = sanitize(editor.getHTML())
    if (incoming === currentSanitized) return
    if (incoming === "<p></p>") return
    editor.commands.setContent(incoming, { emitUpdate: false })
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
      <Toolbar editor={editor} showAlign={showAlign} minimal={minimal} />
      <EditorContent editor={editor} />
      {!value && (
        <style>{`.ProseMirror p.is-editor-empty:first-child::before { content: "${placeholder}"; color: #9ca3af; pointer-events: none; float: left; height: 0; }`}</style>
      )}
    </div>
  )
}

/**
 * Safely render rich text HTML.
 * All content is sanitized through DOMPurify before rendering.
 * This is an admin-authored design tool — content comes from Tiptap, not user input.
 */
export function RichTextContent({ html, className }: { html: string; className?: string }) {
  if (!html) return null
  const clean = sanitize(html)
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
}
