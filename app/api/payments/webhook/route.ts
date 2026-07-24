import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '../../../../lib/prisma';
import { BookingStatus, PaymentStatus, Role } from '@prisma/client';

/**
 * POST /api/payments/webhook
 * Midtrans Webhook Notification Callback Handler
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      transaction_id,
    } = body;

    if (!order_id || !status_code || !gross_amount) {
      return NextResponse.json({ error: 'Invalid notification payload' }, { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (serverKey && signature_key && !serverKey.includes('YOUR_SANDBOX_SERVER_KEY')) {
      const payloadString = `${order_id}${status_code}${gross_amount}${serverKey}`;
      const calculatedSignature = crypto
        .createHash('sha512')
        .update(payloadString)
        .digest('hex');

      if (calculatedSignature !== signature_key) {
        return NextResponse.json({ error: 'Invalid signature key' }, { status: 403 });
      }
    }

    // Extract bookingId from payment reference order_id (e.g. TRX-BK-1234-timestamp or bookingId)
    let bookingId = order_id;
    if (order_id.startsWith('TRX-')) {
      const parts = order_id.split('-');
      if (parts.length >= 2) {
        bookingId = parts[1];
      }
    }

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ id: bookingId }, { bookingNumber: bookingId }],
      },
      include: { provider: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found for order_id' }, { status: 404 });
    }

    let targetPaymentStatus: PaymentStatus = PaymentStatus.PENDING;

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      targetPaymentStatus = PaymentStatus.PAID;
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire'
    ) {
      targetPaymentStatus = PaymentStatus.FAILED;
    } else if (transaction_status === 'pending') {
      targetPaymentStatus = PaymentStatus.PENDING;
    }

    // Execute atomic transaction to update Payment, Booking, and Audit History
    await prisma.$transaction(async (tx) => {
      // 1. Upsert payment record
      await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: parseFloat(gross_amount),
          paymentMethod: payment_type || 'MIDTRANS',
          paymentProvider: 'Midtrans',
          paymentReference: transaction_id || order_id,
          status: targetPaymentStatus,
          paidAt: targetPaymentStatus === PaymentStatus.PAID ? new Date() : null,
        },
      });

      // 2. Update booking payment status
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: targetPaymentStatus,
        },
      });

      // 3. Log Status History
      await tx.bookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          previousStatus: booking.bookingStatus,
          newStatus: booking.bookingStatus,
          actorId: 'SYSTEM_MIDTRANS_WEBHOOK',
          actorRole: Role.ADMIN,
          note: `Pembayaran Midtrans ${transaction_status} (Ref: ${order_id})`,
        },
      });

      // 4. If paid and provider assigned, increment totalCompletedJobs
      if (targetPaymentStatus === PaymentStatus.PAID && booking.providerId) {
        await tx.providerProfile.update({
          where: { id: booking.providerId },
          data: {
            totalJobs: { increment: 1 },
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: `Notification processed for ${order_id}: ${targetPaymentStatus}`,
    });
  } catch (error: any) {
    console.error('Midtrans Webhook Handler Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process notification webhook' },
      { status: 500 }
    );
  }
}
