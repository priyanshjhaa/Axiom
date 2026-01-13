import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

// Helper to generate a secure random token
function generateAccessToken(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `${timestamp}-${randomStr}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: proposalId } = await params;

    // Check if proposal exists and belongs to user
    const proposal = await prisma.proposal.findFirst({
      where: {
        id: proposalId,
        user: { email: session.user.email },
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Generate new access token
    const accessToken = generateAccessToken();

    // Set expiration to 7 days from now
    const accessExpiresAt = new Date();
    accessExpiresAt.setDate(accessExpiresAt.getDate() + 7);

    // Update proposal with access token
    await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        accessToken,
        accessExpiresAt,
      },
    });

    // Generate the shareable URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const shareUrl = `${baseUrl}/share/proposal/${accessToken}`;

    return NextResponse.json({
      shareUrl,
      expiresAt: accessExpiresAt,
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    return NextResponse.json(
      { error: 'Failed to generate share link' },
      { status: 500 }
    );
  }
}
