import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../../lib/auth/jwt';
import { Role } from '@prisma/client';

/**
 * PATCH /api/admin/disputes/[id]
 * Update dispute status and resolution notes
 */
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
    const { status, adminNotes, resolution } = await request.json();

    const existingDispute = await prisma.dispute.findUnique({
      where: { id },
    });

    if (!existingDispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    const updatedDispute = await prisma.dispute.update({
      where: { id },
      data: {
        status: status || existingDispute.status,
        adminNotes: adminNotes || null,
        resolution: resolution || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Status sengketa berhasil diperbarui',
      dispute: updatedDispute,
    });
  } catch (error) {
    console.error('Update Dispute Error:', error);
    return NextResponse.json({ error: 'Failed to update dispute' }, { status: 500 });
  }
}
