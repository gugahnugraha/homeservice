import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../../../lib/auth/jwt';
import { BookingStatus, Role } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || session.role !== Role.PROVIDER) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!providerProfile) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 });
    }

    // Attempt to accept the job within a transaction to avoid race conditions
    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id },
      });

      if (!booking) throw new Error('Booking not found');
      if (booking.bookingStatus !== BookingStatus.PENDING) throw new Error('Booking is no longer available');
      if (booking.providerId !== null) throw new Error('Booking has already been taken by another provider');

      // Update booking
      const updatedBooking = await tx.booking.update({
        where: { id },
        data: {
          providerId: providerProfile.id,
          bookingStatus: BookingStatus.PROVIDER_ASSIGNED, // Or PROVIDER_ACCEPTED based on our flow
          updatedAt: new Date(),
        },
      });

      // Log status history
      await tx.bookingStatusHistory.create({
        data: {
          bookingId: id,
          previousStatus: BookingStatus.PENDING,
          newStatus: BookingStatus.PROVIDER_ASSIGNED,
          actorId: session.userId,
          actorRole: Role.PROVIDER,
          note: 'Pekerjaan diterima oleh mitra.',
        },
      });

      return updatedBooking;
    });

    return NextResponse.json({
      success: true,
      booking: result,
    });
  } catch (error: any) {
    console.error('Accept booking error:', error);
    return NextResponse.json({ error: error.message || 'Failed to accept booking' }, { status: 500 });
  }
}
