'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import Link from 'next/link';

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

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch proposals with React Query
  const { data: proposalsData, isLoading: proposalsLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: async () => {
      const res = await fetch('/api/proposals/generate');
      if (!res.ok) throw new Error('Failed to fetch proposals');
      return res.json();
    },
    staleTime: 60_000, // 1 minute cache
  });

  // Fetch invoices with React Query
  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const res = await fetch('/api/invoices');
      if (!res.ok) throw new Error('Failed to fetch invoices');
      return res.json();
    },
    staleTime: 60_000, // 1 minute cache
  });

  const proposals = proposalsData?.proposals || [];
  const invoices = invoicesData?.invoices || [];
  const isLoading = proposalsLoading || invoicesLoading;

  const [selectedProposalIds, setSelectedProposalIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[]>('');
  const [deleteType, setDeleteType] = useState<'single' | 'bulk'>('single');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const displayedProposals = proposals.slice(0, 5);
  const allSelected = displayedProposals.length > 0 && selectedProposalIds.size === displayedProposals.length;
  const someSelected = selectedProposalIds.size > 0 && selectedProposalIds.size < displayedProposals.length;

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  const toggleSelectProposal = (id: string) => {
    const newSelected = new Set(selectedProposalIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProposalIds(newSelected);
  };

  const toggleSelectAllProposals = () => {
    const displayedProposals = proposals.slice(0, 5);
    if (selectedProposalIds.size === displayedProposals.length) {
      setSelectedProposalIds(new Set());
    } else {
      setSelectedProposalIds(new Set(displayedProposals.map((p: any) => p.id)));
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
        const response = await fetch(`/api/proposals/${deleteTarget}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Invalidate and refetch proposals using React Query
          queryClient.invalidateQueries({ queryKey: ['proposals'] });
        }
      } else {
        const response = await fetch('/api/proposals/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: deleteTarget }),
        });
        if (response.ok) {
          // Invalidate and refetch proposals using React Query
          queryClient.invalidateQueries({ queryKey: ['proposals'] });
        }
      }
      setSelectedProposalIds(new Set());
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete proposal(s):', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalProposals = proposals.length;

  // Invoice statistics
  const totalInvoices = invoices.length;

  if (status === 'loading') {
    return (
      <Layout currentPage="dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-default border-t-accent rounded-full animate-spin"></div>
            <p className="text-secondary text-sm">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session) return null;

  return (
    <Layout currentPage="dashboard">
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header with Profile */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-1">
                Dashboard
              </h2>
              <h4 className="text-secondary text-sm">
                Track your proposals
              </h4>
            </div>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 bg-black/40 hover:bg-black/50 border border-white/10 rounded-xl px-3 py-2 transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-white text-sm font-medium">
                    {(session as any)?.user?.firstName || 'User'}
                  </p>
                  <p className="text-white/50 text-xs capitalize">
                    {(session as any)?.user?.plan || 'free'} plan
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/20 flex items-center justify-center border border-red-500/30">
                  <span className="text-white font-semibold text-sm">
                    {((session as any)?.user?.firstName || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <svg
                  className={`w-4 h-4 text-white/50 transition-transform ${
                    showProfileMenu ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden z-50">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-white text-sm font-medium">
                      {(session as any)?.user?.firstName} {(session as any)?.user?.lastName}
                    </p>
                    <p className="text-white/50 text-xs">{(session as any)?.user?.email}</p>
                  </div>

                  <div className="p-1">
                    <Link
                      href="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white hover:bg-black/40 rounded-lg transition-all text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Edit Profile
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white hover:bg-black/40 rounded-lg transition-all text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>

                    {(session as any)?.user?.plan !== 'pro' && (
                      <Link
                        href="/pricing"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white hover:bg-black/40 rounded-lg transition-all text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        Upgrade to Pro
                      </Link>
                    )}
                  </div>

                  <div className="p-1 border-t border-white/10">
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-black/40 rounded-lg transition-all text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Click outside to close menu */}
          {showProfileMenu && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowProfileMenu(false)}
            />
          )}

          {/* Stats Grid - Smaller, minimal, monochromatic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Total Proposals */}
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-primary mb-1">
                {totalProposals}
              </p>
              <p className="text-tertiary text-xs">Total Proposals</p>
            </div>

            {/* Total Invoices */}
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-primary mb-1">
                {totalInvoices}
              </p>
              <p className="text-tertiary text-xs">Total Invoices</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Proposals List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Quick Actions - Improved for mobile touch */}
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/create-proposal"
                  className="group card card-interactive"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-primary font-medium">Create</p>
                      <p className="text-secondary text-xs">New proposal</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/invoices"
                  className="group card card-interactive"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-primary font-medium">Invoices</p>
                      <p className="text-secondary text-xs">{invoices.length} total</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Recent Proposals */}
              <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h2 className="text-sm font-semibold text-white">Recent Proposals</h2>
                      <span className="text-white/50 text-xs">{proposals.length} total</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Bulk Delete Button - Pro users only */}
                      {selectedProposalIds.size > 0 && (session as any)?.user?.plan === 'pro' && (
                        <button
                          onClick={() => confirmDelete(Array.from(selectedProposalIds))}
                          className="flex items-center gap-2 px-3 py-2 bg-black/40 text-white/70 border border-white/30 rounded-xl hover:bg-black/50 transition-all text-sm h-10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete {selectedProposalIds.size}
                        </button>
                      )}
                      <Link href="/proposals" className="text-white/50 text-xs hover:text-white/70 transition-colors">
                        View all →
                      </Link>
                    </div>
                  </div>
                </div>

                {proposals.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-white/80 text-sm mb-1">No proposals yet</p>
                    <p className="text-white/50 text-xs mb-4">Create your first proposal</p>
                    <Link
                      href="/create-proposal"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full hover:bg-white/90 transition-all text-xs"
                    >
                      Create Proposal
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {/* Select All Header - Pro users only */}
                    {(session as any)?.user?.plan === 'pro' && displayedProposals.length > 0 && (
                      <div className="px-4 py-3 bg-black/40 flex items-center gap-3">
                        <button
                          onClick={toggleSelectAllProposals}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                            allSelected
                              ? 'bg-white border-white'
                              : someSelected
                              ? 'bg-white/60 border-white/60'
                              : 'border-white/40 hover:border-white/60 bg-black/40'
                          }`}
                        >
                          {allSelected || someSelected ? (
                            <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : null}
                        </button>
                        <span className="text-white/40 text-xs">
                          {allSelected ? 'All selected' : someSelected ? `${selectedProposalIds.size} selected` : 'Select all'}
                        </span>
                      </div>
                    )}
                    {displayedProposals.map((proposal: any) => (
                      <div
                        key={proposal.id}
                        className={`flex items-center p-4 transition-all duration-200 ${selectedProposalIds.has(proposal.id) ? 'bg-black/40' : 'hover:bg-black/40'}`}
                      >
                        {/* Checkbox - Pro users only */}
                        {(session as any)?.user?.plan === 'pro' && (
                        <button
                          onClick={() => toggleSelectProposal(proposal.id)}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all mr-4 flex-shrink-0 ${
                            selectedProposalIds.has(proposal.id)
                              ? 'bg-white border-white'
                              : 'border-white/40 hover:border-white/60 bg-black/40'
                          }`}
                        >
                          {selectedProposalIds.has(proposal.id) && (
                            <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        )}

                        {/* Proposal Content */}
                        <Link
                          href={`/proposals/${proposal.id}`}
                          className="flex-1 flex items-center justify-between min-w-0"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-white text-sm font-medium truncate">
                                {proposal.projectName}
                              </p>
                              <p className="text-white/40 text-xs truncate">{proposal.clientName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <p className="text-white/80 text-sm">{getCurrencySymbol(proposal.currency)}{proposal.budget}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              proposal.status === 'sent'
                                ? 'bg-black/40 text-white/70'
                                : proposal.status === 'draft'
                                ? 'bg-black/40 text-white/70'
                                : 'bg-black/40 text-white/50'
                            }`}>
                              {proposal.status || 'Draft'}
                            </span>
                          </div>
                        </Link>

                        {/* Individual Delete Button - Pro users only */}
                        {(session as any)?.user?.plan === 'pro' && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            confirmDelete(proposal.id);
                          }}
                          className="ml-4 w-10 h-10 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-black/40 rounded-xl transition-all flex-shrink-0"
                          title="Delete proposal"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Minimal */}
            <div className="space-y-4">
              {/* Tips - Minimal */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                <h3 className="text-white text-sm font-medium mb-3">Pro Tips</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2 bg-black/40 rounded-lg">
                    <svg className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                      <p className="text-white text-xs font-medium">Quick Turnaround</p>
                      <p className="text-white/40 text-xs">Send within 24hr</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-black/40 rounded-lg">
                    <svg className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <div>
                      <p className="text-white text-xs font-medium">Personalize</p>
                      <p className="text-white/40 text-xs">Add client details</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help - Minimal */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-white/80 text-sm mb-1">Need help?</p>
                <p className="text-white/50 text-xs mb-3">Check our documentation</p>
                <Link
                  href="/guide"
                  className="block w-full py-2 bg-black/40 hover:bg-black/50 text-white rounded-lg transition-all text-xs"
                >
                  View Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
            </div>
            <p className="text-white/70 text-sm mb-6">
              {deleteType === 'single'
                ? 'Are you sure you want to delete this proposal? This action cannot be undone.'
                : `Are you sure you want to delete ${Array.isArray(deleteTarget) ? deleteTarget.length : 0} proposals? This action cannot be undone.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-black/40 text-white rounded-lg hover:bg-black/50 transition-all text-sm font-medium disabled:opacity-50"
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
