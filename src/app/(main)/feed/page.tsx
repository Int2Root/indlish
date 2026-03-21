'use client';

import { useState, useEffect } from 'react';
import ArticleCard from '@/components/articles/ArticleCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Newspaper } from 'lucide-react';
import Link from 'next/link';

export default function FeedPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'articles' | 'boards'>('all');

  useEffect(() => {
    fetch(`/api/feed?type=${tab}`).then(r => r.json()).then(d => {
      setArticles(d.data?.articles || []);
      setBoards(d.data?.boards || []);
      setLoading(false);
    });
  }, [tab]);

  if (loading) return <LoadingSpinner className="py-32" />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">Feed</h1>
        <div className="flex gap-1 bg-surface-lighter rounded-lg p-1">
          {(['all', 'articles', 'boards'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setLoading(true); }} className={`px-3 py-1 rounded text-sm capitalize ${tab === t ? 'bg-brand-500 text-white' : 'text-text-secondary'}`}>{t}</button>
          ))}
        </div>
      </div>

      {articles.length === 0 && boards.length === 0 ? (
        <EmptyState icon={Newspaper} title="Nothing here yet" description="Follow some creators or check out the discover page to fill your feed." action={<Link href="/discover" className="btn-primary">Discover Content</Link>} />
      ) : (
        <div className="space-y-6">
          {articles.map((article: any) => <ArticleCard key={article.id} article={article} />)}
          {boards.length > 0 && tab !== 'articles' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Trending Boards</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {boards.map((board: any) => (
                  <Link key={board.id} href={`/curate/${board.id}`} className="card hover:border-neutral-600">
                    <h3 className="font-medium">{board.title}</h3>
                    <p className="text-text-muted text-sm mt-1">{board._count?.pins || 0} pins · by {board.user?.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}