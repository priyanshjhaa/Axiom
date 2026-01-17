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

    // Check if user is on free plan
    if (user.plan === 'free') {
      return NextResponse.json(
        {
          error: 'UPGRADE_REQUIRED',
          message: 'Proposal management is available for Pro users only. Upgrade to delete proposals.',
          upgradeUrl: '/pricing'
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: ids array required' },
        { status: 400 }
      );
    }

    // Delete only proposals that belong to the user
    const result = await prisma.proposal.deleteMany({
      where: {
        id: { in: ids },
        userId: user.id,
      },
    });

    console.log(`Bulk deleted ${result.count} proposals for user ${user.id}`);

    return NextResponse.json({
      success: true,
      deleted: result.count,
      message: `${result.count} proposal(s) deleted successfully`,
    });
  } catch (error) {
    console.error('Error bulk deleting proposals:', error);
    return NextResponse.json(
      { error: 'Failed to delete proposals' },
      { status: 500 }
    );
  }
}
