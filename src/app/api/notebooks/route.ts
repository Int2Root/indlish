import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';
import { notebookSchema } from '@/lib/validations';
import { PLAN_LIMITS } from '@/lib/utils';

export async function GET() {
  try {
    const session = await requireAuth();
    const notebooks = await prisma.notebook.findMany({
      where: { userId: session.user.id },
      include: { _count: { select: { notes: true } } },
      orderBy: { updatedAt: 'desc' },
    });
    return successResponse(notebooks);
  } catch {
    return errorResponse('Unauthorized', 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const validated = notebookSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return errorResponse('User not found', 404);

    const limits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS];
    const count = await prisma.notebook.count({ where: { userId: session.user.id } });
    if (count >= limits.notebooks) {
      return errorResponse(`Notebook limit reached (${limits.notebooks}). Upgrade to Pro!`, 403);
    }

    const notebook = await prisma.notebook.create({
      data: { ...validated, userId: session.user.id },
    });
    return successResponse(notebook, 201);
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    return errorResponse('Failed to create notebook', 500);
  }
}