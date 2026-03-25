import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function DELETE(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Delete all proposals associated with user
    await prisma.proposal.deleteMany({
      where: {
        user: {
          email: userEmail
        }
      }
    });

    // Delete all invoices associated with user
    await prisma.invoice.deleteMany({
      where: {
        user: {
          email: userEmail
        }
      }
    });

    // Delete the user
    await prisma.user.delete({
      where: { email: userEmail },
    });

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
