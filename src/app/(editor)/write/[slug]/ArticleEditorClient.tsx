'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-session';
import { useDebounce } from '@/hooks/use-debounce';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { toast } from 'sonner';
import { ArrowLeft, Send, Tag, X, Upload, Link2, Check, Heart } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import CommentSection from '@/components/articles/CommentSection';
import ReactionBar from '@/components/articles/ReactionBar';
import FollowButton from '@/components/articles/FollowButton';
import SubscribeWidget from '@/components/articles/SubscribeWidget';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-neutral-800">
      <span className="text-text-muted text-sm mr-1">Share:</span>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600/10 text-green-400 hover:bg-green-600/20 text-sm font-medium transition-colors"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.571a.75.75 0 00.914.914l5.724-1.465A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.707 9.707 0 01-4.95-1.358l-.354-.21-3.672.94.957-3.513-.229-.367A9.713 9.713 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
        WhatsApp
      </a>
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-text-secondary hover:bg-neutral-700 text-sm font-medium transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        Post
      </a>
      <button
        onClick={copyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-text-secondary hover:bg-neutral-700 text-sm font-medium transition-colors"
      >
        {copied ? <Check size={13} className="text-green-400" /> : <Link2 size={13} />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}

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
          // Strip stored JSON — old saves may have persisted a Tiptap JSON object in excerpt
          const rawExcerpt = a.excerpt || '';
          const isJson = rawExcerpt.trim().startsWith('{') && rawExcerpt.includes('"type"');
          setSubtitle(isJson ? '' : rawExcerpt);
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
    const handleLike = async () => {
      const res = await fetch(`/api/articles/${article.id}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) setArticle((prev: any) => ({ ...prev, isLiked: data.data.liked }));
    };

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
            <Link href={`/profile/${article.author?.username}`} className="hover:text-brand-400 transition-colors">
              {article.author?.name}
            </Link>
            <span>·</span>
            <span>{article.readingTime} min read</span>
            <span>·</span>
            <span>{article.views} views</span>
          </div>

          {/* Author + Follow */}
          <div className="flex items-center justify-between gap-4 py-4 border-y border-neutral-800 mb-6">
            <Link href={`/profile/${article.author?.username}`} className="flex items-center gap-3 group">
              {article.author?.image ? (
                <img src={article.author.image} alt="" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center font-bold">
                  {article.author?.name?.[0]}
                </div>
              )}
              <div>
                <p className="font-medium text-sm group-hover:text-brand-400 transition-colors">{article.author?.name}</p>
                <p className="text-text-muted text-xs">{article.author?._count?.followers || 0} followers</p>
              </div>
            </Link>
            <FollowButton authorId={article.authorId} initialFollowing={article.isFollowingAuthor} />
          </div>

          <TiptapEditor content={article.content} editable={false} />

          {/* Reactions */}
          <ReactionBar articleId={article.id} />

          {/* Like + Share */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                article.isLiked
                  ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                  : 'bg-surface-lighter border border-neutral-800 text-text-secondary hover:border-neutral-600'
              }`}
            >
              <Heart size={16} className={article.isLiked ? 'fill-red-400 text-red-400' : ''} />
              {article._count?.likes || 0}
            </button>
            <ShareButtons title={article.title} />
          </div>

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map(({ tag }: any) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="text-xs bg-surface-lighter px-3 py-1 rounded-full text-text-muted hover:text-brand-400 border border-neutral-800 hover:border-neutral-600 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Subscribe widget */}
          <div className="mb-8">
            <SubscribeWidget authorId={article.authorId} authorName={article.author?.name} />
          </div>

          {/* Comments */}
          <CommentSection articleId={article.id} />
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
          placeholder="Start writing your story..."
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
