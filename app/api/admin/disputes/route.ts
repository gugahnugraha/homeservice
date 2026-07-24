import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../lib/auth/jwt';
import { Role } from '@prisma/client';

/**
 * GET /api/admin/disputes
 * List all dispute reports for admin review
 */
export async function GET(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const disputes = await prisma.dispute.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        booking: {
          include: {
            service: { select: { name: true } },
            customer: { include: { user: { select: { name: true, email: true, phone: true } } } },
            provider: { include: { user: { select: { name: true, email: true, phone: true } } } },
          },
        },
      },
    });

    return NextResponse.json({ success: true, disputes });
  } catch (error) {
    console.error('Admin Disputes Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch disputes' }, { status: 500 });
  }
}
