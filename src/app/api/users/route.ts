import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';
import { profileSchema } from '@/lib/validations';

export async function GET() {
  try {
    const session = await requireAuth();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true, name: true, email: true, username: true, image: true,
        bio: true, role: true, plan: true, socialLinks: true, upiId: true, createdAt: true,
        _count: { select: { articles: true, followers: true, following: true } },
      },
    });
    return successResponse(user);
  } catch {
    return errorResponse('Unauthorized', 401);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const validated = profileSchema.parse(body);
    if (validated.username) {
      const existing = await prisma.user.findFirst({
        where: { username: validated.username, NOT: { id: session.user.id } },
      });
      if (existing) return errorResponse('Username taken', 409);
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: validated,
    });

    return successResponse(user);
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    return errorResponse('Update failed', 500);
  }
}