import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../lib/auth/jwt';

/**
 * GET /api/notifications
 * Get user notifications list
 */
export async function GET(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const notifications = await prisma.notification.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: session.userId, isRead: false },
    });

    return NextResponse.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error('Fetch Notifications Error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

/**
 * PATCH /api/notifications
 * Mark notifications as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { notificationId, markAll } = await request.json();

    if (markAll) {
      await prisma.notification.updateMany({
        where: { userId: session.userId, isRead: false },
        data: { isRead: true },
      });
    } else if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId, userId: session.userId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true, message: 'Notifications updated' });
  } catch (error) {
    console.error('Update Notifications Error:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
