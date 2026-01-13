import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: ids array required' },
        { status: 400 }
      );
    }

    // Delete only invoices that belong to the user
    const result = await prisma.invoice.deleteMany({
      where: {
        id: { in: ids },
        userId: user.id,
      },
    });

    console.log(`Bulk deleted ${result.count} invoices for user ${user.id}`);

    return NextResponse.json({
      success: true,
      deleted: result.count,
      message: `${result.count} invoice(s) deleted successfully`,
    });
  } catch (error) {
    console.error('Error bulk deleting invoices:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoices' },
      { status: 500 }
    );
  }
}
