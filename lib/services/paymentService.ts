import siteConfig from '../config/site';

export interface PaymentBreakdown {
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  providerEarnings: number;
}

export interface PaymentIntentParams {
  bookingId: string;
  amount: number;
  paymentMethod?: string;
}

export interface PaymentIntentResult {
  success: boolean;
  paymentReference: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentMethod: string;
  amount: number;
  bookingId: string;
  instruction: string;
}

/**
 * Calculates payment breakdown including platform commission & provider net earnings
 */
export function calculatePaymentBreakdown(
  grossAmount: number,
  customCommissionRate: number | null = null
): PaymentBreakdown {
  const rate = customCommissionRate !== null ? customCommissionRate : siteConfig.defaultCommissionRate;
  const commissionAmount = Math.round(grossAmount * rate);
  const providerEarnings = Math.max(0, grossAmount - commissionAmount);

  return {
    grossAmount,
    commissionRate: rate,
    commissionAmount,
    providerEarnings,
  };
}

/**
 * Process a booking payment intent (Abstracted for Midtrans, Xendit, QRIS, or Mock)
 */
export async function createPaymentIntent({
  bookingId,
  amount,
  paymentMethod = 'BANK_TRANSFER',
}: PaymentIntentParams): Promise<PaymentIntentResult> {
  const reference = `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    success: true,
    paymentReference: reference,
    status: 'PENDING',
    paymentMethod,
    amount,
    bookingId,
    instruction: `Please pay ${siteConfig.currencySymbol} ${amount.toLocaleString('id-ID')} via ${paymentMethod}.`,
  };
}
