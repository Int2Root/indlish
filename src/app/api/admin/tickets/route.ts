import { getAuthSession, successResponse, errorResponse } from '@/lib/api-helpers';
import prisma from '@/lib/prisma';

const ADMIN_EMAIL = 'mukherjee.siddhartha@gmail.com';

// GET — admin only: list all tickets
export async function GET(request: Request) {
  try {
    const session = await getAuthSession();
    if (session?.user?.email !== ADMIN_EMAIL) {
      return errorResponse('Forbidden', 403);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;

    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    if (priority && priority !== 'ALL') where.priority = priority;

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          subject: true,
          email: true,
          priority: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          user: { select: { id: true, name: true } },
          _count: { select: { messages: true } },
        },
      }),
      prisma.supportTicket.count({ where }),
    ]);

    return successResponse({ tickets, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return errorResponse('Failed to fetch tickets', 500);
  }
}

// POST — public: users submit a support ticket
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, email, message } = body;

    if (!subject?.trim() || !email?.trim() || !message?.trim()) {
      return errorResponse('subject, email, and message are required', 422);
    }

    const session = await getAuthSession();
    const userId = session?.user ? (session.user as any).id : null;

    const ticket = await prisma.supportTicket.create({
      data: {
        subject: subject.trim(),
        email: email.trim(),
        userId,
        messages: {
          create: { content: message.trim(), isAdmin: false },
        },
      },
      include: { messages: true },
    });

    return successResponse(ticket, 201);
  } catch {
    return errorResponse('Failed to create ticket', 500);
  }
}
