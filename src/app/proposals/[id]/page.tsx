'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import SignatureModal from '@/components/SignatureModal';
import ShareModal from '@/components/ShareModal';

interface ProposalContent {
  executiveSummary: string;
  scopeOfWork: string;
  pricingBreakdown: string;
  timeline: string;
  termsAndConditions: string;
}

interface Proposal {
  id: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  projectTitle: string;
  projectDescription: string;
  budget: string;
  currency: string;
  timeline: string;
  startDate: string;
  deliverables: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
  content: ProposalContent;
  signatureStatus?: string;
  freelancerSignedAt?: string;
  clientSignedAt?: string;
  freelancerSignatureData?: string;
  freelancerSignatureType?: string;
  clientSignatureData?: string;
  clientSignatureType?: string;
  invoiceId?: string;
  hasInvoice?: boolean;
}

// Currency symbol mapping
const getCurrencySymbol = (currencyCode: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    AUD: 'A$',
    CAD: 'C$',
    SGD: 'S$',
    JPY: '¥',
    AED: 'د.إ',
  };
  return symbols[currencyCode] || currencyCode + ' ';
};

export default function ProposalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }

    fetchProposal();
  }, [session, status, params.id]);

  useEffect(() => {
    if (proposal) {
      fetchTimeline();
    }
  }, [proposal]);

  const fetchTimeline = async () => {
    if (!proposal) return;

    try {
      const response = await fetch(`/api/proposals/${params.id}/timeline`);
      const data = await response.json();

      if (response.ok) {
        setTimeline(data.activities || []);
        setTotalViews(data.totalViews || 0);
      }
    } catch (err) {
      console.error('Failed to fetch timeline:', err);
    }
  };

  const fetchProposal = async () => {
    try {
      console.log('Fetching proposal with ID:', params.id);
      const response = await fetch(`/api/proposals/${params.id}`);
      const data = await response.json();

      console.log('Fetch response:', data);
      console.log('Response status:', response.status);

      if (response.ok) {
        console.log('Proposal loaded successfully');
        setProposal(data.proposal);
      } else {
        console.error('Failed to load proposal:', data.error);
        setError(data.error || 'Failed to load proposal');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendProposal = () => {
    setShowShareModal(true);
  };

  const handleDownloadPDF = async () => {
    if (!proposal) return;

    // Find and update the PDF button
    const pdfButton = document.querySelector('button[onClick*="handleDownloadPDF"]') as HTMLButtonElement;

    try {
      const { default: jsPDF } = await import('jspdf');

      // Show loading state
      if (pdfButton) {
        pdfButton.disabled = true;
        pdfButton.textContent = 'Generating...';
      }

      // Create PDF
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

      // Helper function to add footer to current page
      const addFooter = () => {
        const footerY = pageHeight - 15;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text('Powered by AXIOM', pageWidth - margin - 30, footerY);
      };

      // Track pages for footer
      let pageCount = 1;

      // Helper function to add text with word wrap
      const addText = (text: string, fontSize: number, isBold: boolean = false, marginTop: number = 0) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');

        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          if (yPosition > pageHeight - margin - 20) {
            // Add footer to current page before adding new page
            addFooter();
            doc.addPage();
            pageCount++;
            // Add white background to new page
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

      // Helper function to check if we need a new page
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin - 20) {
          // Add footer to current page before adding new page
          addFooter();
          doc.addPage();
          pageCount++;
          // Add white background to new page
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
          doc.setTextColor(0, 0, 0);
          yPosition = margin;
        }
      };

      // First page - White background with black text
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

      // Draw line
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;

      // Client Information
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

      // Project Information
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
      doc.text(`Budget: ${getCurrencySymbol(proposal.currency)}${proposal.budget}`, margin + 5, yPosition);
      yPosition += 7;
      doc.text(`Timeline: ${proposal.timeline}`, margin + 5, yPosition);
      yPosition += 15;

      // Draw line
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;

      // Executive Summary
      checkPageBreak(20);
      doc.setFontSize(18);
      doc.setFont('times', 'bold');
      doc.text('Executive Summary', margin, yPosition);
      yPosition += 10;

      addText(proposal.content.executiveSummary, 11, false, 15);

      // Scope of Work
      checkPageBreak(20);
      doc.setFontSize(18);
      doc.setFont('times', 'bold');
      doc.text('Scope of Work', margin, yPosition);
      yPosition += 10;

      addText(proposal.content.scopeOfWork, 11, false, 15);

      // Project Timeline
      checkPageBreak(20);
      doc.setFontSize(18);
      doc.setFont('times', 'bold');
      doc.text('Project Timeline', margin, yPosition);
      yPosition += 10;

      addText(proposal.content.timeline, 11, false, 15);

      // Pricing
      checkPageBreak(20);
      doc.setFontSize(18);
      doc.setFont('times', 'bold');
      doc.text('Pricing & Payment Terms', margin, yPosition);
      yPosition += 10;

      addText(proposal.content.pricingBreakdown, 11, false, 15);

      // Terms
      checkPageBreak(20);
      doc.setFontSize(18);
      doc.setFont('times', 'bold');
      doc.text('Terms and Conditions', margin, yPosition);
      yPosition += 10;

      addText(proposal.content.termsAndConditions, 10, false, 15);

      // Add footer and date to last page
      const footerY = pageHeight - 15;
      addFooter();

      const createdDate = new Date(proposal.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 150);
      doc.text(`Created on ${createdDate}`, margin, footerY);

      // Save PDF
      const filename = `${proposal.projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_proposal.pdf`;
      doc.save(filename);

      // Reset button
      if (pdfButton) {
        pdfButton.disabled = false;
        pdfButton.innerHTML = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Export PDF';
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
      // Reset button on error
      if (pdfButton) {
        pdfButton.disabled = false;
        pdfButton.innerHTML = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Export PDF';
      }
    }
  };

  const handleSignProposal = async (signatureData: { type: 'drawn' | 'typed'; data: string }) => {
    if (!proposal) return;

    setIsSigning(true);
    try {
      const response = await fetch(`/api/proposals/${params.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureType: signatureData.type,
          signatureData: signatureData.data,
          role: 'freelancer',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update proposal with new signature status
        setProposal(prev => prev ? {
          ...prev,
          signatureStatus: data.proposal.signatureStatus,
          freelancerSignedAt: data.proposal.freelancerSignedAt,
          freelancerSignatureData: data.proposal.freelancerSignatureData,
          freelancerSignatureType: data.proposal.freelancerSignatureType,
        } : null);

        alert('✅ Proposal signed successfully! You can now send it to your client for their signature.');
        setShowSignatureModal(false);
      } else {
        alert(`❌ Failed to sign proposal: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Signature error:', err);
      alert('❌ Failed to sign proposal. Please try again.');
    } finally {
      setIsSigning(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!proposal) return;

    setIsGeneratingInvoice(true);
    try {
      const response = await fetch(`/api/proposals/${params.id}/generate-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          taxRate: 0,
          // Don't send currency - let the API inherit it from the proposal
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setInvoiceId(data.invoice.id);
        setProposal(prev => prev ? { ...prev, hasInvoice: true, invoiceId: data.invoice.id } : null);

        const paymentLinkMessage = data.invoice.paymentLink
          ? `\n\n✨ Payment link created automatically!\nYour client can now pay directly via the "Pay Now" button.`
          : '';

        alert(`✅ Invoice generated successfully!\n\nInvoice Number: ${data.invoice.invoiceNumber}\nTotal: $${data.invoice.total.toFixed(2)}${paymentLinkMessage}\n\nYou can view it anytime from the dashboard.`);
      } else {
        alert(`❌ Failed to generate invoice: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Invoice generation error:', err);
      alert('❌ Failed to generate invoice. Please try again.');
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const renderSignature = (signatureData: string, signatureType: string) => {
    if (signatureType === 'drawn') {
      return (
        <img
          src={signatureData}
          alt="Signature"
          className="h-16 max-w-xs"
        />
      );
    } else {
      const [name, font] = signatureData.split('|');
      const fontVar = font === 'Dancing Script' ? 'var(--font-dancing-script)' :
                      font === 'Great Vibes' ? 'var(--font-great-vibes)' :
                      'var(--font-herr-von-muellerhoff)';
      return (
        <p
          className="text-3xl"
          style={{ fontFamily: fontVar }}
        >
          {name}
        </p>
      );
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading proposal...</div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  if (error || !proposal) {
    return (
      <Layout currentPage="proposals">
        <div className="min-h-screen px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/50">
              <h1 className="text-2xl text-white mb-4">Error</h1>
              <p className="text-white/80 mb-6">{error || 'Proposal not found'}</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-white text-black font-light rounded-lg hover:bg-white/90 transition-all"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="proposal-detail">
      {/* Solid black background overlay for proposal page */}
      <div className="fixed inset-0 bg-black -z-10" />

      {/* Mobile Header - Sticky with one primary action + more menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg border-b border-white/10">
        {/* Header Top Row */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-white/70 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendProposal}
              className="h-10 px-4 bg-white text-black rounded-full text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>

            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="h-10 w-10 flex items-center justify-center bg-white/10 rounded-full text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Action Menu - INSIDE header, pushes content down */}
        {showActionMenu && (
          <div className="px-4 pb-4 border-t border-white/10 bg-black/95">
            <div className="pt-4 space-y-2">
              <button
                onClick={() => { handleDownloadPDF(); setShowActionMenu(false); }}
                className="w-full h-14 flex items-center gap-4 px-4 bg-white/10 rounded-2xl text-white hover:bg-white/20"
              >
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium">Export PDF</p>
                  <p className="text-xs text-white/50">Download as PDF</p>
                </div>
              </button>

              {invoiceId ? (
                <Link
                  href={`/invoices/${invoiceId}`}
                  onClick={() => setShowActionMenu(false)}
                  className="w-full h-14 flex items-center gap-4 px-4 bg-white/10 rounded-2xl text-white hover:bg-white/20"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">View Invoice</p>
                    <p className="text-xs text-white/50">See generated invoice</p>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => { handleGenerateInvoice(); setShowActionMenu(false); }}
                  disabled={isGeneratingInvoice}
                  className="w-full h-14 flex items-center gap-4 px-4 bg-white/10 rounded-2xl text-white hover:bg-white/20 disabled:opacity-50"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Generate Invoice</p>
                    <p className="text-xs text-white/50">Create invoice from proposal</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="min-h-screen px-4 pt-20 pb-32 lg:pt-24 lg:pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Desktop Header - Full actions */}
          <div className="hidden lg:block mb-8 flex justify-between items-start">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-4xl sm:text-5xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                {proposal.projectTitle}
              </h1>
              <p className="text-white/60 mt-2" style={{ fontFamily: 'var(--font-inter)' }}>
                Proposal ID: {proposal.id}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                className="px-6 py-3 border border-white/30 text-white font-light rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </button>
              <button
                onClick={handleSendProposal}
                className="px-6 py-3 bg-white text-black font-light rounded-lg hover:bg-white/90 transition-all flex items-center gap-2"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share with Client
              </button>
              {invoiceId ? (
                <Link
                  href={`/invoices/${invoiceId}`}
                  className="px-6 py-3 bg-white text-black font-light rounded-lg hover:bg-white/90 transition-all flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  View Invoice
                </Link>
              ) : (
                <button
                  onClick={handleGenerateInvoice}
                  disabled={isGeneratingInvoice}
                  className="px-6 py-3 bg-white text-black font-light rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {isGeneratingInvoice ? 'Generating...' : 'Generate Invoice'}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Title */}
          <div className="lg:hidden mb-6 pt-2">
            <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
              {proposal.projectTitle}
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {proposal.id.slice(0, 8)}...
            </p>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-light ${
              proposal.status === 'draft' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
              proposal.status === 'sent' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
              proposal.status === 'accepted' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
              'bg-red-500/20 text-red-300 border border-red-500/30'
            }`} style={{ fontFamily: 'var(--font-inter)' }}>
              Status: {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </span>
          </div>

          {/* Proposal Document - Space Themed */}
          <div id="proposal-document" className="bg-black/70 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
            {/* Document Header */}
            <div className="bg-white/10 backdrop-blur-sm p-8 border-b border-white/20">
              <h2 className="text-4xl text-white mb-2 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                Project Proposal
              </h2>
              <p className="text-white/90" style={{ fontFamily: 'var(--font-inter)' }}>
                Prepared for {proposal.clientName}
                {proposal.clientCompany && ` at ${proposal.clientCompany}`}
              </p>
            </div>

            {/* Document Body */}
            <div className="p-8 text-white">
              {/* Client & Project Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-white/20">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-light mb-4 text-white/90" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Client Information
                  </h3>
                  <p className="text-sm text-white mb-2"><strong className="text-white">Name:</strong> {proposal.clientName}</p>
                  <p className="text-sm text-white mb-2"><strong className="text-white">Email:</strong> {proposal.clientEmail}</p>
                  {proposal.clientCompany && (
                    <p className="text-sm text-white"><strong className="text-white">Company:</strong> {proposal.clientCompany}</p>
                  )}
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-light mb-4 text-white/90" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Project Information
                  </h3>
                  <p className="text-sm text-white mb-2"><strong className="text-white">Title:</strong> {proposal.projectTitle}</p>
                  <p className="text-sm text-white mb-2"><strong className="text-white">Budget:</strong> {getCurrencySymbol(proposal.currency)}{proposal.budget}</p>
                  <p className="text-sm text-white"><strong className="text-white">Timeline:</strong> {proposal.timeline}</p>
                </div>
              </div>

              {/* Executive Summary */}
              <section className="mb-8 pb-8 border-b border-white/20">
                <h3 className="text-2xl font-light mb-4 text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <div className="w-10 h-10 bg-purple-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Executive Summary
                </h3>
                <div className="text-white whitespace-pre-line leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                  {proposal.content.executiveSummary}
                </div>
              </section>

              {/* Scope of Work */}
              <section className="mb-8 pb-8 border-b border-white/20">
                <h3 className="text-2xl font-light mb-4 text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Scope of Work
                </h3>
                <div className="text-white whitespace-pre-line leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                  {proposal.content.scopeOfWork}
                </div>
              </section>

              {/* Timeline */}
              <section className="mb-8 pb-8 border-b border-white/20">
                <h3 className="text-2xl font-light mb-4 text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <div className="w-10 h-10 bg-green-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Project Timeline
                </h3>
                <div className="text-white whitespace-pre-line leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                  {proposal.content.timeline}
                </div>
              </section>

              {/* Pricing */}
              <section className="mb-8 pb-8 border-b border-white/20">
                <h3 className="text-2xl font-light mb-4 text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <div className="w-10 h-10 bg-amber-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  Pricing & Payment Terms
                </h3>
                <div className="text-white whitespace-pre-line leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                  {proposal.content.pricingBreakdown}
                </div>
              </section>

              {/* Terms */}
              <section className="mb-8">
                <h3 className="text-2xl font-light mb-4 text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <div className="w-10 h-10 bg-cyan-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Terms and Conditions
                </h3>
                <div className="text-white/80 whitespace-pre-line leading-relaxed text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                  {proposal.content.termsAndConditions}
                </div>
              </section>
            </div>

            {/* Document Footer */}
            <div className="bg-white/5 backdrop-blur-sm p-6 border-t border-white/10">
              <div className="flex justify-between items-center text-sm text-white/70">
                <div style={{ fontFamily: 'var(--font-inter)' }}>
                  Created on {new Date(proposal.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="font-light text-white/60" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Powered by AXIOM
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mt-8 bg-white/15 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl text-white mb-6 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
              Digital Signatures
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Freelancer Signature */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg text-white font-light" style={{ fontFamily: 'var(--font-inter)' }}>
                    Your Signature
                  </h4>
                  {proposal.freelancerSignedAt ? (
                    <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Signed
                    </span>
                  ) : (
                    <span className="text-white/50 text-xs">Not signed</span>
                  )}
                </div>

                {proposal.freelancerSignatureData ? (
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4">
                      {renderSignature(proposal.freelancerSignatureData, proposal.freelancerSignatureType || 'drawn')}
                    </div>
                    <p className="text-white/60 text-xs" style={{ fontFamily: 'var(--font-inter)' }}>
                      Signed on {new Date(proposal.freelancerSignedAt || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/50 text-sm mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
                      Sign this proposal to request client signature
                    </p>
                    <button
                      onClick={() => setShowSignatureModal(true)}
                      disabled={isSigning}
                      className="px-6 py-3 bg-white text-black rounded-full hover:bg-white/90 transition-all disabled:opacity-50 text-sm font-light"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {isSigning ? 'Signing...' : 'Sign Proposal'}
                    </button>
                  </div>
                )}
              </div>

              {/* Client Signature */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg text-white font-light" style={{ fontFamily: 'var(--font-inter)' }}>
                    Client Signature
                  </h4>
                  {proposal.clientSignedAt ? (
                    <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Signed
                    </span>
                  ) : proposal.signatureStatus === 'pending_client' ? (
                    <span className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pending
                    </span>
                  ) : (
                    <span className="text-white/50 text-xs">Waiting for you</span>
                  )}
                </div>

                {proposal.clientSignatureData ? (
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4">
                      {renderSignature(proposal.clientSignatureData, proposal.clientSignatureType || 'drawn')}
                    </div>
                    <p className="text-white/60 text-xs" style={{ fontFamily: 'var(--font-inter)' }}>
                      Signed on {new Date(proposal.clientSignedAt || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/50 text-sm mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
                      {proposal.signatureStatus === 'not_started'
                        ? 'Sign the proposal first to send it to your client'
                        : proposal.signatureStatus === 'pending_client'
                        ? 'Waiting for client to sign'
                        : 'Waiting for signatures'}
                    </p>
                    {proposal.signatureStatus === 'signed' && (
                      <div className="flex items-center justify-center gap-2 text-green-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-light">Both parties have signed</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          {timeline.length > 0 && (
            <div className="mt-8 bg-white/15 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Activity Timeline
                </h3>
                {totalViews > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-sm text-white/90">{totalViews} {totalViews === 1 ? 'view' : 'views'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {timeline.map((activity, index) => {
                  const getActivityIcon = (type: string) => {
                    switch (type) {
                      case 'created':
                        return (
                          <div className="w-10 h-10 bg-purple-500/30 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        );
                      case 'shared':
                        return (
                          <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </div>
                        );
                      case 'viewed':
                        return (
                          <div className="w-10 h-10 bg-green-500/30 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                        );
                      case 'signed':
                        return (
                          <div className="w-10 h-10 bg-indigo-500/30 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        );
                      case 'invoice_generated':
                        return (
                          <div className="w-10 h-10 bg-yellow-500/30 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                        );
                      default:
                        return (
                          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        );
                    }
                  };

                  return (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 pb-4 border-l border-white/10 pl-6 relative">
                        {index !== timeline.length - 1 && (
                          <div className="absolute left-0 top-10 w-0.5 h-full bg-white/10" />
                        )}
                        <div className="mb-1">
                          <p className="text-white font-medium">{activity.description}</p>
                        </div>
                        <p className="text-white/50 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                          {new Date(activity.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSubmit={handleSignProposal}
        title="Sign Proposal"
      />

      {/* Share Modal */}
      {proposal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          type="proposal"
          id={params.id as string}
          title={proposal.projectTitle}
        />
      )}
    </Layout>
  );
}
