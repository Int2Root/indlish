import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-helpers';

// GET /api/challenges — list all challenges
export async function GET() {
  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: { deadline: 'asc' },
    });
    return successResponse(challenges);
  } catch {
    return errorResponse('Failed to fetch challenges', 500);
  }
}
