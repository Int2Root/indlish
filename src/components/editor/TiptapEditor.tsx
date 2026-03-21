'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, List, ListOrdered, Quote, ImageIcon, LinkIcon, Undo, Redo } from 'lucide-react';

interface TiptapEditorProps {
  content?: any;
  onChange?: (content: any) => void;
  placeholder?: string;
  editable?: boolean;
}

function MenuBar({ editor }: { editor: any }) {
  if (!editor) return null;

  const buttons = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code') },
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
    { icon: Undo, action: () => editor.chain().focus().undo().run(), active: false },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), active: false },
  ];
  const addImage = () => {
    const url = window.prompt('Image URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt('Link URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-neutral-700 bg-surface-lighter rounded-t-lg">
      {buttons.map(({ icon: Icon, action, active }, i) => (
        <button key={i} onClick={action} className={`p-2 rounded hover:bg-surface-light transition-colors ${active ? 'bg-brand-500/20 text-brand-400' : 'text-text-secondary'}`}>
          <Icon size={16} />
        </button>
      ))}
      <button onClick={addImage} className="p-2 rounded hover:bg-surface-light text-text-secondary"><ImageIcon size={16} /></button>
      <button onClick={addLink} className="p-2 rounded hover:bg-surface-light text-text-secondary"><LinkIcon size={16} /></button>
    </div>
  );
}
export default function TiptapEditor({ content, onChange, placeholder = 'Start writing...', editable = true }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
  });

  return (
    <div className="border border-neutral-700 rounded-lg overflow-hidden">
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} className="prose prose-invert max-w-none p-4" />
    </div>
  );
}