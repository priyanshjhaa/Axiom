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
  paidAmount: number;
  remainingAmount: number;
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[]>('');
  const [deleteType, setDeleteType] = useState<'single' | 'bulk'>('single');

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

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === invoices.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(invoices.map((inv) => inv.id)));
    }
  };

  const confirmDelete = (id: string | string[]) => {
    setDeleteTarget(id);
    setDeleteType(Array.isArray(id) ? 'bulk' : 'single');
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteType === 'single') {
        const response = await fetch(`/api/invoices/${deleteTarget}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setInvoices((prev) => prev.filter((inv) => inv.id !== deleteTarget));
        }
      } else {
        const response = await fetch('/api/invoices/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: deleteTarget }),
        });
        if (response.ok) {
          setInvoices((prev) => prev.filter((inv) => !(deleteTarget as string[]).includes(inv.id)));
        }
      }
      setSelectedIds(new Set());
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete invoice(s):', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <Layout currentPage="invoices">
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
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const outstanding = invoices
    .filter((inv) => inv.status !== 'PAID')
    .reduce((sum, inv) => sum + ((inv.remainingAmount && inv.remainingAmount > 0) ? inv.remainingAmount : (inv.total || 0)), 0);

  const allSelected = invoices.length > 0 && selectedIds.size === invoices.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < invoices.length;

  return (
    <Layout currentPage="invoices">
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
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-semibold text-white">All Invoices</h2>
                  <span className="text-white/50 text-xs">{invoices.length} invoices</span>
                </div>
                {/* Bulk Delete Button */}
                {selectedIds.size > 0 && (
                  <button
                    onClick={() => confirmDelete(Array.from(selectedIds))}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white/70 border border-white/30 rounded-lg hover:bg-white/20 transition-all text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete {selectedIds.size} {selectedIds.size === 1 ? 'Invoice' : 'Invoices'}
                  </button>
                )}
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
                {/* Header Row with Select All */}
                <div className="px-4 py-2 bg-white/5 flex items-center gap-3">
                  <button
                    onClick={toggleSelectAll}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      allSelected
                        ? 'bg-white border-white'
                        : someSelected
                        ? 'bg-white/60 border-white/60'
                        : 'border-white/40 hover:border-white/60 bg-white/5'
                    }`}
                  >
                    {allSelected || someSelected ? (
                      <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : null}
                  </button>
                  <span className="text-white/40 text-xs">
                    {allSelected ? 'All selected' : someSelected ? `${selectedIds.size} selected` : 'Select all'}
                  </span>
                </div>
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className={`flex items-center p-4 transition-all duration-200 ${selectedIds.has(invoice.id) ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelect(invoice.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all mr-4 flex-shrink-0 ${
                        selectedIds.has(invoice.id)
                          ? 'bg-white border-white'
                          : 'border-white/40 hover:border-white/60 bg-white/5'
                      }`}
                    >
                      {selectedIds.has(invoice.id) && (
                        <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Invoice Content */}
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="flex-1 flex items-center justify-between"
                    >
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
                          invoice.status === 'PAID'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : invoice.status === 'PARTIALLY_PAID'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : invoice.status === 'UNPAID'
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {invoice.status.replace('_', ' ')}
                        </span>
                      </div>
                    </Link>

                    {/* Individual Delete Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        confirmDelete(invoice.id);
                      }}
                      className="ml-4 p-2 text-white/40 hover:text-white/70 hover:bg-white/10 rounded-lg transition-all"
                      title="Delete invoice"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black border border-white/20 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white">Confirm Delete</h3>
            </div>
            <p className="text-white/60 text-sm mb-6">
              {deleteType === 'single'
                ? 'Are you sure you want to delete this invoice? This action cannot be undone.'
                : `Are you sure you want to delete ${Array.isArray(deleteTarget) ? deleteTarget.length : 0} invoices? This action cannot be undone.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-white text-black rounded-lg hover:bg-white/90 transition-all text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
