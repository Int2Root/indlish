'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-session';
import { toast } from 'sonner';
import { Copy, Check, Gift, Users, Share2, MessageCircle, Trophy } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

export default function ReferralPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const router = useRouter();
  const [data, setData] = useState<{ referralCode: string; referralCount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/login'); return; }
    if (user) {
      fetch('/api/referral').then(r => r.json()).then(d => {
        if (d.success) setData(d.data);
        setLoading(false);
      });
    }
  }, [user, authLoading, isAuthenticated, router]);

  if (loading || authLoading) return <LoadingSpinner className="py-32" />;

  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/register?ref=${data?.referralCode}`
    : `https://indlish.com/register?ref=${data?.referralCode}`;

  const whatsappText = encodeURIComponent(
    `Hey! Join me on indlish — India's coolest writing platform. Sign up with my link and we both get perks! 🚀\n${referralLink}`
  );

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const tiers = [
    { count: 1, reward: 'Pro Badge', icon: '🏅', achieved: (data?.referralCount || 0) >= 1 },
    { count: 5, reward: '1 Month Pro Free', icon: '⭐', achieved: (data?.referralCount || 0) >= 5 },
    { count: 10, reward: '3 Months Pro Free', icon: '🏆', achieved: (data?.referralCount || 0) >= 10 },
    { count: 25, reward: 'Lifetime Pro', icon: '👑', achieved: (data?.referralCount || 0) >= 25 },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Gift className="text-brand-400" size={32} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Invite Friends, Earn Pro</h1>
        <p className="text-text-secondary">Share indlish with your friends and unlock exclusive rewards. Har referral pe prize! 🎁</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-3xl font-bold text-brand-400">{data?.referralCount || 0}</p>
          <p className="text-text-muted text-sm mt-1">Friends Invited</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-400">
            {tiers.filter(t => t.achieved).length > 0 ? tiers.filter(t => t.achieved).slice(-1)[0].reward : 'None yet'}
          </p>
          <p className="text-text-muted text-sm mt-1">Current Reward</p>
        </div>
      </div>

      {/* Referral link */}
      <div className="card mb-6">
        <h2 className="font-semibold mb-3 flex items-center gap-2"><Share2 size={16} className="text-brand-400" />Your Referral Link</h2>
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-surface-lighter border border-neutral-700 rounded-lg px-3 py-2 text-sm text-text-secondary truncate font-mono">
            {referralLink}
          </div>
          <button onClick={copyLink} className="btn-primary flex items-center gap-2 shrink-0">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="flex gap-3">
          <a
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
            </svg>
            Share on WhatsApp
          </a>
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(`Just joined indlish — India's coolest writing platform! Join me with my referral link: ${referralLink} 🚀 #indlish #writing`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-surface-lighter hover:bg-neutral-700 text-text-primary rounded-lg px-4 py-2.5 text-sm font-medium transition-colors border border-neutral-700"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>
        </div>
      </div>

      {/* Reward tiers */}
      <div className="card mb-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Trophy size={16} className="text-brand-400" />Reward Tiers</h2>
        <div className="space-y-3">
          {tiers.map((tier) => (
            <div key={tier.count} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${tier.achieved ? 'border-brand-500/40 bg-brand-500/5' : 'border-neutral-800'}`}>
              <span className="text-2xl">{tier.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-sm">{tier.reward}</p>
                <p className="text-text-muted text-xs">{tier.count} friends invited</p>
              </div>
              {tier.achieved ? (
                <span className="text-xs bg-brand-500/20 text-brand-400 px-2 py-1 rounded-full font-medium">Unlocked!</span>
              ) : (
                <span className="text-xs text-text-muted">{Math.max(0, tier.count - (data?.referralCount || 0))} more</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp community CTA */}
      <div className="card bg-gradient-to-r from-green-500/10 to-transparent border-green-500/20">
        <div className="flex items-start gap-3">
          <MessageCircle className="text-green-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold">Join the indlish WhatsApp Community</h3>
            <p className="text-text-secondary text-sm mt-1">Connect with 1000+ Indian creators. Get writing tips, feedback, and collab opportunities.</p>
            <a
              href="https://wa.me/+919999999999?text=Hi%2C%20I%27d%20like%20to%20join%20the%20indlish%20WhatsApp%20community!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
              </svg>
              Join Community
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
