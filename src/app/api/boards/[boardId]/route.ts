import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, getAuthSession } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: { boardId: string } }) {
  try {
    const board = await prisma.board.findUnique({
      where: { id: params.boardId },
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
        pins: { include: { user: { select: { id: true, name: true, username: true } } }, orderBy: { createdAt: 'desc' } },
        _count: { select: { pins: true, followers: true } },
      },
    });
    if (!board) return errorResponse('Board not found', 404);

    const session = await getAuthSession();
    if (board.visibility === 'PRIVATE' && board.userId !== session?.user?.id) {
      return errorResponse('Board is private', 403);
    }

    return successResponse(board);
  } catch {
    return errorResponse('Failed to fetch board', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { boardId: string } }) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return errorResponse('Unauthorized', 401);

    const board = await prisma.board.findUnique({ where: { id: params.boardId } });
    if (!board || board.userId !== session.user.id) return errorResponse('Not found', 404);

    const body = await req.json();
    const updated = await prisma.board.update({ where: { id: params.boardId }, data: body });
    return successResponse(updated);
  } catch {
    return errorResponse('Failed to update board', 500);
  }
}
export async function DELETE(req: NextRequest, { params }: { params: { boardId: string } }) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return errorResponse('Unauthorized', 401);

    const board = await prisma.board.findUnique({ where: { id: params.boardId } });
    if (!board || board.userId !== session.user.id) return errorResponse('Not found', 404);

    await prisma.board.delete({ where: { id: params.boardId } });
    return successResponse({ deleted: true });
  } catch {
    return errorResponse('Failed to delete board', 500);
  }
}