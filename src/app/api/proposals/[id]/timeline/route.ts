import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Fetch timeline/activity log for a proposal
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get all activities for this proposal
    const activities = await prisma.activity.findMany({
      where: { proposalId: id },
      orderBy: { createdAt: 'asc' },
    });

    // Get proposal views
    const views = await prisma.proposalView.findMany({
      where: { proposalId: id },
      orderBy: { viewedAt: 'desc' },
      take: 10, // Last 10 views
    });

    const totalViews = await prisma.proposalView.count({
      where: { proposalId: id },
    });

    return NextResponse.json({
      activities,
      views,
      totalViews,
    });
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline' },
      { status: 500 }
    );
  }
}
