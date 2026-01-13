import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Find invoice by access token
    const invoice = await prisma.invoice.findUnique({
      where: { accessToken: token },
      include: {
        proposal: {
          select: {
            projectTitle: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found or link has expired' },
        { status: 404 }
      );
    }

    // Check if link has expired
    if (invoice.accessExpiresAt && new Date() > invoice.accessExpiresAt) {
      return NextResponse.json(
        { error: 'This link has expired' },
        { status: 410 }
      );
    }

    // Parse line items
    let lineItems = [];
    try {
      lineItems = JSON.parse(invoice.lineItems);
    } catch (e) {
      lineItems = [];
    }

    // Return invoice data
    return NextResponse.json({
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        subtotal: invoice.subtotal,
        taxRate: invoice.taxRate,
        taxAmount: invoice.taxAmount,
        total: invoice.total,
        paidAmount: invoice.paidAmount || 0,
        remainingAmount: invoice.remainingAmount || invoice.total,
        currency: invoice.currency,
        lineItems,
        notes: invoice.notes,
        terms: invoice.terms,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        clientCompany: invoice.clientCompany,
        paymentLink: invoice.paymentLink,
        payments: invoice.payments,
        proposal: invoice.proposal,
        user: invoice.user,
      },
    });
  } catch (error) {
    console.error('Error fetching shared invoice:', error);
    return NextResponse.json(
      { error: 'Failed to load invoice' },
      { status: 500 }
    );
  }
}
