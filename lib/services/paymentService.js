import siteConfig from '../config/site';

/**
 * Abstracted Payment & Platform Commission Service
 */

/**
 * Calculates payment breakdown including platform commission & provider earnings
 * @param {number} grossAmount - Total service price
 * @param {number} customCommissionRate - Optional custom commission rate (e.g. 0.15 for 15%)
 */
export function calculatePaymentBreakdown(grossAmount, customCommissionRate = null) {
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
 * Process a booking payment (Abstracted for Indonesian payment gateways like Midtrans, Xendit, QRIS, or Mock)
 */
export async function createPaymentIntent({ bookingId, amount, paymentMethod = 'BANK_TRANSFER' }) {
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
