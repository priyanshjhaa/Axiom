import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 16
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get proposal from database
    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    // Check if user owns this proposal
    if (proposal.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Update proposal status to sent
    await prisma.proposal.update({
      where: { id },
      data: { status: 'sent' },
    });

    console.log('Proposal sent:', {
      id: id,
      to: proposal.clientEmail,
      from: user.email,
    });

    // In production, you would:
    // 1. Send an email to the client with a link to view the proposal
    // 2. Store the sent timestamp
    // 3. Add tracking for opens/views

    return NextResponse.json({
      success: true,
      message: 'Proposal sent successfully',
    });

  } catch (error) {
    console.error('Error sending proposal:', error);
    return NextResponse.json(
      { error: 'Failed to send proposal' },
      { status: 500 }
    );
  }
}
