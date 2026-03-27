import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const authorId = session.user.id;

    // Get all author's articles with stats
    const articles = await prisma.article.findMany({
      where: { authorId },
      include: { _count: { select: { likes: true, comments: true, tips: true } } },
      orderBy: { views: 'desc' },
    });

    const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
    const totalLikes = articles.reduce((sum, a) => sum + a._count.likes, 0);
    const totalComments = articles.reduce((sum, a) => sum + a._count.comments, 0);
    const publishedCount = articles.filter((a) => a.status === 'PUBLISHED').length;
    const draftCount = articles.filter((a) => a.status === 'DRAFT').length;

    // Top 5 articles by views
    const topArticles = articles
      .filter((a) => a.status === 'PUBLISHED')
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        views: a.views,
        likes: a._count.likes,
        comments: a._count.comments,
        publishedAt: a.publishedAt,
      }));

    // Views over last 30 days using ArticleView table
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const viewsByDay = await prisma.articleView.groupBy({
      by: ['createdAt'],
      where: {
        article: { authorId },
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: { id: true },
    });

    // Aggregate into daily buckets
    const dailyMap: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = 0;
    }
    for (const row of viewsByDay) {
      const key = new Date(row.createdAt).toISOString().slice(0, 10);
      if (key in dailyMap) dailyMap[key] += row._count.id;
    }

    const viewsChart = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

    // Subscriber count
    const subscriberCount = await prisma.subscriber.count({ where: { authorId } });

    // Follower count
    const followerCount = await prisma.follow.count({ where: { followingId: authorId } });

    return successResponse({
      totalViews,
      totalLikes,
      totalComments,
      publishedCount,
      draftCount,
      topArticles,
      viewsChart,
      subscriberCount,
      followerCount,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    return errorResponse('Failed to fetch analytics', 500);
  }
}
