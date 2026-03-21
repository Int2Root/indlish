import { NextRequest } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/msg91';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return errorResponse('Email is required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always return success to prevent user enumeration
    if (!user) {
      return successResponse({ ok: true });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpiry: expiry,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || 'https://indlish.com';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail({ email: user.email, resetUrl });

    return successResponse({ ok: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return errorResponse('Something went wrong', 500);
  }
}
