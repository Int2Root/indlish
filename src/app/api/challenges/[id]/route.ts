import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-helpers';

// GET /api/challenges/[id] — get challenge details + leaderboard
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const challenge = await prisma.challenge.findUnique({ where: { id: params.id } });
    if (!challenge) return errorResponse('Challenge not found', 404);

    // Leaderboard: published articles tagged with this challenge's tag, sorted by reactions+comments
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        tags: { some: { tag: { slug: challenge.tagSlug } } },
      },
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        tags: { include: { tag: true } },
        _count: { select: { reactions: true, comments: true, likes: true } },
      },
      orderBy: [{ views: 'desc' }],
      take: 20,
    });

    // Sort by engagement score: reactions*2 + comments*3 + likes
    const ranked = articles
      .map((a) => ({
        ...a,
        score: a._count.reactions * 2 + a._count.comments * 3 + a._count.likes,
      }))
      .sort((a, b) => b.score - a.score);

    return successResponse({ challenge, leaderboard: ranked });
  } catch {
    return errorResponse('Failed to fetch challenge', 500);
  }
}
