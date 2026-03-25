'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      const response = await fetch('/api/user/account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      // Sign out and redirect to home
      await fetch('/api/auth/signout', { method: 'POST' });
      router.push('/');
    } catch (error: any) {
      alert(error.message || 'Failed to delete account');
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
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

  const user = session.user as any;

  return (
    <Layout currentPage="settings">
      <div className="min-h-screen pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
            <p className="text-secondary text-sm">Manage your account settings and preferences</p>
          </div>

          {/* Account Info */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Account Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-white/50 text-sm">Email</span>
                <span className="text-white text-sm">{user.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-white/50 text-sm">Name</span>
                <span className="text-white text-sm">{user.firstName} {user.lastName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-white/50 text-sm">Plan</span>
                <span className="text-white text-sm capitalize">{user.plan || 'free'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-white/50 text-sm">Provider</span>
                <span className="text-white text-sm capitalize">{user.provider || 'credentials'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/50 text-sm">Member Since</span>
                <span className="text-white text-sm">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/profile"
                className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Edit Profile</p>
                    <p className="text-white/50 text-xs">Update your personal information</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-white/30 group-hover:text-white/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {user.provider === 'credentials' && (
                <Link
                  href="/settings/change-password"
                  className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Change Password</p>
                      <p className="text-white/50 text-xs">Update your password</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-white/30 group-hover:text-white/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}

              {user.plan !== 'pro' && (
                <Link
                  href="/pricing"
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-white/20 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Upgrade to Pro</p>
                      <p className="text-white/50 text-xs">Unlock unlimited proposals & more</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-white/30 group-hover:text-white/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h2>
            <p className="text-white/50 text-sm mb-4">
              Irreversible and destructive actions
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-all text-sm font-medium"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Account?</h3>
                  <p className="text-white/50 text-sm">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-white/70 text-sm mb-6">
                Are you sure you want to delete your account? All of your proposals, invoices, and data will be permanently deleted. This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deletingAccount}
                  className="flex-1 px-4 py-2.5 bg-black/40 text-white rounded-lg hover:bg-black/50 transition-all text-sm font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletingAccount ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
