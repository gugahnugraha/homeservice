import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../lib/auth/jwt';

/**
 * POST /api/disputes
 * Create a new dispute report for a booking
 */
export async function POST(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { bookingId, reason, description } = await request.json();

    if (!bookingId || !reason || !description) {
      return NextResponse.json({ error: 'Booking ID, Reason, and Description are required' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const dispute = await prisma.dispute.create({
      data: {
        bookingId,
        reporterId: session.userId,
        reporterRole: session.role,
        reason,
        description,
        status: 'OPEN',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Laporan kendala berhasil dikirim. Tim Customer Support akan meninjau laporan Anda.',
      dispute,
    });
  } catch (error) {
    console.error('Create Dispute Error:', error);
    return NextResponse.json({ error: 'Failed to create dispute' }, { status: 500 });
  }
}
