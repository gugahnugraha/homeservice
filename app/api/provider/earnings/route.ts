import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../lib/auth/jwt';
import { BookingStatus, PaymentStatus, Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || session.role !== Role.PROVIDER) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!providerProfile) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 });
    }

    // Get completed bookings where provider is assigned
    const completedBookings = await prisma.booking.findMany({
      where: {
        providerId: providerProfile.id,
        bookingStatus: { in: [BookingStatus.COMPLETED, BookingStatus.CUSTOMER_CONFIRMED] },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        service: { select: { name: true } },
      },
    });

    let totalEarnings = 0;
    let pendingPayouts = 0;

    completedBookings.forEach((b) => {
      if (b.paymentStatus === PaymentStatus.PAID) {
        totalEarnings += b.providerEarnings;
      } else {
        pendingPayouts += b.providerEarnings;
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalEarnings,
        pendingPayouts,
        completedJobsCount: completedBookings.length,
      },
      history: completedBookings,
    });
  } catch (error) {
    console.error('Earnings error:', error);
    return NextResponse.json({ error: 'Failed to fetch earnings' }, { status: 500 });
  }
}
