import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Writing Challenges',
  description: 'Join weekly writing challenges on indlish. Compete with Indian creators, get featured, and win rewards. Likho, seekho, jeeto!',
  alternates: { canonical: 'https://indlish.com/challenges' },
  openGraph: {
    title: 'Writing Challenges — indlish',
    description: 'Join weekly writing challenges on indlish. Compete with Indian creators, get featured, and win rewards.',
    url: 'https://indlish.com/challenges',
    siteName: 'indlish',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Writing Challenges — indlish',
    description: 'Join weekly writing challenges on indlish. Compete with Indian creators, get featured, and win rewards.',
  },
};

export default function ChallengesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
