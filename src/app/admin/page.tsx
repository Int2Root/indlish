'use client';

import { useState, useEffect } from 'react';
import { Users, FileText, Eye, MessageSquare } from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => {
        setStats(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;

  const cards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Total Articles',
      value: stats?.totalArticles ?? 0,
      icon: FileText,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Total Views',
      value: stats?.totalViews ?? 0,
      icon: Eye,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Open Tickets',
      value: stats?.openTickets ?? 0,
      icon: MessageSquare,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-neutral-400 text-sm mt-1">Platform-wide stats at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-5"
          >
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-4`}>
              <Icon className={color} size={19} />
            </div>
            <p className="text-2xl font-bold tabular-nums">{formatNumber(value)}</p>
            <p className="text-neutral-400 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-800">
          <h2 className="font-semibold text-sm">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800">
                {['Name', 'Email', 'Plan', 'Articles', 'Joined'].map((h) => (
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
              {stats?.recentUsers?.map((user: any) => (
                <tr
                  key={user.id}
                  className="border-b border-neutral-800/50 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-medium">{user.name || '—'}</span>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-400">{user.email}</td>
                  <td className="px-5 py-3.5">
                    <PlanBadge plan={user.plan} />
                  </td>
                  <td className="px-5 py-3.5 tabular-nums">{user._count.articles}</td>
                  <td className="px-5 py-3.5 text-neutral-400 text-xs">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
              {!stats?.recentUsers?.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-500 text-sm">
                    No users yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
