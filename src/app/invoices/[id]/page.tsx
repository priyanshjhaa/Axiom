'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ShareModal from '@/components/ShareModal';
import jsPDF from 'jspdf';

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
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
  currency: string;
  lineItems: LineItem[];
  notes: string;
  terms: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  paymentLink?: string | null;
  proposal: {
    projectTitle: string;
  };
}

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
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
      invoice.lineItems.forEach((item) => {
        const description = doc.splitTextToSize(item.description, pageWidth - 110);
        doc.text(description, 25, yPosition + 7);
        doc.text(item.quantity.toString(), pageWidth - 80, yPosition + 7);
        doc.text(`${invoice.currency}$${item.rate.toFixed(2)}`, pageWidth - 60, yPosition + 7);
        doc.text(`${invoice.currency}$${item.amount.toFixed(2)}`, pageWidth - 30, yPosition + 7, { align: 'right' });
        yPosition += description.length * 7 + 7;
      });

      yPosition += 10;

      // Totals
      doc.text('Subtotal:', pageWidth - 60, yPosition);
      doc.text(`${invoice.currency}$${invoice.subtotal.toFixed(2)}`, pageWidth - 30, yPosition, { align: 'right' });
      yPosition += 7;

      if (invoice.taxRate > 0) {
        doc.text(`Tax (${invoice.taxRate}%):`, pageWidth - 60, yPosition);
        doc.text(`${invoice.currency}$${invoice.taxAmount.toFixed(2)}`, pageWidth - 30, yPosition, { align: 'right' });
        yPosition += 7;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Total:', pageWidth - 60, yPosition);
      doc.setFontSize(12);
      doc.text(`${invoice.currency}$${invoice.total.toFixed(2)}`, pageWidth - 30, yPosition, { align: 'right' });
      yPosition += 15;

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
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading invoice...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!invoice) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h2>
            <button
              onClick={() => router.back()}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AXIOM</h1>
              <p className="text-gray-600">Professional Invoice Solutions</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
              <p className="text-gray-600">{invoice.invoiceNumber}</p>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill To:</h3>
              <p className="text-gray-700 font-semibold">{invoice.clientName}</p>
              {invoice.clientCompany && (
                <p className="text-gray-600">{invoice.clientCompany}</p>
              )}
              <p className="text-gray-600">{invoice.clientEmail}</p>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="text-sm text-gray-600">Issue Date:</span>
                <span className="ml-2 font-semibold">{new Date(invoice.issueDate).toLocaleDateString()}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-600">Due Date:</span>
                <span className="ml-2 font-semibold">{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Project */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Project:</h3>
            <p className="text-gray-700">{invoice.proposal.projectTitle}</p>
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 text-sm font-semibold text-gray-900">Description</th>
                  <th className="text-center py-3 text-sm font-semibold text-gray-900">Qty</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900">Rate</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 text-gray-700">{item.description}</td>
                    <td className="py-4 text-center text-gray-700">{item.quantity}</td>
                    <td className="py-4 text-right text-gray-700">
                      {invoice.currency}${item.rate.toFixed(2)}
                    </td>
                    <td className="py-4 text-right text-gray-700 font-semibold">
                      {invoice.currency}${item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">{invoice.currency}${invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                  <span className="font-semibold">{invoice.currency}${invoice.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-4 border-t-2 border-gray-900">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold text-indigo-600">
                  {invoice.currency}${invoice.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {invoice.notes && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes:</h3>
              <p className="text-gray-600 text-sm">{invoice.notes}</p>
            </div>
          )}

          {invoice.terms && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Terms:</h3>
              <p className="text-gray-600 text-sm">{invoice.terms}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share with Client
            </button>
            {invoice.paymentLink && invoice.status !== 'paid' && (
              <a
                href={invoice.paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
              >
                Pay Now
              </a>
            )}
            <button
              onClick={downloadPDF}
              disabled={downloading}
              className={`${
                invoice.paymentLink && invoice.status !== 'paid' ? 'flex-1' : 'flex-1'
              } bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {downloading ? 'Downloading...' : 'Download PDF'}
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
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
