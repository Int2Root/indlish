'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-session';
import { FileText, Eye, Heart, IndianRupee, BookOpen, LayoutGrid, TrendingUp, PenLine } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatNumber, formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/login'); return; }
    if (user) {
      Promise.all([
        fetch(`/api/articles?authorId=${user.id}`).then(r => r.json()),
        fetch('/api/notebooks').then(r => r.json()),
        fetch(`/api/boards?userId=${user.id}`).then(r => r.json()),
        fetch('/api/tips?type=received').then(r => r.json()),
      ]).then(([articlesData, notebooksData, boardsData, tipsData]) => {
        const articles = articlesData.data?.articles || [];
        setStats({
          totalArticles: articlesData.data?.total || 0,
          totalViews: articles.reduce((sum: number, a: any) => sum + a.views, 0),
          totalLikes: articles.reduce((sum: number, a: any) => sum + (a._count?.likes || 0), 0),
          totalNotebooks: (notebooksData.data || []).length,
          totalBoards: boardsData.data?.total || 0,
          totalEarnings: tipsData.data?.totalEarnings || 0,
          recentArticles: articles.slice(0, 5),
          recentTips: (tipsData.data?.tips || []).slice(0, 5),
        });
        setLoading(false);
      });
    }
  }, [user, authLoading, isAuthenticated, router]);

  if (loading || authLoading) return <LoadingSpinner className="py-32" />;

  const statCards = [
    { label: 'Articles', value: formatNumber(stats?.totalArticles || 0), icon: FileText, color: 'text-blue-400' },
    { label: 'Total Views', value: formatNumber(stats?.totalViews || 0), icon: Eye, color: 'text-green-400' },
    { label: 'Total Likes', value: formatNumber(stats?.totalLikes || 0), icon: Heart, color: 'text-pink-400' },
    { label: 'Tips Earned', value: formatCurrency(stats?.totalEarnings || 0), icon: IndianRupee, color: 'text-yellow-400' },
    { label: 'Notebooks', value: stats?.totalNotebooks || 0, icon: BookOpen, color: 'text-purple-400' },
    { label: 'Boards', value: stats?.totalBoards || 0, icon: LayoutGrid, color: 'text-orange-400' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-text-secondary mt-1">Welcome back, {user?.name || 'Creator'}! Here's your overview.</p>
        </div>
        <Link href="/write" className="btn-primary flex items-center gap-2"><PenLine size={16} />New Article</Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card text-center">
            <Icon className={`mx-auto mb-2 ${color}`} size={20} />
            <p className="text-xl font-bold">{value}</p>
            <p className="text-text-muted text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp size={16} />Recent Articles</h2>
          {stats?.recentArticles?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentArticles.map((a: any) => (
                <Link key={a.id} href={`/write/${a.slug}`} className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0 hover:text-brand-400">
                  <span className="text-sm truncate mr-4">{a.title}</span>
                  <span className="text-text-muted text-xs flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1"><Eye size={12} />{a.views}</span>
                    <span className={a.status === 'PUBLISHED' ? 'text-green-400' : 'text-yellow-400'}>{a.status}</span>
                  </span>
                </Link>
              ))}
            </div>
          ) : <p className="text-text-muted text-sm">No articles yet. Start writing!</p>}
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><IndianRupee size={16} />Recent Tips</h2>
          {stats?.recentTips?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentTips.map((tip: any) => (
                <div key={tip.id} className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0">
                  <div className="flex items-center gap-2">
                    {tip.fromUser?.image ? <img src={tip.fromUser.image} alt="" className="w-6 h-6 rounded-full" /> : <div className="w-6 h-6 rounded-full bg-brand-500" />}
                    <span className="text-sm">{tip.fromUser?.name}</span>
                  </div>
                  <span className="text-green-400 font-medium text-sm">{formatCurrency(tip.amount)}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-text-muted text-sm">No tips received yet. Keep creating!</p>}
        </div>
      </div>

      <div className="mt-8 card bg-gradient-to-r from-brand-500/10 to-transparent border-brand-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Current Plan: <span className="text-brand-400">{user?.plan || 'FREE'}</span></h3>
            <p className="text-text-secondary text-sm mt-1">
              {user?.plan === 'FREE' ? 'Upgrade to Pro for unlimited articles, notebooks, and UPI tipping.' : 'You\'re on a premium plan. Enjoy all features!'}
            </p>
          </div>
          {user?.plan === 'FREE' && <Link href="/settings" className="btn-primary text-sm">Upgrade to Pro</Link>}
        </div>
      </div>
    </div>
  );
}