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
      <section id="hero" className="min-h-screen flex items-center justify-center px-4 pt-20 md:pt-24">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 sm:mb-6 leading-tight font-light px-2" style={{ fontFamily: 'var(--font-playfair)', letterSpacing: '0.05em' }}>
            Transform Job Descriptions
            <br className="hidden sm:block" />
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mt-2 sm:mt-4 block">
              Into Professional Documents
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white mb-8 sm:mb-12 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
            Describe your project in simple terms and instantly generate professional proposals and invoices — ready to share, track, and get approved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link
              href="/create-proposal"
              className="px-8 py-3 sm:px-10 bg-white text-black font-light rounded-full hover:bg-white/90 transition-all duration-300 text-sm sm:text-base"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Get Started
            </Link>
            <button
              onClick={() => scrollToSection('why-axiom')}
              className="px-8 py-3 sm:px-10 border border-white text-white font-light rounded-full hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              See Why Axiom
            </button>
          </div>

          {/* Micro-trust line */}
          <p className="text-white/40 text-xs sm:text-sm mt-6 max-w-md mx-auto" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
            No setup. No accounting tools. Just clean proposals and invoices.
          </p>
        </div>
      </section>

      {/* Why Axiom Section */}
      <section id="why-axiom" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-6 sm:mb-10 leading-tight font-light px-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Why Freelancers Choose Axiom
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-12 sm:mb-16" style={{ fontFamily: 'var(--font-inter)' }}>
            Stop wrestling with Word docs and scattered tools. Close deals faster with proposals that work as hard as you do.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 px-4">
            <div className="text-left bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl text-white mb-2 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                    AI-Powered Speed
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                    Transform rough ideas into polished proposals in seconds. No more blank page paralysis.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-left bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl text-white mb-2 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                    Real-Time Tracking
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                    Know exactly when clients open your proposals. Stop guessing and start closing more deals.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-left bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/30 to-green-600/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl text-white mb-2 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                    Digital Signatures
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                    Capture legally-binding signatures without the paperwork. Streamline your client onboarding.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-left bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/30 to-yellow-600/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl text-white mb-2 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                    One-Click Invoicing
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                    Generate matching invoices instantly. Keep your cash flow smooth and your business professional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-6 sm:mb-10 leading-tight font-light px-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            What You Can Do With Axiom
          </h2>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Generate Professional Proposals</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                Turn rough ideas into polished proposals in seconds with AI. Just describe your project and get a tailored document ready to send.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Create Clean Invoices</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                Generate matching invoices from approved proposals with one click. Export as PDF and share instantly with clients.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Track Proposal Activity</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                Know exactly when clients view your proposals. See the complete timeline of views, shares, and signatures.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Capture Digital Signatures</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                Collect legally-binding signatures directly on proposals. No paperwork, no delays—just smooth approvals.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Share Secure Access Links</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                Send secure proposals via email links. Clients can view, sign, and approve without creating accounts.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Export Professional PDFs</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                Download publication-ready PDFs perfect for email attachments, printing, or archiving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight font-light px-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-12" style={{ fontFamily: 'var(--font-inter)' }}>
            Start free, upgrade when you're ready
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Basic Tier */}
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-inter)' }}>Try & Trust</p>
              <h3 className="text-2xl text-white font-light mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                Basic
              </h3>
              <p className="text-white/60 text-sm mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
                Perfect for getting started
              </p>
              <div className="text-4xl text-white mb-6 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                Free
              </div>
              <ul className="text-white/90 space-y-2 text-left text-sm mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Create proposals (limited)</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Generate invoice PDFs</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Secure client access</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Digital signature capture</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Activity tracking</li>
                <li className="flex items-center gap-2 text-white/40"><span>✗</span> Max 3 proposals/month</li>
                <li className="flex items-center gap-2 text-white/40"><span>✗</span> "Powered by Axiom" branding</li>
              </ul>
              <Link
                href="/create-proposal"
                className="block w-full px-6 py-3 bg-white text-black rounded-full hover:bg-white/90 transition-all duration-300 text-sm font-light text-center"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-8 border border-white/30 relative scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-white text-black text-xs font-medium rounded-full" style={{ fontFamily: 'var(--font-inter)' }}>
                  Most Popular
                </span>
              </div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-inter)' }}>Most Popular</p>
              <h3 className="text-2xl text-white font-light mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                Pro
              </h3>
              <p className="text-white/60 text-sm mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
                For serious freelancers
              </p>
              <div className="text-4xl text-white mb-1 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                $4.99<span className="text-lg">/month</span>
              </div>
              <p className="text-white/40 text-xs mb-6">₹299/month in India</p>
              <ul className="text-white/90 space-y-2 text-left text-sm mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Unlimited proposals & invoices</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Email delivery</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> "Viewed by client" tracking</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Activity timeline</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Remove "Powered by Axiom"</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Custom logo & branding</li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full px-6 py-3 bg-white text-black rounded-full hover:bg-white/90 transition-all duration-300 text-sm font-light text-center"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                See How It Works
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/pricing"
              className="inline-block px-8 py-3 border border-white text-white rounded-full hover:bg-white/10 transition-all duration-300 text-sm font-light"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              View All Pricing Details
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-6 sm:mb-8 leading-tight font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
            About AXIOM
          </h2>

          <div className="text-left space-y-4 sm:space-y-6 max-w-2xl sm:max-w-3xl mx-auto">
            <p className="text-base sm:text-lg text-white/90 leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
              AXIOM is revolutionizing how freelancers and businesses create professional documents.
              We believe that great proposals shouldn't require hours of formatting and writing.
            </p>

            <p className="text-base sm:text-lg text-white/90 leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
              Simply describe your project in natural language, and our AI will generate a polished,
              professional proposal complete with scope, timeline, and pricing. Then send it directly
              to clients via email with PDF attachments.
            </p>

            <p className="text-base sm:text-lg text-white/90 leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
              Focus on what matters most - your clients and your work - while we handle the documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center justify-center px-4 py-20 pb-32">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-6 sm:mb-8 leading-tight font-light px-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Get in Touch
          </h2>

          <div className="space-y-4 sm:space-y-6 px-4">
            <p className="text-base sm:text-lg text-white/90 leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
              Have questions or feedback? We'd love to hear from you.
            </p>

            <div className="space-y-3 sm:space-y-4">
              <p className="text-white text-sm sm:text-base" style={{ fontFamily: 'var(--font-inter)' }}>
                Email: <span className="text-white/85">hello@axiom.app</span>
              </p>
              <p className="text-white text-sm sm:text-base" style={{ fontFamily: 'var(--font-inter)' }}>
                Support: <span className="text-white/85">support@axiom.app</span>
              </p>
            </div>

            <div className="mt-6 sm:mt-8">
              <Link
                href="/create-proposal"
                className="inline-block px-8 sm:px-10 py-3 bg-white text-black font-light rounded-full hover:bg-white/90 transition-all duration-300 text-sm sm:text-base"
                style={{ fontFamily: 'var(--font-inter)' }}
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
