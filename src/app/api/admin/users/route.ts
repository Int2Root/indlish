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
    const plan = searchParams.get('plan') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (plan && plan !== 'ALL') {
      where.plan = plan;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          plan: true,
          role: true,
          image: true,
          createdAt: true,
          _count: { select: { articles: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return successResponse({ users, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return errorResponse('Failed to fetch users', 500);
  }
}
