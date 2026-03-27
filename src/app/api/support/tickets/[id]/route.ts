import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    const ticket = await prisma.supportTicket.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, name: true, image: true } } },
        },
      },
    });

    if (!ticket) return errorResponse('Ticket not found', 404);

    return successResponse(ticket);
  } catch (err: any) {
    if (err.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    return errorResponse('Failed to fetch ticket', 500);
  }
}
