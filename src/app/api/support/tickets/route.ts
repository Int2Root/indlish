import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { z } from 'zod';

const createTicketSchema = z.object({
  subject: z.string().min(3).max(200),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  message: z.string().min(10).max(5000),
});

export async function GET() {
  try {
    const session = await requireAuth();

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: { orderBy: { createdAt: 'asc' }, take: 1 },
        _count: { select: { messages: true } },
      },
    });

    return successResponse(tickets);
  } catch (err: any) {
    if (err.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    return errorResponse('Failed to fetch tickets', 500);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { subject, priority, message } = createTicketSchema.parse(body);

    const ticket = await prisma.supportTicket.create({
      data: {
        subject,
        priority,
        userId: session.user.id,
        messages: {
          create: {
            content: message,
            userId: session.user.id,
            isStaff: false,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return successResponse(ticket, 201);
  } catch (err: any) {
    if (err.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (err.name === 'ZodError') return errorResponse(err.errors[0]?.message || 'Invalid input', 400);
    return errorResponse('Failed to create ticket', 500);
  }
}
