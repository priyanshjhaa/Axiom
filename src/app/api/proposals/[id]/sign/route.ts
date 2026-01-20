import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { signatureType, signatureData, role } = body; // role: 'freelancer' | 'client'

    // Get proposal
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Check permissions
    const userEmail = session.user?.email;
    if (role === 'freelancer') {
      // Only the proposal owner can sign as freelancer
      if (proposal.user.email !== userEmail) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else if (role === 'client') {
      // Client signing uses signature token for authentication
      const { token } = body;
      if (proposal.signatureToken !== token) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
      }
    }

    // Update proposal based on role
    const updateData: any = {};

    if (role === 'freelancer') {
      updateData.freelancerSignatureType = signatureType;
      updateData.freelancerSignatureData = signatureData;
      updateData.freelancerSignedAt = new Date();
      updateData.signatureStatus = 'pending_client';

      // Generate signature token for client
      if (!proposal.signatureToken) {
        updateData.signatureToken = uuidv4();
      }

      // SECURITY: Generate content hash (SHA-256)
      // This prevents tampering with proposal content after signing
      const contentString = JSON.stringify({
        executiveSummary: proposal.executiveSummary,
        scopeOfWork: proposal.scopeOfWork,
        pricingBreakdown: proposal.pricingBreakdown,
        timelineDetails: proposal.timelineDetails,
        termsAndConditions: proposal.termsAndConditions,
        budget: proposal.budget,
        projectTitle: proposal.projectTitle,
      });

      updateData.contentHash = crypto
        .createHash('sha256')
        .update(contentString)
        .digest('hex');

      // SECURITY: Generate 6-digit verification code
      // Client must enter this to prove they own the email
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      updateData.verificationCode = verificationCode;
      updateData.verificationCodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      console.log('Generated verification code:', verificationCode); // For development
    } else if (role === 'client') {
      // Verify that freelancer has signed first
      if (!proposal.freelancerSignedAt) {
        return NextResponse.json(
          { error: 'Freelancer must sign first' },
          { status: 400 }
        );
      }

      // SECURITY: Verify email code
      const { verificationCode: inputCode } = body;

      if (!proposal.clientEmailVerified) {
        return NextResponse.json(
          { error: 'Email must be verified first. Please check your email for the verification code.' },
          { status: 403 }
        );
      }

      // SECURITY: Check terms acceptance
      if (!proposal.termsAccepted) {
        return NextResponse.json(
          { error: 'You must accept the terms before signing' },
          { status: 400 }
        );
      }

      updateData.clientSignatureType = signatureType;
      updateData.clientSignatureData = signatureData;
      updateData.clientSignedAt = new Date();
      updateData.signatureStatus = 'signed';

      // SECURITY: Capture IP address for audit trail
      const ipAddress = request.headers.get('x-forwarded-for') ||
                        request.headers.get('x-real-ip') ||
                        'unknown';
      updateData.ipAddress = ipAddress;

      // SECURITY: Capture user agent for audit trail
      const userAgent = request.headers.get('user-agent') || 'unknown';
      updateData.userAgent = userAgent;

      console.log('Client signed from IP:', ipAddress);
    }

    const updatedProposal = await prisma.proposal.update({
      where: { id },
      data: updateData,
    });

    // Log activity when proposal is fully signed
    if (role === 'client' && updateData.signatureStatus === 'signed') {
      await prisma.activity.create({
        data: {
          proposalId: id,
          type: 'SIGNED',
          description: 'Proposal signed by both parties',
          metadata: JSON.stringify({
            clientSignedAt: updateData.clientSignedAt,
            freelancerSignedAt: proposal.freelancerSignedAt,
          }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      proposal: updatedProposal,
    });
  } catch (error) {
    console.error('Error signing proposal:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));

    // Type guard for Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      return NextResponse.json(
        {
          error: 'Failed to sign proposal',
          details: error.code,
          message: 'message' in error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to sign proposal',
        details: typeof error === 'object' ? JSON.stringify(error) : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      select: {
        signatureStatus: true,
        freelancerSignedAt: true,
        clientSignedAt: true,
        signatureToken: true,
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json({
      signatureStatus: proposal.signatureStatus,
      freelancerSignedAt: proposal.freelancerSignedAt,
      clientSignedAt: proposal.clientSignedAt,
      hasToken: !!proposal.signatureToken,
    });
  } catch (error) {
    console.error('Error fetching signature status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signature status' },
      { status: 500 }
    );
  }
}
