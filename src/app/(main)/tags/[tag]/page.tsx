'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ArticleCard from '@/components/articles/ArticleCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Tag, TrendingUp } from 'lucide-react';

export default function TagPage() {
  const { tag } = useParams();
  const tagSlug = Array.isArray(tag) ? tag[0] : tag;

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/articles?tag=${tagSlug}&limit=20&page=1`)
      .then((r) => r.json())
      .then((d) => {
        const fetched = d.data?.articles || [];
        setArticles(fetched);
        setHasMore(d.data?.totalPages > 1);
        setLoading(false);
      });
  }, [tagSlug]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetch(`/api/articles?tag=${tagSlug}&limit=20&page=${next}`)
      .then((r) => r.json())
      .then((d) => {
        setArticles((prev) => [...prev, ...(d.data?.articles || [])]);
        setHasMore(d.data?.page < d.data?.totalPages);
      });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
          <Tag size={18} className="text-brand-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">#{tagSlug}</h1>
          <p className="text-text-muted text-sm mt-0.5">
            {loading ? '...' : `${articles.length} articles`}
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : articles.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No articles yet"
          description={`No published articles with #${tagSlug} yet.`}
        />
      ) : (
        <>
          <div className="space-y-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button onClick={loadMore} className="btn-secondary">
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
