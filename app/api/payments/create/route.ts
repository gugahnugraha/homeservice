import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../lib/auth/jwt';
import { Role } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || session.role !== Role.CUSTOMER) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { bookingId, paymentMethod = 'QRIS' } = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking || booking.customer.userId !== session.userId) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Booking is already paid' }, { status: 400 });
    }

    // Get Platform Commission Rate from settings or fallback to 0.15
    const commissionSetting = await prisma.platformSetting.findUnique({
      where: { key: 'platform_commission_rate' }
    });
    
    const commissionRate = commissionSetting ? parseFloat(commissionSetting.value) : 0.15;
    const commissionAmount = booking.price * commissionRate;
    const providerEarnings = booking.price - commissionAmount;

    // Create payment intent / mock payment completion immediately for MVP sandbox
    await prisma.$transaction(async (tx) => {
      // 1. Create completed payment record
      await tx.payment.create({
        data: {
          bookingId,
          amount: booking.price,
          paymentMethod,
          paymentProvider: 'MockGateway',
          status: 'PAID',
          paidAt: new Date(),
        },
      });

      // 2. Update booking financial data & status
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: 'PAID',
          commissionRate,
          commissionAmount,
          providerEarnings,
        },
      });
      
      // 3. Record status history
      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          previousStatus: booking.bookingStatus,
          newStatus: booking.bookingStatus, // just marking paid, status remains same or changes if needed
          actorId: session.userId,
          actorRole: Role.CUSTOMER,
          note: 'Payment processed via MockGateway',
        }
      });
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Payment processed successfully',
    });

  } catch (error) {
    console.error('Payment API Error:', error);
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}
