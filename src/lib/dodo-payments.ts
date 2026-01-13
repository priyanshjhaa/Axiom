import { DodoPayments } from 'dodopayments';

// Get API key from environment variables
const API_KEY = process.env.DODO_PAYMENTS_API_KEY || '';

// Initialize Dodo Payments client
let dodoClient: DodoPayments | null = null;

const getClient = () => {
  if (!API_KEY) {
    throw new Error('DODO_PAYMENTS_API_KEY is not set in environment variables');
  }

  if (!dodoClient) {
    // Dodo Payments SDK - pass options object with bearerToken
    dodoClient = new DodoPayments({
      bearerToken: API_KEY,
      // Note: If your API key is for live mode, change to 'live_mode'
      environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as any) || 'test_mode',
    });
  }

  return dodoClient;
};

export interface CreateCheckoutSessionParams {
  amount: number; // Amount in smallest currency unit (e.g., cents for USD)
  currency: string; // USD, INR, etc.
  productName?: string; // Only needed if not using productId
  productId?: string; // Optional: If you have a product ID in Dodo
  customerEmail?: string;
  customerName?: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResult {
  checkoutUrl: string;
  sessionId: string;
}

/**
 * Create a checkout session for one-time payment
 */
export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<CheckoutSessionResult> {
  try {
    const client = getClient();

    // Build product cart item
    // Note: For ad-hoc products (no productId), you still need to provide product_id
    // as an empty string, but the product details (name, price, currency) are required
    const productCartItem: any = {
      product_id: params.productId || 'adhoc_product',
      amount: params.amount,
      quantity: 1,
    };

    // If using ad-hoc product, add product details
    if (!params.productId) {
      productCartItem.name = params.productName;
      productCartItem.type = 'one_time';
      productCartItem.price = params.amount;
      productCartItem.currency = params.currency;
    }

    // Create checkout session using the correct API structure
    const session = await client.checkoutSessions.create({
      product_cart: [productCartItem],
      billing_currency: params.currency as any,
      customer: params.customerEmail
        ? {
            email: params.customerEmail,
            name: params.customerName,
          }
        : undefined,
      metadata: params.metadata,
      // Use return_url for redirect after payment
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invoices/{invoice_id}?payment=success`,
    });

    // Return the checkout URL and session ID
    return {
      checkoutUrl: session.checkout_url || '',
      sessionId: session.session_id,
    };
  } catch (error) {
    console.error('Error creating Dodo Payments checkout session:', error);
    throw new Error(`Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get payment status by checkout session ID
 */
export async function getPaymentStatus(sessionId: string) {
  try {
    const client = getClient();
    const session = await client.checkoutSessions.retrieve(sessionId);
    return {
      status: session.payment_status,
      paymentId: session.payment_id,
    };
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    throw new Error(`Failed to retrieve payment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Verify webhook signature (for future use with webhooks)
 */
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  try {
    // Note: Dodo Payments uses standardwebhooks library
    // You'll need to add your webhook secret to .env as DODO_PAYMENTS_WEBHOOK_KEY
    const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;

    if (!webhookKey) {
      console.warn('DODO_PAYMENTS_WEBHOOK_KEY not set, skipping webhook verification');
      return false;
    }

    // Import standardwebhooks for verification
    const { Webhook } = require('standardwebhooks');
    const wh = new Webhook(webhookKey);
    wh.verify(payload, signature);
    return true;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}
