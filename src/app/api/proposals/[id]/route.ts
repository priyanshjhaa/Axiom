import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(
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

    console.log('Fetching proposal with ID:', id);

    // Get proposal from database
    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      console.log('Proposal not found');
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    // Check if user owns this proposal
    if (proposal.userId !== user.id) {
      console.log('Access denied for user:', user.id);
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Format proposal for frontend
    const formattedProposal = {
      id: proposal.id,
      userId: user.id,
      clientName: proposal.clientName,
      clientEmail: proposal.clientEmail,
      clientCompany: proposal.clientCompany,
      projectTitle: proposal.projectTitle,
      projectDescription: proposal.projectDescription,
      budget: proposal.budget,
      currency: proposal.currency || 'USD',
      timeline: proposal.timeline,
      startDate: proposal.startDate || '',
      deliverables: proposal.deliverables,
      status: proposal.status,
      createdAt: proposal.createdAt.toISOString(),
      content: {
        executiveSummary: proposal.executiveSummary,
        scopeOfWork: proposal.scopeOfWork,
        pricingBreakdown: proposal.pricingBreakdown,
        timeline: proposal.timelineDetails,
        termsAndConditions: proposal.termsAndConditions,
      },
      // Signature fields
      signatureStatus: proposal.signatureStatus || 'not_started',
      freelancerSignedAt: proposal.freelancerSignedAt?.toISOString(),
      clientSignedAt: proposal.clientSignedAt?.toISOString(),
      freelancerSignatureData: proposal.freelancerSignatureData,
      freelancerSignatureType: proposal.freelancerSignatureType,
      clientSignatureData: proposal.clientSignatureData,
      clientSignatureType: proposal.clientSignatureType,
    };

    console.log('Proposal found and sent with currency:', formattedProposal.currency);

    return NextResponse.json({
      proposal: formattedProposal,
    });

  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if proposal exists and belongs to user
    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    if (proposal.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Delete the proposal (cascade will delete related records)
    await prisma.proposal.delete({
      where: { id },
    });

    console.log('Proposal deleted:', id);

    return NextResponse.json({
      success: true,
      message: 'Proposal deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json(
      { error: 'Failed to delete proposal' },
      { status: 500 }
    );
  }
}
