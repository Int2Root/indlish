'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-session';
import { useDebounce } from '@/hooks/use-debounce';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { toast } from 'sonner';
import { Send, ArrowLeft, Tag, ImageIcon, X, CheckCircle, Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ArticleEditorPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useCurrentUser();
  const [article, setArticle] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [loading, setLoading] = useState(true);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 2000);

  useEffect(() => {
    fetch(`/api/articles/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const a = data.data;
          setArticle(a);
          setTitle(a.title);
          setContent(a.content);
          setExcerpt(a.excerpt || '');
          setCoverImage(a.coverImage || '');
          setTags(a.tags?.map((t: any) => t.tag.name) || []);
        }
        setLoading(false);
      });
  }, [slug]);

  // Auto-resize title textarea
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [title]);

  const save = useCallback(
    async (status?: string) => {
      if (!article) return;
      setSaving(true);
      setSaved(false);
      const res = await fetch(`/api/articles/${article.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, excerpt, coverImage, tags, status }),
      });
      const data = await res.json();
      setSaving(false);
      if (data.success) {
        setSaved(true);
        if (status === 'PUBLISHED') {
          toast.success('Published!');
          router.push(`/write/${data.data.slug}`);
        }
      } else {
        toast.error(data.error || 'Save failed');
      }
    },
    [article, title, content, excerpt, coverImage, tags, router]
  );

  // Auto-save on debounced changes
  useEffect(() => {
    if (article && (debouncedTitle || debouncedContent)) {
      save();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedContent]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && tags.length < 5 && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const handleCoverFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <LoadingSpinner className="py-32" />;
  if (!article) return <div className="text-center py-32 text-text-muted">Article not found</div>;

  const isAuthor = user?.id === article.authorId;
  const isPublished = article.status === 'PUBLISHED';

  return (
    <div className="min-h-screen bg-surface">
      {isAuthor ? (
        <>
          {/* Minimal fixed header */}
          <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-surface/90 backdrop-blur-sm border-b border-neutral-800/50">
            <button
              onClick={() => router.push('/write')}
              className="flex items-center gap-1.5 text-text-muted hover:text-text-secondary transition-colors text-sm"
            >
              <ArrowLeft size={15} />
              <span>My articles</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Auto-save indicator */}
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                {saving ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Saving…
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle size={12} className="text-green-500/70" />
                    Saved
                  </>
                ) : null}
              </span>
              {!isPublished && (
                <button
                  onClick={() => save('PUBLISHED')}
                  className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
                >
                  <Send size={13} />
                  Publish
                </button>
              )}
            </div>
          </header>

          {/* Editor canvas */}
          <main className="pt-20 pb-32 max-w-[680px] mx-auto px-6 sm:px-8">

            {/* Cover image */}
            {coverImage ? (
              <div className="relative mb-8 group">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-56 object-cover rounded-xl"
                />
                <button
                  onClick={() => setCoverImage('')}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label
                className="flex flex-col items-center justify-center w-full mb-8 h-36 border-2 border-dashed border-neutral-800 rounded-xl cursor-pointer hover:border-brand-500/40 hover:bg-brand-500/5 transition-all group"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file?.type.startsWith('image/')) handleCoverFile(file);
                }}
              >
                <input
                  ref={coverFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCoverFile(file);
                  }}
                />
                <ImageIcon size={22} className="text-neutral-600 group-hover:text-brand-500/60 mb-2 transition-colors" />
                <span className="text-sm text-neutral-600 group-hover:text-neutral-500 transition-colors">
                  Drop cover image or click to upload
                </span>
              </label>
            )}

            {/* Title */}
            <textarea
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title…"
              rows={1}
              className="editor-title-input"
            />

            {/* Subtitle / excerpt */}
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Add a subtitle…"
              className="editor-subtitle-input"
            />

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-8 pb-6 border-b border-neutral-800/60">
              <Tag size={13} className="text-neutral-600" />
              {tags.map((t) => (
                <span
                  key={t}
                  onClick={() => setTags(tags.filter((tag) => tag !== t))}
                  className="bg-neutral-800 hover:bg-red-500/20 hover:text-red-400 px-2.5 py-0.5 rounded-full text-xs text-neutral-400 cursor-pointer transition-colors"
                >
                  {t} ×
                </span>
              ))}
              {tags.length < 5 && (
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tag…"
                  className="bg-transparent text-sm outline-none text-neutral-500 placeholder:text-neutral-700 w-20"
                />
              )}
            </div>

            {/* The editor */}
            <TiptapEditor
              content={content}
              onChange={(c) => { setContent(c); setSaved(false); }}
              placeholder="Tell your story…"
            />
          </main>
        </>
      ) : (
        /* Read-only view */
        <article className="max-w-[680px] mx-auto px-6 sm:px-8 pt-12 pb-32">
          {article.coverImage && (
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-64 object-cover rounded-xl mb-8"
            />
          )}
          <h1 className="text-4xl font-bold mb-3 leading-tight tracking-tight text-text-primary" style={{ fontFamily: 'Georgia, serif' }}>
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-xl text-text-secondary mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 mb-10 text-text-muted text-sm border-b border-neutral-800 pb-6">
            <span className="text-text-secondary font-medium">{article.author?.name}</span>
            <span>·</span>
            <span>{article.readingTime} min read</span>
            <span>·</span>
            <span>{article.views} views</span>
          </div>
          <TiptapEditor content={article.content} editable={false} />
        </article>
      )}
    </div>
  );
}
