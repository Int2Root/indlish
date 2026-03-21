import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: { notebookId: string } }) {
  try {
    const session = await requireAuth();
    const notebook = await prisma.notebook.findFirst({
      where: { id: params.notebookId, userId: session.user.id },
      include: { notes: { orderBy: { updatedAt: 'desc' } }, _count: { select: { notes: true } } },
    });
    if (!notebook) return errorResponse('Notebook not found', 404);
    return successResponse(notebook);
  } catch {
    return errorResponse('Unauthorized', 401);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { notebookId: string } }) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const notebook = await prisma.notebook.findFirst({
      where: { id: params.notebookId, userId: session.user.id },
    });
    if (!notebook) return errorResponse('Notebook not found', 404);

    const updated = await prisma.notebook.update({
      where: { id: params.notebookId },
      data: body,
    });
    return successResponse(updated);
  } catch {
    return errorResponse('Failed to update notebook', 500);
  }
}
export async function DELETE(req: NextRequest, { params }: { params: { notebookId: string } }) {
  try {
    const session = await requireAuth();
    const notebook = await prisma.notebook.findFirst({
      where: { id: params.notebookId, userId: session.user.id },
    });
    if (!notebook) return errorResponse('Notebook not found', 404);

    await prisma.notebook.delete({ where: { id: params.notebookId } });
    return successResponse({ deleted: true });
  } catch {
    return errorResponse('Failed to delete notebook', 500);
  }
}