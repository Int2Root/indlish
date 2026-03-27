'use client';

import { useState, useEffect } from 'react';
import ArticleCard from '@/components/articles/ArticleCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Newspaper, Users, PenLine } from 'lucide-react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-session';

type FeedTab = 'trending' | 'following';
type ContentTab = 'all' | 'articles' | 'boards';

export default function FeedPage() {
  const { user } = useCurrentUser();
  const [articles, setArticles] = useState<any[]>([]);
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedTab, setFeedTab] = useState<FeedTab>('trending');
  const [contentTab, setContentTab] = useState<ContentTab>('all');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/feed?type=${contentTab}&feed=${feedTab}`)
      .then((r) => r.json())
      .then((d) => {
        setArticles(d.data?.articles || []);
        setBoards(d.data?.boards || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [feedTab, contentTab]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-2xl font-bold">Feed</h1>
      </div>

      {/* Feed type tabs */}
      <div className="flex gap-1 bg-surface-lighter rounded-lg p-1 w-fit mb-4">
        <button
          onClick={() => { setFeedTab('trending'); setLoading(true); }}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${feedTab === 'trending' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Trending
        </button>
        {user && (
          <button
            onClick={() => { setFeedTab('following'); setLoading(true); }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-medium transition-all ${feedTab === 'following' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <Users size={13} />
            Following
          </button>
        )}
      </div>

      {/* Content type tabs */}
      <div className="flex gap-1 mb-8">
        {(['all', 'articles', 'boards'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setContentTab(t); setLoading(true); }}
            className={`px-3 py-1 rounded-full text-sm capitalize transition-all ${contentTab === t ? 'bg-neutral-700 text-white' : 'text-text-muted hover:text-text-secondary'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : articles.length === 0 && boards.length === 0 ? (
        feedTab === 'following' ? (
          <EmptyState
            icon={Users}
            title="No posts from people you follow"
            description="Follow some creators to see their articles here."
            action={<Link href="/discover" className="btn-primary">Discover Creators</Link>}
          />
        ) : (
          <EmptyState
            icon={PenLine}
            title="No articles published yet"
            description="Be the first to write! Share your thoughts, stories, and ideas with the indlish community."
            action={<Link href="/write" className="btn-primary">Write your first article</Link>}
          />
        )
      ) : (
        <div className="space-y-6">
          {articles.map((article: any) => <ArticleCard key={article.id} article={article} />)}
          {boards.length > 0 && contentTab !== 'articles' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Boards</h2>
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
