import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../lib/auth/jwt';
import { createBooking } from '../../../lib/services/bookingService';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let where: any = {};

    if (session.role === Role.CUSTOMER) {
      const customer = await prisma.customerProfile.findUnique({ where: { userId: session.userId } });
      if (!customer) return NextResponse.json({ bookings: [] });
      where.customerId = customer.id;
    } else if (session.role === Role.PROVIDER) {
      const provider = await prisma.providerProfile.findUnique({ where: { userId: session.userId } });
      if (!provider) return NextResponse.json({ bookings: [] });
      where.providerId = provider.id;
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        service: { select: { name: true, slug: true, priceModel: true } },
        address: true,
        attachments: true,
        provider: { include: { user: { select: { name: true, phone: true } } } },
        customer: { include: { user: { select: { name: true, phone: true } } } },
      },
    });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const customerProfile = await prisma.customerProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!customerProfile) {
      return NextResponse.json({ error: 'Customer profile required to make a booking' }, { status: 400 });
    }

    const body = await request.json();
    const { serviceId, addressId, scheduledDate, scheduledTime, customerNotes, attachments } = body;

    if (!serviceId || !addressId || !scheduledDate || !scheduledTime) {
      return NextResponse.json({ error: 'Service, Address, Scheduled Date & Time are required' }, { status: 400 });
    }

    const booking = await createBooking({
      customerId: customerProfile.id,
      serviceId,
      addressId,
      scheduledDate,
      scheduledTime,
      customerNotes,
      attachments,
    });

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error: any) {
    console.error('Booking Creation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 });
  }
}
