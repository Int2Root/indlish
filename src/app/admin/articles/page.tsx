'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Heart, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useDebounce } from '@/hooks/use-debounce';
import Link from 'next/link';

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        status === 'PUBLISHED'
          ? 'bg-green-500/20 text-green-400'
          : 'bg-neutral-700/60 text-neutral-400'
      }`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

const STATUS_OPTIONS = ['ALL', 'PUBLISHED', 'DRAFT'];

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 350);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(status !== 'ALL' && { status }),
    });
    const res = await fetch(`/api/admin/articles?${params}`);
    const data = await res.json();
    setArticles(data.data?.articles ?? []);
    setTotal(data.data?.total ?? 0);
    setTotalPages(data.data?.totalPages ?? 1);
    setLoading(false);
  }, [page, debouncedSearch, status]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold">Articles</h1>
        <p className="text-neutral-400 text-sm mt-1">{total} total articles</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-[#1a1a1a] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === 'ALL' ? 'All Status' : s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl overflow-hidden">
        {loading ? (
          <LoadingSpinner className="py-16" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800">
                  {['Title', 'Author', 'Status', 'Views', 'Likes', 'Created'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-neutral-500 font-medium text-xs uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-neutral-800/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5 max-w-[240px]">
                      <span className="font-medium truncate block">{article.title}</span>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-400">
                      {article.author?.name || '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={article.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-neutral-400">
                        <Eye size={13} />
                        {formatNumber(article.views)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-neutral-400">
                        <Heart size={13} />
                        {formatNumber(article._count.likes)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-400 text-xs">
                      {formatDate(article.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      {article.status === 'PUBLISHED' && (
                        <Link
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          className="text-neutral-500 hover:text-orange-400 transition-colors"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
                {!articles.length && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-neutral-500 text-sm">
                      No articles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-neutral-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-[#1a1a1a] border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg bg-[#1a1a1a] border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
