import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth, getAuthSession } from '@/lib/api-helpers';
import { boardSchema } from '@/lib/validations';
import { PLAN_LIMITS } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId');

    const where: any = { visibility: 'PUBLIC' };
    if (userId) where.userId = userId;

    const session = await getAuthSession();
    if (session?.user && userId === session.user.id) {
      delete where.visibility; // Show all boards for the owner
    }

    const [boards, total] = await Promise.all([
      prisma.board.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, username: true, image: true } },
          pins: { take: 4, orderBy: { createdAt: 'desc' } },
          _count: { select: { pins: true, followers: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.board.count({ where }),
    ]);

    return successResponse({ boards, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return errorResponse('Failed to fetch boards', 500);
  }
}
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const validated = boardSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return errorResponse('User not found', 404);

    const limits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS];
    const count = await prisma.board.count({ where: { userId: session.user.id } });
    if (count >= limits.boards) {
      return errorResponse(`Board limit reached (${limits.boards}). Upgrade to Pro!`, 403);
    }

    const board = await prisma.board.create({
      data: { ...validated, userId: session.user.id },
    });
    return successResponse(board, 201);
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    return errorResponse('Failed to create board', 500);
  }
}