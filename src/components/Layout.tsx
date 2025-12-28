'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function Layout({ children, currentPage = 'home' }: LayoutProps) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ fontFamily: 'var(--font-inter)' }}>
      {/* Space Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/space-background-landscape.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Navigation */}
      <nav className="relative z-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 w-full">
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                AXIOM
              </h1>
            </div>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
              <a
                href="/"
                className={`px-6 py-2 rounded-full text-sm font-light transition-all duration-300 ${
                  currentPage === 'home'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white hover:text-black'
                }`}
              >
                Home
              </a>
              <a
                href="/about"
                className={`px-6 py-2 rounded-full text-sm font-light transition-all duration-300 ${
                  currentPage === 'about'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white hover:text-black'
                }`}
              >
                About
              </a>
              <a
                href="/features"
                className={`px-6 py-2 rounded-full text-sm font-light transition-all duration-300 ${
                  currentPage === 'features'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white hover:text-black'
                }`}
              >
                Features
              </a>
              <a
                href="/how-it-works"
                className={`px-6 py-2 rounded-full text-sm font-light transition-all duration-300 ${
                  currentPage === 'how-it-works'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white hover:text-black'
                }`}
              >
                How It Works
              </a>
              <a
                href="/pricing"
                className={`px-6 py-2 rounded-full text-sm font-light transition-all duration-300 ${
                  currentPage === 'pricing'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white hover:text-black'
                }`}
              >
                Pricing
              </a>
              <a
                href="/contact"
                className={`px-6 py-2 rounded-full text-sm font-light transition-all duration-300 ${
                  currentPage === 'contact'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white hover:text-black'
                }`}
              >
                Contact
              </a>
            </div>

            {/* Auth Buttons - Right */}
            <div className="hidden md:flex items-center space-x-3">
              {status === 'loading' ? (
                <div className="text-white text-sm">Loading...</div>
              ) : session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-sm font-light text-white hover:text-white/80 transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/create-proposal"
                    className="px-4 py-2 text-sm font-light bg-white text-black rounded-full hover:bg-white/90 transition-all duration-300"
                  >
                    Create Proposal
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-4 py-2 text-sm font-light bg-white/10 text-white border border-white/30 rounded-full hover:bg-white/20 transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="px-4 py-2 text-sm font-light text-white hover:text-white/80 transition-all duration-300"
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="px-4 py-2 text-sm font-light bg-white text-black rounded-full hover:bg-white/90 transition-all duration-300"
                  >
                    Sign Up
                  </a>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <a
                href="/"
                className={`block px-4 py-3 rounded-full text-sm font-light transition-all duration-300 ${
                  currentPage === 'home'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/about"
                className={`block px-4 py-3 rounded-full text-sm font-light transition-all duration-300 ${
                  currentPage === 'about'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="/features"
                className={`block px-4 py-3 rounded-full text-sm font-light transition-all duration-300 ${
                  currentPage === 'features'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="/how-it-works"
                className={`block px-4 py-3 rounded-full text-sm font-light transition-all duration-300 ${
                  currentPage === 'how-it-works'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="/pricing"
                className={`block px-4 py-3 rounded-full text-sm font-light transition-all duration-300 ${
                  currentPage === 'pricing'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="/contact"
                className={`block px-4 py-3 rounded-full text-sm font-light transition-all duration-300 ${
                  currentPage === 'contact'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-white/20 space-y-3">
                {status === 'loading' ? (
                  <div className="text-white text-sm text-center">Loading...</div>
                ) : session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 text-sm font-light text-white hover:bg-white/10 rounded-full transition-all duration-300 text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/create-proposal"
                      className="block px-4 py-3 text-sm font-light bg-white text-black rounded-full hover:bg-white/90 transition-all duration-300 text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create Proposal
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-sm font-light bg-white/10 text-white border border-white/30 rounded-full hover:bg-white/20 transition-all duration-300 text-center"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="block px-4 py-3 text-sm font-light text-white hover:bg-white/10 rounded-full transition-all duration-300 text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </a>
                    <a
                      href="/signup"
                      className="block px-4 py-3 text-sm font-light bg-white text-black rounded-full hover:bg-white/90 transition-all duration-300 text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}