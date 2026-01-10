import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code, token } = body;

    // Get proposal
    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // SECURITY: Verify token matches
    if (proposal.signatureToken !== token) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    // SECURITY: Verify code matches
    if (proposal.verificationCode !== code) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 403 });
    }

    // SECURITY: Check if code has expired (1 hour)
    if (proposal.verificationCodeExpiry && new Date() > proposal.verificationCodeExpiry) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Mark email as verified
    await prisma.proposal.update({
      where: { id },
      data: { clientEmailVerified: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully. You can now sign the proposal.',
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
