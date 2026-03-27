'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/use-session';
import { UserPlus, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Props {
  authorId: string;
  initialFollowing?: boolean;
  size?: 'sm' | 'md';
}

export default function FollowButton({ authorId, initialFollowing, size = 'md' }: Props) {
  const { user } = useCurrentUser();
  const [following, setFollowing] = useState(initialFollowing ?? false);
  const [loading, setLoading] = useState(initialFollowing === undefined);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (initialFollowing !== undefined) { setLoading(false); return; }
    if (!user) { setLoading(false); return; }
    fetch(`/api/users/${authorId}/follow`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setFollowing(d.data.following);
        setLoading(false);
      });
  }, [authorId, user, initialFollowing]);

  if (!user || user.id === authorId) return null;

  const toggle = async () => {
    if (pending) return;
    setPending(true);
    const prev = following;
    setFollowing(!prev);
    try {
      const res = await fetch(`/api/users/${authorId}/follow`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success(data.data.followed ? 'Following!' : 'Unfollowed');
        setFollowing(data.data.followed);
      } else {
        setFollowing(prev);
        toast.error(data.error);
      }
    } catch {
      setFollowing(prev);
    } finally {
      setPending(false);
    }
  };

  if (loading) return <div className={`${size === 'sm' ? 'h-7 w-20' : 'h-9 w-24'} rounded-lg bg-neutral-800 animate-pulse`} />;

  const cls = size === 'sm'
    ? 'flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all'
    : 'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all';

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`${cls} ${
        following
          ? 'bg-surface-lighter border border-neutral-700 text-text-secondary hover:border-red-500/50 hover:text-red-400'
          : 'bg-brand-500 hover:bg-brand-600 text-white'
      }`}
    >
      {following ? (
        <><UserCheck size={size === 'sm' ? 12 : 14} /> Following</>
      ) : (
        <><UserPlus size={size === 'sm' ? 12 : 14} /> Follow</>
      )}
    </button>
  );
}
