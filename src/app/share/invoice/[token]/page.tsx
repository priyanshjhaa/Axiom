'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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

interface SharedInvoice {
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
  lineItems: LineItem[];
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
  user: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export default function SharedInvoicePage() {
  const params = useParams();
  const [invoice, setInvoice] = useState<SharedInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoice();
  }, [params.token]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/share/invoice/${params.token}`);
      const data = await response.json();

      if (response.ok) {
        setInvoice(data.invoice);
      } else {
        setError(data.error || 'Invoice not found');
      }
    } catch (err) {
      setError('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl text-gray-900 mb-2">Link Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'This invoice link is invalid or has expired.'}</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all"
            >
              Go to Axiom
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AXIOM</h1>
            <p className="text-gray-500 text-sm">Invoice Sharing</p>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Get Started with Axiom →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Invoice Header */}
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
                  invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'PARTIALLY_PAID' ? 'bg-blue-100 text-blue-800' :
                  invoice.status === 'UNPAID' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {invoice.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Progress Bar */}
          {(invoice.paidAmount > 0 || invoice.status === 'PARTIALLY_PAID') && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-blue-900">Payment Progress</span>
                <span className="text-sm font-semibold text-blue-900">
                  {invoice.currency}{invoice.paidAmount.toFixed(2)} / {invoice.currency}{invoice.total.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    invoice.status === 'PAID'
                      ? 'bg-green-500'
                      : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min(100, (invoice.paidAmount / invoice.total) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-green-700 font-medium">
                  Paid: {invoice.currency}{invoice.paidAmount.toFixed(2)}
                </span>
                <span className="text-blue-700">
                  {Math.round((invoice.paidAmount / invoice.total) * 100)}%
                </span>
                {invoice.remainingAmount > 0 && (
                  <span className="text-orange-700 font-medium">
                    Remaining: {invoice.currency}{invoice.remainingAmount.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          )}

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
            <div className="w-72">
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
              {(invoice.paidAmount > 0 || invoice.status === 'PARTIALLY_PAID') && (
                <>
                  <div className="flex justify-between mb-2">
                    <span className="text-green-600">Amount Paid:</span>
                    <span className="font-semibold text-green-600">{invoice.currency}${invoice.paidAmount.toFixed(2)}</span>
                  </div>
                  {invoice.remainingAmount > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-orange-600">Remaining:</span>
                      <span className="font-semibold text-orange-600">{invoice.currency}${invoice.remainingAmount.toFixed(2)}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between pt-4 border-t-2 border-gray-900">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold text-indigo-600">
                  {invoice.currency}${invoice.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {invoice.payments && invoice.payments.length > 0 && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment History</h3>
              <div className="space-y-2">
                {invoice.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-900">{invoice.currency}{payment.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleString()}</p>
                    </div>
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 font-medium">
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {/* Pay Now Button */}
          {invoice.paymentLink && !['PAID', 'paid', 'PA'].includes(invoice.status) && (
            <div className="pt-6 border-t border-gray-200">
              <a
                href={invoice.paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2.5 px-5 rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-indigo-700 transition-colors text-center"
              >
                {invoice.status === 'PARTIALLY_PAID' || invoice.status === 'partial'
                  ? `Pay Remaining ${invoice.currency}${invoice.remainingAmount.toFixed(2)}`
                  : `Pay Now ${invoice.currency}${invoice.total.toFixed(2)}`
                }
              </a>
              <p className="text-xs text-gray-500 text-center mt-2">
                Secure payment powered by Dodo Payments
              </p>
            </div>
          )}

          {/* From */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              From: {invoice.user.firstName && invoice.user.lastName
                ? `${invoice.user.firstName} ${invoice.user.lastName}`
                : invoice.user.email}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">Powered by AXIOM</p>
        </div>
      </div>
    </div>
  );
}
