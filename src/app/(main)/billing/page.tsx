'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-session';
import { Receipt, ArrowUpRight, Zap } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const planLabels: Record<string, string> = {
  FREE: 'Free',
  PRO: 'Pro',
  PRO_PLUS: 'Pro+',
};

const planColors: Record<string, string> = {
  FREE: 'bg-neutral-500/20 text-neutral-400',
  PRO: 'bg-brand-500/20 text-brand-400',
  PRO_PLUS: 'bg-purple-500/20 text-purple-400',
};

export default function BillingPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) return <LoadingSpinner className="py-32" />;

  const plan = user?.plan || 'FREE';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-text-secondary mt-1 text-sm">Manage your subscription and view invoice history.</p>
      </div>

      {/* Current Plan card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Current Plan</p>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{planLabels[plan]}</h2>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${planColors[plan]}`}>
                Active
              </span>
            </div>
            {plan === 'FREE' && (
              <p className="text-text-secondary text-sm mt-1">
                Free forever · No credit card needed
              </p>
            )}
            {plan === 'PRO' && (
              <p className="text-text-secondary text-sm mt-1">
                ₹399/month
              </p>
            )}
            {plan === 'PRO_PLUS' && (
              <p className="text-text-secondary text-sm mt-1">
                ₹499/month
              </p>
            )}
          </div>
          {plan === 'FREE' && (
            <Link href="/upgrade" className="btn-primary flex items-center gap-2 text-sm">
              <Zap size={14} /> Upgrade
            </Link>
          )}
          {plan !== 'FREE' && (
            <Link href="/upgrade" className="btn-ghost flex items-center gap-2 text-sm">
              Manage plan <ArrowUpRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Invoice history */}
      <div className="card">
        <h2 className="font-semibold mb-1 flex items-center gap-2">
          <Receipt size={16} className="text-brand-400" />
          Invoice History
        </h2>
        <p className="text-text-muted text-xs mb-6">All your payment receipts in one place.</p>

        {/* Empty state — no payments exist yet */}
        <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl">
          <Receipt size={36} className="text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary text-sm">No invoices yet.</p>
          <p className="text-text-muted text-xs mt-1">
            Your billing history will appear here once you upgrade.
          </p>
          {plan === 'FREE' && (
            <Link href="/upgrade" className="btn-primary text-sm inline-flex items-center gap-2 mt-4">
              <Zap size={14} /> View Plans
            </Link>
          )}
        </div>
      </div>

      <p className="text-text-muted text-xs text-center mt-6">
        Questions about billing?{' '}
        <Link href="/support" className="text-brand-400 hover:underline">
          Contact support
        </Link>{' '}
        or email{' '}
        <a href="mailto:support@indlish.com" className="text-brand-400 hover:underline">
          support@indlish.com
        </a>
      </p>
    </div>
  );
}
