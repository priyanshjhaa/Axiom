'use client';

import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout currentPage="home">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10 px-8 py-6 rounded-3xl" style={{ marginTop: '-60px', backdropFilter: 'blur(2px)' }}>
          <div className="animate-fade-in-up">
            <h2 className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              Transform Job Descriptions
              <br />
              <span className="text-accent">Into Professional Documents</span>
            </h2>

            <p className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Describe your project in simple terms and instantly generate professional proposals and invoices — ready to share, track, and get approved.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/create-proposal"
                className="btn-primary"
              >
                Get Started Free
              </Link>
              <button
                onClick={() => scrollToSection('about')}
                className="btn-secondary"
              >
                Learn More
              </button>
            </div>

            <p className="text-tertiary text-sm">
              No setup required. No credit card needed.
            </p>
          </div>
        </div>
      </section>

      {/* Why Axiom Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16" style={{ textAlign: 'center' }}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 leading-tight" style={{ textAlign: 'center' }}>
              Why Freelancers Choose Axiom
            </h2>
            <p className="text-lg text-secondary leading-relaxed" style={{ textAlign: 'center', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              Stop wrestling with Word docs and scattered tools. Close deals faster with proposals that work as hard as you do.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 text-center">
            <div className="card card-interactive">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    AI-Powered Speed
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed">
                    Transform rough ideas into polished proposals in seconds. No more blank page paralysis.
                  </p>
                </div>
              </div>
            </div>

            <div className="card card-interactive">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    Real-Time Tracking
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed">
                    Know exactly when clients open your proposals. Stop guessing and start closing more deals.
                  </p>
                </div>
              </div>
            </div>

            <div className="card card-interactive">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    Digital Signatures
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed">
                    Capture legally-binding signatures without the paperwork. Streamline your client onboarding.
                  </p>
                </div>
              </div>
            </div>

            <div className="card card-interactive">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    One-Click Invoicing
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed">
                    Generate matching invoices instantly. Keep your cash flow smooth and your business professional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4">
              What You Can Do With Axiom
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-primary mb-3">Generate Professional Proposals</h3>
              <p className="text-secondary text-sm leading-relaxed">
                Turn rough ideas into polished proposals in seconds with AI. Just describe your project and get a tailored document ready to send.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-primary mb-3">Create Clean Invoices</h3>
              <p className="text-secondary text-sm leading-relaxed">
                Generate matching invoices from approved proposals with one click. Export as PDF and share instantly with clients.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-primary mb-3">Track Proposal Activity</h3>
              <p className="text-secondary text-sm leading-relaxed">
                Know exactly when clients view your proposals. See the complete timeline of views, shares, and signatures.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-primary mb-3">Capture Digital Signatures</h3>
              <p className="text-secondary text-sm leading-relaxed">
                Collect legally-binding signatures directly on proposals. No paperwork, no delays—just smooth approvals.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-primary mb-3">Share Secure Access Links</h3>
              <p className="text-secondary text-sm leading-relaxed">
                Send secure proposals via email links. Clients can view, sign, and approve without creating accounts.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-primary mb-3">Export Professional PDFs</h3>
              <p className="text-secondary text-sm leading-relaxed">
                Download publication-ready PDFs perfect for email attachments, printing, or archiving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-secondary">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Tier */}
            <div className="card-elevated">
              <p className="text-xs uppercase tracking-wider text-tertiary mb-2 font-medium">Try & Trust</p>
              <h3 className="text-2xl mb-2">Basic</h3>
              <p className="text-secondary text-sm mb-6">Perfect for getting started</p>
              <div className="text-4xl mb-6 font-semibold">
                Free
              </div>
              <ul className="space-y-3 text-sm mb-8">
                <li className="flex items-center gap-3 text-secondary">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create proposals (limited)
                </li>
                <li className="flex items-center gap-3 text-secondary">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Generate invoice PDFs
                </li>
                <li className="flex items-center gap-3 text-secondary">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure client access
                </li>
                <li className="flex items-center gap-3 text-secondary">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Digital signature capture
                </li>
                <li className="flex items-center gap-3 text-secondary">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Activity tracking
                </li>
                <li className="flex items-center gap-3 text-tertiary">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Max 3 proposals/month
                </li>
              </ul>
              <Link
                href="/create-proposal"
                className="btn-primary w-full text-center"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="card-elevated relative border-accent/30" style={{ borderWidth: '2px' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-accent text-white text-xs font-medium rounded-full">
                  Most Popular
                </span>
              </div>
              <p className="text-xs uppercase tracking-wider text-tertiary mb-2 font-medium">Professional</p>
              <h3 className="text-2xl mb-2">Pro</h3>
              <p className="text-secondary text-sm mb-6">For serious freelancers</p>
              <div className="text-4xl mb-1 font-semibold">
                $4.99<span className="text-lg text-secondary">/month</span>
              </div>
              <p className="text-tertiary text-xs mb-6">₹299/month in India</p>
              <ul className="space-y-3 text-sm mb-8">
                <li className="flex items-center gap-3 text-secondary">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited proposals & invoices
                </li>
                <li className="flex items-center gap-3 text-secondary">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email delivery
                </li>
                <li className="flex items-center gap-3 text-secondary">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  "Viewed by client" tracking
                </li>
                <li className="flex items-center gap-3 text-secondary">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Activity timeline
                </li>
                <li className="flex items-center gap-3 text-secondary">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Remove "Powered by Axiom"
                </li>
                <li className="flex items-center gap-3 text-secondary">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom logo & branding
                </li>
              </ul>
              <Link
                href="/pricing"
                className="btn-primary w-full text-center"
              >
                See How It Works
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/pricing"
              className="btn-secondary"
            >
              View All Pricing Details
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-details" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4">
              About Axiom
            </h2>
          </div>

          <div className="space-y-6 text-center">
            <p className="text-lg text-secondary leading-relaxed">
              Axiom is revolutionizing how freelancers and businesses create professional documents.
              We believe that great proposals shouldn't require hours of formatting and writing.
            </p>

            <p className="text-lg text-secondary leading-relaxed">
              Simply describe your project in natural language, and our AI will generate a polished,
              professional proposal complete with scope, timeline, and pricing. Then send it directly
              to clients via email with PDF attachments.
            </p>

            <p className="text-lg text-secondary leading-relaxed">
              Focus on what matters most - your clients and your work - while we handle the documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4">
            Get in Touch
          </h2>

          <div className="space-y-6">
            <p className="text-lg text-secondary leading-relaxed">
              Have questions or feedback? We'd love to hear from you.
            </p>

            <div className="space-y-4">
              <p className="text-primary">
                Email: <a href="mailto:hello@axiom.app" className="text-accent hover:underline">hello@axiom.app</a>
              </p>
              <p className="text-primary">
                Support: <a href="mailto:support@axiom.app" className="text-accent hover:underline">support@axiom.app</a>
              </p>
            </div>

            <div className="pt-8">
              <Link
                href="/create-proposal"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
