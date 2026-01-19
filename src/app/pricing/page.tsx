'use client';

import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Pricing() {
  const { data: session } = useSession();

  const plans = [
    {
      name: 'Basic',
      tagline: 'Try & Trust',
      monthlyPrice: 0,
      description: 'Perfect for getting started',
      features: [
        { text: 'Create proposals (limited)', included: true },
        { text: 'Generate invoice PDFs', included: true },
        { text: 'Secure client access (OTP / token)', included: true },
        { text: 'Digital signature capture', included: true },
        { text: 'One-time payment link', included: true },
        { text: 'Payment status (Paid / Partially Paid)', included: true },
        { text: 'Copy & share secure link', included: true },
        { text: 'Max 3 proposals / month', included: false },
        { text: 'Max 3 invoices', included: false },
        { text: '"Powered by Axiom" branding on PDFs', included: false },
        { text: 'No email delivery (link-only sharing)', included: false },
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      name: 'Pro',
      tagline: 'Get Paid Faster',
      monthlyPrice: 4.99,
      inrPrice: 299,
      description: 'For serious freelancers',
      features: [
        { text: 'Unlimited proposals & invoices', included: true, category: 'Usage' },
        { text: 'Unlimited clients', included: true, category: 'Usage' },
        { text: 'Email delivery to client', included: true, category: 'Delivery & Tracking' },
        { text: '"Viewed by client" status', included: true, category: 'Delivery & Tracking' },
        { text: 'Signed timestamp + audit trail', included: true, category: 'Delivery & Tracking' },
        { text: 'Partial payments & milestones', included: true, category: 'Payments' },
        { text: 'Multiple payments per invoice', included: true, category: 'Payments' },
        { text: 'Payment history per invoice', included: true, category: 'Payments' },
        { text: 'Remove "Powered by Axiom"', included: true, category: 'Branding' },
        { text: 'Upload logo', included: true, category: 'Branding' },
        { text: 'Custom accent color', included: true, category: 'Branding' },
      ],
      cta: 'Upgrade to Pro',
      popular: true,
    },
  ];

  return (
    <Layout currentPage="pricing">
      <div className="min-h-screen px-4 py-20 pb-32">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-inter)' }}>
              Start free, upgrade when you're ready. Cancel anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white/15 backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 ${
                  plan.popular
                    ? 'border-white/30 scale-105'
                    : 'border-white/20 hover:border-white/30'
                }`}
              >

                <div className="text-center mb-6">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                    {plan.tagline}
                  </p>
                  <h3 className="text-2xl text-white font-light mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {plan.name}
                  </h3>
                  <p className="text-white/60 text-sm mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
                    {plan.description}
                  </p>
                  {plan.monthlyPrice > 0 ? (
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                        ${plan.monthlyPrice}
                      </span>
                      <span className="text-white/60 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                        /month
                      </span>
                      <span className="text-white/40 text-xs">(₹{plan.inrPrice}/mo)</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Free
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className={`flex items-start gap-3 ${!feature.included ? 'opacity-50' : ''}`}>
                        <span className="flex-shrink-0 mt-0.5">
                          {feature.included ? (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </span>
                        <span className={`text-sm ${feature.included ? 'text-white/90' : 'text-white/40 line-through'}`} style={{ fontFamily: 'var(--font-inter)' }}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  {plan.name === 'Basic' && session ? (
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-white/10 text-white/60 rounded-lg cursor-not-allowed text-sm font-light"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      Current Plan
                    </button>
                  ) : plan.name === 'Pro' ? (
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-white/10 text-white/60 rounded-lg cursor-not-allowed text-sm font-light"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      Coming Soon
                    </button>
                  ) : !session ? (
                    <Link
                      href="/signup"
                      className="block w-full px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-all duration-300 text-sm font-light text-center"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      Get Started
                    </Link>
                  ) : (
                    <button
                      className="w-full px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-all duration-300 text-sm font-light"
                      style={{ fontFamily: 'var(--font-inter)' }}
                      onClick={() => {
                        alert('Upgrade flow coming soon! For now, please contact hello@axiom.app');
                      }}
                    >
                      {plan.cta}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl text-white text-center mb-8 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <div className="bg-white/15 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                <h4 className="text-white text-lg mb-2 font-light" style={{ fontFamily: 'var(--font-inter)' }}>
                  What payment methods do you accept?
                </h4>
                <p className="text-white/70 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                  We accept all major credit cards and UPI payments. Pricing is ₹299/month in India or $4.99/month internationally.
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                <h4 className="text-white text-lg mb-2 font-light" style={{ fontFamily: 'var(--font-inter)' }}>
                  Can I upgrade from Basic to Pro?
                </h4>
                <p className="text-white/70 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                  Yes! You can upgrade anytime. Your existing proposals and invoices will remain intact.
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                <h4 className="text-white text-lg mb-2 font-light" style={{ fontFamily: 'var(--font-inter)' }}>
                  Can I cancel anytime?
                </h4>
                <p className="text-white/70 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                  Absolutely. You can cancel your subscription at any time. You'll retain access until the end of your billing period.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/"
              className="inline-block px-8 py-3 border border-white text-white rounded-full hover:bg-white/10 transition-all duration-300 text-sm font-light"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
