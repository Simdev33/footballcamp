"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Eraser,
} from "lucide-react"
import { useEffect } from "react"

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
}

/**
 * Simple WYSIWYG editor for admin panel. Stores HTML strings.
 * Keep it intentionally minimal so non-technical users aren't overwhelmed.
 */
export function RichTextEditor({ value, onChange, placeholder, minHeight = 140 }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none focus:outline-none px-4 py-3 min-h-[var(--min-h)] text-white/90",
        style: `--min-h: ${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  // Keep editor in sync if parent resets value (e.g. after server save).
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  if (!editor) {
    return (
      <div
        className="bg-black/30 border border-[#d4a017]/20 rounded-md"
        style={{ minHeight: minHeight + 40 }}
      />
    )
  }

  const Btn = ({
    active,
    onClick,
    title,
    children,
  }: {
    active?: boolean
    onClick: () => void
    title: string
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded text-xs transition-colors ${
        active
          ? "bg-[#d4a017] text-[#0a1f0a]"
          : "text-white/70 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="bg-black/30 border border-[#d4a017]/20 rounded-md overflow-hidden focus-within:border-[#d4a017] transition-colors">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-white/10 bg-black/20">
        <Btn
          title="Félkövér"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon className="w-3.5 h-3.5" />
        </Btn>
        <Btn
          title="Dőlt"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon className="w-3.5 h-3.5" />
        </Btn>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <Btn
          title="Nagy cím"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="w-3.5 h-3.5" />
        </Btn>
        <Btn
          title="Alcím"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="w-3.5 h-3.5" />
        </Btn>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <Btn
          title="Felsorolás"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-3.5 h-3.5" />
        </Btn>
        <Btn
          title="Számozott lista"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </Btn>
        <Btn
          title="Idézet"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="w-3.5 h-3.5" />
        </Btn>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <Btn
          title="Formázás törlése"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          <Eraser className="w-3.5 h-3.5" />
        </Btn>
        <div className="ml-auto flex items-center gap-0.5">
          <Btn title="Visszavonás" onClick={() => editor.chain().focus().undo().run()}>
            <Undo className="w-3.5 h-3.5" />
          </Btn>
          <Btn title="Újra" onClick={() => editor.chain().focus().redo().run()}>
            <Redo className="w-3.5 h-3.5" />
          </Btn>
        </div>
      </div>
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  )
}
