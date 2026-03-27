import { NextRequest } from 'next/server';
import Razorpay from 'razorpay';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-helpers';

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const { amount } = await req.json();
    const razorpay = getRazorpay();

    if (!amount || amount < 10) {
      return errorResponse('Minimum tip amount is ₹10', 400);
    }
    if (amount > 10000) {
      return errorResponse('Maximum tip amount is ₹10,000', 400);
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects paise
      currency: 'INR',
      receipt: `tip_${Date.now()}`,
    });

    return successResponse({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch {
    return errorResponse('Failed to create payment order', 500);
  }
}