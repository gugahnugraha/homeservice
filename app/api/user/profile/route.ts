import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../lib/auth/jwt';
import { Role, AvailabilityStatus } from '@prisma/client';

export async function PUT(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifyJWT(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, bio, yearsExperience, availabilityStatus } = body;

    // Update basic user details
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        ...(name && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone ? phone.trim() : null }),
      },
    });

    // Update Provider profile if provider
    if (session.role === Role.PROVIDER) {
      await prisma.providerProfile.update({
        where: { userId: session.userId },
        data: {
          ...(bio !== undefined && { bio: bio ? bio.trim() : null }),
          ...(yearsExperience !== undefined && { yearsExperience: Number(yearsExperience) || 1 }),
          ...(availabilityStatus && Object.values(AvailabilityStatus).includes(availabilityStatus) && {
            availabilityStatus: availabilityStatus as AvailabilityStatus,
          }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
