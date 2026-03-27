'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Trophy, Clock, Medal, Eye, Heart, MessageCircle, Zap } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { formatDate, formatNumber } from '@/lib/utils';

export default function ChallengePage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<{ challenge: any; leaderboard: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/challenges/${id}`).then(r => r.json()).then(d => {
      setData(d.data || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner className="py-32" />;
  if (!data) return <div className="text-center py-32 text-text-muted">Challenge not found.</div>;

  const { challenge, leaderboard } = data;
  const isActive = challenge.status === 'active' && new Date(challenge.deadline) > new Date();
  const daysLeft = Math.max(0, Math.ceil((new Date(challenge.deadline).getTime() - Date.now()) / 86400000));

  const medalColors = ['text-yellow-400', 'text-gray-300', 'text-orange-400'];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="card mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${isActive ? 'bg-green-500/15 text-green-400' : 'bg-neutral-700 text-text-muted'}`}>
              <Zap size={10} />{isActive ? 'Active' : 'Ended'}
            </div>
            <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
            <p className="text-text-secondary">{challenge.description}</p>
          </div>
          {challenge.prize && (
            <div className="shrink-0 text-center">
              <div className="text-3xl mb-1">🏆</div>
              <p className="text-xs font-medium text-brand-400">{challenge.prize}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-neutral-800 text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {isActive ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining` : `Ended ${formatDate(challenge.deadline)}`}
          </span>
          <span className="flex items-center gap-1.5">
            <Trophy size={14} />#{challenge.tagSlug}
          </span>
        </div>

        {isActive && (
          <Link href={`/write?tag=${challenge.tagSlug}`} className="btn-primary mt-4 inline-flex items-center gap-2">
            Write for this challenge
          </Link>
        )}
      </div>

      {/* Leaderboard */}
      <div className="card">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Medal size={16} className="text-brand-400" /> Leaderboard
          <span className="text-text-muted text-xs font-normal">({leaderboard.length} entries)</span>
        </h2>

        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-secondary text-sm">No entries yet. Be the first to participate!</p>
            {isActive && (
              <Link href={`/write?tag=${challenge.tagSlug}`} className="btn-primary mt-3 text-sm inline-flex">Start Writing</Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((article, i) => (
              <div key={article.id} className={`flex items-start gap-3 p-3 rounded-lg ${i < 3 ? 'bg-surface-lighter' : ''}`}>
                <div className="shrink-0 w-8 text-center">
                  {i < 3 ? (
                    <Medal size={18} className={medalColors[i]} />
                  ) : (
                    <span className="text-text-muted text-sm font-mono">#{i + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/articles/${article.slug}`} className="font-medium text-sm hover:text-brand-400 transition-colors line-clamp-1">
                    {article.title}
                  </Link>
                  <div className="flex items-center gap-1.5 mt-1">
                    {article.author.image ? (
                      <img src={article.author.image} alt="" className="w-4 h-4 rounded-full" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center text-[10px]">{article.author.name?.[0]}</div>
                    )}
                    <Link href={`/profile/${article.author.username}`} className="text-xs text-text-muted hover:text-brand-400">
                      {article.author.name}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-text-muted text-xs shrink-0">
                  <span className="flex items-center gap-1"><Eye size={12} />{formatNumber(article.views)}</span>
                  <span className="flex items-center gap-1"><Heart size={12} />{formatNumber(article._count.likes)}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={12} />{formatNumber(article._count.comments)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
