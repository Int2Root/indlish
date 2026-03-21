import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';
import { pinSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const validated = pinSchema.parse(body);

    const board = await prisma.board.findUnique({ where: { id: validated.boardId } });
    if (!board || board.userId !== session.user.id) {
      return errorResponse('Board not found or access denied', 404);
    }

    const pin = await prisma.pin.create({
      data: { ...validated, userId: session.user.id },
    });
    return successResponse(pin, 201);
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    return errorResponse('Failed to create pin', 500);
  }
}