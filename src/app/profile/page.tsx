'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    firstName: (session as any)?.user?.firstName || '',
    lastName: (session as any)?.user?.lastName || '',
    email: (session as any)?.user?.email || '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });

      // Refresh session to update UI
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <Layout currentPage="profile">
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-default border-t-accent rounded-full animate-spin"></div>
            <p className="text-secondary text-sm">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session) return null;

  return (
    <Layout currentPage="profile">
      <div className="min-h-screen pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white/70 transition-colors text-sm mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-primary mb-2">Edit Profile</h1>
            <p className="text-secondary text-sm">Update your personal information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/20 flex items-center justify-center border border-red-500/30">
                <span className="text-white font-semibold text-2xl">
                  {((session as any)?.user?.firstName || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">
                  {(session as any)?.user?.firstName} {(session as any)?.user?.lastName}
                </h3>
                <p className="text-white/50 text-sm mb-2">{(session as any)?.user?.email}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  (session as any)?.user?.plan === 'pro' ? 'bg-white/10 text-white' : 'bg-white/5 text-white/70'
                }`}>
                  {(session as any)?.user?.plan || 'free'} plan
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all"
                  placeholder="Enter your first name"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all"
                  placeholder="Enter your last name"
                  required
                />
              </div>

              {/* Email (Read-only for OAuth users) */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white/50 cursor-not-allowed"
                  title="Email cannot be changed"
                />
                <p className="text-white/30 text-xs mt-1">
                  {(session as any)?.user?.provider === 'credentials'
                    ? 'Contact support to change your email'
                    : `Managed by ${(session as any)?.user?.provider === 'google' ? 'Google' : (session as any)?.user?.provider === 'github' ? 'GitHub' : 'OAuth'}`}
                </p>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="flex-1 px-6 py-3 bg-black/40 hover:bg-black/50 border border-white/10 rounded-xl text-white transition-all text-sm font-medium"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-white hover:bg-white/90 text-black rounded-xl transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Section - Only for credentials users */}
          {(session as any)?.user?.provider === 'credentials' && (
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-medium mb-2">Change Password</h3>
              <p className="text-white/50 text-sm mb-4">
                Ensure your account is using a long, random password to stay secure.
              </p>
              <Link
                href="/settings/change-password"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Change Password
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
