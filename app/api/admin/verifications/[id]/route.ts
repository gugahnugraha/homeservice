import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../../lib/auth/jwt';
import { Role, VerificationStatus } from '@prisma/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { status, adminNotes } = await request.json();

    if (!Object.values(VerificationStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update Provider Profile
    const updatedProvider = await prisma.providerProfile.update({
      where: { id },
      data: {
        verificationStatus: status,
      },
    });

    // Optionally update the latest verification document record if it exists
    const latestVerification = await prisma.providerVerification.findFirst({
      where: { providerId: id },
      orderBy: { createdAt: 'desc' },
    });

    if (latestVerification) {
      await prisma.providerVerification.update({
        where: { id: latestVerification.id },
        data: {
          status,
          adminNotes,
          reviewedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, provider: updatedProvider });
  } catch (error: any) {
    console.error('Admin update verification error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update' }, { status: 500 });
  }
}
