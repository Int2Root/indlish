import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';

export async function POST(req: NextRequest, { params }: { params: { articleId: string } }) {
  try {
    const session = await requireAuth();

    const existing = await prisma.articleLike.findUnique({
      where: { userId_articleId: { userId: session.user.id, articleId: params.articleId } },
    });

    if (existing) {
      await prisma.articleLike.delete({ where: { id: existing.id } });
      return successResponse({ liked: false });
    }

    await prisma.articleLike.create({
      data: { userId: session.user.id, articleId: params.articleId },
    });

    return successResponse({ liked: true });
  } catch {
    return errorResponse('Failed to toggle like', 500);
  }
}