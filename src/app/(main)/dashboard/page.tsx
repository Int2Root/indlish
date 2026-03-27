'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-session';
import {
  FileText, Eye, Heart, IndianRupee, TrendingUp, PenLine,
  MessageCircle, Users, Mail, BarChart2, BookOpen, LayoutGrid
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatNumber, formatCurrency, formatDate } from '@/lib/utils';

function MiniChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const last7 = data.slice(-14); // show last 14 days

  return (
    <div className="flex items-end gap-0.5 h-16 w-full">
      {last7.map((d, i) => {
        const height = Math.round((d.count / max) * 100);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className="w-full bg-brand-500/60 hover:bg-brand-500 rounded-sm transition-colors"
              style={{ height: `${Math.max(height, d.count > 0 ? 8 : 2)}%` }}
              title={`${d.date}: ${d.count} views`}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [tips, setTips] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/login'); return; }
    if (user) {
      Promise.all([
        fetch('/api/analytics').then((r) => r.json()),
        fetch('/api/tips?type=received').then((r) => r.json()),
      ]).then(([analyticsData, tipsData]) => {
        setAnalytics(analyticsData.data || null);
        setTips(tipsData.data || null);
        setLoading(false);
      });
    }
  }, [user, authLoading, isAuthenticated, router]);

  if (loading || authLoading) return <LoadingSpinner className="py-32" />;

  const statCards = [
    { label: 'Total Views', value: formatNumber(analytics?.totalViews || 0), icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Likes', value: formatNumber(analytics?.totalLikes || 0), icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Comments', value: formatNumber(analytics?.totalComments || 0), icon: MessageCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Followers', value: formatNumber(analytics?.followerCount || 0), icon: Users, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Subscribers', value: formatNumber(analytics?.subscriberCount || 0), icon: Mail, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Tips Earned', value: formatCurrency(tips?.totalEarnings || 0), icon: IndianRupee, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-text-secondary mt-1">
            Welcome back, {user?.name?.split(' ')[0] || 'Creator'}!
            {' '}
            <span className="text-text-muted text-sm">
              {analytics?.publishedCount || 0} published · {analytics?.draftCount || 0} draft{analytics?.draftCount !== 1 ? 's' : ''}
            </span>
          </p>
        </div>
        <Link href="/write" className="btn-primary flex items-center gap-2">
          <PenLine size={16} /> New Article
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card text-center">
            <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <Icon className={color} size={18} />
            </div>
            <p className="text-xl font-bold">{value}</p>
            <p className="text-text-muted text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Views chart + top articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Views chart */}
        <div className="card">
          <h2 className="font-semibold mb-1 flex items-center gap-2">
            <BarChart2 size={16} className="text-brand-400" />
            Views (Last 14 days)
          </h2>
          <p className="text-text-muted text-xs mb-4">Daily article views from readers</p>
          {analytics?.viewsChart ? (
            <MiniChart data={analytics.viewsChart} />
          ) : (
            <div className="h-16 bg-surface-lighter rounded animate-pulse" />
          )}
          <div className="flex justify-between text-text-muted text-xs mt-2">
            <span>{analytics?.viewsChart?.[analytics.viewsChart.length - 14]?.date?.slice(5)}</span>
            <span>Today</span>
          </div>
        </div>

        {/* Top articles */}
        <div className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-brand-400" />
            Top Articles
          </h2>
          {analytics?.topArticles?.length > 0 ? (
            <div className="space-y-3">
              {analytics.topArticles.map((a: any, i: number) => (
                <Link
                  key={a.id}
                  href={`/write/${a.slug}`}
                  className="flex items-center gap-3 py-2 border-b border-neutral-800 last:border-0 hover:text-brand-400 group"
                >
                  <span className="text-text-muted text-sm font-mono w-5 shrink-0">#{i + 1}</span>
                  <span className="text-sm truncate flex-1 group-hover:text-brand-400 transition-colors">{a.title}</span>
                  <span className="text-text-muted text-xs flex items-center gap-1 shrink-0">
                    <Eye size={11} />{a.views}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm">No published articles yet.</p>
          )}
        </div>
      </div>

      {/* Recent tips + Quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <IndianRupee size={16} className="text-brand-400" />
            Recent Tips
          </h2>
          {tips?.tips?.length > 0 ? (
            <div className="space-y-3">
              {tips.tips.slice(0, 5).map((tip: any) => (
                <div key={tip.id} className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0">
                  <div className="flex items-center gap-2">
                    {tip.fromUser?.image ? (
                      <img src={tip.fromUser.image} alt="" className="w-7 h-7 rounded-full" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold">
                        {tip.fromUser?.name?.[0]}
                      </div>
                    )}
                    <span className="text-sm">{tip.fromUser?.name}</span>
                  </div>
                  <span className="text-green-400 font-medium text-sm">{formatCurrency(tip.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm">No tips received yet. Keep creating!</p>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Quick Links</h2>
          <div className="space-y-2">
            <Link href="/write" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-lighter transition-colors group">
              <FileText size={16} className="text-text-muted group-hover:text-brand-400" />
              <span className="text-sm">All Articles</span>
            </Link>
            <Link href="/organize" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-lighter transition-colors group">
              <BookOpen size={16} className="text-text-muted group-hover:text-brand-400" />
              <span className="text-sm">Notebooks</span>
            </Link>
            <Link href="/curate" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-lighter transition-colors group">
              <LayoutGrid size={16} className="text-text-muted group-hover:text-brand-400" />
              <span className="text-sm">Boards</span>
            </Link>
            <Link href={`/profile/${user?.username}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-lighter transition-colors group">
              <Users size={16} className="text-text-muted group-hover:text-brand-400" />
              <span className="text-sm">Public Profile</span>
            </Link>
            <Link href="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-lighter transition-colors group">
              <Mail size={16} className="text-text-muted group-hover:text-brand-400" />
              <span className="text-sm">Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Plan upgrade banner */}
      {user?.plan === 'FREE' && (
        <div className="card bg-gradient-to-r from-brand-500/10 to-transparent border-brand-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Upgrade to Pro</h3>
              <p className="text-text-secondary text-sm mt-1">
                Unlock unlimited articles, UPI tipping, and advanced analytics.
              </p>
            </div>
            <Link href="/pricing" className="btn-primary text-sm">Upgrade</Link>
          </div>
        </div>
      )}
    </div>
  );
}
