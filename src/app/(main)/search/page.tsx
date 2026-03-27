'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import ArticleCard from '@/components/articles/ArticleCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Search, Users, BookOpen, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner className="py-32" />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const qParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(qParam);
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        .then(r => r.json())
        .then(d => { setResults(d.data || {}); setLoading(false); });
    } else {
      setResults({});
    }
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const totalResults = (results.articles?.length || 0) + (results.users?.length || 0) + (results.boards?.length || 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Search</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search articles, creators, boards..."
            className="input-field w-full pl-10 pr-4"
            autoFocus
          />
        </div>
      </form>

      {loading && <LoadingSpinner className="py-16" />}

      {!loading && debouncedQuery.length >= 2 && (
        totalResults === 0 ? (
          <div className="card text-center py-12">
            <Search className="mx-auto text-text-muted mb-3" size={36} />
            <p className="font-semibold mb-1">No results for &ldquo;{debouncedQuery}&rdquo;</p>
            <p className="text-text-muted text-sm">Try different keywords or check your spelling.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {results.articles?.length > 0 && (
              <section>
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2 text-text-secondary">
                  <BookOpen size={15} /> Articles ({results.articles.length})
                </h2>
                <div className="space-y-4">
                  {results.articles.map((a: any) => <ArticleCard key={a.id} article={a} />)}
                </div>
              </section>
            )}

            {results.users?.length > 0 && (
              <section>
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2 text-text-secondary">
                  <Users size={15} /> Creators ({results.users.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.users.map((u: any) => (
                    <Link key={u.id} href={`/profile/${u.username}`} className="card flex items-center gap-3 hover:border-neutral-600 transition-colors">
                      {u.image
                        ? <img src={u.image} alt="" className="w-10 h-10 rounded-full shrink-0" />
                        : <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center font-medium shrink-0">{u.name?.[0]}</div>
                      }
                      <div className="min-w-0">
                        <p className="font-medium truncate">{u.name}</p>
                        <p className="text-text-muted text-sm">@{u.username} · {u._count?.articles || 0} articles</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.boards?.length > 0 && (
              <section>
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2 text-text-secondary">
                  <LayoutGrid size={15} /> Boards ({results.boards.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.boards.map((b: any) => (
                    <Link key={b.id} href={`/curate/${b.id}`} className="card hover:border-neutral-600 transition-colors">
                      <p className="font-medium">{b.title}</p>
                      <p className="text-text-muted text-sm mt-0.5">{b._count?.pins} pins · by {b.user?.name}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )
      )}

      {!loading && debouncedQuery.length < 2 && (
        <div className="text-center py-16 text-text-muted">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Type at least 2 characters to search</p>
        </div>
      )}
    </div>
  );
}
