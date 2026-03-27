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

  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      ...(article.coverImage ? { images: [{ url: article.coverImage }] } : {}),
      ...(article.publishedAt ? { publishedTime: article.publishedAt.toISOString() } : {}),
    },
    twitter: {
      card: article.coverImage ? 'summary_large_image' : 'summary',
      title: article.title,
      description,
      ...(article.coverImage ? { images: [article.coverImage] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, status: 'PUBLISHED' },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <ArticleReader article={serialized as any} />
    </div>
  );
}
