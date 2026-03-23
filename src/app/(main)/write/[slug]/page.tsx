'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-session';
import { useDebounce } from '@/hooks/use-debounce';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { toast } from 'sonner';
import { ArrowLeft, Send, Tag, Upload } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ArticleEditorPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useCurrentUser();
  const [article, setArticle] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [coverImage, setCoverImage] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 2000);

  useEffect(() => {
    fetch(`/api/articles/slug/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const a = data.data;
          setArticle(a);
          setTitle(a.title === 'Untitled Article' ? '' : a.title);
          setContent(a.content);
          setSubtitle(a.excerpt || '');
          setCoverImage(a.coverImage || '');
          setCoverPreview(a.coverImage || '');
          setTags(a.tags?.map((t: any) => t.tag.name) || []);
        }
        setLoading(false);
      });
  }, [slug]);

  const save = useCallback(async (status?: string) => {
    if (!article) return;
    setSaving(true);
    const res = await fetch(`/api/articles/${article.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title || 'Untitled Article',
        content,
        excerpt: subtitle,
        coverImage,
        status,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setSavedAt(new Date());
      if (status === 'PUBLISHED') {
        toast.success('Published!');
        router.push(`/${data.data.slug}`);
      }
    } else {
      toast.error(data.error || 'Save failed');
    }
  }, [article, title, content, subtitle, coverImage, router]);

  // Auto-save
  useEffect(() => {
    if (article && (debouncedTitle || debouncedContent)) {
      save();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedContent]);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && tags.length < 5 && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleCoverFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setCoverPreview(dataUrl);
      setCoverImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleCoverFile(file);
  };

  const onDropCover = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleCoverFile(file);
  };

  if (loading) return <LoadingSpinner className="py-32" />;
  if (!article) return <div className="text-center py-32 text-text-muted">Article not found</div>;

  const isAuthor = user?.id === article.authorId;
  const isPublished = article.status === 'PUBLISHED';

  const savedLabel = saving
    ? 'Saving...'
    : savedAt
    ? `Saved`
    : 'Draft';

  return (
    <div className="medium-page">
      {isAuthor && (
        <header className="medium-header">
          <button
            onClick={() => router.push('/write')}
            className="medium-back-btn"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="medium-header-right">
            <span className="medium-save-label">{savedLabel}</span>
            {!isPublished && (
              <button
                onClick={() => save('PUBLISHED')}
                className="medium-publish-btn"
              >
                <Send size={14} />
                Publish
              </button>
            )}
          </div>
        </header>
      )}

      <main className="medium-canvas">
        {isAuthor ? (
          <>
            {/* Cover image upload */}
            <div
              className="medium-cover-upload"
              onClick={() => fileInputRef.current?.click()}
              onDrop={onDropCover}
              onDragOver={(e) => e.preventDefault()}
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Cover" className="medium-cover-img" />
              ) : (
                <div className="medium-cover-placeholder">
                  <Upload size={20} />
                  <span>Add a cover image</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileInputChange}
              />
            </div>

            {/* Tags row */}
            <div className="medium-tags-row">
              <Tag size={13} className="text-text-muted" />
              {tags.map(t => (
                <span
                  key={t}
                  className="medium-tag"
                  onClick={() => setTags(tags.filter(tag => tag !== t))}
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
                    if (e.key === 'Enter') { e.preventDefault(); addTag(); }
                    if (e.key === ',' ) { e.preventDefault(); addTag(); }
                  }}
                  placeholder="Add topic..."
                  className="medium-tag-input"
                />
              )}
            </div>

            {/* Title */}
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="medium-title-input"
              rows={1}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
              }}
            />

            {/* Subtitle */}
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Add a subtitle..."
              className="medium-subtitle-input"
              rows={1}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
              }}
            />

            {/* Body */}
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Tell your story..."
            />
          </>
        ) : (
          <>
            {article.coverImage && (
              <img src={article.coverImage} alt={article.title} className="medium-cover-img mb-10" />
            )}
            <h1 className="medium-read-title">{article.title}</h1>
            {article.excerpt && (
              <p className="medium-read-subtitle">{article.excerpt}</p>
            )}
            <div className="medium-read-meta">
              <span>{article.author?.name}</span>
              <span>·</span>
              <span>{article.readingTime} min read</span>
              <span>·</span>
              <span>{article.views} views</span>
            </div>
            <TiptapEditor content={article.content} editable={false} />
          </>
        )}
      </main>
    </div>
  );
}
