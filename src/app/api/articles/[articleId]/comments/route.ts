import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, getAuthSession } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: { articleId: string } }) {
  try {
    const comments = await prisma.comment.findMany({
      where: { articleId: params.articleId, parentId: null },
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        replies: {
          include: {
            author: { select: { id: true, name: true, username: true, image: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(comments);
  } catch {
    return errorResponse('Failed to fetch comments', 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: { articleId: string } }) {
  try {
    const session = await getAuthSession();
    if (!session) return errorResponse('Unauthorized', 401);

    const { content, parentId } = await req.json();
    if (!content?.trim()) return errorResponse('Comment cannot be empty', 400);
    if (content.length > 2000) return errorResponse('Comment too long (max 2000 chars)', 400);

    const article = await prisma.article.findUnique({ where: { id: params.articleId } });
    if (!article) return errorResponse('Article not found', 404);

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        articleId: params.articleId,
        authorId: session.user.id,
        parentId: parentId || null,
      },
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        replies: { include: { author: { select: { id: true, name: true, username: true, image: true } } } },
      },
    });

    return successResponse(comment, 201);
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    return errorResponse('Failed to post comment', 500);
  }
}
