import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Curate',
  description: 'Create visual Pinterest-style boards on indlish. Pin articles, images, and links to curate your favourite Indian English content.',
  alternates: { canonical: 'https://indlish.com/curate' },
  openGraph: {
    title: 'Curate Boards — indlish',
    description: 'Create visual Pinterest-style boards on indlish. Pin articles, images, and links.',
    url: 'https://indlish.com/curate',
    siteName: 'indlish',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curate Boards — indlish',
    description: 'Create visual Pinterest-style boards on indlish. Pin articles, images, and links.',
  },
};

export default function CurateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
