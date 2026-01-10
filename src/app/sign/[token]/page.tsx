'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SignatureModal from '@/components/SignatureModal';

type Step = 'verify' | 'terms' | 'sign' | 'success';

export default function ClientSignPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [step, setStep] = useState<Step>('verify');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [proposal, setProposal] = useState<any>(null);

  // Form states
  const [verificationCode, setVerificationCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid signature link');
      return;
    }

    // Fetch proposal details
    fetchProposal();
  }, [token]);

  const fetchProposal = async () => {
    try {
      // Extract proposal ID from token by looking up the proposal
      const response = await fetch(`/api/proposals/by-token?token=${token}`);

      if (!response.ok) {
        throw new Error('Proposal not found');
      }

      const data = await response.json();
      setProposal(data.proposal);

      // Check if already verified
      if (data.proposal.clientEmailVerified) {
        setStep('terms');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load proposal');
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/proposals/${proposal.id}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode, token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setStep('terms');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTerms = async () => {
    if (!termsAccepted) {
      setError('Please accept the terms to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/proposals/${proposal.id}/accept-terms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept terms');
      }

      setStep('sign');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (signatureData: { type: 'drawn' | 'typed'; data: string }) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/proposals/${proposal.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureType: signatureData.type,
          signatureData: signatureData.data,
          token,
          role: 'client',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign proposal');
      }

      setStep('success');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (error && step === 'verify' && !proposal) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/30">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">✕</div>
            <h1 className="text-white text-2xl font-bold mb-2">Invalid Link</h1>
            <p className="text-white/70">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">AXIOM</h1>
              <p className="text-white/60 text-sm">Secure Proposal Signing</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${step === 'verify' || step === 'terms' || step === 'sign' || step === 'success' ? 'bg-green-500' : 'bg-white/30'}`} />
              <div className={`h-2 w-2 rounded-full ${step === 'terms' || step === 'sign' || step === 'success' ? 'bg-green-500' : 'bg-white/30'}`} />
              <div className={`h-2 w-2 rounded-full ${step === 'sign' || step === 'success' ? 'bg-green-500' : 'bg-white/30'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-12">
          <div className={`flex-1 text-center ${step === 'verify' ? 'text-white' : 'text-white/40'}`}>
            <div className="text-sm font-medium mb-1">Step 1</div>
            <div className="text-xs">Verify Email</div>
          </div>
          <div className="flex-1 h-px bg-white/20" />
          <div className={`flex-1 text-center ${step === 'terms' ? 'text-white' : 'text-white/40'}`}>
            <div className="text-sm font-medium mb-1">Step 2</div>
            <div className="text-xs">Accept Terms</div>
          </div>
          <div className="flex-1 h-px bg-white/20" />
          <div className={`flex-1 text-center ${step === 'sign' || step === 'success' ? 'text-white' : 'text-white/40'}`}>
            <div className="text-sm font-medium mb-1">Step 3</div>
            <div className="text-xs">Sign</div>
          </div>
        </div>

        {/* Step Content */}
        {step === 'verify' && (
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/30">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
              <p className="text-white/70">Enter the 6-digit code sent to your email</p>
              <p className="text-white/50 text-sm mt-1">{proposal.clientEmail}</p>
            </div>

            <form onSubmit={handleVerifyEmail} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-white/50"
                  maxLength={6}
                  required
                />
                <p className="text-white/50 text-xs mt-2 text-center">
                  Code expires in 1 hour
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="w-full py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              <div className="text-center">
                <p className="text-white/60 text-sm">
                  Didn't receive the code? Contact the freelancer to resend the proposal.
                </p>
              </div>
            </form>
          </div>
        )}

        {step === 'terms' && (
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/30">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Terms & Conditions</h2>
              <p className="text-white/70">Please review and accept the terms before signing</p>
            </div>

            <div className="space-y-6">
              {/* Legal Disclaimer */}
              <div className="bg-white/5 rounded-xl p-6 space-y-4 text-white/80 text-sm">
                <h3 className="font-semibold text-white mb-3">Electronic Signature Disclosure</h3>

                <p>
                  By signing this document, you agree that your electronic signature is:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Legally binding and equivalent to a handwritten signature</li>
                  <li>Valid under the U.S. ESIGN Act, EU eIDAS, and similar international laws</li>
                  <li>Intentional and voluntary</li>
                  <li>Securely recorded with timestamp and audit trail</li>
                </ul>

                <p className="text-xs text-white/60 mt-4">
                  <strong>Audit Trail:</strong> Your IP address, browser type, and timestamp will be recorded
                  for security and legal verification purposes.
                </p>

                <p className="text-xs text-white/60">
                  <strong>Content Integrity:</strong> This proposal is protected by a SHA-256 content hash.
                  Any modifications after signing will invalidate the signature.
                </p>

                <p className="text-xs text-white/60">
                  <strong>Right to Withdraw:</strong> You have the right to withdraw your consent within
                  a reasonable timeframe. Contact the freelancer directly for any concerns.
                </p>
              </div>

              {/* Proposal Summary */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-3">Proposal Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Project:</span>
                    <span className="text-white font-medium">{proposal.projectTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Freelancer:</span>
                    <span className="text-white">{proposal.user.firstName} {proposal.user.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Budget:</span>
                    <span className="text-white">{proposal.budget}</span>
                  </div>
                </div>
              </div>

              {/* Accept Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-white/30 bg-white/10 text-white focus:ring-white focus:ring-offset-0"
                  required
                />
                <span className="text-white/80 text-sm">
                  I have read, understood, and agree to the terms and conditions. I consent to sign this
                  proposal electronically and acknowledge that my signature is legally binding.
                </span>
              </label>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleAcceptTerms}
                disabled={loading || !termsAccepted}
                className="w-full py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Accept & Continue to Signing'}
              </button>
            </div>
          </div>
        )}

        {step === 'sign' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Sign the Proposal</h2>
              <p className="text-white/70">Choose to draw or type your signature</p>
            </div>

            <SignatureModal
              isOpen={true}
              onClose={() => {}}
              onSubmit={handleSign}
              title="Sign as Client"
              loading={loading}
            />

            {error && (
              <div className="mt-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        )}

        {step === 'success' && (
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/30 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Proposal Signed!</h2>
            <p className="text-white/70 mb-8">
              Thank you for signing. Both parties have now signed this proposal.
            </p>

            <div className="bg-white/5 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-white mb-4">Signed Proposal Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Project:</span>
                  <span className="text-white font-medium">{proposal.projectTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Client:</span>
                  <span className="text-white">{proposal.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Freelancer:</span>
                  <span className="text-white">{proposal.user.firstName} {proposal.user.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Budget:</span>
                  <span className="text-white">{proposal.budget}</span>
                </div>
                <div className="pt-3 border-t border-white/20">
                  <div className="flex justify-between">
                    <span className="text-white/70">You signed at:</span>
                    <span className="text-white">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 mb-8">
              <p className="text-blue-200 text-sm">
                <strong>Next Steps:</strong> The freelancer will receive a notification and can
                download the signed PDF. You'll also receive a confirmation email shortly.
              </p>
            </div>

            <button
              onClick={() => router.push('/')}
              className="py-3 px-8 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors"
            >
              Return to AXIOM
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-white/50 text-sm">
            <p>Secured by industry-standard encryption and audit trails</p>
            <p className="mt-2">Compliant with ESIGN Act, eIDAS, and international e-signature laws</p>
          </div>
        </div>
      </div>
    </div>
  );
}
