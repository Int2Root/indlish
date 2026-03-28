import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import ArticleReader from '@/components/articles/ArticleReader';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, status: 'PUBLISHED' },
    select: {
      title: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
  });

  if (!article) return { title: 'Article Not Found' };

  const description =
    article.excerpt && !article.excerpt.startsWith('{')
      ? article.excerpt.slice(0, 200)
      : `Read "${article.title}" on indlish`;

  const ogImage = article.coverImage
    ? [{ url: article.coverImage, width: 1200, height: 630 }]
    : [{ url: `/api/og?title=${encodeURIComponent(article.title)}&subtitle=${encodeURIComponent(`by ${article.author.name ?? 'indlish creator'}`)}`, width: 1200, height: 630 }];

  return {
    title: article.title,
    description,
    alternates: { canonical: `https://indlish.com/articles/${params.slug}` },
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      url: `https://indlish.com/articles/${params.slug}`,
      siteName: 'indlish',
      images: ogImage,
      ...(article.publishedAt ? { publishedTime: article.publishedAt.toISOString() } : {}),
      authors: article.author.name ? [article.author.name] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [ogImage[0].url],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, status: 'PUBLISHED' },
    include: {
      author: { select: { id: true, name: true, username: true, image: true, upiId: true } },
      tags: { include: { tag: true } },
      _count: { select: { likes: true } },
    },
  });

  if (!article) notFound();

  // Increment views
  await prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } },
  });

  // Serialize Date objects before passing to client component
  const serialized = {
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: undefined,
    publishedAt: article.publishedAt?.toISOString() ?? null,
  };

  const description =
    article.excerpt && !article.excerpt.startsWith('{')
      ? article.excerpt.slice(0, 200)
      : `Read "${article.title}" on indlish`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description,
    url: `https://indlish.com/articles/${params.slug}`,
    ...(article.coverImage ? { image: article.coverImage } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt.toISOString() } : {}),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author.name ?? 'indlish creator',
      url: `https://indlish.com/profile/${article.author.username}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'indlish',
      url: 'https://indlish.com',
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleReader article={serialized as any} />
    </div>
  );
}
