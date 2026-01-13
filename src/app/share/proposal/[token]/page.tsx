'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import SignatureCanvas to avoid SSR issues
const SignatureModal = dynamic(() => import('@/components/SignatureModal'), {
  ssr: false,
});

interface ProposalContent {
  executiveSummary: string;
  scopeOfWork: string;
  pricingBreakdown: string;
  timeline: string;
  termsAndConditions: string;
}

interface SharedProposal {
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
  executiveSummary: string;
  scopeOfWork: string;
  pricingBreakdown: string;
  timelineDetails: string;
  termsAndConditions: string;
  createdAt: string;
  signatureStatus: string;
  freelancerSignedAt?: string;
  clientSignedAt?: string;
  freelancerSignatureData?: string;
  freelancerSignatureType?: string;
  clientSignatureData?: string;
  clientSignatureType?: string;
  user: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export default function SharedProposalPage() {
  const params = useParams();
  const router = useRouter();
  const [proposal, setProposal] = useState<SharedProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);

  useEffect(() => {
    fetchProposal();
  }, [params.token]);

  const fetchProposal = async () => {
    try {
      const response = await fetch(`/api/share/proposal/${params.token}`);
      const data = await response.json();

      if (response.ok) {
        setProposal(data.proposal);
      } else {
        setError(data.error || 'Proposal not found');
      }
    } catch (err) {
      setError('Failed to load proposal');
    } finally {
      setLoading(false);
    }
  };

  const handleSignProposal = async (signatureData: { type: 'drawn' | 'typed'; data: string }) => {
    setIsSigning(true);
    try {
      const response = await fetch(`/api/share/proposal/${params.token}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureType: signatureData.type,
          signatureData: signatureData.data,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSignSuccess(true);
        // Refresh proposal to show updated signature
        fetchProposal();
      } else {
        alert(data.error || 'Failed to sign proposal');
      }
    } catch (err) {
      alert('Failed to sign proposal. Please try again.');
    } finally {
      setIsSigning(false);
      setShowSignatureModal(false);
    }
  };

  const renderSignature = (signatureData: string, signatureType: string) => {
    if (signatureType === 'drawn') {
      return (
        <img
          src={signatureData}
          alt="Signature"
          className="h-16 max-w-xs"
        />
      );
    } else {
      const [name, font] = signatureData.split('|');
      const fontVar = font === 'Dancing Script' ? 'var(--font-dancing-script)' :
                      font === 'Great Vibes' ? 'var(--font-great-vibes)' :
                      'var(--font-herr-von-muellerhoff)';
      return (
        <p
          className="text-3xl"
          style={{ fontFamily: fontVar }}
        >
          {name}
        </p>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl text-white mb-2">Link Not Found</h2>
            <p className="text-gray-400 mb-6">{error || 'This proposal link is invalid or has expired.'}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Success Message */}
      {signSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Proposal signed successfully!
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">AXIOM</h1>
            <p className="text-gray-400 text-sm">Proposal Sharing</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Sign Proposal Button - Only show when pending client signature */}
            {proposal.signatureStatus === 'pending_client' && !proposal.clientSignedAt && (
              <button
                onClick={() => setShowSignatureModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Sign Proposal
              </button>
            )}
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Get Started with Axiom →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Project Proposal</p>
              <h2 className="text-4xl font-light text-white">{proposal.projectTitle}</h2>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              proposal.signatureStatus === 'signed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
              proposal.signatureStatus === 'pending_client' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
              'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {proposal.signatureStatus === 'signed' ? 'Signed' :
               proposal.signatureStatus === 'pending_client' ? 'Pending Signature' :
               'Draft'}
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-gray-400">Prepared for</p>
              <p className="text-white font-medium">{proposal.clientName}</p>
              {proposal.clientCompany && <p className="text-gray-400">{proposal.clientCompany}</p>}
            </div>
            <div>
              <p className="text-gray-400">Budget</p>
              <p className="text-white font-medium">${proposal.budget}</p>
            </div>
            <div>
              <p className="text-gray-400">Timeline</p>
              <p className="text-white font-medium">{proposal.timeline}</p>
            </div>
          </div>
        </div>

        {/* Document Sections */}
        <div className="space-y-6">
          {/* Executive Summary */}
          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-light text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Executive Summary
            </h3>
            <div className="text-gray-300 whitespace-pre-line leading-relaxed">
              {proposal.executiveSummary}
            </div>
          </section>

          {/* Scope of Work */}
          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-light text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Scope of Work
            </h3>
            <div className="text-gray-300 whitespace-pre-line leading-relaxed">
              {proposal.scopeOfWork}
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-light text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Project Timeline
            </h3>
            <div className="text-gray-300 whitespace-pre-line leading-relaxed">
              {proposal.timelineDetails}
            </div>
          </section>

          {/* Pricing */}
          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-light text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              Pricing & Payment Terms
            </h3>
            <div className="text-gray-300 whitespace-pre-line leading-relaxed">
              {proposal.pricingBreakdown}
            </div>
          </section>

          {/* Terms */}
          <section className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-light text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Terms and Conditions
            </h3>
            <div className="text-gray-400 whitespace-pre-line leading-relaxed text-sm">
              {proposal.termsAndConditions}
            </div>
          </section>
        </div>

        {/* Signatures Section */}
        {(proposal.freelancerSignatureData || proposal.clientSignatureData) && (
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-light text-white mb-6">Signatures</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Freelancer Signature */}
              {proposal.freelancerSignatureData && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">
                    {proposal.user.firstName || proposal.user.email} (Freelancer)
                  </p>
                  <div className="bg-white rounded-lg p-4 inline-block">
                    {renderSignature(proposal.freelancerSignatureData, proposal.freelancerSignatureType || 'drawn')}
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Signed {proposal.freelancerSignedAt ? new Date(proposal.freelancerSignedAt).toLocaleDateString() : ''}
                  </p>
                </div>
              )}

              {/* Client Signature */}
              {proposal.clientSignatureData && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">{proposal.clientName} (Client)</p>
                  <div className="bg-white rounded-lg p-4 inline-block">
                    {renderSignature(proposal.clientSignatureData, proposal.clientSignatureType || 'drawn')}
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Signed {proposal.clientSignedAt ? new Date(proposal.clientSignedAt).toLocaleDateString() : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Created on {new Date(proposal.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-gray-600 text-xs mt-2">Powered by AXIOM</p>
        </div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSubmit={handleSignProposal}
        title="Sign This Proposal"
        loading={isSigning}
      />
    </div>
  );
}
