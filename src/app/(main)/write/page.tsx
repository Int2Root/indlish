'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PenLine, Plus, FileText, Eye, Heart } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-session';
import { formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function WritePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user) {
      fetch(`/api/articles?authorId=${user.id}&status=DRAFT`)
        .then(res => res.json())
        .then(data => { setArticles(data.data?.articles || []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user, authLoading, isAuthenticated, router]);

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Your Articles</h1>
        <button onClick={createArticle} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Article
        </button>
      </div>

      {articles.length === 0 ? (
        <EmptyState icon={FileText} title="No articles yet" description="Start writing your first article. Share your thoughts with the world!" action={<button onClick={createArticle} className="btn-primary">Write Your First Article</button>} />
      ) : (
        <div className="space-y-4">
          {articles.map((article: any) => (
            <Link key={article.id} href={`/write/${article.slug}`} className="card flex items-center justify-between hover:border-neutral-600 transition-colors">
              <div>
                <h3 className="font-medium">{article.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-text-muted text-sm">
                  <span>{formatDate(article.updatedAt)}</span>
                  <span className={article.status === 'PUBLISHED' ? 'text-green-400' : 'text-yellow-400'}>{article.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-text-muted text-sm">
                <span className="flex items-center gap-1"><Eye size={14} />{article.views}</span>
                <span className="flex items-center gap-1"><Heart size={14} />{article._count?.likes || 0}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}