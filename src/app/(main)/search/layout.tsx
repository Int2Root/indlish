import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search articles, creators, and boards on indlish — India\'s writing platform for Indian English.',
  alternates: { canonical: 'https://indlish.com/search' },
  robots: { index: false, follow: true },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
