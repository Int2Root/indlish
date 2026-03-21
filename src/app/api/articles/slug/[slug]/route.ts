import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: params.slug },
      include: {
        author: { select: { id: true, name: true, username: true, image: true, bio: true } },
        tags: { include: { tag: true } },
        _count: { select: { likes: true, tips: true } },
      },
    });

    if (!article) return errorResponse('Article not found', 404);

    await prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } });

    return successResponse(article);
  } catch {
    return errorResponse('Failed to fetch article', 500);
  }
}