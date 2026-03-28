import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover',
  description: "Explore trending articles, creators, and curated boards from India's best writers on indlish.",
  alternates: { canonical: 'https://indlish.com/discover' },
  openGraph: {
    title: 'Discover — indlish',
    description: 'Trending articles, top creators, and curated boards — all in one place.',
    url: 'https://indlish.com/discover',
    siteName: 'indlish',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover — indlish',
    description: 'Trending articles, top creators, and curated boards — all in one place.',
  },
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
