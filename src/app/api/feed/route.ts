import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, getAuthSession } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type') || 'all';

    const session = await getAuthSession();
    const skip = (page - 1) * limit;

    let articles: any[] = [];
    let boards: any[] = [];

    if (type === 'all' || type === 'articles') {
      const whereArticle: any = { status: 'PUBLISHED', author: { username: { not: 'test' } } };

      // If logged in, prioritize followed creators
      if (session?.user) {
        const following = await prisma.follow.findMany({
          where: { followerId: session.user.id },
          select: { followingId: true },
        });
        const followingIds = following.map(f => f.followingId);

        if (followingIds.length > 0) {
          articles = await prisma.article.findMany({
            where: { ...whereArticle, authorId: { in: followingIds } },
            include: {
              author: { select: { id: true, name: true, username: true, image: true } },
              tags: { include: { tag: true } },
              _count: { select: { likes: true, tips: true } },
            },
            orderBy: { publishedAt: 'desc' },
            take: limit,
            skip,
          });
        }
      }

      // Fill with trending if not enough
      if (articles.length < limit) {
        const trending = await prisma.article.findMany({
          where: { status: 'PUBLISHED', author: { username: { not: 'test' } }, id: { notIn: articles.map(a => a.id) } },
          include: {
            author: { select: { id: true, name: true, username: true, image: true } },
            tags: { include: { tag: true } },
            _count: { select: { likes: true, tips: true } },
          },
          orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }],
          take: limit - articles.length,
          skip: articles.length > 0 ? 0 : skip,
        });
        articles = [...articles, ...trending];
      }
    }

    if (type === 'all' || type === 'boards') {
      boards = await prisma.board.findMany({
        where: { visibility: 'PUBLIC' },
        include: {
          user: { select: { id: true, name: true, username: true, image: true } },
          pins: { take: 4, orderBy: { createdAt: 'desc' } },
          _count: { select: { pins: true, followers: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: type === 'boards' ? limit : 6,
        skip: type === 'boards' ? skip : 0,
      });
    }

    return successResponse({ articles, boards, page });
  } catch {
    return errorResponse('Failed to fetch feed', 500);
  }
}