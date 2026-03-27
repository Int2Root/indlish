import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';
import { nanoid } from 'nanoid';

// GET /api/referral — get current user's referral info
export async function GET() {
  try {
    const session = await requireAuth();

    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, referralCode: true },
    });

    // Auto-generate referral code if not set
    if (!user?.referralCode) {
      const code = nanoid(8).toUpperCase();
      user = await prisma.user.update({
        where: { id: session.user.id },
        data: { referralCode: code },
        select: { id: true, referralCode: true },
      });
    }

    const referralCount = await prisma.user.count({
      where: { referredById: session.user.id },
    });

    return successResponse({ referralCode: user?.referralCode, referralCount });
  } catch {
    return errorResponse('Unauthorized', 401);
  }
}
