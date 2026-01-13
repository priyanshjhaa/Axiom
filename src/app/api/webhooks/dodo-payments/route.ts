import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

/**
 * Dodo Payments Webhook Handler
 *
 * Processes payment.success events and updates invoice status
 * Supports partial payments - multiple payments accumulate
 *
 * Security: Verifies webhook signature using DODO_WEBHOOK_SECRET
 * Idempotent: Safe if same webhook is fired twice
 */

// Webhook signature verification
// Dodo sends signature as: t=timestamp,v1=hash
function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;

  // Parse signature header (format: t=timestamp,v1=hash)
  const elements = signature.split(',');
  const signatureMap = new Map<string, string>();

  for (const element of elements) {
    const [key, value] = element.split('=');
    if (key && value) {
      signatureMap.set(key, value);
    }
  }

  const timestamp = signatureMap.get('t');
  const v1Hash = signatureMap.get('v1');

  if (!timestamp || !v1Hash) {
    console.log('⚠️  [Webhook] Invalid signature format');
    return false;
  }

  // Check timestamp is within 5 minutes to prevent replay attacks
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    console.log('⚠️  [Webhook] Signature timestamp too old');
    return false;
  }

  // Compute expected signature
  const payload = `${timestamp}.${rawBody}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  // Use timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(v1Hash),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('📩 [Webhook] Dodo Payments webhook received');

  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-dodo-signature') ||
                      request.headers.get('X-Dodo-Signature') ||
                      request.headers.get('dodo-signature') ||
                      request.headers.get('Dodo-Signature');

    // Verify webhook signature
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
    if (webhookSecret) {
      if (!signature) {
        console.log('❌ [Webhook] Missing signature header');
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }

      if (!verifySignature(rawBody, signature, webhookSecret)) {
        console.log('❌ [Webhook] Invalid signature');
        console.log('🔐 [Webhook] Received signature:', signature.substring(0, 30) + '...');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
      console.log('✅ [Webhook] Signature verified');
    } else {
      console.log('⚠️  [Webhook] No webhook secret configured - skipping verification');
    }

    let event;
    try {
      event = JSON.parse(rawBody);
    } catch (e) {
      console.error('❌ [Webhook] Invalid JSON:', e);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    console.log('📦 [Webhook] Event type:', event.type);
    console.log('💰 [Webhook] Payment ID:', event.data?.payment_id || event.data?.id);

    // Handle successful payments only
    if (event.type === 'payment.succeeded' || event.type === 'payment.completed' || event.type === 'checkout.completed') {
      const paymentData = event.data;

      // Extract invoice info from metadata
      const metadata = paymentData.metadata || {};
      const proposalId = metadata.proposal_id;
      const invoiceNumber = metadata.invoice_number;

      if (!proposalId && !invoiceNumber) {
        console.log('⚠️  [Webhook] No invoice identifier in metadata');
        return NextResponse.json({ received: true, warning: 'No invoice identifier' }, { status: 200 });
      }

      // Find the invoice
      const invoice = await prisma.invoice.findFirst({
        where: proposalId ? { proposalId } : { invoiceNumber },
      });

      if (!invoice) {
        console.log('⚠️  [Webhook] Invoice not found');
        return NextResponse.json({ received: true, warning: 'Invoice not found' }, { status: 200 });
      }

      console.log(`📄 [Webhook] Found invoice: ${invoice.invoiceNumber}`);

      // Extract payment amount
      const paymentAmount = paymentData.amount || paymentData.amount_paid || 0;
      const externalPaymentId = paymentData.payment_id || paymentData.id || paymentData.session_id;

      if (!externalPaymentId) {
        console.log('⚠️  [Webhook] No payment ID in webhook data');
        return NextResponse.json({ received: true, warning: 'No payment ID' }, { status: 200 });
      }

      // IDEMPOTENCY CHECK: See if this payment was already processed
      const existingPayment = await prisma.payment.findUnique({
        where: { externalPaymentId },
      });

      if (existingPayment) {
        console.log(`✅ [Webhook] Payment already processed, skipping. Payment ID: ${externalPaymentId}`);
        return NextResponse.json({
          received: true,
          message: 'Payment already processed',
          invoiceId: invoice.id,
        }, { status: 200 });
      }

      // Get currency from payment data or invoice
      const currency = paymentData.currency || invoice.currency;

      console.log(`💵 [Webhook] Processing payment: ${currency}${paymentAmount} for invoice ${invoice.invoiceNumber}`);

      // Create payment record and update invoice in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // 1. Create the payment record
        const payment = await tx.payment.create({
          data: {
            invoiceId: invoice.id,
            externalPaymentId,
            amount: paymentAmount,
            currency,
            status: 'succeeded',
            paymentMethod: paymentData.payment_method || paymentData.method || null,
            metadata: JSON.stringify(paymentData),
          },
        });

        console.log(`✅ [Webhook] Payment record created: ${payment.id}`);

        // 2. Calculate new totals
        const currentPaidAmount = invoice.paidAmount || 0;
        const newPaidAmount = currentPaidAmount + paymentAmount;
        const totalAmount = invoice.total;
        const newRemainingAmount = totalAmount - newPaidAmount;

        console.log(`📊 [Webhook] Payment calculation:`, {
          previousPaid: currentPaidAmount,
          thisPayment: paymentAmount,
          newPaid: newPaidAmount,
          total: totalAmount,
          remaining: newRemainingAmount,
        });

        // 3. Derive new status based on amount paid
        let newStatus: string;
        if (newPaidAmount >= totalAmount - 0.01) { // Small tolerance for floating point
          newStatus = 'PAID';
        } else if (newPaidAmount > 0) {
          newStatus = 'PARTIALLY_PAID';
        } else {
          newStatus = 'UNPAID';
        }

        console.log(`🔄 [Webhook] Status change: ${invoice.status} → ${newStatus}`);

        // 4. Update invoice
        const updatedInvoice = await tx.invoice.update({
          where: { id: invoice.id },
          data: {
            paidAmount: newPaidAmount,
            remainingAmount: Math.max(0, newRemainingAmount),
            status: newStatus,
          },
        });

        console.log(`✅ [Webhook] Invoice updated: ${updatedInvoice.invoiceNumber} is now ${newStatus}`);

        return { payment, updatedInvoice };
      });

      const duration = Date.now() - startTime;
      console.log(`⏱️  [Webhook] Processed in ${duration}ms`);

      return NextResponse.json({
        received: true,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        paymentId: result.payment.id,
        newStatus: result.updatedInvoice.status,
        paidAmount: result.updatedInvoice.paidAmount,
        remainingAmount: result.updatedInvoice.remainingAmount,
      }, { status: 200 });
    }

    // Handle failed/cancelled payments
    if (event.type === 'payment.failed' || event.type === 'payment.cancelled') {
      console.log(`❌ [Webhook] Payment ${event.type}`);
      // Could create a failed payment record for audit trail
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Unhandled event type
    console.log(`⚠️  [Webhook] Unhandled event type: ${event.type}`);
    return NextResponse.json({ received: true, handled: false }, { status: 200 });

  } catch (error) {
    console.error('💥 [Webhook] Error:', error);
    return NextResponse.json({
      error: 'Webhook handler failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
