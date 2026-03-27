'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/use-session';
import { toast } from 'sonner';

const EMOJIS = ['❤️', '🔥', '👏', '💡', '😂'];

interface ReactionSummary {
  summary: Record<string, number>;
  userReactions: string[];
}

export default function ReactionBar({ articleId }: { articleId: string }) {
  const { user } = useCurrentUser();
  const [data, setData] = useState<ReactionSummary>({ summary: {}, userReactions: [] });
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/articles/${articleId}/reactions`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.data);
        setLoading(false);
      });
  }, [articleId]);

  const react = async (emoji: string) => {
    if (!user) { toast.error('Sign in to react'); return; }
    if (pending) return;
    setPending(emoji);

    const isReacted = data.userReactions.includes(emoji);
    // Optimistic update
    setData((prev) => ({
      summary: {
        ...prev.summary,
        [emoji]: (prev.summary[emoji] || 0) + (isReacted ? -1 : 1),
      },
      userReactions: isReacted
        ? prev.userReactions.filter((e) => e !== emoji)
        : [...prev.userReactions, emoji],
    }));

    try {
      const res = await fetch(`/api/articles/${articleId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji }),
      });
      const result = await res.json();
      if (!result.success) {
        // Revert on failure
        setData((prev) => ({
          summary: {
            ...prev.summary,
            [emoji]: (prev.summary[emoji] || 0) + (isReacted ? 1 : -1),
          },
          userReactions: isReacted
            ? [...prev.userReactions, emoji]
            : prev.userReactions.filter((e) => e !== emoji),
        }));
      }
    } finally {
      setPending(null);
    }
  };

  if (loading) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 my-6 py-4 border-y border-neutral-800">
      {EMOJIS.map((emoji) => {
        const count = data.summary[emoji] || 0;
        const reacted = data.userReactions.includes(emoji);
        return (
          <button
            key={emoji}
            onClick={() => react(emoji)}
            disabled={pending === emoji}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all
              ${reacted
                ? 'bg-brand-500/20 border border-brand-500/50 text-brand-300'
                : 'bg-surface-lighter border border-neutral-800 text-text-secondary hover:border-neutral-600'
              }`}
          >
            <span className="text-base leading-none">{emoji}</span>
            {count > 0 && <span className="font-medium">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
