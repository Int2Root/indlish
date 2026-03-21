'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import ArticleCard from '@/components/articles/ArticleCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DiscoverPage() {
  return (
    <Suspense fallback={<LoadingSpinner className="py-32" />}>
      <DiscoverContent />
    </Suspense>
  );
}

function DiscoverContent() {
  const searchParams = useSearchParams();
  const tagFilter = searchParams.get('tag');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>({});
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      fetch(`/api/search?q=${debouncedQuery}`).then(r => r.json()).then(d => { setResults(d.data || {}); setLoading(false); });
    } else {
      const url = tagFilter ? `/api/articles?tag=${tagFilter}` : '/api/articles?limit=20';
      fetch(url).then(r => r.json()).then(d => { setTrending(d.data?.articles || []); setLoading(false); });
    }
  }, [debouncedQuery, tagFilter]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Discover</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setLoading(true); }} placeholder="Search articles, boards, creators..." className="input-field w-full pl-10" />
        </div>
        {tagFilter && <p className="mt-2 text-text-secondary text-sm">Filtering by tag: <span className="text-brand-400">#{tagFilter}</span></p>}
      </div>

      {loading ? <LoadingSpinner className="py-16" /> : debouncedQuery.length >= 2 ? (
        <div className="space-y-8">
          {results.articles?.length > 0 && (
            <div><h2 className="text-lg font-semibold mb-4">Articles</h2><div className="space-y-4">{results.articles.map((a: any) => <ArticleCard key={a.id} article={a} />)}</div></div>
          )}
          {results.users?.length > 0 && (
            <div><h2 className="text-lg font-semibold mb-4">Creators</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{results.users.map((u: any) => (
              <Link key={u.id} href={`/profile/${u.username}`} className="card flex items-center gap-3 hover:border-neutral-600">
                {u.image ? <img src={u.image} alt="" className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center font-medium">{u.name?.[0]}</div>}
                <div><p className="font-medium">{u.name}</p><p className="text-text-muted text-sm">@{u.username} · {u._count?.articles || 0} articles</p></div>
              </Link>
            ))}</div></div>
          )}
          {results.boards?.length > 0 && (
            <div><h2 className="text-lg font-semibold mb-4">Boards</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{results.boards.map((b: any) => (
              <Link key={b.id} href={`/curate/${b.id}`} className="card hover:border-neutral-600">
                <h3 className="font-medium">{b.title}</h3><p className="text-text-muted text-sm">{b._count?.pins} pins · by {b.user?.name}</p>
              </Link>
            ))}</div></div>
          )}
        </div>
      ) : (
        <div><h2 className="flex items-center gap-2 text-lg font-semibold mb-4"><TrendingUp size={18} />Trending</h2><div className="space-y-4">{trending.map((a: any) => <ArticleCard key={a.id} article={a} />)}</div></div>
      )}
    </div>
  );
}