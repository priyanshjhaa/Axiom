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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }

    // Fetch proposals from database
    fetchProposals();
  }, [session, status, router]);

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/proposals/generate');
      const data = await response.json();
      if (response.ok) {
        setProposals(data.proposals || []);
      }
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats
  const totalProposals = proposals.length;
  const sentProposals = proposals.filter((p: any) => p.status === 'sent').length;

  // Calculate total earnings (just from sent proposals for now)
  const totalEarnings = proposals
    .filter((p: any) => p.status === 'sent')
    .reduce((sum: number, p: any) => {
      const budget = parseFloat(p.budget?.replace(/[^0-9.]/g, '') || '0');
      return sum + budget;
    }, 0);

  if (status === 'loading') {
    return (
      <Layout currentPage="dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  // Determine if user is new (less than 3 proposals)
  const isNewUser = totalProposals < 3;
  const conversionRate = totalProposals > 0 ? Math.round((sentProposals / totalProposals) * 100) : 0;

  return (
    <Layout currentPage="dashboard">
      <div className="min-h-screen px-4 py-20 pb-32">
        <div className="max-w-5xl mx-auto">
          {/* Header - Personalized & Contextual */}
          <div className="mb-12">
            <p className="text-white/60 text-sm uppercase tracking-widest mb-4 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
              Dashboard
            </p>
            <h1 className="text-4xl sm:text-5xl text-white font-light mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              {isNewUser ? `Welcome, ${(session.user as any)?.firstName || 'there'}` : `${(session.user as any)?.firstName || 'Welcome'}`}
            </h1>
            <p className="text-white/70 text-lg max-w-2xl" style={{ fontFamily: 'var(--font-inter)' }}>
              {isNewUser
                ? "Let's create your first proposal and get you started on winning clients."
                : "Here's what's happening with your proposals and business."
              }
            </p>
          </div>

          {/* Contextual: New User Onboarding vs Active User Dashboard */}
          {isNewUser ? (
            // NEW USER EXPERIENCE - Focus on getting started
            <div className="space-y-6">
              {/* Primary Goal - Get Started */}
              <Link
                href="/create-proposal"
                className="block bg-white text-black p-8 rounded-2xl hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-light mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                      Create Your First Proposal
                    </p>
                    <p className="text-base opacity-60" style={{ fontFamily: 'var(--font-inter)' }}>
                      AI-powered generation takes 2 minutes
                    </p>
                  </div>
                  <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>

              {/* Value Proposition - ROI Preview */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white/15 border border-white/20 p-6 rounded-xl backdrop-blur-xl">
                  <p className="text-white/80 text-xs uppercase tracking-widest mb-3 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                    Save Time
                  </p>
                  <p className="text-3xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                    2 hrs
                  </p>
                  <p className="text-white/70 text-sm mt-2" style={{ fontFamily: 'var(--font-inter)' }}>
                    per proposal
                  </p>
                </div>
                <div className="bg-white/15 border border-white/20 p-6 rounded-xl backdrop-blur-xl">
                  <p className="text-white/80 text-xs uppercase tracking-widest mb-3 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                    Win Rate
                  </p>
                  <p className="text-3xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                    +40%
                  </p>
                  <p className="text-white/70 text-sm mt-2" style={{ fontFamily: 'var(--font-inter)' }}>
                    with AI
                  </p>
                </div>
                <div className="bg-white/15 border border-white/20 p-6 rounded-xl backdrop-blur-xl">
                  <p className="text-white/80 text-xs uppercase tracking-widest mb-3 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                    Get Paid
                  </p>
                  <p className="text-3xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                    3x
                  </p>
                  <p className="text-white/70 text-sm mt-2" style={{ fontFamily: 'var(--font-inter)' }}>
                    faster
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // ACTIVE USER EXPERIENCE - Focus on outcomes & metrics
            <div className="space-y-8">
              {/* Key Metrics - What matters most */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-5xl text-white font-light mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                    ${totalEarnings.toLocaleString()}
                  </p>
                  <p className="text-white/70 text-xs uppercase tracking-widest font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                    Total Revenue
                  </p>
                </div>
                <div className="text-center border-x border-white/10">
                  <p className="text-5xl text-white font-light mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {sentProposals}
                  </p>
                  <p className="text-white/70 text-xs uppercase tracking-widest font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                    Proposals Sent
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-5xl text-white font-light mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {conversionRate}%
                  </p>
                  <p className="text-white/70 text-xs uppercase tracking-widest font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                    Win Rate
                  </p>
                </div>
              </div>

              {/* ROI Reinforcement - Time & Money Saved */}
              <div className="bg-white/15 border border-white/20 p-6 rounded-xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs uppercase tracking-widest mb-2 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                      Your Savings with AXIOM
                    </p>
                    <p className="text-white text-lg" style={{ fontFamily: 'var(--font-inter)' }}>
                      ~{sentProposals * 2} hours saved • ${sentProposals * 500} potential value created
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {sentProposals}x
                    </p>
                    <p className="text-white/70 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                      more proposals
                    </p>
                  </div>
                </div>
              </div>

              {/* Goal-Based Navigation - What do they want to do? */}
              <div>
                <p className="text-white/70 text-xs uppercase tracking-widest mb-5 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                  What would you like to do?
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link
                    href="/create-proposal"
                    className="bg-white text-black p-6 rounded-xl hover:scale-[1.01] transition-all duration-300"
                  >
                    <p className="text-xl font-light mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                      Create New Proposal
                    </p>
                    <p className="text-sm opacity-60" style={{ fontFamily: 'var(--font-inter)' }}>
                      Win more clients
                    </p>
                  </Link>

                  <button className="bg-white/15 border border-white/20 text-white p-6 rounded-xl hover:bg-white/20 transition-all duration-300 text-left backdrop-blur-xl">
                    <p className="text-xl font-light mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                      Send Invoice
                    </p>
                    <p className="text-sm text-white/70" style={{ fontFamily: 'var(--font-inter)' }}>
                      Get paid faster
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Proposals - Contextual based on state */}
          {proposals.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/70 text-xs uppercase tracking-widest font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                  Recent Proposals
                </p>
                <Link href="/proposals" className="text-white/70 text-sm hover:text-white/90 transition-colors" style={{ fontFamily: 'var(--font-inter)' }}>
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {proposals.slice(0, 3).map((proposal: any) => (
                  <Link
                    key={proposal.id}
                    href={`/proposals/${proposal.id}`}
                    className="block px-6 py-4 border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-light mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                          {proposal.projectName}
                        </p>
                        <p className="text-white/50 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                          {proposal.clientName} • {proposal.budget}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          proposal.status === 'sent'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-white/15 text-white/70'
                        }`} style={{ fontFamily: 'var(--font-inter)' }}>
                          {proposal.status || 'Draft'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Simple Sign Out */}
          <div className="mt-16 text-center">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-white/30 text-sm hover:text-white/50 transition-colors duration-300"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
