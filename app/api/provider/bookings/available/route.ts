import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../../lib/auth/jwt';
import { BookingStatus, Role } from '@prisma/client';

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
      include: { services: { select: { serviceId: true } } },
    });

    if (!providerProfile) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 });
    }

    const offeredServiceIds = providerProfile.services.map((s) => s.serviceId);

    if (offeredServiceIds.length === 0) {
      return NextResponse.json({ success: true, availableBookings: [] });
    }

    // Find bookings that are PENDING, have no provider assigned, and match the provider's offered services
    const availableBookings = await prisma.booking.findMany({
      where: {
        bookingStatus: BookingStatus.PENDING,
        providerId: null,
        serviceId: { in: offeredServiceIds },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        service: { select: { name: true, slug: true, priceModel: true } },
        address: { select: { city: true, fullAddress: true } },
        customer: { include: { user: { select: { name: true } } } },
      },
    });

    return NextResponse.json({
      success: true,
      availableBookings,
    });
  } catch (error) {
    console.error('Available bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch available bookings' }, { status: 500 });
  }
}
