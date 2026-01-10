import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { token } = body;

    // Get proposal
    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Verify token
    if (proposal.signatureToken !== token) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    // Mark terms as accepted
    await prisma.proposal.update({
      where: { id },
      data: { termsAccepted: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Terms accepted successfully.',
    });
  } catch (error) {
    console.error('Error accepting terms:', error);
    return NextResponse.json(
      { error: 'Failed to accept terms' },
      { status: 500 }
    );
  }
}
