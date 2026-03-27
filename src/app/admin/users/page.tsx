'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useDebounce } from '@/hooks/use-debounce';

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    FREE: 'bg-neutral-700/60 text-neutral-300',
    PRO: 'bg-blue-500/20 text-blue-400',
    PRO_PLUS: 'bg-orange-500/20 text-orange-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[plan] ?? styles.FREE}`}>
      {plan === 'PRO_PLUS' ? 'Pro+' : plan.charAt(0) + plan.slice(1).toLowerCase()}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        role === 'CREATOR'
          ? 'bg-purple-500/20 text-purple-400'
          : 'bg-neutral-700/60 text-neutral-400'
      }`}
    >
      {role.charAt(0) + role.slice(1).toLowerCase()}
    </span>
  );
}

const PLAN_OPTIONS = ['ALL', 'FREE', 'PRO', 'PRO_PLUS'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [plan, setPlan] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 350);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(plan !== 'ALL' && { plan }),
    });
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.data?.users ?? []);
    setTotal(data.data?.total ?? 0);
    setTotalPages(data.data?.totalPages ?? 1);
    setLoading(false);
  }, [page, debouncedSearch, plan]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, plan]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-neutral-400 text-sm mt-1">{total} total users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="bg-[#1a1a1a] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 cursor-pointer"
        >
          {PLAN_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p === 'ALL' ? 'All Plans' : p === 'PRO_PLUS' ? 'Pro+' : p.charAt(0) + p.slice(1).toLowerCase()}
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
                  {['Name', 'Email', 'Plan', 'Role', 'Articles', 'Joined'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-neutral-500 font-medium text-xs uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-neutral-800/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold shrink-0">
                            {(user.name || user.email || '?')[0].toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium truncate max-w-[140px]">
                          {user.name || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-400 max-w-[200px] truncate">
                      {user.email}
                    </td>
                    <td className="px-5 py-3.5">
                      <PlanBadge plan={user.plan} />
                    </td>
                    <td className="px-5 py-3.5">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-5 py-3.5 tabular-nums">{user._count.articles}</td>
                    <td className="px-5 py-3.5 text-neutral-400 text-xs">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
                {!users.length && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-neutral-500 text-sm">
                      No users found
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
