'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import ShareModal from '@/components/ShareModal';
import Link from 'next/link';
import jsPDF from 'jspdf';

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  currency: string;
  lineItems: LineItem[] | string; // Can be array or JSON string
  notes: string;
  terms: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  paymentLink?: string | null;
  payments?: Payment[];
  proposal: {
    projectTitle: string;
  };
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

// Helper function to parse lineItems from JSON string or return array
const parseLineItems = (lineItems: LineItem[] | string): LineItem[] => {
  if (Array.isArray(lineItems)) {
    return lineItems;
  }
  try {
    return JSON.parse(lineItems as string);
  } catch {
    return [];
  }
};

export default function InvoicePage() {
  const params = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [params.id]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setInvoice(data.invoice);
      } else {
        console.error('Failed to fetch invoice:', data.error);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!invoice) return;

    setDownloading(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;

      // Clean and format currency - strip any $ symbols and get clean code
      const cleanCurrency = invoice.currency.replace(/[$\s]/g, '').toUpperCase();

      // Currency symbols map
      const currencySymbols: Record<string, string> = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'CAD': '$',
        'AUD': '$',
        'CHF': 'Fr',
        'CNY': '¥',
        'INR': '₹',
      };

      const currencySymbol = currencySymbols[cleanCurrency] || cleanCurrency + ' ';
      const formatAmount = (amount: number) => `${currencySymbol}${amount.toFixed(2)}`;

      // Add AXIOM branding
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('AXIOM', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Professional Invoice Solutions', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Invoice title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Invoice details
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, yPosition);
      yPosition += 15;

      // Bill to section
      doc.setFont('helvetica', 'bold');
      doc.text('Bill To:', 20, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      doc.text(invoice.clientName, 20, yPosition);
      yPosition += 7;
      if (invoice.clientCompany) {
        doc.text(invoice.clientCompany, 20, yPosition);
        yPosition += 7;
      }
      doc.text(invoice.clientEmail, 20, yPosition);
      yPosition += 15;

      // Project title
      doc.setFont('helvetica', 'bold');
      doc.text('Project:', 20, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      doc.text(invoice.proposal.projectTitle, 20, yPosition);
      yPosition += 15;

      // Table header
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('Description', 25, yPosition + 7);
      doc.text('Qty', pageWidth - 80, yPosition + 7);
      doc.text('Rate', pageWidth - 60, yPosition + 7);
      doc.text('Amount', pageWidth - 30, yPosition + 7, { align: 'right' });
      yPosition += 10;

      // Line items
      doc.setFont('helvetica', 'normal');
      const parsedLineItems = parseLineItems(invoice.lineItems);
      parsedLineItems.forEach((item) => {
        const description = doc.splitTextToSize(item.description, pageWidth - 110);
        doc.text(description, 25, yPosition + 7);
        doc.text(item.quantity.toString(), pageWidth - 80, yPosition + 7);
        doc.text(formatAmount(item.rate), pageWidth - 60, yPosition + 7);
        doc.text(formatAmount(item.amount), pageWidth - 30, yPosition + 7, { align: 'right' });
        yPosition += description.length * 7 + 7;
      });

      yPosition += 10;

      // Totals - Right aligned with proper spacing
      const totalsX = pageWidth - 70;
      doc.setFont('helvetica', 'normal');
      doc.text('Subtotal:', totalsX, yPosition);
      doc.text(formatAmount(invoice.subtotal), pageWidth - 25, yPosition, { align: 'right' });
      yPosition += 8;

      if (invoice.taxRate > 0) {
        doc.text(`Tax (${invoice.taxRate}%):`, totalsX, yPosition);
        doc.text(formatAmount(invoice.taxAmount), pageWidth - 25, yPosition, { align: 'right' });
        yPosition += 8;
      }

      // Separator line
      doc.setDrawColor(200, 200, 200);
      doc.line(totalsX, yPosition, pageWidth - 25, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Total:', totalsX, yPosition);
      doc.text(formatAmount(invoice.total), pageWidth - 25, yPosition, { align: 'right' });
      yPosition += 20;

      // Notes and terms
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Notes:', 20, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      const notes = doc.splitTextToSize(invoice.notes || '', pageWidth - 40);
      doc.text(notes, 20, yPosition);
      yPosition += notes.length * 7 + 10;

      if (invoice.terms) {
        doc.setFont('helvetica', 'bold');
        doc.text('Terms:', 20, yPosition);
        yPosition += 7;
        doc.setFont('helvetica', 'normal');
        const terms = doc.splitTextToSize(invoice.terms, pageWidth - 40);
        doc.text(terms, 20, yPosition);
      }

      // Save PDF
      doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Layout currentPage="invoices">
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-white/60 text-sm">Loading invoice...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!invoice) {
    return (
      <Layout currentPage="invoices">
        <div className="min-h-screen px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
              <h1 className="text-2xl text-white mb-4">Invoice Not Found</h1>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-all"
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
    <Layout currentPage="invoices">
      {/* Solid black background overlay */}
      <div className="fixed inset-0 bg-black -z-10" />
      <div className="min-h-screen px-4 py-20 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
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
                {invoice.proposal.projectTitle}
              </h1>
              <p className="text-white/60 mt-2">Invoice: {invoice.invoiceNumber}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={downloadPDF}
                disabled={downloading}
                className="px-4 py-2 border border-white/20 text-white text-xs font-medium rounded hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {downloading ? 'Downloading...' : 'Export PDF'}
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 bg-white text-black text-xs font-medium rounded hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share with Client
              </button>
            </div>
          </div>

          {/* Status Badge & Payment Progress */}
          <div className="mb-6 space-y-4">
            {/* Status Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-light ${
                invoice.status === 'PAID' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                invoice.status === 'PARTIALLY_PAID' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                invoice.status === 'UNPAID' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {invoice.status === 'PARTIALLY_PAID'
                  ? `Partially Paid (${Math.round((invoice.paidAmount / invoice.total) * 100)}%)`
                  : invoice.status.replace('_', ' ')
                }
              </span>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Amount */}
                <div className="text-center">
                  <p className="text-white/60 text-xs mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {getCurrencySymbol(invoice.currency)}{invoice.total.toFixed(2)}
                  </p>
                </div>

                {/* Amount Received */}
                <div className="text-center">
                  <p className="text-white/60 text-xs mb-1">Amount Received</p>
                  <p className={`text-2xl font-bold ${invoice.paidAmount > 0 ? 'text-green-400' : 'text-white/40'}`} style={{ fontFamily: 'var(--font-playfair)' }}>
                    {getCurrencySymbol(invoice.currency)}{invoice.paidAmount.toFixed(2)}
                  </p>
                </div>

                {/* Remaining Amount */}
                <div className="text-center">
                  <p className="text-white/60 text-xs mb-1">Remaining</p>
                  <p className={`text-2xl font-bold ${invoice.remainingAmount > 0 ? 'text-orange-400' : 'text-green-400'}`} style={{ fontFamily: 'var(--font-playfair)' }}>
                    {getCurrencySymbol(invoice.currency)}{invoice.remainingAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Payment Progress Bar */}
              {invoice.paidAmount > 0 && (
                <div className="mt-6">
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        invoice.status === 'PAID'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                      }`}
                      style={{ width: `${Math.min(100, (invoice.paidAmount / invoice.total) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-green-400">
                      {Math.round((invoice.paidAmount / invoice.total) * 100)}% Paid
                    </span>
                    {invoice.remainingAmount > 0 && (
                      <span className="text-white/60">
                        {getCurrencySymbol(invoice.currency)}{invoice.remainingAmount.toFixed(2)} pending
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                {/* Copy Payment Link */}
                {invoice.paymentLink && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(invoice.paymentLink!);
                      alert('Payment link copied to clipboard!');
                    }}
                    className="flex-1 min-w-[200px] px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Payment Link
                  </button>
                )}

                {/* Resend Invoice */}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex-1 min-w-[200px] px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Resend Invoice
                </button>
              </div>
            </div>
          </div>

          {/* Invoice Document - Space Themed */}
          <div className="bg-black/70 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
            {/* Document Header */}
            <div className="bg-white/10 backdrop-blur-sm p-8 border-b border-white/20">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl text-white mb-2 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                    INVOICE
                  </h2>
                  <p className="text-white/90">{invoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm">Issue Date</p>
                  <p className="text-white font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                  <p className="text-white/60 text-sm mt-2">Due Date</p>
                  <p className="text-white font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-8 text-white">
              {/* Client & Project Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-white/20">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-light mb-4 text-white/90" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Bill To
                  </h3>
                  <p className="text-white font-medium mb-1">{invoice.clientName}</p>
                  {invoice.clientCompany && (
                    <p className="text-white/70 text-sm mb-1">{invoice.clientCompany}</p>
                  )}
                  <p className="text-white/70 text-sm">{invoice.clientEmail}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-light mb-4 text-white/90" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Project Details
                  </h3>
                  <p className="text-white font-medium">{invoice.proposal.projectTitle}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 text-sm font-semibold text-white/80">Description</th>
                      <th className="text-center py-3 text-sm font-semibold text-white/80">Qty</th>
                      <th className="text-right py-3 text-sm font-semibold text-white/80">Rate</th>
                      <th className="text-right py-3 text-sm font-semibold text-white/80">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parseLineItems(invoice.lineItems).map((item, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-4 text-white">{item.description}</td>
                        <td className="py-4 text-center text-white">{item.quantity}</td>
                        <td className="py-4 text-right text-white">
                          {getCurrencySymbol(invoice.currency)}{item.rate.toFixed(2)}
                        </td>
                        <td className="py-4 text-right text-white font-medium">
                          {getCurrencySymbol(invoice.currency)}{item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-72">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70">Subtotal:</span>
                    <span className="font-medium text-white">{getCurrencySymbol(invoice.currency)}{invoice.subtotal.toFixed(2)}</span>
                  </div>
                  {invoice.taxRate > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-white/70">Tax ({invoice.taxRate}%):</span>
                      <span className="font-medium text-white">{getCurrencySymbol(invoice.currency)}{invoice.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {(invoice.paidAmount > 0 || invoice.status === 'PARTIALLY_PAID') && (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-green-400">Amount Paid:</span>
                        <span className="font-medium text-green-400">{getCurrencySymbol(invoice.currency)}{invoice.paidAmount.toFixed(2)}</span>
                      </div>
                      {invoice.remainingAmount > 0 && (
                        <div className="flex justify-between mb-2">
                          <span className="text-orange-400">Remaining:</span>
                          <span className="font-medium text-orange-400">{getCurrencySymbol(invoice.currency)}{invoice.remainingAmount.toFixed(2)}</span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between pt-4 border-t border-white/30">
                    <span className="text-lg font-light text-white">Total:</span>
                    <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {getCurrencySymbol(invoice.currency)}{invoice.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              {invoice.payments && invoice.payments.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-light mb-4 text-white/90" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Payment History
                  </h3>
                  <div className="bg-white/5 rounded-xl border border-white/20 overflow-hidden">
                    <div className="divide-y divide-white/10">
                      {invoice.payments.map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center p-4">
                          <div>
                            <p className="text-white font-medium">{getCurrencySymbol(invoice.currency)}{payment.amount.toFixed(2)}</p>
                            <p className="text-white/50 text-xs">{new Date(payment.createdAt).toLocaleString()}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-300 border border-green-500/30">
                            {payment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes & Terms */}
              {invoice.notes && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/90 mb-2">Notes:</h3>
                  <p className="text-white/70 text-sm whitespace-pre-line">{invoice.notes}</p>
                </div>
              )}

              {invoice.terms && (
                <div>
                  <h3 className="text-sm font-semibold text-white/90 mb-2">Terms:</h3>
                  <p className="text-white/70 text-sm whitespace-pre-line">{invoice.terms}</p>
                </div>
              )}
            </div>

            {/* Document Footer */}
            <div className="bg-white/5 backdrop-blur-sm p-6 border-t border-white/10">
              <div className="text-center text-sm text-white/60">
                Powered by <span className="font-light text-white/80" style={{ fontFamily: 'var(--font-playfair)' }}>AXIOM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {invoice && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          type="invoice"
          id={params.id as string}
          title={`Invoice ${invoice.invoiceNumber}`}
        />
      )}
    </Layout>
  );
}
