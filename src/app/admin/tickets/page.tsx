'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    LOW: 'bg-neutral-700/60 text-neutral-400',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400',
    HIGH: 'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[priority] ?? styles.MEDIUM}`}>
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OPEN: 'bg-blue-500/20 text-blue-400',
    IN_PROGRESS: 'bg-orange-500/20 text-orange-400',
    RESOLVED: 'bg-green-500/20 text-green-400',
  };
  const labels: Record<string, string> = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? styles.OPEN}`}>
      {labels[status] ?? status}
    </span>
  );
}

const STATUS_OPTIONS = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'];
const PRIORITY_OPTIONS = ['ALL', 'LOW', 'MEDIUM', 'HIGH'];

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      ...(status !== 'ALL' && { status }),
      ...(priority !== 'ALL' && { priority }),
    });
    const res = await fetch(`/api/admin/tickets?${params}`);
    const data = await res.json();
    setTickets(data.data?.tickets ?? []);
    setTotal(data.data?.total ?? 0);
    setTotalPages(data.data?.totalPages ?? 1);
    setLoading(false);
  }, [page, status, priority]);

  useEffect(() => {
    setPage(1);
  }, [status, priority]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <p className="text-neutral-400 text-sm mt-1">{total} total tickets</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-[#1a1a1a] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === 'ALL' ? 'All Status' : s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="bg-[#1a1a1a] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 cursor-pointer"
        >
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p === 'ALL' ? 'All Priority' : p.charAt(0) + p.slice(1).toLowerCase()}
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
                  {['Subject', 'User', 'Priority', 'Status', 'Messages', 'Created'].map((h) => (
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
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-neutral-800/50 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-5 py-3.5 max-w-[220px]">
                      <span className="font-medium truncate block">{ticket.subject}</span>
                      <span className="text-neutral-500 text-xs">{ticket.email}</span>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-400">
                      {ticket.user?.name || ticket.email.split('@')[0]}
                    </td>
                    <td className="px-5 py-3.5">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-5 py-3.5 text-neutral-400 tabular-nums">
                      {ticket._count.messages}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-400 text-xs">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/tickets/${ticket.id}`}
                        className="text-neutral-500 hover:text-orange-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
                {!tickets.length && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-neutral-500 text-sm">
                      No tickets yet
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
