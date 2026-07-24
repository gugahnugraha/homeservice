import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../lib/auth/jwt';
import { Role } from '@prisma/client';

/**
 * GET /api/provider/reviews
 * Fetch reviews left for the logged-in provider
 */
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

    const reviews = await prisma.review.findMany({
      where: { providerId: providerProfile.id },
      include: {
        customer: { include: { user: { select: { name: true, avatarUrl: true } } } },
        service: { select: { name: true } },
        booking: { select: { bookingNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Fetch Reviews Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * PATCH /api/provider/reviews
 * Provider reply to a customer review
 */
export async function PATCH(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || session.role !== Role.PROVIDER) {
      return NextResponse.json({ error: 'Forbidden. Only service providers can reply to reviews.' }, { status: 403 });
    }

    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!providerProfile) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 });
    }

    const { reviewId, responseText } = await request.json();

    if (!reviewId || !responseText || !responseText.trim()) {
      return NextResponse.json({ error: 'Review ID and response text are required' }, { status: 400 });
    }

    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview || existingReview.providerId !== providerProfile.id) {
      return NextResponse.json({ error: 'Review not found or unauthorized' }, { status: 404 });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        responseText: responseText.trim(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Tanggapan ulasan berhasil disimpan',
      review: updatedReview,
    });
  } catch (error) {
    console.error('Reply Review Error:', error);
    return NextResponse.json({ error: 'Failed to save review reply' }, { status: 500 });
  }
}
