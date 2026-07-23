import prisma from '../prisma';
import { BookingStatus, PaymentStatus, Role } from '@prisma/client';
import { calculatePaymentBreakdown } from './paymentService';

export interface CreateBookingInput {
  customerId: string;
  serviceId: string;
  addressId: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // e.g. "10:00 AM - 12:00 PM"
  customerNotes?: string;
  attachments?: string[]; // Array of Cloudflare R2 file URLs
  providerId?: string;
}

export interface UpdateBookingStatusInput {
  bookingId: string;
  newStatus: BookingStatus;
  actorId: string;
  actorRole: Role;
  note?: string;
  attachments?: string[]; // E.g. Proof of completion URLs from Cloudflare R2
}

/**
 * Generate Unique Booking Number e.g. BK-20260723-8901
 */
export function generateBookingNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `BK-${dateStr}-${randomSuffix}`;
}

/**
 * Create a new Booking with status transition history logging
 */
export async function createBooking(input: CreateBookingInput) {
  const service = await prisma.service.findUnique({
    where: { id: input.serviceId },
  });

  if (!service) {
    throw new Error('Service not found');
  }

  const { grossAmount, commissionRate, commissionAmount, providerEarnings } = calculatePaymentBreakdown(service.basePrice);
  const bookingNumber = generateBookingNumber();

  // Create booking, attachments, and status history in Prisma transaction
  const booking = await prisma.$transaction(async (tx) => {
    const newBooking = await tx.booking.create({
      data: {
        bookingNumber,
        customerId: input.customerId,
        serviceId: input.serviceId,
        addressId: input.addressId,
        providerId: input.providerId || null,
        scheduledDate: new Date(input.scheduledDate),
        scheduledTime: input.scheduledTime,
        customerNotes: input.customerNotes || null,
        price: grossAmount,
        commissionRate,
        commissionAmount,
        providerEarnings,
        bookingStatus: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
      },
    });

    // Create attachments if provided
    if (input.attachments && input.attachments.length > 0) {
      await tx.bookingAttachment.createMany({
        data: input.attachments.map((url) => ({
          bookingId: newBooking.id,
          fileUrl: url,
          fileType: 'IMAGE',
          uploadedByRole: Role.CUSTOMER,
        })),
      });
    }

    // Record initial status in BookingStatusHistory
    await tx.bookingStatusHistory.create({
      data: {
        bookingId: newBooking.id,
        previousStatus: null,
        newStatus: BookingStatus.PENDING,
        actorId: input.customerId,
        actorRole: Role.CUSTOMER,
        note: 'Pesanan baru berhasil dibuat oleh pelanggan.',
      },
    });

    return newBooking;
  });

  return booking;
}

/**
 * Update Booking Status with Audit History Logging
 */
export async function updateBookingStatus(input: UpdateBookingStatusInput) {
  const currentBooking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
  });

  if (!currentBooking) {
    throw new Error('Booking not found');
  }

  const previousStatus = currentBooking.bookingStatus;

  const updatedBooking = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.update({
      where: { id: input.bookingId },
      data: {
        bookingStatus: input.newStatus,
        ...(input.newStatus === BookingStatus.COMPLETED || input.newStatus === BookingStatus.CUSTOMER_CONFIRMED
          ? { updatedAt: new Date() }
          : {}),
      },
    });

    await tx.bookingStatusHistory.create({
      data: {
        bookingId: input.bookingId,
        previousStatus,
        newStatus: input.newStatus,
        actorId: input.actorId,
        actorRole: input.actorRole,
        note: input.note || `Status berubah ke ${input.newStatus}`,
      },
    });

    if (input.attachments && input.attachments.length > 0) {
      await tx.bookingAttachment.createMany({
        data: input.attachments.map((url) => ({
          bookingId: input.bookingId,
          fileUrl: url,
          fileType: 'IMAGE',
          uploadedByRole: input.actorRole,
        })),
      });
    }

    return booking;
  });

  return updatedBooking;
}
