import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Find proposal by access token
    const proposal = await prisma.proposal.findUnique({
      where: { accessToken: token },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found or link has expired' },
        { status: 404 }
      );
    }

    // Check if link has expired
    if (proposal.accessExpiresAt && new Date() > proposal.accessExpiresAt) {
      return NextResponse.json(
        { error: 'This link has expired' },
        { status: 410 }
      );
    }

    // Return proposal data
    return NextResponse.json({
      proposal: {
        id: proposal.id,
        projectTitle: proposal.projectTitle,
        clientName: proposal.clientName,
        clientEmail: proposal.clientEmail,
        clientCompany: proposal.clientCompany,
        projectDescription: proposal.projectDescription,
        budget: proposal.budget,
        timeline: proposal.timeline,
        startDate: proposal.startDate,
        deliverables: proposal.deliverables,
        executiveSummary: proposal.executiveSummary,
        scopeOfWork: proposal.scopeOfWork,
        pricingBreakdown: proposal.pricingBreakdown,
        timelineDetails: proposal.timelineDetails,
        termsAndConditions: proposal.termsAndConditions,
        createdAt: proposal.createdAt,
        // Signature info
        signatureStatus: proposal.signatureStatus,
        freelancerSignedAt: proposal.freelancerSignedAt,
        clientSignedAt: proposal.clientSignedAt,
        freelancerSignatureData: proposal.freelancerSignatureData,
        freelancerSignatureType: proposal.freelancerSignatureType,
        clientSignatureData: proposal.clientSignatureData,
        clientSignatureType: proposal.clientSignatureType,
        // User info
        user: proposal.user,
      },
    });
  } catch (error) {
    console.error('Error fetching shared proposal:', error);
    return NextResponse.json(
      { error: 'Failed to load proposal' },
      { status: 500 }
    );
  }
}
