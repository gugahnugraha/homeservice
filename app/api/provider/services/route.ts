import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../lib/auth/jwt';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || (session.role !== Role.PROVIDER && session.role !== Role.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: session.userId },
      include: {
        services: {
          include: { service: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      offeredServices: providerProfile?.services || [],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch provider services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || (session.role !== Role.PROVIDER && session.role !== Role.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { serviceId, customPrice, isAvailable } = await request.json();

    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!providerProfile) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 });
    }

    const providerService = await prisma.providerService.upsert({
      where: {
        providerId_serviceId: {
          providerId: providerProfile.id,
          serviceId,
        },
      },
      update: {
        customPrice: customPrice ? Number(customPrice) : null,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
      },
      create: {
        providerId: providerProfile.id,
        serviceId,
        customPrice: customPrice ? Number(customPrice) : null,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
      },
    });

    return NextResponse.json({
      success: true,
      providerService,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update offered service' }, { status: 500 });
  }
}
