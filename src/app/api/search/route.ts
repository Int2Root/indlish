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

    const results: any = {};

    if (type === 'all' || type === 'articles') {
      results.articles = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
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
      });
    }

    if (type === 'all' || type === 'boards') {
      results.boards = await prisma.board.findMany({
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
      });
    }

    if (type === 'all' || type === 'users') {
      results.users = await prisma.user.findMany({
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
      });
    }

    return successResponse(results);
  } catch {
    return errorResponse('Search failed', 500);
  }
}