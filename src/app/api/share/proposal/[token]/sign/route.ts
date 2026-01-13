import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const { signatureType, signatureData } = body;

    // Find proposal by access token
    const proposal = await prisma.proposal.findUnique({
      where: { accessToken: token },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Check if link has expired
    if (proposal.accessExpiresAt && new Date() > proposal.accessExpiresAt) {
      return NextResponse.json({ error: 'This link has expired' }, { status: 410 });
    }

    // Check if freelancer has signed first
    if (!proposal.freelancerSignedAt) {
      return NextResponse.json(
        { error: 'This proposal is not ready for client signature yet' },
        { status: 400 }
      );
    }

    // Check if already signed
    if (proposal.clientSignedAt) {
      return NextResponse.json(
        { error: 'This proposal has already been signed' },
        { status: 400 }
      );
    }

    // Update proposal with client signature
    const updatedProposal = await prisma.proposal.update({
      where: { id: proposal.id },
      data: {
        clientSignatureType: signatureType,
        clientSignatureData: signatureData,
        clientSignedAt: new Date(),
        signatureStatus: 'signed',
        // Capture IP address for audit trail
        ipAddress: request.headers.get('x-forwarded-for') ||
                  request.headers.get('x-real-ip') ||
                  'unknown',
        // Capture user agent for audit trail
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    console.log('Client signed via share link for proposal:', proposal.id);

    return NextResponse.json({
      success: true,
      proposal: updatedProposal,
    });
  } catch (error) {
    console.error('Error signing proposal via share link:', error);
    return NextResponse.json(
      { error: 'Failed to sign proposal' },
      { status: 500 }
    );
  }
}
