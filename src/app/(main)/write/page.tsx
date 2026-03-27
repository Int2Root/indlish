'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PenLine, Plus, FileText, Eye, Heart, MessageCircle, Clock } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-session';
import { formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

type StatusFilter = 'ALL' | 'DRAFT' | 'PUBLISHED';

export default function WritePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('ALL');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user) {
      const statusParam = filter === 'ALL' ? '' : `&status=${filter}`;
      fetch(`/api/articles?authorId=${user.id}${statusParam}&limit=50`)
        .then((res) => res.json())
        .then((data) => { setArticles(data.data?.articles || []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user, authLoading, isAuthenticated, router, filter]);

  const createArticle = async () => {
    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled Article', content: { type: 'doc', content: [] } }),
    });
    const data = await res.json();
    if (data.success) router.push(`/write/${data.data.slug}`);
  };

  if (loading || authLoading) return <LoadingSpinner className="py-32" />;

  const drafts = articles.filter((a) => a.status === 'DRAFT');
  const published = articles.filter((a) => a.status === 'PUBLISHED');
  const filtered = filter === 'ALL' ? articles : filter === 'DRAFT' ? drafts : published;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Your Articles</h1>
          <p className="text-text-muted text-sm mt-1">
            {published.length} published · {drafts.length} draft{drafts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={createArticle} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Article
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-1 bg-surface-lighter rounded-lg p-1 w-fit mb-6">
        {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setLoading(true); }}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all capitalize ${filter === s ? 'bg-brand-500 text-white' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {s === 'ALL' ? 'All' : s === 'PUBLISHED' ? `Published (${published.length})` : `Drafts (${drafts.length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={filter === 'DRAFT' ? 'No drafts' : filter === 'PUBLISHED' ? 'Nothing published yet' : 'No articles yet'}
          description={filter === 'DRAFT' ? 'All your articles are published.' : 'Start writing your first article!'}
          action={<button onClick={createArticle} className="btn-primary flex items-center gap-2"><PenLine size={14} />Write Your First Article</button>}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((article: any) => (
            <Link
              key={article.id}
              href={`/write/${article.slug}`}
              className="card flex items-center justify-between hover:border-neutral-600 transition-colors group"
            >
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    article.status === 'PUBLISHED'
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-yellow-500/15 text-yellow-400'
                  }`}>
                    {article.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-text-muted text-xs flex items-center gap-1">
                    <Clock size={11} />
                    {formatDate(article.updatedAt)}
                  </span>
                </div>
                <h3 className="font-medium group-hover:text-brand-400 transition-colors truncate">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-text-muted text-sm mt-0.5 truncate">{article.excerpt}</p>
                )}
              </div>
              <div className="flex items-center gap-4 text-text-muted text-sm shrink-0">
                <span className="flex items-center gap-1"><Eye size={14} />{article.views}</span>
                <span className="flex items-center gap-1"><Heart size={14} />{article._count?.likes || 0}</span>
                <span className="flex items-center gap-1"><MessageCircle size={14} />{article._count?.comments || 0}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
