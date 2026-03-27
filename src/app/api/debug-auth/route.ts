import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const email = 'mukherjee.siddhartha@gmail.com';
    
    // Step 1: Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    
    // Step 2: Find accounts for this user
    const accounts = user ? await prisma.account.findMany({ where: { userId: user.id } }) : [];
    
    // Step 3: Test the exact query the Prisma adapter uses
    let adapterResult = null;
    if (accounts.length > 0) {
      adapterResult = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: accounts[0].provider,
            providerAccountId: accounts[0].providerAccountId,
          },
        },
        select: { user: true },
      });
    }
    
    return NextResponse.json({
      user: user ? { id: user.id, email: user.email } : null,
      accounts: accounts.map(a => ({ id: a.id, provider: a.provider, providerAccountId: a.providerAccountId })),
      adapterQueryResult: adapterResult ? 'FOUND' : 'NOT_FOUND',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
