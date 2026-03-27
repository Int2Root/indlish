'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/use-session';
import { Trophy, Clock, Tag, Users, Zap, PenLine } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

function ChallengeCard({ challenge }: { challenge: any }) {
  const isActive = challenge.status === 'active' && new Date(challenge.deadline) > new Date();
  const daysLeft = Math.max(0, Math.ceil((new Date(challenge.deadline).getTime() - Date.now()) / 86400000));

  return (
    <div className="card hover:border-neutral-600 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-500/15 text-green-400' : 'bg-neutral-700 text-text-muted'}`}>
            {isActive ? 'Active' : 'Ended'}
          </div>
          {isActive && daysLeft <= 3 && (
            <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400">
              Ending soon!
            </div>
          )}
        </div>
        {challenge.prize && (
          <span className="text-xs font-medium text-brand-400 bg-brand-500/10 px-2 py-1 rounded-full">🏆 {challenge.prize}</span>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-2">{challenge.title}</h2>
      <p className="text-text-secondary text-sm mb-4 line-clamp-3">{challenge.description}</p>

      <div className="flex flex-wrap items-center gap-3 text-text-muted text-xs mb-4">
        <span className="flex items-center gap-1"><Tag size={12} />#{challenge.tagSlug}</span>
        <span className="flex items-center gap-1"><Clock size={12} />
          {isActive ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left` : `Ended ${formatDate(challenge.deadline)}`}
        </span>
      </div>

      <div className="flex gap-2">
        <Link href={`/challenges/${challenge.id}`} className="btn-ghost text-sm flex items-center gap-1.5 flex-1 justify-center">
          <Users size={14} />View Leaderboard
        </Link>
        {isActive && (
          <Link
            href={`/write?tag=${challenge.tagSlug}`}
            className="btn-primary text-sm flex items-center gap-1.5 flex-1 justify-center"
          >
            <PenLine size={14} />Participate
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useCurrentUser();

  useEffect(() => {
    fetch('/api/challenges').then(r => r.json()).then(d => {
      setChallenges(d.data || []);
      setLoading(false);
    });
  }, []);

  const active = challenges.filter(c => c.status === 'active' && new Date(c.deadline) > new Date());
  const ended = challenges.filter(c => c.status !== 'active' || new Date(c.deadline) <= new Date());

  if (loading) return <LoadingSpinner className="py-32" />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
            <Trophy className="text-brand-400" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Writing Challenges</h1>
            <p className="text-text-secondary text-sm">Compete, get feedback, win rewards. Likho, seekho, jeeto! ✍️</p>
          </div>
        </div>
      </div>

      {challenges.length === 0 ? (
        <div className="card text-center py-16">
          <Trophy className="mx-auto text-text-muted mb-3" size={40} />
          <h2 className="text-lg font-semibold mb-2">No challenges yet</h2>
          <p className="text-text-secondary text-sm">Check back soon — exciting writing challenges are coming!</p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap size={16} className="text-brand-400" /> Active Challenges
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {active.map(c => <ChallengeCard key={c.id} challenge={c} />)}
              </div>
            </div>
          )}

          {ended.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-text-secondary">
                <Clock size={16} /> Past Challenges
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ended.map(c => <ChallengeCard key={c.id} challenge={c} />)}
              </div>
            </div>
          )}
        </>
      )}

      {/* How it works */}
      <div className="mt-12 card bg-gradient-to-br from-brand-500/5 to-transparent border-brand-500/20">
        <h2 className="font-semibold mb-4">How Challenges Work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Pick a challenge', desc: 'Choose an active writing challenge that excites you.' },
            { step: '2', title: 'Write & tag', desc: `Write your article and tag it with the challenge's hashtag.` },
            { step: '3', title: 'Win rewards', desc: 'Top articles by reactions & comments win prizes and Pro upgrades.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-sm font-bold shrink-0">{step}</div>
              <div>
                <p className="font-medium text-sm">{title}</p>
                <p className="text-text-muted text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
