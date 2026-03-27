import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for Indian creators. Start free, upgrade when you grow.',
};

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: '',
    description: 'Perfect for getting started',
    features: [
      '5 articles per month',
      '3 notebooks',
      '2 boards',
      'Basic profile',
      'Public articles',
      'Community feed',
    ],
    cta: 'Get Started Free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹99',
    period: '/mo',
    description: 'For serious creators',
    features: [
      'Unlimited articles',
      'Unlimited notebooks',
      'Unlimited boards',
      'UPI tipping enabled',
      'Custom profile',
      'Priority in discover',
      'Everything in Free',
    ],
    cta: 'Go Pro',
    href: '/register',
    highlight: true,
  },
  {
    name: 'Pro+',
    price: '₹199',
    period: '/mo',
    description: 'For power creators',
    features: [
      'Everything in Pro',
      'AI writing assistant',
      'Advanced analytics',
      'Custom domain',
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
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-4">Simple pricing, powerful features</h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          Start for free, upgrade as you grow. No hidden fees, no credit card required to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card relative flex flex-col ${plan.highlight ? 'border-brand-500/60' : ''}`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
              <p className="text-text-muted text-sm mb-3">{plan.description}</p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-text-muted text-sm mb-1">{plan.period}</span>}
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                  <Check size={15} className="text-brand-400 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`block text-center py-2.5 px-4 rounded-lg font-medium transition-colors ${
                plan.highlight
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="card text-center max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-2">All plans include</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-sm text-text-secondary">
          {[
            'Dark mode editor',
            'Mobile-friendly',
            'Tipping via UPI',
            'Tag-based discovery',
            'Visual boards',
            'Note-taking notebooks',
          ].map((f) => (
            <div key={f} className="flex items-center gap-1.5">
              <Check size={13} className="text-brand-400 flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-text-muted text-sm mt-10">
        Questions?{' '}
        <a href="mailto:support@indlish.com" className="text-brand-400 hover:text-brand-300">
          Contact us
        </a>
      </p>
    </div>
  );
}
