import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';

export async function PATCH(req: NextRequest, { params }: { params: { noteId: string } }) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    const note = await prisma.note.findUnique({
      where: { id: params.noteId },
      include: { notebook: true },
    });
    if (!note || note.notebook.userId !== session.user.id) {
      return errorResponse('Note not found', 404);
    }

    const updated = await prisma.note.update({
      where: { id: params.noteId },
      data: { title: body.title, content: body.content },
    });
    return successResponse(updated);
  } catch {
    return errorResponse('Failed to update note', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { noteId: string } }) {
  try {
    const session = await requireAuth();
    const note = await prisma.note.findUnique({
      where: { id: params.noteId },
      include: { notebook: true },
    });
    if (!note || note.notebook.userId !== session.user.id) {
      return errorResponse('Note not found', 404);
    }

    await prisma.note.delete({ where: { id: params.noteId } });
    return successResponse({ deleted: true });
  } catch {
    return errorResponse('Failed to delete note', 500);
  }
}