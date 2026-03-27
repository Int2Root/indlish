'use client';

import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  authorId: string;
  authorName: string | null;
}

export default function SubscribeWidget({ authorId, authorName }: Props) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    if (!email || !email.includes('@')) { toast.error('Enter a valid email'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, authorId }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        toast.success(data.data.alreadySubscribed ? "You're already subscribed!" : 'Subscribed!');
      } else {
        toast.error(data.error || 'Failed to subscribe');
      }
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
        <Check size={18} className="text-green-400 shrink-0" />
        <p className="text-sm text-green-400">
          You&apos;re subscribed to {authorName || 'this creator'}. We&apos;ll notify you of new posts!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-surface-lighter rounded-xl border border-neutral-800">
      <div className="flex items-center gap-2 mb-2">
        <Mail size={16} className="text-brand-400" />
        <h3 className="font-semibold text-sm">Subscribe to {authorName || 'this creator'}</h3>
      </div>
      <p className="text-text-muted text-xs mb-4">Get notified when they publish new stories.</p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && subscribe()}
          placeholder="your@email.com"
          className="input-field text-sm flex-1"
        />
        <button
          onClick={subscribe}
          disabled={loading}
          className="btn-primary text-sm px-4 whitespace-nowrap"
        >
          {loading ? '...' : 'Subscribe'}
        </button>
      </div>
    </div>
  );
}
