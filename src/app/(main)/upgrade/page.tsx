'use client';

import { useCurrentUser } from '@/hooks/use-session';
import { toast } from 'sonner';
import { Check, Zap, Star, Crown } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    id: 'FREE' as const,
    name: 'Free',
    price: '₹0',
    period: 'forever',
    desc: 'Perfect to get started',
    icon: Star,
    features: [
      '5 articles per month',
      '3 notebooks',
      '2 curate boards',
      'Basic profile page',
      'Reader comments',
      'Discover & Feed access',
    ],
    cta: 'Current Plan',
    highlight: false,
  },
  {
    id: 'PRO' as const,
    name: 'Pro',
    price: '₹99',
    period: 'per month',
    desc: 'For serious creators',
    icon: Zap,
    features: [
      'Unlimited articles',
      'Unlimited notebooks',
      'Unlimited curate boards',
      'UPI tipping from readers',
      'Earnings dashboard',
      'Priority in Discover',
      'Custom profile URL',
    ],
    cta: 'Upgrade to Pro',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    id: 'PRO_PLUS' as const,
    name: 'Pro+',
    price: '₹199',
    period: 'per month',
    desc: 'For power creators',
    icon: Crown,
    features: [
      'Everything in Pro',
      'AI writing assistant',
      'Advanced analytics',
      'Custom domain',
      'Newsletter feature',
      'Priority support',
      'Early access to features',
    ],
    cta: 'Upgrade to Pro+',
    highlight: false,
  },
];

export default function UpgradePage() {
  const { user } = useCurrentUser();
  const currentPlan = user?.plan || 'FREE';

  function handleUpgradeClick(planName: string) {
    toast.info(`${planName} plan — coming soon! We'll notify you when payments go live.`);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upgrade your plan</h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          No hidden fees. No dollar confusion. Honest pricing for Indian creators.
        </p>
        {currentPlan !== 'FREE' && (
          <div className="mt-4 inline-flex items-center gap-2 bg-green-500/10 text-green-400 text-sm px-4 py-2 rounded-full">
            <Check size={14} />
            You&apos;re on the <span className="font-semibold">{currentPlan === 'PRO_PLUS' ? 'Pro+' : 'Pro'}</span> plan
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const Icon = plan.icon;

          return (
            <div
              key={plan.id}
              className={`card relative flex flex-col ${
                plan.highlight
                  ? 'border-brand-500/60 ring-1 ring-brand-500/30 bg-gradient-to-b from-brand-500/5 to-transparent'
                  : ''
              } ${isCurrentPlan ? 'border-green-500/40' : ''}`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  plan.highlight ? 'bg-brand-500/20' : 'bg-surface-lighter'
                }`}>
                  <Icon size={20} className={plan.highlight ? 'text-brand-400' : 'text-text-secondary'} />
                </div>
                <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                <p className="text-text-muted text-sm mb-3">{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-text-muted text-sm">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check size={15} className="text-brand-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20 cursor-default"
                >
                  Current Plan
                </button>
              ) : plan.id === 'FREE' ? (
                <Link href="/feed" className="btn-ghost text-center text-sm">
                  Continue Free
                </Link>
              ) : (
                <button
                  onClick={() => handleUpgradeClick(plan.name)}
                  className={plan.highlight ? 'btn-primary text-sm w-full' : 'btn-secondary text-sm w-full'}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="card text-center max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-2">Student or just starting out?</h3>
        <p className="text-text-secondary text-sm mb-4">
          Drop us a mail and we&apos;ll sort you out with a special discount.
        </p>
        <a href="mailto:support@indlish.com" className="text-brand-400 hover:underline text-sm">
          support@indlish.com
        </a>
      </div>
    </div>
  );
}
