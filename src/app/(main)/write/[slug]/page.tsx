'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-session';
import { useDebounce } from '@/hooks/use-debounce';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { toast } from 'sonner';
import { Save, Send, ArrowLeft, Tag } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 2000);

  useEffect(() => {
    fetch(`/api/articles/slug/${slug}`)
      .then(res => res.json())
      .then(data => {
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
  const save = useCallback(async (status?: string) => {
    if (!article) return;
    setSaving(true);
    const res = await fetch(`/api/articles/${article.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, excerpt, coverImage, status }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      toast.success(status === 'PUBLISHED' ? 'Published!' : 'Saved');
      if (status === 'PUBLISHED') router.push(`/write/${data.data.slug}`);
    } else {
      toast.error(data.error || 'Save failed');
    }
  }, [article, title, content, excerpt, coverImage, router]);

  // Auto-save
  useEffect(() => {
    if (article && debouncedTitle && debouncedContent) {
      save();
    }
  }, [debouncedTitle, debouncedContent]);

  const addTag = () => {
    if (tagInput && tags.length < 5 && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  if (loading) return <LoadingSpinner className="py-32" />;
  if (!article) return <div className="text-center py-32 text-text-muted">Article not found</div>;

  const isAuthor = user?.id === article.authorId;
  const isPublished = article.status === 'PUBLISHED';
  return (
    <div className="max-w-article mx-auto px-4 sm:px-6 py-8">
      {isAuthor && (
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push('/write')} className="btn-ghost flex items-center gap-2 text-sm"><ArrowLeft size={16} />Back</button>
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-xs">{saving ? 'Saving...' : 'Saved'}</span>
            <button onClick={() => save()} className="btn-secondary flex items-center gap-2 text-sm"><Save size={14} />Save</button>
            {!isPublished && <button onClick={() => save('PUBLISHED')} className="btn-primary flex items-center gap-2 text-sm"><Send size={14} />Publish</button>}
          </div>
        </div>
      )}

      {isAuthor ? (
        <>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title..." className="w-full text-3xl font-bold bg-transparent border-none outline-none mb-2 placeholder:text-text-muted" />
          <input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short excerpt (optional)..." className="w-full text-text-secondary bg-transparent border-none outline-none mb-4 text-sm placeholder:text-text-muted" />
          <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Cover image URL (optional)..." className="input-field w-full mb-4 text-sm" />
          <div className="flex items-center gap-2 mb-6">
            <Tag size={14} className="text-text-muted" />
            {tags.map(t => <span key={t} className="bg-surface-lighter px-2 py-1 rounded text-xs text-text-secondary cursor-pointer hover:text-red-400" onClick={() => setTags(tags.filter(tag => tag !== t))}>{t} ×</span>)}
            {tags.length < 5 && <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag..." className="bg-transparent text-sm outline-none text-text-muted w-24" />}
          </div>
          <TiptapEditor content={content} onChange={setContent} placeholder="Start writing your article..." />
        </>
      ) : (
        <>
          {article.coverImage && <img src={article.coverImage} alt={article.title} className="w-full h-64 object-cover rounded-xl mb-6" />}
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center gap-3 mb-8 text-text-secondary text-sm">
            <span>{article.author?.name}</span>
            <span>·</span>
            <span>{article.readingTime} min read</span>
            <span>·</span>
            <span>{article.views} views</span>
          </div>
          <TiptapEditor content={article.content} editable={false} />
        </>
      )}
    </div>
  );
}