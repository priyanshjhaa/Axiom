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
  } = formData;

  // Build comprehensive prompt for Groq AI
  const systemPrompt = `You are an expert proposal writer with years of experience in creating professional, winning proposals. Your task is to transform project requirements into a polished, client-ready proposal.

Your proposal must be:
- Professional and concise
- Persuasive but realistic
- Well-structured and easy to read
- Tailored to the specific project

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
- Timeline: ${timeline}
${startDate ? `- Start Date: ${startDate}` : ''}

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
  const { projectTitle, projectDescription, budget, timeline, deliverables, startDate } = formData;

  const executiveSummary = `We are pleased to present this proposal for ${projectTitle}. This document outlines our understanding of your requirements and our proposed approach to delivering a successful solution.\n\nBased on our initial discussions, we understand that you need ${projectDescription}\n\nOur team is excited about the opportunity to work with you and is confident in our ability to deliver exceptional results that meet your specific needs.`;

  const scopeOfWork = `Project Overview:\n${projectDescription}\n\n${deliverables ? `Key Deliverables:\n${deliverables.split('\n').filter((d: string) => d.trim()).map((d: string) => `• ${d.replace(/^[-•]\s*/, '')}`).join('\n')}` : ''}\n\nOur Approach:\n• We will follow industry best practices to ensure high-quality deliverables\n• Regular communication and progress updates throughout the project\n• Flexible approach to accommodate any necessary adjustments\n• Quality assurance at every stage of development`;

  const budgetNum = parseFloat(budget.replace(/[^0-9.]/g, '')) || 0;
  const pricingBreakdown = `Total Project Cost: $${budgetNum.toLocaleString()}\n\nThis includes:\n• Project planning and requirement analysis\n• Development and implementation\n• Testing and quality assurance\n• Project management and communication\n• Documentation and handover\n\nPayment Terms:\n• 50% deposit to commence work\n• 50% on completion and delivery\n\nThe pricing is fixed for the scope outlined above. Any additional requirements outside this scope will be discussed and quoted separately.`;

  const timelineContent = `Estimated Duration: ${timeline}\n\n${startDate ? `Proposed Start Date: ${new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n` : ''}Project Phases:\n\n1. Discovery & Planning Phase\n   • Requirements gathering and analysis\n   • Project planning and milestone definition\n   • Duration: ~15% of timeline\n\n2. Development/Execution Phase\n   • Core implementation\n   • Regular progress reviews\n   • Duration: ~60% of timeline\n\n3. Testing & Refinement Phase\n   • Quality assurance and testing\n   • Refinements based on feedback\n   • Duration: ~20% of timeline\n\n4. Delivery & Handover Phase\n   • Final delivery\n   • Documentation and training\n   • Duration: ~5% of timeline`;

  const termsAndConditions = `1. Acceptance: This proposal is valid for 30 days from the date of issue.\n\n2. Scope: This proposal covers the work described above. Any additional work will require a separate agreement.\n\n3. Timeline: The estimated timeline may vary based on client feedback and response times.\n\n4. Payment: Payment terms as outlined in the pricing section must be strictly followed.\n\n5. Intellectual Property: All deliverables and intellectual property will be transferred to the client upon full payment.\n\n6. Confidentiality: Both parties agree to maintain confidentiality of all proprietary information shared during this project.\n\n7. Cancellation: Either party may terminate this agreement with 14 days written notice. Work completed up to that point will be billed proportionally.`;

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

export async function GET(request: NextRequest) {
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
