import type { Metadata } from 'next';

interface Props {
  params: { tag: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);
  const title = `#${tag} Articles`;
  const description = `Explore articles tagged #${tag} on indlish — India's writing platform for Indian English creators.`;

  return {
    title,
    description,
    alternates: { canonical: `https://indlish.com/tags/${params.tag}` },
    openGraph: {
      title: `#${tag} — indlish`,
      description,
      url: `https://indlish.com/tags/${params.tag}`,
      siteName: 'indlish',
    },
    twitter: {
      card: 'summary',
      title: `#${tag} — indlish`,
      description,
    },
  };
}

export default function TagLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
