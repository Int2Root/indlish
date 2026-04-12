import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, getAuthSession } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const type = searchParams.get('type') || 'all';
    const feed = searchParams.get('feed') || 'trending'; // 'trending' or 'following'

    const session = await getAuthSession();
    const skip = (page - 1) * limit;
    const articleInclude = {
      author: { select: { id: true, name: true, username: true, image: true } },
      tags: { include: { tag: true } },
      _count: { select: { likes: true, tips: true } },
    };
    const whereArticle: any = { status: 'PUBLISHED', author: { username: { not: 'test' } } };

    // Fetch following IDs once (only if user is logged in)
    let followingIds: string[] = [];
    if (session?.user) {
      const following = await prisma.follow.findMany({
        where: { followerId: session.user.id },
        select: { followingId: true },
      });
      followingIds = following.map(f => f.followingId);
    }

    // Build article + board queries in parallel
    const articlePromise = (async () => {
      if (type !== 'all' && type !== 'articles') return [];

      if (feed === 'following' && session?.user) {
        return prisma.article.findMany({
          where: { ...whereArticle, authorId: { in: followingIds } },
          include: articleInclude,
          orderBy: { publishedAt: 'desc' },
          take: limit,
          skip,
        });
      }

      // Trending feed — single query, no waterfall
      if (followingIds.length > 0) {
        const fromFollowing = await prisma.article.findMany({
          where: { ...whereArticle, authorId: { in: followingIds } },
          include: articleInclude,
          orderBy: { publishedAt: 'desc' },
          take: limit,
          skip,
        });
        if (fromFollowing.length >= limit) return fromFollowing;

        const trending = await prisma.article.findMany({
          where: { status: 'PUBLISHED', id: { notIn: fromFollowing.map(a => a.id) } },
          include: articleInclude,
          orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }],
          take: limit - fromFollowing.length,
        });
        return [...fromFollowing, ...trending];
      }

      return prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        include: articleInclude,
        orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }],
        take: limit,
        skip,
      });
    })();

    const boardPromise = (type === 'all' || type === 'boards')
      ? prisma.board.findMany({
          where: { visibility: 'PUBLIC' },
          include: {
            user: { select: { id: true, name: true, username: true, image: true } },
            pins: { take: 4, orderBy: { createdAt: 'desc' } },
            _count: { select: { pins: true, followers: true } },
          },
          orderBy: { updatedAt: 'desc' },
          take: type === 'boards' ? limit : 6,
          skip: type === 'boards' ? skip : 0,
        })
      : Promise.resolve([]);

    const [articles, boards] = await Promise.all([articlePromise, boardPromise]);

    return successResponse({ articles, boards, page });
  } catch {
    return errorResponse('Failed to fetch feed', 500);
  }
}