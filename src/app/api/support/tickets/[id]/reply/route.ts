import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { z } from 'zod';

const replySchema = z.object({
  content: z.string().min(1).max(5000),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { content } = replySchema.parse(body);

    const ticket = await prisma.supportTicket.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!ticket) return errorResponse('Ticket not found', 404);
    if (ticket.status === 'CLOSED') return errorResponse('Ticket is closed', 400);

    const message = await prisma.ticketMessage.create({
      data: {
        content,
        ticketId: params.id,
        userId: session.user.id,
        isStaff: false,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    // Reopen ticket if resolved when user replies
    if (ticket.status === 'RESOLVED') {
      await prisma.supportTicket.update({
        where: { id: params.id },
        data: { status: 'OPEN' },
      });
    }

    return successResponse(message, 201);
  } catch (err: any) {
    if (err.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (err.name === 'ZodError') return errorResponse(err.errors[0]?.message || 'Invalid input', 400);
    return errorResponse('Failed to add reply', 500);
  }
}
