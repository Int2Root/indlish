'use client';

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Link as LinkIcon, Quote, Plus, Image as ImageIcon } from 'lucide-react';

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
  // Fix raw JSON display bug — handle stringified content
  const parsedContent = (() => {
    if (!content) return undefined;
    if (typeof content === 'string') {
      try { return JSON.parse(content); } catch { return undefined; }
    }
    return content;
  })();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Heading...';
          return placeholder;
        },
        emptyNodeClass: 'medium-placeholder',
      }),
    ],
    content: parsedContent,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'medium-body focus:outline-none',
        spellcheck: 'true',
      },
    },
  });

  const setLink = () => {
    const prev = editor?.getAttributes('link').href || '';
    const url = window.prompt('Enter URL:', prev);
    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().unsetLink().run();
    } else {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Image URL:');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="medium-editor-wrapper">
      {editable && editor && (
        <>
          {/* Bubble toolbar — appears on text selection */}
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100, placement: 'top' }}
            className="bubble-menu"
          >
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
              className={`bubble-btn${editor.isActive('bold') ? ' active' : ''}`}
              title="Bold"
            >
              <strong>B</strong>
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
              className={`bubble-btn${editor.isActive('italic') ? ' active' : ''}`}
              title="Italic"
            >
              <em>I</em>
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); setLink(); }}
              className={`bubble-btn${editor.isActive('link') ? ' active' : ''}`}
              title="Link"
            >
              <LinkIcon size={13} />
            </button>
            <div className="bubble-divider" />
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
              className={`bubble-btn${editor.isActive('heading', { level: 2 }) ? ' active' : ''}`}
              title="Heading 2"
            >
              H2
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
              className={`bubble-btn${editor.isActive('heading', { level: 3 }) ? ' active' : ''}`}
              title="Heading 3"
            >
              H3
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
              className={`bubble-btn${editor.isActive('blockquote') ? ' active' : ''}`}
              title="Blockquote"
            >
              <Quote size={13} />
            </button>
          </BubbleMenu>

          {/* Floating "+" menu — appears on empty lines */}
          <FloatingMenu
            editor={editor}
            tippyOptions={{ duration: 100, placement: 'left-start', offset: [-4, 8] }}
            className="floating-menu"
          >
            <button
              onMouseDown={(e) => { e.preventDefault(); addImage(); }}
              className="floating-plus-btn"
              title="Add image"
            >
              <Plus size={16} />
            </button>
          </FloatingMenu>
        </>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
