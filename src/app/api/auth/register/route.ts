import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { sendWelcomeEmail } from '@/lib/msg91';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      return errorResponse('Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);

    // Resolve referral
    let referrerId: string | undefined;
    if (body.referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode: body.referralCode }, select: { id: true } });
      if (referrer) referrerId = referrer.id;
    }

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: 'CREATOR',
        username: validated.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, ''),
        ...(referrerId ? { referredById: referrerId } : {}),
      },
    });

    // Welcome email (fire and forget)
    sendWelcomeEmail(user.email, user.name).catch(() => {});

    return successResponse({ id: user.id, email: user.email }, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse(error.errors[0].message, 422);
    }
    return errorResponse('Registration failed', 500);
  }
}