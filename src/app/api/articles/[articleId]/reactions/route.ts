import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, getAuthSession } from '@/lib/api-helpers';

const ALLOWED_EMOJIS = ['❤️', '🔥', '👏', '💡', '😂'];

export async function GET(req: NextRequest, { params }: { params: { articleId: string } }) {
  try {
    const session = await getAuthSession();

    const reactions = await prisma.reaction.groupBy({
      by: ['emoji'],
      where: { articleId: params.articleId },
      _count: { emoji: true },
    });

    const summary: Record<string, number> = {};
    for (const r of reactions) {
      summary[r.emoji] = r._count.emoji;
    }

    let userReactions: string[] = [];
    if (session) {
      const mine = await prisma.reaction.findMany({
        where: { articleId: params.articleId, userId: session.user.id },
        select: { emoji: true },
      });
      userReactions = mine.map((r) => r.emoji);
    }

    return successResponse({ summary, userReactions });
  } catch {
    return errorResponse('Failed to fetch reactions', 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: { articleId: string } }) {
  try {
    const session = await getAuthSession();
    if (!session) return errorResponse('Unauthorized', 401);

    const { emoji } = await req.json();
    if (!ALLOWED_EMOJIS.includes(emoji)) return errorResponse('Invalid emoji', 400);

    const existing = await prisma.reaction.findUnique({
      where: {
        userId_articleId_emoji: {
          userId: session.user.id,
          articleId: params.articleId,
          emoji,
        },
      },
    });

    if (existing) {
      await prisma.reaction.delete({ where: { id: existing.id } });
      return successResponse({ reacted: false, emoji });
    }

    await prisma.reaction.create({
      data: { emoji, articleId: params.articleId, userId: session.user.id },
    });

    return successResponse({ reacted: true, emoji });
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    return errorResponse('Failed to react', 500);
  }
}
