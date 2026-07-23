import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../lib/auth/jwt';
import siteConfig from '../../../../lib/config/site';

export async function GET(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const customerProfile = await prisma.customerProfile.findUnique({
      where: { userId: session.userId },
      include: { addresses: true },
    });

    return NextResponse.json({
      success: true,
      addresses: customerProfile?.addresses || [],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { label = 'Home', fullAddress, city = siteConfig.defaultCity, postalCode, isDefault = false } = body;

    if (!fullAddress || fullAddress.trim().length < 5) {
      return NextResponse.json({ error: 'Full address is required' }, { status: 400 });
    }

    const customerProfile = await prisma.customerProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!customerProfile) {
      return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
    }

    const newAddress = await prisma.address.create({
      data: {
        customerId: customerProfile.id,
        label: label.trim(),
        fullAddress: fullAddress.trim(),
        city: city.trim(),
        postalCode: postalCode ? postalCode.trim() : null,
        isDefault,
      },
    });

    return NextResponse.json({
      success: true,
      address: newAddress,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}
