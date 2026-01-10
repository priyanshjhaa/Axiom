import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find proposal by signature token
    const proposal = await prisma.proposal.findFirst({
      where: {
        signatureToken: token,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Check if proposal is in correct state for client signing
    if (proposal.signatureStatus !== 'pending_client') {
      return NextResponse.json(
        { error: 'Proposal is not ready for client signing' },
        { status: 400 }
      );
    }

    // Check if freelancer has signed
    if (!proposal.freelancerSignedAt) {
      return NextResponse.json(
        { error: 'Freelancer must sign first' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      proposal: {
        id: proposal.id,
        projectTitle: proposal.projectTitle,
        clientName: proposal.clientName,
        clientEmail: proposal.clientEmail,
        clientCompany: proposal.clientCompany,
        budget: proposal.budget,
        timeline: proposal.timeline,
        executiveSummary: proposal.executiveSummary,
        scopeOfWork: proposal.scopeOfWork,
        pricingBreakdown: proposal.pricingBreakdown,
        timelineDetails: proposal.timelineDetails,
        termsAndConditions: proposal.termsAndConditions,
        user: proposal.user,
        signatureStatus: proposal.signatureStatus,
        clientEmailVerified: proposal.clientEmailVerified,
        termsAccepted: proposal.termsAccepted,
        freelancerSignedAt: proposal.freelancerSignedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching proposal by token:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}
