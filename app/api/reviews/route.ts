import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../lib/auth/jwt';
import { Role } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || session.role !== Role.CUSTOMER) {
      return NextResponse.json({ error: 'Forbidden. Only customers can leave reviews.' }, { status: 403 });
    }

    const { bookingId, rating, comment } = await request.json();

    if (!bookingId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating data' }, { status: 400 });
    }

    // Verify booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, provider: true },
    });

    if (!booking || booking.customer.userId !== session.userId) {
      return NextResponse.json({ error: 'Booking not found or unauthorized' }, { status: 404 });
    }

    if (!booking.providerId) {
      return NextResponse.json({ error: 'No provider assigned to this booking' }, { status: 400 });
    }

    // Check if already reviewed
    const existingReview = await prisma.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this booking' }, { status: 400 });
    }

    // Create Review in transaction to update Provider rating
    await prisma.$transaction(async (tx) => {
      await tx.review.create({
        data: {
          bookingId,
          customerId: booking.customerId,
          providerId: booking.providerId as string,
          serviceId: booking.serviceId,
          rating,
          comment,
        },
      });

      // Recalculate average rating for provider
      const providerReviews = await tx.review.findMany({
        where: { providerId: booking.providerId as string },
        select: { rating: true },
      });

      const totalRating = providerReviews.reduce((acc, r) => acc + r.rating, 0);
      const newAvg = providerReviews.length > 0 ? totalRating / providerReviews.length : 0;

      await tx.providerProfile.update({
        where: { id: booking.providerId as string },
        data: { ratingAvg: newAvg },
      });
    });

    return NextResponse.json({ success: true, message: 'Review submitted successfully' });

  } catch (error) {
    console.error('Review API Error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
