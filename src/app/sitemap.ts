import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

const BASE_URL = 'https://indlish.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/discover`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/challenges`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/upgrade`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/curate`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/legal/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/legal/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const [articles, users, tags] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
      take: 1000,
    }),
    prisma.user.findMany({
      where: { username: { not: null } },
      select: { username: true, updatedAt: true },
      take: 500,
    }),
    prisma.tag.findMany({
      select: { slug: true },
      take: 200,
    }),
  ]);

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a: { slug: string; updatedAt: Date }) => ({
    url: `${BASE_URL}/articles/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const profileRoutes: MetadataRoute.Sitemap = users
    .filter((u: { username: string | null; updatedAt: Date }) => u.username)
    .map((u: { username: string | null; updatedAt: Date }) => ({
      url: `${BASE_URL}/profile/${u.username}`,
      lastModified: u.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map((t: { slug: string }) => ({
    url: `${BASE_URL}/tags/${t.slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...articleRoutes, ...profileRoutes, ...tagRoutes];
}
