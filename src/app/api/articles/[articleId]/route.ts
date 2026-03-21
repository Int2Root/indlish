import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, getAuthSession } from '@/lib/api-helpers';
import { articleSchema } from '@/lib/validations';

export async function GET(req: NextRequest, { params }: { params: { articleId: string } }) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.articleId },
      include: {
        author: { select: { id: true, name: true, username: true, image: true, bio: true } },
        tags: { include: { tag: true } },
        _count: { select: { likes: true, tips: true } },
      },
    });

    if (!article) return errorResponse('Article not found', 404);

    // Increment views
    await prisma.article.update({ where: { id: params.articleId }, data: { views: { increment: 1 } } });

    return successResponse(article);
  } catch {
    return errorResponse('Failed to fetch article', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { articleId: string } }) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return errorResponse('Unauthorized', 401);

    const article = await prisma.article.findUnique({ where: { id: params.articleId } });
    if (!article) return errorResponse('Article not found', 404);
    if (article.authorId !== session.user.id) return errorResponse('Forbidden', 403);

    const body = await req.json();
    const validated = articleSchema.partial().parse(body);

    const updated = await prisma.article.update({
      where: { id: params.articleId },
      data: {
        ...validated,
        publishedAt: validated.status === 'PUBLISHED' && !article.publishedAt ? new Date() : article.publishedAt,
      },
    });

    return successResponse(updated);
  } catch {
    return errorResponse('Failed to update article', 500);
  }
}
export async function DELETE(req: NextRequest, { params }: { params: { articleId: string } }) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return errorResponse('Unauthorized', 401);

    const article = await prisma.article.findUnique({ where: { id: params.articleId } });
    if (!article) return errorResponse('Article not found', 404);
    if (article.authorId !== session.user.id) return errorResponse('Forbidden', 403);

    await prisma.article.delete({ where: { id: params.articleId } });
    return successResponse({ deleted: true });
  } catch {
    return errorResponse('Failed to delete article', 500);
  }
}