'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Link as LinkIcon, Heading1, Heading2, Quote, Minus, Code, ImageIcon, Plus } from 'lucide-react';

interface TiptapEditorProps {
  content?: any;
  onChange?: (content: any) => void;
  placeholder?: string;
  editable?: boolean;
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = 'Tell your story...',
  editable = true,
}: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [floatingOpen, setFloatingOpen] = useState(false);
  const initialized = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'editor-link' },
      }),
      Image.configure({ allowBase64: true }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Heading...';
          return placeholder;
        },
      }),
    ],
    content: null,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
  });

  // Load content once it arrives from the server (avoids stale closure on useEditor init)
  useEffect(() => {
    if (editor && content && !initialized.current) {
      editor.commands.setContent(content, false);
      initialized.current = true;
    }
  }, [editor, content]);

  // Close floating menu when editor loses focus
  useEffect(() => {
    if (!editor) return;
    const handleBlur = () => setFloatingOpen(false);
    editor.on('blur', handleBlur);
    return () => { editor.off('blur', handleBlur); };
  }, [editor]);

  const insertImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      editor?.chain().focus().setImage({ src: e.target?.result as string }).run();
    };
    reader.readAsDataURL(file);
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl || '');
    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().unsetLink().run();
      return;
    }
    const href = url.startsWith('http') ? url : `https://${url}`;
    if (editor?.state.selection.empty) {
      editor.chain().focus().setLink({ href }).insertContent(href).run();
    } else {
      editor?.chain().focus().setLink({ href }).run();
    }
  };

  return (
    <div className="relative editor-wrapper">
      {editable && editor && (
        <>
          {/* Floating bubble toolbar — appears on text selection */}
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 80, placement: 'top' }}
            className="bubble-menu"
          >
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
              className={`bm-btn ${editor.isActive('bold') ? 'active' : ''}`}
              title="Bold"
            >
              <Bold size={14} />
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
              className={`bm-btn ${editor.isActive('italic') ? 'active' : ''}`}
              title="Italic"
            >
              <Italic size={14} />
            </button>
            <div className="bm-sep" />
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
              className={`bm-btn text-xs font-bold ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
              title="Heading 1"
            >
              H1
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
              className={`bm-btn text-xs font-bold ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
              title="Heading 2"
            >
              H2
            </button>
            <div className="bm-sep" />
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
              className={`bm-btn ${editor.isActive('blockquote') ? 'active' : ''}`}
              title="Blockquote"
            >
              <Quote size={14} />
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); setLink(); }}
              className={`bm-btn ${editor.isActive('link') ? 'active' : ''}`}
              title="Link"
            >
              <LinkIcon size={14} />
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleCode().run(); }}
              className={`bm-btn ${editor.isActive('code') ? 'active' : ''}`}
              title="Inline Code"
            >
              <Code size={14} />
            </button>
          </BubbleMenu>

          {/* Floating "+" inserter — appears on empty lines */}
          <FloatingMenu
            editor={editor}
            tippyOptions={{ duration: 80, placement: 'left-start', offset: [0, -8] }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFloatingOpen((o) => !o)}
                className={`floating-plus${floatingOpen ? ' open' : ''}`}
                title="Insert content"
              >
                <Plus size={16} className={`transition-transform duration-200 ${floatingOpen ? 'rotate-45' : ''}`} />
              </button>
              {floatingOpen && (
                <div className="floating-menu-panel">
                  <button
                    onClick={() => { setFloatingOpen(false); fileInputRef.current?.click(); }}
                    className="fm-item"
                  >
                    <ImageIcon size={14} />
                    <span>Image</span>
                  </button>
                  <div className="fm-sep" />
                  <button
                    onClick={() => { setFloatingOpen(false); editor.chain().focus().setHorizontalRule().run(); }}
                    className="fm-item"
                  >
                    <Minus size={14} />
                    <span>Divider</span>
                  </button>
                  <div className="fm-sep" />
                  <button
                    onClick={() => { setFloatingOpen(false); editor.chain().focus().toggleCodeBlock().run(); }}
                    className="fm-item"
                  >
                    <Code size={14} />
                    <span>Code</span>
                  </button>
                  <div className="fm-sep" />
                  <button
                    onClick={() => { setFloatingOpen(false); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
                    className="fm-item"
                  >
                    <Heading1 size={14} />
                    <span>Heading</span>
                  </button>
                  <div className="fm-sep" />
                  <button
                    onClick={() => { setFloatingOpen(false); editor.chain().focus().toggleBulletList().run(); }}
                    className="fm-item"
                  >
                    <span className="text-base leading-none">•</span>
                    <span>List</span>
                  </button>
                </div>
              )}
            </div>
          </FloatingMenu>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) insertImageFile(file);
          e.target.value = '';
        }}
      />

      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
