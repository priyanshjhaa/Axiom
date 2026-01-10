'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Pricing() {
  const { data: session } = useSession();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfect for getting started',
      features: [
        '5 proposals per month',
        'AI-powered generation',
        'PDF export',
        'Email sending',
        'Digital signatures',
        'Basic templates',
        'Community support',
      ],
      limitations: [
        'AXIOM branding on emails/PDFs',
        'No custom domain',
        'No invoice generation',
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      name: 'Pro',
      monthlyPrice: 29,
      yearlyPrice: 278, // ~$23/month (20% off)
      description: 'For serious freelancers',
      features: [
        'Unlimited proposals',
        'Everything in Free',
        'Custom templates',
        'Invoice generation',
        'Stripe payments integration',
        'Priority email support',
        'Remove AXIOM branding',
        'Custom domain for emails',
        'Analytics dashboard',
      ],
      limitations: [],
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      monthlyPrice: 99,
      yearlyPrice: 950, // ~$79/month (20% off)
      description: 'For growing teams',
      features: [
        'Everything in Pro',
        'Team collaboration (up to 10 users)',
        'White-label solution',
        'Custom branding',
        'API access',
        'Priority phone support',
        'Advanced analytics',
        'Multiple domains',
        'Webhooks & integrations',
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <Layout currentPage="pricing">
      <div className="min-h-screen px-4 py-20 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-inter)' }}>
              Choose the plan that fits your needs. Upgrade or downgrade at any time.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setIsYearly(false)}
                className={`text-sm font-light transition-colors ${
                  !isYearly ? 'text-white' : 'text-white/50 hover:text-white/70'
                }`}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  isYearly ? 'bg-white' : 'bg-white/30'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-black rounded-full transition-transform ${
                    isYearly ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`text-sm font-light transition-colors ${
                  isYearly ? 'text-white' : 'text-white/50 hover:text-white/70'
                }`}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Yearly
                <span className="ml-1 text-xs text-white/60">(Save 20%)</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white/15 backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 ${
                  plan.popular
                    ? 'border-white/30 scale-105 shadow-2xl'
                    : 'border-white/20 hover:border-white/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-white text-black text-xs font-medium rounded-full" style={{ fontFamily: 'var(--font-inter)' }}>
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl text-white font-light mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {plan.name}
                  </h3>
                  <p className="text-white/60 text-sm mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                      ${isYearly ? Math.floor(plan.yearlyPrice / 12) : plan.monthlyPrice}
                    </span>
                    <span className="text-white/60 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                      /month
                    </span>
                  </div>
                  {isYearly && plan.monthlyPrice > 0 && (
                    <p className="text-white/50 text-xs mt-2" style={{ fontFamily: 'var(--font-inter)' }}>
                      Billed ${plan.yearlyPrice}/yearly
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/90 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-white/50 text-sm line-through" style={{ fontFamily: 'var(--font-inter)' }}>
                          {limitation}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  {plan.name === 'Free' && session ? (
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-white/10 text-white/60 rounded-full cursor-not-allowed text-sm font-light"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      Current Plan
                    </button>
                  ) : plan.name === 'Enterprise' ? (
                    <a
                      href="mailto:hello@axiom.app?subject=Enterprise Plan Inquiry"
                      className="block w-full px-6 py-3 bg-white/10 border border-white/30 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-sm font-light text-center"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      Contact Sales
                    </a>
                  ) : !session ? (
                    <Link
                      href="/signup"
                      className="block w-full px-6 py-3 bg-white text-black rounded-full hover:bg-white/90 transition-all duration-300 text-sm font-light text-center"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      Get Started
                    </Link>
                  ) : (
                    <button
                      className="w-full px-6 py-3 bg-white text-black rounded-full hover:bg-white/90 transition-all duration-300 text-sm font-light"
                      style={{ fontFamily: 'var(--font-inter)' }}
                      onClick={() => {
                        // TODO: Implement upgrade flow
                        alert('Upgrade flow coming soon! For now, please contact hello@axiom.app');
                      }}
                    >
                      Upgrade to {plan.name}
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
                  Can I change plans later?
                </h4>
                <p className="text-white/70 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll be prorated accordingly.
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                <h4 className="text-white text-lg mb-2 font-light" style={{ fontFamily: 'var(--font-inter)' }}>
                  What payment methods do you accept?
                </h4>
                <p className="text-white/70 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                  We accept all major credit cards (Visa, MasterCard, American Express) through Stripe, as well as PayPal.
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                <h4 className="text-white text-lg mb-2 font-light" style={{ fontFamily: 'var(--font-inter)' }}>
                  Is there a free trial for paid plans?
                </h4>
                <p className="text-white/70 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                  Yes! All paid plans come with a 14-day free trial. No credit card required to start.
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
