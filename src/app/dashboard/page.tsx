'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      const [proposalsRes, invoicesRes] = await Promise.all([
        fetch('/api/proposals/generate'),
        fetch('/api/invoices')
      ]);

      const proposalsData = await proposalsRes.json();
      const invoicesData = await invoicesRes.json();

      if (proposalsRes.ok) {
        setProposals(proposalsData.proposals || []);
      }

      if (invoicesRes.ok) {
        setInvoices(invoicesData.invoices || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalProposals = proposals.length;
  const sentProposals = proposals.filter((p: any) => p.status === 'sent').length;
  const conversionRate = totalProposals > 0 ? Math.round((sentProposals / totalProposals) * 100) : 0;

  // Invoice statistics
  const pendingInvoices = invoices.filter((inv: any) => inv.status === 'pending').length;
  const totalInvoiced = invoices.reduce((sum: number, inv: any) => sum + inv.total, 0);
  const totalPaid = invoices
    .filter((inv: any) => inv.status === 'paid')
    .reduce((sum: number, inv: any) => sum + (inv.paidAmount || inv.total), 0);
  const outstandingBalance = totalInvoiced - totalPaid;

  if (status === 'loading') {
    return (
      <Layout currentPage="dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-white/60 text-sm">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session) return null;

  const isNewUser = totalProposals < 3;

  return (
    <Layout currentPage="dashboard">
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Simple Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
              Dashboard
            </h2>
            <h4 className="text-white/50 text-sm">
              Track your proposals
            </h4>
          </div>

          {/* Stats Grid - Smaller, minimal, monochromatic */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Revenue */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                ${totalPaid.toLocaleString()}
              </p>
              <p className="text-white/50 text-xs">Total Paid</p>
            </div>

            {/* Outstanding Balance */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                ${outstandingBalance.toLocaleString()}
              </p>
              <p className="text-white/50 text-xs">Outstanding</p>
            </div>

            {/* Pending Invoices */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                {pendingInvoices}
              </p>
              <p className="text-white/50 text-xs">Pending Invoices</p>
            </div>

            {/* Total Invoices */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                {invoices.length}
              </p>
              <p className="text-white/50 text-xs">Total Invoices</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Proposals List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/create-proposal"
                  className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Create Proposal</p>
                      <p className="text-white/50 text-xs">Generate with AI</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/invoices"
                  className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">View Invoices</p>
                      <p className="text-white/50 text-xs">{invoices.length} invoices</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Recent Proposals */}
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-white">Recent Proposals</h2>
                    <Link href="/proposals" className="text-white/50 text-xs hover:text-white/70 transition-colors">
                      View all →
                    </Link>
                  </div>
                </div>

                {proposals.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
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
                    {proposals.slice(0, 5).map((proposal: any, index: number) => (
                      <Link
                        key={proposal.id}
                        href={`/proposals/${proposal.id}`}
                        className="block p-3 hover:bg-white/5 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">
                                {proposal.projectName}
                              </p>
                              <p className="text-white/40 text-xs">{proposal.clientName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-white/80 text-sm">{proposal.budget}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              proposal.status === 'sent'
                                ? 'bg-white/10 text-white/70'
                                : proposal.status === 'draft'
                                ? 'bg-white/10 text-white/70'
                                : 'bg-white/5 text-white/50'
                            }`}>
                              {proposal.status || 'Draft'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Minimal */}
            <div className="space-y-4">
              {/* Win Rate - Minimal */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white text-sm font-medium">Win Rate</h3>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {conversionRate}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div
                    className="bg-white/30 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${conversionRate}%` }}
                  />
                </div>
                <p className="text-white/50 text-xs mt-2">
                  {sentProposals} of {totalProposals} sent
                </p>
              </div>

              {/* Tips - Minimal */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white text-sm font-medium mb-3">Pro Tips</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2 bg-white/5 rounded-lg">
                    <svg className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                      <p className="text-white text-xs font-medium">Quick Turnaround</p>
                      <p className="text-white/40 text-xs">Send within 24hr</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-white/5 rounded-lg">
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
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-white/80 text-sm mb-1">Need help?</p>
                <p className="text-white/50 text-xs mb-3">Check our documentation</p>
                <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-xs">
                  View Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
