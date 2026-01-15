'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

interface Proposal {
  id: string;
  projectTitle: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  budget: string;
  currency: string;
  timeline: string;
  status: string;
  createdAt: string;
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

export default function AllProposalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }

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

  if (status === 'loading' || isLoading) {
    return (
      <Layout currentPage="dashboard">
        <div className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen px-4 py-20 pb-32">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Link
                  href="/dashboard"
                  className="text-white/70 text-sm hover:text-white/90 transition-colors inline-block mb-4"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  ← Back to Dashboard
                </Link>
                <h1 className="text-4xl sm:text-5xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                  All Proposals
                </h1>
                <p className="text-white/70 text-lg mt-2" style={{ fontFamily: 'var(--font-inter)' }}>
                  {proposals.length} {proposals.length === 1 ? 'proposal' : 'proposals'} created
                </p>
              </div>
              <Link
                href="/create-proposal"
                className="px-6 py-3 bg-white text-black rounded-full hover:bg-white/90 transition-all duration-300 text-sm font-light"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Create New
              </Link>
            </div>
          </div>

          {/* Proposals List */}
          {proposals.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/70 text-lg mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
                No proposals yet. Create your first proposal to get started!
              </p>
              <Link
                href="/create-proposal"
                className="inline-block px-8 py-3 bg-white text-black rounded-full hover:bg-white/90 transition-all duration-300"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Create Proposal
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <Link
                  key={proposal.id}
                  href={`/proposals/${proposal.id}`}
                  className="block px-6 py-5 border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <p className="text-white font-light text-lg" style={{ fontFamily: 'var(--font-playfair)' }}>
                          {proposal.projectTitle}
                        </p>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            proposal.status === 'sent'
                              ? 'bg-green-500/20 text-green-300'
                              : proposal.status === 'accepted'
                              ? 'bg-blue-500/20 text-blue-300'
                              : proposal.status === 'rejected'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-white/15 text-white/70'
                          }`}
                          style={{ fontFamily: 'var(--font-inter)' }}
                        >
                          {proposal.status || 'Draft'}
                        </span>
                      </div>
                      <p className="text-white/50 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                        {proposal.clientName}
                        {proposal.clientCompany && ` • ${proposal.clientCompany}`}
                      </p>
                      <p className="text-white/40 text-xs mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
                        Created on {new Date(proposal.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-white font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                        {getCurrencySymbol(proposal.currency)}{proposal.budget}
                      </p>
                      <p className="text-white/50 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                        {proposal.timeline}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
