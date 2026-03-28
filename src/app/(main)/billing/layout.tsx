import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billing',
  description: 'Manage your indlish subscription and view payment history.',
  robots: { index: false, follow: false },
};

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
