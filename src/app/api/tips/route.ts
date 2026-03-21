import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';
import { tipSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'received';

    const where = type === 'received'
      ? { toUserId: session.user.id }
      : { fromUserId: session.user.id };

    const tips = await prisma.tip.findMany({
      where,
      include: {
        fromUser: { select: { id: true, name: true, username: true, image: true } },
        toUser: { select: { id: true, name: true, username: true, image: true } },
        article: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const totalEarnings = type === 'received'
      ? await prisma.tip.aggregate({ where, _sum: { amount: true } })
      : null;

    return successResponse({ tips, totalEarnings: totalEarnings?._sum?.amount || 0 });
  } catch {
    return errorResponse('Unauthorized', 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const validated = tipSchema.parse(body);

    if (session.user.id === validated.toUserId) {
      return errorResponse('Cannot tip yourself', 400);
    }

    const tip = await prisma.tip.create({
      data: {
        amount: validated.amount,
        fromUserId: session.user.id,
        toUserId: validated.toUserId,
        articleId: validated.articleId || null,
        razorpayPaymentId: body.razorpayPaymentId || null,
      },
    });

    return successResponse(tip, 201);
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    return errorResponse('Failed to create tip', 500);
  }
}