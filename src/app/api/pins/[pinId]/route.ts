import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';

export async function DELETE(req: NextRequest, { params }: { params: { pinId: string } }) {
  try {
    const session = await requireAuth();
    const pin = await prisma.pin.findUnique({ where: { id: params.pinId } });
    if (!pin || pin.userId !== session.user.id) return errorResponse('Not found', 404);

    await prisma.pin.delete({ where: { id: params.pinId } });
    return successResponse({ deleted: true });
  } catch {
    return errorResponse('Failed to delete pin', 500);
  }
}