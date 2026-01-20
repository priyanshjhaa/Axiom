import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Log a proposal view
 * Called when someone views a shared proposal
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { ipAddress, userAgent, referer } = body;

    // Get the proposal to verify it exists
    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Create the view record
    const view = await prisma.proposalView.create({
      data: {
        proposalId: id,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        referer: referer || null,
      },
    });

    // Update or create the 'viewed' activity
    const existingViewActivity = await prisma.activity.findFirst({
      where: {
        proposalId: id,
        type: 'VIEWED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get total view count
    const viewCount = await prisma.proposalView.count({
      where: { proposalId: id },
    });

    if (existingViewActivity) {
      // Update the existing activity with new count
      await prisma.activity.update({
        where: { id: existingViewActivity.id },
        data: {
          description: `Proposal viewed ${viewCount} ${viewCount === 1 ? 'time' : 'times'}`,
          metadata: JSON.stringify({
            viewCount,
            lastViewedAt: new Date().toISOString(),
          }),
        },
      });
    } else {
      // Create new activity for first view
      await prisma.activity.create({
        data: {
          proposalId: id,
          type: 'VIEWED',
          description: `Proposal viewed ${viewCount} ${viewCount === 1 ? 'time' : 'times'}`,
          metadata: JSON.stringify({
            viewCount,
            firstViewedAt: new Date().toISOString(),
          }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      view: {
        id: view.id,
        viewedAt: view.viewedAt,
      },
      viewCount,
    });
  } catch (error) {
    console.error('Error logging proposal view:', error);
    return NextResponse.json(
      { error: 'Failed to log view' },
      { status: 500 }
    );
  }
}
