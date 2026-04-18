'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

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
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen" style={{ scrollBehavior: 'smooth' }}>
      {/* Background Image */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/converted_image.webp')" }}
      />

      {/* Navigation - Hide for create-proposal and proposal-detail pages */}
      {currentPage !== 'create-proposal' && currentPage !== 'proposal-detail' && (
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="w-full">
            <div className="flex items-center h-16 w-full px-4">
              {/* Logo - Top Left */}
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="text-2xl font-semibold transition-all duration-200"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    color: '#ffffff',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  AXIOM
                </Link>
              </div>

              {/* Center Navigation - Only on landing page */}
              {currentPage === 'home' && (
                <div className="hidden md:flex items-center space-x-8 flex-1 justify-center px-8">
                  <button
                    onClick={() => scrollToSection('about')}
                    className="hover:bg-black/40 hover:border-white/20 hover:backdrop-blur-md px-4 py-2 rounded-lg transition-all text-sm font-medium border border-transparent"
                    style={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="hover:bg-black/40 hover:border-white/20 hover:backdrop-blur-md px-4 py-2 rounded-lg transition-all text-sm font-medium border border-transparent"
                    style={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="hover:bg-black/40 hover:border-white/20 hover:backdrop-blur-md px-4 py-2 rounded-lg transition-all text-sm font-medium border border-transparent"
                    style={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="hover:bg-black/40 hover:border-white/20 hover:backdrop-blur-md px-4 py-2 rounded-lg transition-all text-sm font-medium border border-transparent"
                    style={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                  >
                    Contact
                  </button>
                </div>
              )}

              {/* Auth Buttons - Top Right - Hide on login/signup pages */}
              {currentPage !== 'login' && currentPage !== 'signup' && (
                <div className="hidden md:flex items-center space-x-3 ml-auto">
                  {status === 'loading' ? (
                    <div style={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }} className="text-sm">Loading...</div>
                  ) : session ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="hover:bg-black/40 hover:border-white/20 hover:backdrop-blur-md px-4 py-2 rounded-lg transition-all text-sm font-medium border border-transparent"
                        style={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/create-proposal"
                        className="bg-black/40 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg transition-all text-sm font-medium border border-white/20"
                        style={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                      >
                        Create Proposal
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="hover:bg-black/40 hover:border-white/20 hover:backdrop-blur-md px-4 py-2 rounded-lg transition-all text-sm font-medium border border-transparent"
                        style={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="bg-black/40 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg transition-all text-sm font-medium border border-white/20"
                        style={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white p-2 hover:bg-black/40 rounded-md transition-colors"
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
            <div className="md:hidden absolute top-full left-0 right-0 bg-elevated border-t border-subtle" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <div className="px-4 py-6 space-y-4">
                {currentPage === 'home' && (
                  <>
                    <button
                      onClick={() => scrollToSection('about')}
                      className="block w-full px-4 py-3 rounded-md text-secondary hover:text-primary hover:bg-hover transition-all text-left"
                    >
                      About
                    </button>
                    <button
                      onClick={() => scrollToSection('features')}
                      className="block w-full px-4 py-3 rounded-md text-secondary hover:text-primary hover:bg-hover transition-all text-left"
                    >
                      Features
                    </button>
                    <button
                      onClick={() => scrollToSection('pricing')}
                      className="block w-full px-4 py-3 rounded-md text-secondary hover:text-primary hover:bg-hover transition-all text-left"
                    >
                      Pricing
                    </button>
                    <button
                      onClick={() => scrollToSection('contact')}
                      className="block w-full px-4 py-3 rounded-md text-secondary hover:text-primary hover:bg-hover transition-all text-left"
                    >
                      Contact
                    </button>
                  </>
                )}

                {/* Mobile Auth Buttons - Hide on login/signup pages */}
                {currentPage !== 'login' && currentPage !== 'signup' && (
                  <div className="pt-4 space-y-3">
                    {status === 'loading' ? (
                      <div className="text-secondary text-sm text-center">Loading...</div>
                    ) : session ? (
                      <>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-3 text-secondary hover:text-primary hover:bg-hover rounded-md transition-all text-center"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/create-proposal"
                          className="block px-4 py-3 btn-primary text-center"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Create Proposal
                        </Link>
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: '/' });
                            setMobileMenuOpen(false);
                          }}
                          className="w-full px-4 py-3 btn-secondary"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="block px-4 py-3 text-secondary hover:text-primary hover:bg-hover rounded-md transition-all text-center"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          href="/signup"
                          className="block px-4 py-3 btn-primary text-center"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Page Content */}
      <main className="relative">
        {children}
      </main>
    </div>
  );
}
