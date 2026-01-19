import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { dueDate, taxRate = 0, notes, terms, paymentLink: manualPaymentLink } = body;

    // Get the proposal
    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Use proposal's currency, or allow override
    const currency = body.currency || proposal.currency || 'USD';

    // Check if invoice already exists for this proposal
    const existingInvoice = await prisma.invoice.findUnique({
      where: { proposalId: id },
    });

    if (existingInvoice) {
      return NextResponse.json({
        success: true,
        invoice: {
          ...existingInvoice,
          lineItems: JSON.parse(existingInvoice.lineItems),
        },
      });
    }

    // Parse pricing breakdown from proposal to create line items
    let lineItems = [];
    let subtotal = 0;

    try {
      // Try to parse the pricing breakdown as JSON
      const pricingData = JSON.parse(proposal.pricingBreakdown);
      if (Array.isArray(pricingData)) {
        lineItems = pricingData;
        subtotal = pricingData.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
      } else {
        // If it's not an array, create a single line item from budget
        const budget = parseFloat(proposal.budget.replace(/[^0-9.]/g, '') || '0');
        lineItems = [{
          description: proposal.projectTitle,
          quantity: 1,
          rate: budget,
          amount: budget
        }];
        subtotal = budget;
      }
    } catch {
      // If parsing fails, create line item from budget
      const budget = parseFloat(proposal.budget.replace(/[^0-9.]/g, '') || '0');
      lineItems = [{
        description: proposal.projectTitle,
        quantity: 1,
        rate: budget,
        amount: budget
      }];
      subtotal = budget;
    }

    // Calculate tax
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    // Calculate due date (default: 30 days from issue date)
    const dueDateObj = dueDate ? new Date(dueDate) : new Date();
    if (!dueDate) {
      dueDateObj.setDate(dueDateObj.getDate() + 30);
    }

    // Generate unique invoice number using timestamp and random string
    // This avoids conflicts when invoices are deleted
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    const invoiceNumber = `INV-${timestamp}-${random}`;

    // Use manual payment link if provided
    let finalPaymentLink = manualPaymentLink || null;

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        userId: proposal.userId,
        proposalId: proposal.id,
        clientName: proposal.clientName,
        clientEmail: proposal.clientEmail,
        clientCompany: proposal.clientCompany,
        invoiceNumber,
        issueDate: new Date(),
        dueDate: dueDateObj,
        subtotal,
        taxRate,
        taxAmount,
        total,
        currency,
        paidAmount: 0,
        remainingAmount: total,
        lineItems: JSON.stringify(lineItems),
        notes: notes || `Thank you for your business! Payment is due within 30 days.`,
        terms: terms || proposal.termsAndConditions,
        paymentLink: finalPaymentLink,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        proposalId: proposal.id,
        type: 'invoice_generated',
        description: `Invoice generated: ${invoiceNumber}`,
        metadata: JSON.stringify({
          invoiceId: invoice.id,
          invoiceNumber,
          total,
          currency,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      invoice: {
        ...invoice,
        lineItems: JSON.parse(invoice.lineItems),
      },
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        invoice: true,
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    if (!proposal.invoice) {
      return NextResponse.json({ hasInvoice: false }, { status: 200 });
    }

    return NextResponse.json({
      hasInvoice: true,
      invoice: {
        ...proposal.invoice,
        lineItems: JSON.parse(proposal.invoice.lineItems),
      },
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}
