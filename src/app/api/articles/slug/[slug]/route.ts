import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, getAuthSession } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getAuthSession();

    const article = await prisma.article.findUnique({
      where: { slug: params.slug },
      include: {
        author: {
          select: {
            id: true, name: true, username: true, image: true, bio: true,
            _count: { select: { followers: true } },
          },
        },
        tags: { include: { tag: true } },
        _count: { select: { likes: true, tips: true, comments: true } },
      },
    });

    if (!article) return errorResponse('Article not found', 404);

    // Track view
    await Promise.all([
      prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } }),
      prisma.articleView.create({
        data: { articleId: article.id, userId: session?.user?.id || null },
      }),
    ]);

    // Check if current user liked this article
    let isLiked = false;
    let isFollowingAuthor = false;
    if (session) {
      const [like, follow] = await Promise.all([
        prisma.articleLike.findUnique({
          where: { userId_articleId: { userId: session.user.id, articleId: article.id } },
        }),
        prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: session.user.id, followingId: article.authorId } },
        }),
      ]);
      isLiked = !!like;
      isFollowingAuthor = !!follow;
    }

    return successResponse({ ...article, isLiked, isFollowingAuthor });
  } catch {
    return errorResponse('Failed to fetch article', 500);
  }
}