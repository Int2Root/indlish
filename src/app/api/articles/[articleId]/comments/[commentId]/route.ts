import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, getAuthSession } from '@/lib/api-helpers';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { articleId: string; commentId: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session) return errorResponse('Unauthorized', 401);

    const comment = await prisma.comment.findUnique({ where: { id: params.commentId } });
    if (!comment) return errorResponse('Comment not found', 404);
    if (comment.authorId !== session.user.id) return errorResponse('Forbidden', 403);

    await prisma.comment.delete({ where: { id: params.commentId } });
    return successResponse({ deleted: true });
  } catch {
    return errorResponse('Failed to delete comment', 500);
  }
}
