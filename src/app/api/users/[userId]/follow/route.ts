import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth, getAuthSession } from '@/lib/api-helpers';

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await requireAuth();
    const { userId } = params;

    if (session.user.id === userId) {
      return errorResponse('Cannot follow yourself', 400);
    }

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: session.user.id, followingId: userId } },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return successResponse({ followed: false });
    }

    await prisma.follow.create({
      data: { followerId: session.user.id, followingId: userId },
    });

    return successResponse({ followed: true });
  } catch {
    return errorResponse('Failed to follow', 500);
  }
}

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getAuthSession();
    if (!session) return successResponse({ following: false });

    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: session.user.id, followingId: params.userId } },
    });

    return successResponse({ following: !!follow });
  } catch {
    return errorResponse('Failed to check follow status', 500);
  }
}