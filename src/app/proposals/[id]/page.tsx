'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

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
  timeline: string;
  startDate: string;
  deliverables: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
  content: ProposalContent;
}

export default function ProposalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }

    fetchProposal();
  }, [session, status, params.id]);

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

  const handleSendProposal = async () => {
    if (!proposal) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/proposals/${params.id}/send`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setProposal(prev => prev ? { ...prev, status: 'sent' } : null);
        alert('Proposal sent successfully to client!');
      } else {
        alert(data.error || 'Failed to send proposal');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = () => {
    alert('PDF download feature coming soon! For now, you can print the page using Ctrl/Cmd + P');
  };

  if (status === 'loading' || isLoading) {
    return (
      <Layout currentPage="proposals">
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
    <Layout currentPage="proposals">
      {/* Solid black background overlay for proposal page */}
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
                disabled={isSending || proposal.status !== 'draft'}
                className="px-6 py-3 bg-white text-black font-light rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {isSending ? 'Sending...' : proposal.status === 'sent' ? 'Sent ✓' : 'Send to Client'}
              </button>
            </div>
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
          <div className="bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
            {/* Document Header */}
            <div className="bg-white/5 backdrop-blur-sm p-8 border-b border-white/10">
              <h2 className="text-4xl text-white mb-2 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                Project Proposal
              </h2>
              <p className="text-white/80" style={{ fontFamily: 'var(--font-inter)' }}>
                Prepared for {proposal.clientName}
                {proposal.clientCompany && ` at ${proposal.clientCompany}`}
              </p>
            </div>

            {/* Document Body */}
            <div className="p-8 text-white">
              {/* Client & Project Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-white/10">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-light mb-4 text-white/80" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Client Information
                  </h3>
                  <p className="text-sm text-white/90 mb-2"><strong className="text-white">Name:</strong> {proposal.clientName}</p>
                  <p className="text-sm text-white/90 mb-2"><strong className="text-white">Email:</strong> {proposal.clientEmail}</p>
                  {proposal.clientCompany && (
                    <p className="text-sm text-white/90"><strong className="text-white">Company:</strong> {proposal.clientCompany}</p>
                  )}
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-light mb-4 text-white/80" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Project Information
                  </h3>
                  <p className="text-sm text-white/90 mb-2"><strong className="text-white">Title:</strong> {proposal.projectTitle}</p>
                  <p className="text-sm text-white/90 mb-2"><strong className="text-white">Budget:</strong> ${proposal.budget}</p>
                  <p className="text-sm text-white/90"><strong className="text-white">Timeline:</strong> {proposal.timeline}</p>
                </div>
              </div>

              {/* Executive Summary */}
              <section className="mb-8 pb-8 border-b border-white/10">
                <h3 className="text-2xl font-light mb-4 text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <div className="w-10 h-10 bg-purple-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Executive Summary
                </h3>
                <div className="text-white/90 whitespace-pre-line leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                  {proposal.content.executiveSummary}
                </div>
              </section>

              {/* Scope of Work */}
              <section className="mb-8 pb-8 border-b border-white/10">
                <h3 className="text-2xl font-light mb-4 text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Scope of Work
                </h3>
                <div className="text-white/90 whitespace-pre-line leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                  {proposal.content.scopeOfWork}
                </div>
              </section>

              {/* Timeline */}
              <section className="mb-8 pb-8 border-b border-white/10">
                <h3 className="text-2xl font-light mb-4 text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <div className="w-10 h-10 bg-green-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Project Timeline
                </h3>
                <div className="text-white/90 whitespace-pre-line leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                  {proposal.content.timeline}
                </div>
              </section>

              {/* Pricing */}
              <section className="mb-8 pb-8 border-b border-white/10">
                <h3 className="text-2xl font-light mb-4 text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <div className="w-10 h-10 bg-amber-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  Pricing & Payment Terms
                </h3>
                <div className="text-white/90 whitespace-pre-line leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
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
        </div>
      </div>
    </Layout>
  );
}
