import { getAuthSession, successResponse, errorResponse } from '@/lib/api-helpers';
import prisma from '@/lib/prisma';

const ADMIN_EMAIL = 'mukherjee.siddhartha@gmail.com';

// GET — admin only: ticket detail with full message thread
export async function GET(
  _request: Request,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getAuthSession();
    if (session?.user?.email !== ADMIN_EMAIL) {
      return errorResponse('Forbidden', 403);
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.ticketId },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!ticket) return errorResponse('Ticket not found', 404);

    return successResponse(ticket);
  } catch {
    return errorResponse('Failed to fetch ticket', 500);
  }
}

// PATCH — admin only: update status/priority or add an admin reply
export async function PATCH(
  request: Request,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getAuthSession();
    if (session?.user?.email !== ADMIN_EMAIL) {
      return errorResponse('Forbidden', 403);
    }

    const body = await request.json();
    const { status, priority, message } = body;

    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;

    const ticket = await prisma.supportTicket.update({
      where: { id: params.ticketId },
      data: updateData,
    });

    // Add admin reply message if provided
    if (message?.trim()) {
      await prisma.ticketMessage.create({
        data: {
          ticketId: params.ticketId,
          content: message.trim(),
          isStaff: true,
        },
      });
    }

    // Return updated ticket with messages
    const updated = await prisma.supportTicket.findUnique({
      where: { id: params.ticketId },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    return successResponse(updated);
  } catch {
    return errorResponse('Failed to update ticket', 500);
  }
}
