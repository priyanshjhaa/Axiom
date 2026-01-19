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

          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-12 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
            Describe your project in simple terms and generate professional proposals
            and invoices with payment links in seconds.
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
              onClick={() => scrollToSection('how-it-works')}
              className="px-8 py-3 sm:px-10 border border-white text-white font-light rounded-full hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-8 sm:mb-12 leading-tight font-light px-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            How It Works
          </h2>

          <div className="space-y-6 sm:space-y-8 px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-left">
              <div className="text-2xl sm:text-3xl text-white font-light min-w-fit">1</div>
              <div>
                <h3 className="text-lg sm:text-xl text-white mb-2 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Describe Your Project</h3>
                <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                  Write a simple description of the work you need to propose for. No technical knowledge required.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-left">
              <div className="text-2xl sm:text-3xl text-white font-light min-w-fit">2</div>
              <div>
                <h3 className="text-lg sm:text-xl text-white mb-2 font-light" style={{ fontFamily: 'var(--font-inter)' }}>AI Generates Proposal</h3>
                <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                  Our AI analyzes your description and creates a professional proposal with scope, timeline, and pricing.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-left">
              <div className="text-2xl sm:text-3xl text-white font-light min-w-fit">3</div>
              <div>
                <h3 className="text-lg sm:text-xl text-white mb-2 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Send to Client</h3>
                <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                  Export as PDF or send directly via email with professional formatting.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-left">
              <div className="text-2xl sm:text-3xl text-white font-light min-w-fit">4</div>
              <div>
                <h3 className="text-lg sm:text-xl text-white mb-2 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Get Paid</h3>
                <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                  Create matching invoices and get paid quickly through integrated payment systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-8 sm:mb-12 leading-tight font-light px-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Features
          </h2>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4">
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20">
              <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>AI-Powered Generation</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                Advanced AI understands your project needs and creates tailored, professional proposals that impress clients.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20">
              <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Instant Invoicing</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                Generate matching invoices with integrated payment links. Track payments in real-time.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20">
              <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Secure Link Sharing</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                Share proposals and invoices via secure access links. Track views, capture digital signatures, and get paid.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20">
              <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Payment Tracking</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                Track payment status in real-time. Support for partial payments, milestones, and complete payment history.
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
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Payment links</li>
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
              <p className="text-white/50 text-xs uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-inter)' }}>Get Paid Faster</p>
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
                <li className="flex items-center gap-2"><span className="text-white">✓</span> "Viewed by client" status</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Partial payments & milestones</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Remove "Powered by Axiom"</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Custom logo & branding</li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full px-6 py-3 bg-white text-black rounded-full hover:bg-white/90 transition-all duration-300 text-sm font-light text-center"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Learn More
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
