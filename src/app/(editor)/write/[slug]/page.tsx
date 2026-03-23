'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-session';
import { useDebounce } from '@/hooks/use-debounce';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { toast } from 'sonner';
import { ArrowLeft, Send, Tag, X, Upload } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

export default function ArticleEditorPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useCurrentUser();

  const [article, setArticle] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [coverImage, setCoverImage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 2000);

  useEffect(() => {
    fetch(`/api/articles/slug/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const a = data.data;
          setArticle(a);
          setTitle(a.title || '');
          setSubtitle(a.excerpt || '');
          setContent(a.content);
          setCoverImage(a.coverImage || '');
          setTags(a.tags?.map((t: any) => t.tag.name) || []);
        }
        setLoading(false);
      });
  }, [slug]);

  const save = useCallback(
    async (publishStatus?: string) => {
      if (!article) return;
      setSaveStatus('saving');
      try {
        const res = await fetch(`/api/articles/${article.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            content,
            excerpt: subtitle,
            coverImage,
            tags,
            ...(publishStatus ? { status: publishStatus } : {}),
          }),
        });
        const data = await res.json();
        if (data.success) {
          setSaveStatus('saved');
          if (publishStatus === 'PUBLISHED') {
            toast.success('Published!');
            router.push(`/write/${data.data.slug}`);
          }
        } else {
          setSaveStatus('unsaved');
          toast.error(data.error || 'Save failed');
        }
      } catch {
        setSaveStatus('unsaved');
      }
    },
    [article, title, content, subtitle, coverImage, tags, router]
  );

  // Auto-save on debounced changes
  useEffect(() => {
    if (article && (debouncedTitle || debouncedContent)) {
      save();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedContent]);

  // Cover image: drag & drop
  const handleCoverDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setCoverImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleCoverFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setCoverImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() && tags.length < 5 && !tags.includes(tagInput.trim())) {
      e.preventDefault();
      setTags((prev) => [...prev, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const autoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const t = e.currentTarget;
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 'px';
  };

  if (loading) return <LoadingSpinner className="py-32" />;
  if (!article) return (
    <div className="flex items-center justify-center min-h-screen text-text-muted">
      Article not found
    </div>
  );

  const isAuthor = user?.id === article.authorId;
  const isPublished = article.status === 'PUBLISHED';

  // ── Reader view (non-author) ────────────────────────────────────────────────
  if (!isAuthor) {
    return (
      <div className="reader-page">
        <header className="reader-topbar">
          <Link href="/" className="topbar-back">
            <ArrowLeft size={18} />
          </Link>
        </header>
        <article className="reader-canvas">
          {article.coverImage && (
            <img src={article.coverImage} alt={article.title} className="reader-cover" />
          )}
          <h1 className="reader-title">{article.title}</h1>
          {article.excerpt && <p className="reader-subtitle">{article.excerpt}</p>}
          <div className="reader-meta">
            <span>{article.author?.name}</span>
            <span>·</span>
            <span>{article.readingTime} min read</span>
            <span>·</span>
            <span>{article.views} views</span>
          </div>
          <TiptapEditor content={article.content} editable={false} />
        </article>
      </div>
    );
  }

  // ── Editor view (author) ────────────────────────────────────────────────────
  return (
    <div className="editor-page">
      {/* Top bar */}
      <header className="editor-topbar">
        <button onClick={() => router.push('/write')} className="topbar-back">
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Drafts</span>
        </button>
        <div className="topbar-right">
          <span
            className={`save-status ${
              saveStatus === 'saving'
                ? 'text-text-muted'
                : saveStatus === 'saved'
                ? 'text-green-500/70'
                : 'text-yellow-500/70'
            }`}
          >
            {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved' : 'Unsaved'}
          </span>
          {!isPublished && (
            <button onClick={() => save('PUBLISHED')} className="publish-btn">
              <Send size={13} />
              Publish
            </button>
          )}
        </div>
      </header>

      {/* Canvas */}
      <main className="editor-canvas">
        {/* Cover image drop zone */}
        <div
          className={`cover-zone ${isDragging ? 'is-dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleCoverDrop}
        >
          {coverImage ? (
            <div className="cover-preview">
              <img src={coverImage} alt="Cover" />
              <button
                className="cover-remove-btn"
                onClick={() => setCoverImage('')}
                title="Remove cover image"
              >
                <X size={14} />
                Remove
              </button>
            </div>
          ) : (
            <button
              className="cover-upload-btn"
              onClick={() => coverInputRef.current?.click()}
            >
              <Upload size={16} />
              Add cover image
            </button>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverFile}
          />
        </div>

        {/* Title */}
        <textarea
          value={title}
          onChange={(e) => { setTitle(e.target.value); setSaveStatus('unsaved'); }}
          onInput={autoResize}
          placeholder="Title"
          className="editor-title-input"
          rows={1}
        />

        {/* Subtitle */}
        <textarea
          value={subtitle}
          onChange={(e) => { setSubtitle(e.target.value); setSaveStatus('unsaved'); }}
          onInput={autoResize}
          placeholder="Add a subtitle…"
          className="editor-subtitle-input"
          rows={1}
        />

        {/* Body */}
        <TiptapEditor
          content={content}
          onChange={(c) => { setContent(c); setSaveStatus('unsaved'); }}
          placeholder="Tell your story…"
        />

        {/* Tags */}
        <div className="editor-tags">
          <Tag size={12} className="text-text-muted flex-shrink-0" />
          {tags.map((t) => (
            <span key={t} className="tag-chip">
              {t}
              <button
                onClick={() => setTags((prev) => prev.filter((tag) => tag !== t))}
                className="tag-chip-remove"
              >
                <X size={10} />
              </button>
            </span>
          ))}
          {tags.length < 5 && (
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Add tag…"
              className="tag-input"
            />
          )}
        </div>
      </main>
    </div>
  );
}
