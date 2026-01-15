import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface ProposalContent {
  executiveSummary: string;
  scopeOfWork: string;
  pricingBreakdown: string;
  timeline: string;
  termsAndConditions: string;
}

async function generateProposalWithAI(formData: any): Promise<ProposalContent> {
  const {
    clientName,
    clientCompany,
    projectTitle,
    projectDescription,
    budget,
    timeline,
    deliverables,
    startDate,
    currency,
  } = formData;

  // Get currency symbol for display
  const getCurrencySymbol = (code: string): string => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      AUD: 'A$',
      CAD: 'C$',
      JPY: '¥',
      CHF: 'CHF ',
      CNY: '¥',
      SGD: 'S$',
    };
    return symbols[currency] || currency + ' ';
  };

  const currencySymbol = getCurrencySymbol(currency || 'USD');

  // Build comprehensive prompt for Groq AI
  const systemPrompt = `You are an experienced professional consultant who writes clear, practical, and client-ready project proposals.

Rules:
- Write in professional, human, business-friendly language
- Avoid buzzwords, hype, or exaggerated claims
- Be specific and structured
- Do NOT promise unrealistic outcomes
- Focus on clarity, scope, timelines, and deliverables
- Use simple headings and bullet points
- The proposal must be suitable to send directly to a real client
- Do not mention AI or automated generation

IMPORTANT: You must respond with a valid JSON object containing these exact fields:
{
  "executiveSummary": "2-3 paragraph compelling summary",
  "scopeOfWork": "detailed project scope including approach and methodology",
  "pricingBreakdown": "detailed cost breakdown with payment terms",
  "timeline": "detailed project timeline with phases and milestones",
  "termsAndConditions": "professional terms covering acceptance, scope, IP, confidentiality, etc."
}

Make each section detailed and professional (200-400 words per section).`;

  const userPrompt = `Create a professional proposal with the following details:

CLIENT INFORMATION:
- Name: ${clientName}
- Company: ${clientCompany || 'N/A'}

PROJECT DETAILS:
- Title: ${projectTitle}
- Description: ${projectDescription}
${deliverables ? `- Key Deliverables:\n${deliverables}` : ''}

PROJECT PARAMETERS:
- Budget: ${budget}
- Currency: ${currency || 'USD'} (use currency symbol "${currencySymbol}" throughout the proposal)
- Timeline: ${timeline}
${startDate ? `- Start Date: ${startDate}` : ''}

IMPORTANT CURRENCY INSTRUCTIONS:
- Use "${currencySymbol}" as the currency symbol throughout the pricing section
- Format prices as "${currencySymbol}X,XXX" (e.g., "${currencySymbol}5,000")
- All monetary values must use the ${currency || 'USD'} currency

Please generate a comprehensive, professional proposal that demonstrates expertise and builds client confidence.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the AI response
    const aiContent = JSON.parse(content);

    // Validate and ensure all fields exist
    return {
      executiveSummary: aiContent.executiveSummary || 'Executive summary will be generated.',
      scopeOfWork: aiContent.scopeOfWork || 'Scope of work will be detailed.',
      pricingBreakdown: aiContent.pricingBreakdown || `Total Budget: ${budget}`,
      timeline: aiContent.timeline || `Estimated Timeline: ${timeline}`,
      termsAndConditions: aiContent.termsAndConditions || 'Standard terms will apply.',
    };
  } catch (error) {
    console.error('AI generation error:', error);

    // Fallback to template-based generation if AI fails
    console.log('Falling back to template-based generation');
    return generateTemplateBasedContent(formData);
  }
}

function generateTemplateBasedContent(formData: any): ProposalContent {
  const { projectTitle, projectDescription, budget, timeline, deliverables, startDate, currency } = formData;

  // Get currency symbol
  const getCurrencySymbol = (curr: string): string => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      AUD: 'A$',
      CAD: 'C$',
      JPY: '¥',
      CHF: 'CHF ',
      CNY: '¥',
      SGD: 'S$',
    };
    return symbols[curr] || curr + ' ';
  };

  const currencySymbol = getCurrencySymbol(currency || 'USD');

  const executiveSummary = `We are pleased to present this proposal for ${projectTitle}. This document outlines our understanding of your requirements and our proposed approach to delivering a successful solution.\n\nBased on our initial discussions, we understand that you need ${projectDescription}\n\nOur team is excited about the opportunity to work with you and is confident in our ability to deliver results that meet your specific needs.`;

  const scopeOfWork = `Project Overview\n${projectDescription}\n\n${deliverables ? `Key Deliverables\n${deliverables.split('\n').filter((d: string) => d.trim()).map((d: string) => `• ${d.replace(/^[-•]\s*/, '')}`).join('\n')}\n\n` : ''}Our Approach\n• We will follow industry best practices to ensure quality deliverables\n• Regular communication and progress updates throughout the project\n• Flexible approach to accommodate necessary adjustments\n• Quality assurance at each stage`;

  const budgetNum = parseFloat(budget.replace(/[^0-9.]/g, '')) || 0;
  const pricingBreakdown = `Total Project Cost: ${currencySymbol}${budgetNum.toLocaleString()}\n\nThis includes\n• Project planning and requirements\n• Development and implementation\n• Testing and quality assurance\n• Project management and communication\n• Documentation and handover\n\nPayment Terms\n• 50% deposit to begin work\n• 50% on completion and delivery\n\nThe pricing is fixed for the scope outlined above. Any additional work outside this scope will be discussed and quoted separately.`;

  const timelineContent = `Estimated Duration: ${timeline}\n\n${startDate ? `Proposed Start Date: ${new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n` : ''}Project Phases\n\n1. Discovery & Planning\n   Requirements gathering, analysis, and project planning\n   Duration: ~15% of timeline\n\n2. Development & Execution\n   Core implementation with regular progress reviews\n   Duration: ~60% of timeline\n\n3. Testing & Refinement\n   Quality assurance, testing, and refinements\n   Duration: ~20% of timeline\n\n4. Delivery & Handover\n   Final delivery, documentation, and training\n   Duration: ~5% of timeline`;

  const termsAndConditions = `1. Acceptance\nThis proposal is valid for 30 days from the date of issue.\n\n2. Scope\nThis proposal covers the work described above. Any additional work will require a separate agreement.\n\n3. Timeline\nThe estimated timeline may vary based on client feedback and response times.\n\n4. Payment\nPayment terms as outlined in the pricing section must be followed.\n\n5. Intellectual Property\nAll deliverables and intellectual property will transfer to the client upon full payment.\n\n6. Confidentiality\nBoth parties agree to maintain confidentiality of proprietary information shared during this project.\n\n7. Cancellation\nEither party may terminate this agreement with 14 days written notice. Work completed will be billed proportionally.`;

  return {
    executiveSummary,
    scopeOfWork,
    pricingBreakdown,
    timeline: timelineContent,
    termsAndConditions,
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.json();

    // Validate required fields
    const requiredFields = ['clientName', 'clientEmail', 'projectTitle', 'projectDescription', 'budget', 'timeline'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service not configured. Please add GROQ_API_KEY to environment variables.' },
        { status: 500 }
      );
    }

    console.log('Generating proposal with AI...');
    console.log('Form data:', {
      projectTitle: formData.projectTitle,
      clientName: formData.clientName,
      budget: formData.budget,
      timeline: formData.timeline,
    });

    // Generate professional proposal content using Groq AI
    const content = await generateProposalWithAI(formData);

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

    // Check proposal limit for free users (max 3 proposals)
    const proposalCount = await prisma.proposal.count({
      where: { userId: user.id }
    });

    if (proposalCount >= 3) {
      return NextResponse.json(
        {
          error: 'FREE_TIER_LIMIT',
          message: 'You\'ve reached your free plan limit of 3 proposals. Upgrade to Pro for unlimited proposals.',
          upgradeUrl: '/pricing'
        },
        { status: 403 }
      );
    }

    // Save proposal to database
    const proposal = await prisma.proposal.create({
      data: {
        userId: user.id,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientCompany: formData.clientCompany || '',
        projectTitle: formData.projectTitle,
        projectDescription: formData.projectDescription,
        budget: formData.budget,
        currency: formData.currency || 'USD',
        timeline: formData.timeline,
        startDate: formData.startDate || null,
        deliverables: formData.deliverables || '',
        status: 'draft',
        // Store AI-generated content
        executiveSummary: content.executiveSummary,
        scopeOfWork: content.scopeOfWork,
        pricingBreakdown: content.pricingBreakdown,
        timelineDetails: content.timeline,
        termsAndConditions: content.termsAndConditions,
      },
    });

    console.log('✅ AI-powered proposal created successfully in database:', {
      id: proposal.id,
      userId: user.id,
      projectTitle: proposal.projectTitle,
      status: proposal.status,
    });

    return NextResponse.json({
      success: true,
      proposalId: proposal.id,
      message: 'Proposal generated successfully using AI and saved to database',
    });

  } catch (error) {
    console.error('Proposal generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate proposal' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
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

    // Get all proposals for this user
    const proposals = await prisma.proposal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      proposals,
    });

  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}
