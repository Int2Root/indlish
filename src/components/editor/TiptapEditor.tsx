'use client';

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Node, mergeAttributes } from '@tiptap/core';
import { useRef, useState } from 'react';
import {
  Bold, Italic, Strikethrough, Code, Quote,
  Link as LinkIcon, Plus, Image as ImageIcon,
  Video, Minus, Code2,
} from 'lucide-react';

// ── YouTube custom node ───────────────────────────────────────────────────────
function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?/\s]{11})/
  );
  return m ? m[1] : null;
}

const YouTubeExtension = Node.create({
  name: 'youtube',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return { videoId: { default: null } };
  },

  parseHTML() {
    return [{ tag: 'div[data-yt]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-yt': '' }, HTMLAttributes)];
  },

  addNodeView() {
    return ({ node }) => {
      const wrap = document.createElement('div');
      wrap.style.cssText =
        'position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:2em 0;background:#000;';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${node.attrs.videoId}?rel=0`;
      iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      wrap.appendChild(iframe);
      return { dom: wrap };
    };
  },

  addCommands() {
    return {
      insertYouTube:
        (url: string) =>
        ({ commands }: any) => {
          const videoId = getYouTubeId(url);
          if (!videoId) return false;
          return commands.insertContent({ type: 'youtube', attrs: { videoId } });
        },
    } as any;
  },
});

// ── Component ─────────────────────────────────────────────────────────────────
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
  const [showInsert, setShowInsert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Accept only valid Tiptap doc objects; treat everything else as empty
  const normalizedContent =
    content && typeof content === 'object' && content.type === 'doc' ? content : undefined;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder }),
      YouTubeExtension,
    ],
    content: normalizedContent,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange?.(editor.getJSON()),
  });

  if (!editor) return null;

  const handleLink = () => {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('URL:', prev);
    if (url === null) return;
    if (!url) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url }).run();
  };

  const handleImage = () => {
    setShowInsert(false);
    fileInputRef.current?.click();
  };

  const handleYouTube = () => {
    const url = window.prompt('YouTube URL:');
    if (url) (editor.chain().focus() as any).insertYouTube(url).run();
    setShowInsert(false);
  };

  const handleHR = () => {
    editor.chain().focus().setHorizontalRule().run();
    setShowInsert(false);
  };

  const handleCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock().run();
    setShowInsert(false);
  };

  return (
    <div className="editor-root">
      {editable && (
        <>
          {/* ── Bubble menu (selection toolbar) ─────────────────────────── */}
          <BubbleMenu editor={editor} tippyOptions={{ duration: 80 }} className="bubble-menu">
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
              className={editor.isActive('bold') ? 'is-active' : ''}
              title="Bold"
            >
              <Bold size={13} />
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
              className={editor.isActive('italic') ? 'is-active' : ''}
              title="Italic"
            >
              <Italic size={13} />
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
              className={editor.isActive('strike') ? 'is-active' : ''}
              title="Strikethrough"
            >
              <Strikethrough size={13} />
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
              className={editor.isActive('link') ? 'is-active' : ''}
              title="Link"
            >
              <LinkIcon size={13} />
            </button>
            <span className="bubble-sep" />
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
              className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
              title="Heading 2"
            >
              H2
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
              className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
              title="Heading 3"
            >
              H3
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
              className={editor.isActive('blockquote') ? 'is-active' : ''}
              title="Blockquote"
            >
              <Quote size={13} />
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleCode().run(); }}
              className={editor.isActive('code') ? 'is-active' : ''}
              title="Inline code"
            >
              <Code size={13} />
            </button>
          </BubbleMenu>

          {/* ── Floating "+" inserter (empty-line trigger) ───────────────── */}
          <FloatingMenu
            editor={editor}
            tippyOptions={{ duration: 80, placement: 'left-start', offset: [0, 20] }}
            className="floating-menu"
          >
            {showInsert ? (
              <div className="insert-panel">
                <button
                  onMouseDown={(e) => { e.preventDefault(); setShowInsert(false); }}
                  title="Close"
                  className="insert-close"
                >
                  <Plus size={14} style={{ transform: 'rotate(45deg)' }} />
                </button>
                <button onMouseDown={(e) => { e.preventDefault(); handleImage(); }} title="Image">
                  <ImageIcon size={15} />
                </button>
                <button onMouseDown={(e) => { e.preventDefault(); handleYouTube(); }} title="YouTube">
                  <Video size={15} />
                </button>
                <button onMouseDown={(e) => { e.preventDefault(); handleHR(); }} title="Divider">
                  <Minus size={15} />
                </button>
                <button onMouseDown={(e) => { e.preventDefault(); handleCodeBlock(); }} title="Code block">
                  <Code2 size={15} />
                </button>
              </div>
            ) : (
              <button
                className="insert-trigger"
                onMouseDown={(e) => { e.preventDefault(); setShowInsert(true); }}
                title="Insert"
              >
                <Plus size={18} />
              </button>
            )}
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
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            editor?.chain().focus().setImage({ src: ev.target?.result as string }).run();
          };
          reader.readAsDataURL(file);
          e.target.value = '';
        }}
      />

      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
