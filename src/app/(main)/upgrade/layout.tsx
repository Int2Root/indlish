import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upgrade Your Plan',
  description: 'Unlock unlimited writing, UPI tipping, and advanced analytics. Upgrade to indlish Pro or Pro+ — starting at ₹99/month.',
  alternates: { canonical: 'https://indlish.com/upgrade' },
  openGraph: {
    title: 'Upgrade Your Plan — indlish',
    description: 'Unlock unlimited writing, UPI tipping & analytics. Pro from ₹99/month.',
    url: 'https://indlish.com/upgrade',
    siteName: 'indlish',
  },
};

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
