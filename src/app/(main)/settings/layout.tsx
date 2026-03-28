import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Update your indlish profile, social links, UPI ID, and account preferences.',
  robots: { index: false, follow: false },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
