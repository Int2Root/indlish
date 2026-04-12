import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const type = searchParams.get('type') || 'all';

    if (!q || q.length < 2) {
      return errorResponse('Query must be at least 2 characters', 400);
    }

    // Run all search queries in parallel instead of sequentially
    const queries: Promise<any>[] = [];
    const queryKeys: string[] = [];

    if (type === 'all' || type === 'articles') {
      queryKeys.push('articles');
      queries.push(prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          author: { username: { not: 'test' } },
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
          ],
        },
        include: {
          author: { select: { id: true, name: true, username: true, image: true } },
          tags: { include: { tag: true } },
          _count: { select: { likes: true } },
        },
        take: 20,
        orderBy: { views: 'desc' },
      }));
    }

    if (type === 'all' || type === 'boards') {
      queryKeys.push('boards');
      queries.push(prisma.board.findMany({
        where: {
          visibility: 'PUBLIC',
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        include: {
          user: { select: { id: true, name: true, username: true, image: true } },
          _count: { select: { pins: true, followers: true } },
        },
        take: 20,
      }));
    }

    if (type === 'all' || type === 'users') {
      queryKeys.push('users');
      queries.push(prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { username: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true, name: true, username: true, image: true, bio: true,
          _count: { select: { articles: true, followers: true } },
        },
        take: 20,
      }));
    }

    const queryResults = await Promise.all(queries);
    const results: any = {};
    queryKeys.forEach((key, i) => { results[key] = queryResults[i]; });

    return successResponse(results);
  } catch {
    return errorResponse('Search failed', 500);
  }
}