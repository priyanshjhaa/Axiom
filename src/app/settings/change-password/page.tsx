'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setMessage({ type: 'success', text: 'Password changed successfully! Please sign in with your new password.' });

      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Sign out after 2 seconds
      setTimeout(() => {
        signIn('credentials', {
          email: (session as any)?.user?.email,
          password: formData.newPassword,
          redirect: false,
        }).then(() => {
          router.push('/login');
        });
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to change password' });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <Layout currentPage="settings">
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

  // Only show for credentials users
  if ((session as any)?.user?.provider !== 'credentials') {
    return (
      <Layout currentPage="settings">
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="max-w-md w-full mx-4 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Password Not Required</h1>
            <p className="text-white/50 mb-6">
              You signed in with {(session as any)?.user?.provider === 'google' ? 'Google' : 'GitHub'}, so you don't have a password to change.
            </p>
            <Link
              href="/settings"
              className="inline-block px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-all"
            >
              Back to Settings
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="settings">
      <div className="min-h-screen pt-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white/70 transition-colors text-sm mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Settings
            </Link>
            <h1 className="text-3xl font-bold text-primary mb-2">Change Password</h1>
            <p className="text-secondary text-sm">Update your password to keep your account secure</p>
          </div>

          {/* Change Password Card */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all"
                  placeholder="Enter your current password"
                  required
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all"
                  placeholder="Enter your new password"
                  required
                  minLength={8}
                />
                <p className="text-white/30 text-xs mt-1">Must be at least 8 characters long</p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all"
                  placeholder="Confirm your new password"
                  required
                  minLength={8}
                />
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
                  href="/settings"
                  className="flex-1 px-6 py-3 bg-black/40 hover:bg-black/50 border border-white/10 rounded-xl text-white transition-all text-sm font-medium text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-white hover:bg-white/90 text-black rounded-xl transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Security Tips */}
          <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
            <h3 className="text-white text-sm font-medium mb-2">Password Security Tips</h3>
            <ul className="text-white/50 text-xs space-y-1">
              <li>• Use at least 8 characters</li>
              <li>• Include a mix of letters, numbers, and symbols</li>
              <li>• Avoid common words or personal information</li>
              <li>• Don't reuse passwords from other sites</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
