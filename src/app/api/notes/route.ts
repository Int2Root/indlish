import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';
import { noteSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const notebookId = searchParams.get('notebookId');

    if (!notebookId) return errorResponse('notebookId required', 400);

    const notebook = await prisma.notebook.findFirst({
      where: { id: notebookId, userId: session.user.id },
    });
    if (!notebook) return errorResponse('Notebook not found', 404);

    const notes = await prisma.note.findMany({
      where: { notebookId },
      orderBy: { updatedAt: 'desc' },
    });
    return successResponse(notes);
  } catch {
    return errorResponse('Unauthorized', 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const validated = noteSchema.parse(body);

    const notebook = await prisma.notebook.findFirst({
      where: { id: validated.notebookId, userId: session.user.id },
    });
    if (!notebook) return errorResponse('Notebook not found', 404);

    const note = await prisma.note.create({ data: validated });
    return successResponse(note, 201);
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    return errorResponse('Failed to create note', 500);
  }
}