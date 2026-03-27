import { getAuthSession, successResponse, errorResponse } from '@/lib/api-helpers';
import prisma from '@/lib/prisma';

const ADMIN_EMAIL = 'mukherjee.siddhartha@gmail.com';

export async function GET() {
  try {
    const session = await getAuthSession();
    if (session?.user?.email !== ADMIN_EMAIL) {
      return errorResponse('Forbidden', 403);
    }

    const [totalUsers, totalArticles, totalViews, openTickets, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.article.count(),
      prisma.articleView.count(),
      prisma.supportTicket.count({ where: { status: 'OPEN' } }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          role: true,
          createdAt: true,
          _count: { select: { articles: true } },
        },
      }),
    ]);

    return successResponse({ totalUsers, totalArticles, totalViews, openTickets, recentUsers });
  } catch {
    return errorResponse('Failed to fetch stats', 500);
  }
}
