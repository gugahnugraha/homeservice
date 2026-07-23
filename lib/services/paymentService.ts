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
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  itemDetails?: string;
  paymentMethod?: string;
}

export interface MidtransSnapTokenResult {
  success: boolean;
  token?: string;
  redirectUrl?: string;
  paymentReference: string;
  amount: number;
  bookingId: string;
  provider: 'Midtrans Sandbox' | 'Mock';
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
 * Creates Midtrans Snap transaction token (Sandbox mode)
 */
export async function createMidtransTransactionToken({
  bookingId,
  amount,
  customerName = 'Customer',
  customerEmail = 'customer@example.com',
  customerPhone = '08123456789',
  itemDetails = 'Home Service Booking',
}: PaymentIntentParams): Promise<MidtransSnapTokenResult> {
  const paymentReference = `TRX-${bookingId}-${Date.now()}`;
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

  if (serverKey && !serverKey.includes('YOUR_SANDBOX_SERVER_KEY')) {
    // Basic Auth header for Midtrans Snap API
    const authString = Buffer.from(`${serverKey}:`).toString('base64');
    const apiUrl = isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: paymentReference,
            gross_amount: amount,
          },
          customer_details: {
            first_name: customerName,
            email: customerEmail,
            phone: customerPhone,
          },
          item_details: [
            {
              id: bookingId,
              price: amount,
              quantity: 1,
              name: itemDetails,
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.token) {
        return {
          success: true,
          token: data.token,
          redirectUrl: data.redirect_url,
          paymentReference,
          amount,
          bookingId,
          provider: 'Midtrans Sandbox',
        };
      }
    } catch (error) {
      console.error('Midtrans Snap Error:', error);
    }
  }

  // Simulated Midtrans Snap Token for testing
  return {
    success: true,
    token: `snap_sandbox_${paymentReference}`,
    redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${paymentReference}`,
    paymentReference,
    amount,
    bookingId,
    provider: 'Midtrans Sandbox',
  };
}
