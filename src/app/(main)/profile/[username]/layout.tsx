import type { Metadata } from 'next';
import prisma from '@/lib/prisma';

interface Props {
  params: { username: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: { name: true, bio: true, image: true },
  });

  if (!user) return { title: 'Profile Not Found' };

  const name = user.name ?? params.username;
  const description = user.bio
    ? user.bio.slice(0, 150)
    : `Read articles and explore boards by ${name} on indlish — India's creator platform.`;

  return {
    title: `${name} (@${params.username})`,
    description,
    alternates: { canonical: `https://indlish.com/profile/${params.username}` },
    openGraph: {
      title: `${name} on indlish`,
      description,
      url: `https://indlish.com/profile/${params.username}`,
      siteName: 'indlish',
      type: 'profile',
      images: user.image
        ? [{ url: user.image, width: 400, height: 400, alt: name }]
        : [{ url: `/api/og?title=${encodeURIComponent(name)}&subtitle=on indlish`, width: 1200, height: 630 }],
    },
    twitter: {
      card: user.image ? 'summary' : 'summary_large_image',
      title: `${name} (@${params.username}) on indlish`,
      description,
      images: user.image
        ? [user.image]
        : [`/api/og?title=${encodeURIComponent(name)}&subtitle=on indlish`],
    },
  };
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
