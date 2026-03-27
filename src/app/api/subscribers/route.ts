import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';
import { sendSubscriptionConfirmation } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, authorId } = await req.json();

    if (!email || !email.includes('@')) return errorResponse('Invalid email', 400);
    if (!authorId) return errorResponse('Author ID required', 400);

    const author = await prisma.user.findUnique({ where: { id: authorId } });
    if (!author) return errorResponse('Author not found', 404);

    try {
      await prisma.subscriber.create({ data: { email: email.toLowerCase().trim(), authorId } });

      // Send confirmation to subscriber (fire and forget)
      sendSubscriptionConfirmation({
        email: email.toLowerCase().trim(),
        authorName: author.name || 'this creator',
      }).catch(console.error);

      return successResponse({ subscribed: true }, 201);
    } catch (e: any) {
      if (e.code === 'P2002') {
        // Already subscribed
        return successResponse({ subscribed: true, alreadySubscribed: true });
      }
      throw e;
    }
  } catch (error: any) {
    return errorResponse('Failed to subscribe', 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const count = await prisma.subscriber.count({ where: { authorId: session.user.id } });
    return successResponse({ count });
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    return errorResponse('Failed to fetch subscribers', 500);
  }
}
