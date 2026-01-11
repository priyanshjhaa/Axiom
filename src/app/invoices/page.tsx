'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: string;
  total: number;
  currency: string;
  clientName: string;
  clientEmail: string;
  proposal: {
    projectTitle: string;
  };
}

export default function InvoicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }

    fetchInvoices();
  }, [session, status, router]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      const data = await response.json();
      if (response.ok) {
        setInvoices(data.invoices || []);
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-white/60 text-sm">Loading invoices...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session) return null;

  const totalPaid = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const outstanding = invoices
    .filter((inv) => inv.status !== 'paid')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  return (
    <Layout>
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
              Invoices
            </h2>
            <h4 className="text-white/50 text-sm">
              Manage your invoices and payments
            </h4>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
              <p className="text-white/50 text-xs mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                ${totalPaid.toLocaleString()}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
              <p className="text-white/50 text-xs mb-1">Outstanding</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                ${outstanding.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Invoices List */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">All Invoices</h2>
                <span className="text-white/50 text-xs">{invoices.length} invoices</span>
              </div>
            </div>

            {invoices.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-white/80 text-sm mb-1">No invoices yet</p>
                <p className="text-white/50 text-xs mb-4">Generate an invoice from a proposal</p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full hover:bg-white/90 transition-all text-xs"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/invoices/${invoice.id}`}
                    className="block p-4 hover:bg-white/5 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-white/40 text-xs">{invoice.clientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-white text-sm font-medium">
                            {invoice.currency}${invoice.total.toLocaleString()}
                          </p>
                          <p className="text-white/40 text-xs">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          invoice.status === 'paid'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
