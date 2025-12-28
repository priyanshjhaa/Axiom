'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }

    // Fetch proposals from database
    fetchProposals();
  }, [session, status, router]);

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/proposals/generate');
      const data = await response.json();
      if (response.ok) {
        setProposals(data.proposals || []);
      }
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats
  const totalProposals = proposals.length;
  const sentProposals = proposals.filter((p: any) => p.status === 'sent').length;
  const pendingProposals = proposals.filter((p: any) => p.status === 'draft').length;

  // Calculate total earnings (just from sent proposals for now)
  const totalEarnings = proposals
    .filter((p: any) => p.status === 'sent')
    .reduce((sum: number, p: any) => {
      const budget = parseFloat(p.budget?.replace(/[^0-9.]/g, '') || '0');
      return sum + budget;
    }, 0);

  if (status === 'loading') {
    return (
      <Layout currentPage="dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  const initials = `${session.user?.firstName?.[0] || ''}${session.user?.lastName?.[0] || ''}`.toUpperCase();
  const displayName = `${session.user?.firstName || ''} ${session.user?.lastName || ''}`.trim() || session.user?.email || 'User';

  return (
    <Layout currentPage="dashboard">
      <div className="min-h-screen px-4 py-20 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl text-white mb-2 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Welcome back, {session.user?.firstName || 'User'}! 👋
                </h1>
                <p className="text-white/80 text-lg" style={{ fontFamily: 'var(--font-inter)' }}>
                  Ready to create amazing proposals and invoices?
                </p>
              </div>

              {/* User Profile Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                {session.user?.picture ? (
                  <img
                    src={session.user.picture}
                    alt="Profile"
                    className="w-14 h-14 rounded-full border-2 border-white/30"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xl border-2 border-white/30">
                    {initials}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate" style={{ fontFamily: 'var(--font-inter)' }}>
                    {displayName}
                  </p>
                  <p className="text-white/60 text-sm truncate" style={{ fontFamily: 'var(--font-inter)' }}>
                    {session.user?.email}
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" title="Online"></div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-3xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>{isLoading ? '...' : totalProposals}</span>
              </div>
              <h3 className="text-lg text-white mb-1 font-light" style={{ fontFamily: 'var(--font-inter)' }}>
                Total Proposals
              </h3>
              <p className="text-white/60 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                Documents created
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-3xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>${isLoading ? '...' : totalEarnings.toLocaleString()}</span>
              </div>
              <h3 className="text-lg text-white mb-1 font-light" style={{ fontFamily: 'var(--font-inter)' }}>
                Total Earnings
              </h3>
              <p className="text-white/60 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                Revenue generated
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-3xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>{isLoading ? '...' : sentProposals}</span>
              </div>
              <h3 className="text-lg text-white mb-1 font-light" style={{ fontFamily: 'var(--font-inter)' }}>
                Paid Invoices
              </h3>
              <p className="text-white/60 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                Successfully collected
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-3xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>{isLoading ? '...' : pendingProposals}</span>
              </div>
              <h3 className="text-lg text-white mb-1 font-light" style={{ fontFamily: 'var(--font-inter)' }}>
                Pending
              </h3>
              <p className="text-white/60 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                Awaiting payment
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl text-white font-light mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                Quick Actions
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Create Proposal Card */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 group">
                  <div className="w-14 h-14 bg-purple-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2h2.828l-5.586-5.586z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl text-white mb-3 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Create Proposal
                  </h3>
                  <p className="text-white/80 mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
                    Transform your project description into a professional proposal in seconds.
                  </p>
                  <Link
                    href="/create-proposal"
                    className="px-6 py-3 bg-white text-black font-light rounded-full hover:bg-white/90 transition-all duration-300 group-hover:scale-105 inline-block text-center"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    Create Proposal
                  </Link>
                </div>

                {/* Generate Invoice Card */}
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 group">
                  <div className="w-14 h-14 bg-blue-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl text-white mb-3 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Generate Invoice
                  </h3>
                  <p className="text-white/80 mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
                    Create professional invoices with integrated payment links.
                  </p>
                  <button className="px-6 py-3 bg-white text-black font-light rounded-full hover:bg-white/90 transition-all duration-300 group-hover:scale-105" style={{ fontFamily: 'var(--font-inter)' }}>
                    Generate Invoice
                  </button>
                </div>

                {/* View Templates Card */}
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 group">
                  <div className="w-14 h-14 bg-green-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl text-white mb-3 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Browse Templates
                  </h3>
                  <p className="text-white/80 mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
                    Choose from professionally designed templates.
                  </p>
                  <button className="px-6 py-3 bg-white text-black font-light rounded-full hover:bg-white/90 transition-all duration-300 group-hover:scale-105" style={{ fontFamily: 'var(--font-inter)' }}>
                    View Templates
                  </button>
                </div>

                {/* Settings Card */}
                <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 group">
                  <div className="w-14 h-14 bg-orange-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl text-white mb-3 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Account Settings
                  </h3>
                  <p className="text-white/80 mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
                    Manage your profile and preferences.
                  </p>
                  <button className="px-6 py-3 bg-white text-black font-light rounded-full hover:bg-white/90 transition-all duration-300 group-hover:scale-105" style={{ fontFamily: 'var(--font-inter)' }}>
                    Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity - Takes 1 column */}
            <div className="space-y-6">
              <h2 className="text-2xl text-white font-light mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                Recent Activity
              </h2>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-white/60 text-center" style={{ fontFamily: 'var(--font-inter)' }}>
                    No recent activity
                  </p>
                  <p className="text-white/40 text-sm text-center mt-2" style={{ fontFamily: 'var(--font-inter)' }}>
                    Start creating proposals to see your history here
                  </p>
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg text-white mb-3 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                  💡 Getting Started Tips
                </h3>
                <ul className="space-y-2 text-white/70 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Describe your project in simple terms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Include budget and timeline details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Generate PDF for professional sharing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Share payment links for quick collection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="text-center">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-8 py-3 border border-white text-white font-light rounded-full hover:bg-white/10 transition-all duration-300"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
