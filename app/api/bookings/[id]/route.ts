import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../lib/auth/jwt';
import { updateBookingStatus } from '../../../../lib/services/bookingService';
import { BookingStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        address: true,
        attachments: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
        payments: true,
        customer: { include: { user: { select: { name: true, email: true, phone: true } } } },
        provider: { include: { user: { select: { name: true, email: true, phone: true } } } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch booking details' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { newStatus, note, attachments } = await request.json();

    if (!newStatus || !Object.values(BookingStatus).includes(newStatus)) {
      return NextResponse.json({ error: 'Valid newStatus is required' }, { status: 400 });
    }

    const updatedBooking = await updateBookingStatus({
      bookingId: id,
      newStatus,
      actorId: session.userId,
      actorRole: session.role,
      note,
      attachments,
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update booking status' }, { status: 500 });
  }
}
