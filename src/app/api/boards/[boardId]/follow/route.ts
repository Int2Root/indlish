import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';

export async function POST(req: NextRequest, { params }: { params: { boardId: string } }) {
  try {
    const session = await requireAuth();

    const existing = await prisma.boardFollow.findUnique({
      where: { userId_boardId: { userId: session.user.id, boardId: params.boardId } },
    });

    if (existing) {
      await prisma.boardFollow.delete({ where: { id: existing.id } });
      return successResponse({ followed: false });
    }

    await prisma.boardFollow.create({
      data: { userId: session.user.id, boardId: params.boardId },
    });
    return successResponse({ followed: true });
  } catch {
    return errorResponse('Failed to toggle follow', 500);
  }
}