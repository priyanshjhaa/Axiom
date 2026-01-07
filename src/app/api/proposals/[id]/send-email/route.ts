import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import jsPDF from 'jspdf';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposalId = params.id;

    // Fetch proposal from database
    const prisma = (await import('@/lib/db')).default;
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Generate PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper functions
    const addText = (text: string, fontSize: number, isBold: boolean = false, marginTop: number = 0) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');

      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
          doc.setTextColor(0, 0, 0);
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += fontSize * 0.5;
      });

      yPosition += marginTop;
    };

    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        doc.setTextColor(0, 0, 0);
        yPosition = margin;
      }
    };

    // Generate PDF content
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(28);
    doc.setFont('times', 'normal');
    doc.text('Project Proposal', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Prepared for ${proposal.clientName}${proposal.clientCompany ? ` at ${proposal.clientCompany}` : ''}`, margin, yPosition);
    yPosition += 20;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    checkPageBreak(40);
    doc.setFontSize(16);
    doc.setFont('times', 'bold');
    doc.text('Client Information', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${proposal.clientName}`, margin + 5, yPosition);
    yPosition += 7;
    doc.text(`Email: ${proposal.clientEmail}`, margin + 5, yPosition);
    yPosition += 7;
    if (proposal.clientCompany) {
      doc.text(`Company: ${proposal.clientCompany}`, margin + 5, yPosition);
      yPosition += 7;
    }

    yPosition += 8;
    checkPageBreak(30);
    doc.setFontSize(16);
    doc.setFont('times', 'bold');
    doc.text('Project Information', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Title: ${proposal.projectTitle}`, margin + 5, yPosition);
    yPosition += 7;
    doc.text(`Budget: $${proposal.budget}`, margin + 5, yPosition);
    yPosition += 7;
    doc.text(`Timeline: ${proposal.timeline}`, margin + 5, yPosition);
    yPosition += 15;

    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    checkPageBreak(20);
    doc.setFontSize(18);
    doc.setFont('times', 'bold');
    doc.text('Executive Summary', margin, yPosition);
    yPosition += 10;

    addText(proposal.content!.executiveSummary, 11, false, 15);

    checkPageBreak(20);
    doc.setFontSize(18);
    doc.setFont('times', 'bold');
    doc.text('Scope of Work', margin, yPosition);
    yPosition += 10;

    addText(proposal.content!.scopeOfWork, 11, false, 15);

    checkPageBreak(20);
    doc.setFontSize(18);
    doc.setFont('times', 'bold');
    doc.text('Project Timeline', margin, yPosition);
    yPosition += 10;

    addText(proposal.content!.timeline, 11, false, 15);

    checkPageBreak(20);
    doc.setFontSize(18);
    doc.setFont('times', 'bold');
    doc.text('Pricing & Payment Terms', margin, yPosition);
    yPosition += 10;

    addText(proposal.content!.pricingBreakdown, 11, false, 15);

    checkPageBreak(20);
    doc.setFontSize(18);
    doc.setFont('times', 'bold');
    doc.text('Terms and Conditions', margin, yPosition);
    yPosition += 10;

    addText(proposal.content!.termsAndConditions, 10, false, 15);

    // Footer
    yPosition = pageHeight - 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    const createdDate = new Date(proposal.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    doc.text(`Created on ${createdDate}`, margin, yPosition);
    doc.text('Powered by AXIOM', pageWidth - margin - 30, yPosition);

    // Convert PDF to buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Create email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Project Proposal</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 300; letter-spacing: 1px;">AXIOM</h1>
            </div>

            <!-- Content -->
            <div style="padding: 40px 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #333;">
                Hi <strong>${proposal.clientName}</strong>,
              </p>

              <p style="margin: 0 0 30px; font-size: 15px; line-height: 1.6; color: #555;">
                Thank you for your interest! Please find attached the detailed project proposal for <strong>${proposal.projectTitle}</strong>.
              </p>

              <div style="background: #f9f9f9; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 15px; font-size: 16px; color: #333;">Proposal Highlights:</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #555;">
                  <li style="margin-bottom: 8px;">Project: ${proposal.projectTitle}</li>
                  <li style="margin-bottom: 8px;">Budget: $${proposal.budget}</li>
                  <li style="margin-bottom: 8px;">Timeline: ${proposal.timeline}</li>
                </ul>
              </div>

              <p style="margin: 30px 0 10px; font-size: 15px; line-height: 1.6; color: #555;">
                The attached PDF includes:
              </p>

              <ul style="margin: 0 0 30px; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #555;">
                <li>Complete project scope and deliverables</li>
                <li>Detailed timeline with milestones</li>
                <li>Comprehensive pricing breakdown</li>
                <li>Terms and conditions</li>
              </ul>

              <p style="margin: 30px 0 10px; font-size: 15px; line-height: 1.6; color: #555;">
                Please review the proposal and let me know if you have any questions or would like to discuss further.
              </p>

              <p style="margin: 30px 0 0; font-size: 15px; line-height: 1.6; color: #555;">
                Looking forward to working together!
              </p>

              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="margin: 0; font-size: 14px; color: #888;">
                  Best regards,<br>
                  <span style="color: #333; font-weight: 500;">Your Team</span>
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f9f9f9; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                This proposal was sent via <strong style="color: #667eea;">AXIOM</strong> - Proposal Management Platform
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    const data = await resend.emails.send({
      from: 'AXIOM Proposals <onboarding@resend.dev>', // You can customize this
      to: proposal.clientEmail,
      subject: `Project Proposal: ${proposal.projectTitle}`,
      html: emailHtml,
      attachments: [
        {
          filename: `${proposal.projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_proposal.pdf`,
          content: pdfBuffer.toString('base64'),
        },
      ],
    });

    // Update proposal status
    await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: 'sent' },
    });

    return NextResponse.json({
      success: true,
      messageId: data.id,
      message: 'Proposal sent successfully!'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
