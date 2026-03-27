import { getAuthSession, successResponse, errorResponse } from '@/lib/api-helpers';
import prisma from '@/lib/prisma';

const ADMIN_EMAIL = 'mukherjee.siddhartha@gmail.com';

export async function GET(request: Request) {
  try {
    const session = await getAuthSession();
    if (session?.user?.email !== ADMIN_EMAIL) {
      return errorResponse('Forbidden', 403);
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          views: true,
          createdAt: true,
          publishedAt: true,
          author: { select: { id: true, name: true, email: true } },
          _count: { select: { likes: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return successResponse({ articles, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return errorResponse('Failed to fetch articles', 500);
  }
}
