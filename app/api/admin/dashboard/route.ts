import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../lib/auth/jwt';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const [totalUsers, totalProviders, totalBookings, revenueData] = await Promise.all([
      prisma.user.count({ where: { role: Role.CUSTOMER } }),
      prisma.user.count({ where: { role: Role.PROVIDER } }),
      prisma.booking.count(),
      prisma.booking.aggregate({
        _sum: {
          commissionAmount: true,
        },
        where: {
          paymentStatus: 'PAID',
        },
      }),
    ]);

    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { include: { user: { select: { name: true } } } },
        provider: { include: { user: { select: { name: true } } } },
        service: { select: { name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalProviders,
        totalBookings,
        totalRevenue: revenueData._sum.commissionAmount || 0,
      },
      recentBookings,
    });
  } catch (error) {
    console.error('Admin Dashboard API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
