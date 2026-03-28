import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Articles',
  description: 'Manage your articles on indlish — view drafts, published posts, and start writing new ones.',
  robots: { index: false, follow: false },
};

export default function WriteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
