import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all invoices for this user
    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      include: {
        proposal: {
          select: {
            projectTitle: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Parse line items for each invoice
    const invoicesWithParsedItems = invoices.map((invoice) => ({
      ...invoice,
      lineItems: JSON.parse(invoice.lineItems),
    }));

    return NextResponse.json({
      success: true,
      invoices: invoicesWithParsedItems,
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
