import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || typeof token !== 'string') {
      return errorResponse('Invalid token', 400);
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return errorResponse('Password must be at least 8 characters', 400);
    }

    const user = await prisma.user.findUnique({
      where: { passwordResetToken: token },
    });

    if (!user || !user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
      return errorResponse('Invalid or expired reset link', 400);
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    return successResponse({ ok: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return errorResponse('Something went wrong', 500);
  }
}
