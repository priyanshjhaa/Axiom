'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import CosmicBackground from './CosmicBackground';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function Layout({ children, currentPage = 'home' }: LayoutProps) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen" style={{ fontFamily: 'var(--font-inter)', scrollBehavior: 'smooth' }}>
      {/* Space Background Image */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          backgroundImage: 'url(/images/pexels-cris-menles-4621648-34385494.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Animated Stars & Nebula Effects */}
      <CosmicBackground />

      {/* Dark Overlay for better text visibility */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 -z-10" />

      {/* Navigation - Hide for create-proposal and proposal-detail pages */}
      {currentPage !== 'create-proposal' && currentPage !== 'proposal-detail' && (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 w-full">
            {/* Logo - Left with cosmic glow */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-2xl sm:text-3xl font-bold text-white hover:text-white/80 transition-all cosmic-glow"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                AXIOM
              </Link>
            </div>

            {/* Center Navigation - Only on landing page */}
            {currentPage === 'home' && (
              <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
                <button
                  onClick={() => scrollToSection('about')}
                  className="px-6 py-2 rounded-full text-sm font-light text-white hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="px-6 py-2 rounded-full text-sm font-light text-white hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="px-6 py-2 rounded-full text-sm font-light text-white hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="px-6 py-2 rounded-full text-sm font-light text-white hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-6 py-2 rounded-full text-sm font-light text-white hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  Contact
                </button>
              </div>
            )}

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
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-light text-white hover:text-white/80 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-sm font-light bg-white text-black rounded-full hover:bg-white/90 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/80 backdrop-blur-xl">
            <div className="px-4 py-6 space-y-4">
              {currentPage === 'home' && (
                <>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="block w-full px-4 py-3 rounded-full text-sm font-light text-white hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="block w-full px-4 py-3 rounded-full text-sm font-light text-white hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    className="block w-full px-4 py-3 rounded-full text-sm font-light text-white hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    How It Works
                  </button>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="block w-full px-4 py-3 rounded-full text-sm font-light text-white hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="block w-full px-4 py-3 rounded-full text-sm font-light text-white hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    Contact
                  </button>
                </>
              )}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 space-y-3">
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
                    <Link
                      href="/login"
                      className="block px-4 py-3 text-sm font-light text-white hover:bg-white/10 rounded-full transition-all duration-300 text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-3 text-sm font-light bg-white text-black rounded-full hover:bg-white/90 transition-all duration-300 text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      )}

      {/* Page Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}