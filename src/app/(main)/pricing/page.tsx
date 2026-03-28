import Link from 'next/link';
import type { Metadata } from 'next';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, honest pricing for Indian creators. Start free, upgrade when you grow.',
  openGraph: {
    title: 'Pricing — indlish',
    description: 'Simple, honest pricing for Indian creators. Start free, upgrade when you grow.',
  },
};

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    desc: 'Perfect to get started',
    features: [
      '5 articles per month',
      '3 notebooks',
      '2 curate boards',
      'Basic profile page',
      'Reader comments',
      'Discover & Feed access',
    ],
    cta: 'Get Started Free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹99',
    period: 'per month',
    desc: 'For serious creators',
    features: [
      'Unlimited articles',
      'Unlimited notebooks',
      'Unlimited curate boards',
      'UPI tipping from readers',
      'Custom profile & bio',
      'Earnings dashboard',
      'Priority in Discover',
    ],
    cta: 'Go Pro',
    href: '/register',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Pro+',
    price: '₹199',
    period: 'per month',
    desc: 'For power creators',
    features: [
      'Everything in Pro',
      'AI writing assistant',
      'Advanced analytics',
      'Custom domain',
      'Newsletter feature',
      'Priority support',
      'Early access to features',
    ],
    cta: 'Go Pro+',
    href: '/register',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple pricing, dil se</h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          No hidden fees. No dollar confusion. Just honest pricing built for Indian creators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card relative flex flex-col ${plan.highlight ? 'border-brand-500/60 ring-1 ring-brand-500/30' : ''}`}
          >
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                {plan.badge}
              </div>
            )}
            <div className="mb-6">
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

            <Link
              href={plan.href}
              className={plan.highlight ? 'btn-primary text-center' : 'btn-secondary text-center'}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="card text-center max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-2">Student / Creator discount available</h3>
        <p className="text-text-secondary text-sm mb-4">
          Studying in India or just starting out? Drop us a mail and we&apos;ll sort you out.
        </p>
        <a href="mailto:support@indlish.com" className="text-brand-400 hover:underline text-sm">
          support@indlish.com
        </a>
      </div>
    </div>
  );
}
