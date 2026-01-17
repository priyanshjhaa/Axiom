'use client';

import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Guide() {
  return (
    <Layout currentPage="guide">
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
              How to Use Axiom
            </h1>
            <p className="text-white/60">
              Simple guide to help you get started with creating and managing proposals
            </p>
          </div>

          {/* Guide Sections */}
          <div className="space-y-6">
            {/* What is Axiom */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                    What is Axiom?
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Axiom helps you create professional project proposals quickly. You can manage clients, track proposals,
                    and send invoices - all in one place. Think of it as your personal assistant for handling business paperwork.
                  </p>
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Getting Started
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-white/50 text-sm font-medium">1.</span>
                      <p className="text-white/70 text-sm flex-1">
                        <strong className="text-white/90">Sign up</strong> - Create your account with your email and password
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-white/50 text-sm font-medium">2.</span>
                      <p className="text-white/70 text-sm flex-1">
                        <strong className="text-white/90">Go to Dashboard</strong> - This is your main control center
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-white/50 text-sm font-medium">3.</span>
                      <p className="text-white/70 text-sm flex-1">
                        <strong className="text-white/90">Create your first proposal</strong> - Click the "Create" button to start
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Creating a Proposal */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Creating a Proposal
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-white/50 text-sm font-medium">1.</span>
                      <p className="text-white/70 text-sm flex-1">
                        <strong className="text-white/90">Fill in project details</strong> - Name your project and describe what you'll do
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-white/50 text-sm font-medium">2.</span>
                      <p className="text-white/70 text-sm flex-1">
                        <strong className="text-white/90">Add client info</strong> - Enter who this proposal is for
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-white/50 text-sm font-medium">3.</span>
                      <p className="text-white/70 text-sm flex-1">
                        <strong className="text-white/90">Set your pricing</strong> - Add line items for your services and choose currency
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-white/50 text-sm font-medium">4.</span>
                      <p className="text-white/70 text-sm flex-1">
                        <strong className="text-white/90">Generate & review</strong> - Click generate to create your proposal document
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-white/50 text-sm font-medium">5.</span>
                      <p className="text-white/70 text-sm flex-1">
                        <strong className="text-white/90">Save or send</strong> - Keep it as draft or send it directly to your client
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sending & Tracking */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Sending & Tracking Proposals
                  </h2>
                  <div className="space-y-3">
                    <p className="text-white/70 text-sm">
                      <strong className="text-white/90">Send to client:</strong> After generating, click "Send" to email it to your client
                    </p>
                    <p className="text-white/70 text-sm">
                      <strong className="text-white/90">Track status:</strong> View all proposals in your dashboard to see which ones are sent, viewed, or accepted
                    </p>
                    <p className="text-white/70 text-sm">
                      <strong className="text-white/90">Client signs:</strong> Clients can sign proposals electronically - no paper needed!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Creating Invoices
                  </h2>
                  <div className="space-y-3">
                    <p className="text-white/70 text-sm">
                      <strong className="text-white/90">From accepted proposals:</strong> Once a client accepts your proposal, you can create an invoice with one click
                    </p>
                    <p className="text-white/70 text-sm">
                      <strong className="text-white/90">Track payments:</strong> See which invoices are paid, pending, or overdue in the Invoices section
                    </p>
                    <p className="text-white/70 text-sm">
                      <strong className="text-white/90">Multi-currency:</strong> Accept payments in different currencies based on your client's location
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Pro Tips
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-white/70 text-sm flex-1">
                        <strong className="text-white/90">Be specific</strong> - Clear project descriptions help clients understand exactly what they're getting
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-white/70 text-sm flex-1">
                        <strong className="text-white/90">Send quickly</strong> - Try to send proposals within 24 hours while the project is fresh in everyone's mind
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-white/70 text-sm flex-1">
                        <strong className="text-white/90">Follow up</strong> - If you haven't heard back in a few days, it's okay to send a friendly reminder
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-white/70 text-sm flex-1">
                        <strong className="text-white/90">Use templates</strong> - Once you create a proposal you like, you can use it as a template for future projects
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Need More Help?
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed">
                    If you're stuck or something isn't working as expected, don't worry! We're here to help.
                    Check the contact page or reach out to our support team for assistance.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white text-black rounded-full hover:bg-white/90 transition-all text-sm"
                  >
                    Contact Support
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
