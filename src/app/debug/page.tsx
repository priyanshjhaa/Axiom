'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

export default function DebugPage() {
  const [users, setUsers] = useState<any>(null);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/debug/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setMessage('Error fetching users');
    }
  };

  const resetUsers = async () => {
    try {
      const response = await fetch('/api/auth/debug/users', {
        method: 'DELETE'
      });
      const data = await response.json();
      setMessage(data.message);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      setMessage('Error resetting users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout currentPage="debug">
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl text-white mb-6 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
              Debug: User Management
            </h2>

            {message && (
              <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                <p className="text-blue-200 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                  {message}
                </p>
              </div>
            )}

            {users && (
              <div className="mb-6">
                <h3 className="text-xl text-white mb-3 font-light" style={{ fontFamily: 'var(--font-inter)' }}>
                  Current Users ({users.userCount})
                </h3>
                <div className="space-y-2">
                  {users.users.map((user: any, index: number) => (
                    <div key={index} className="bg-white/5 p-3 rounded-lg">
                      <p className="text-white/90 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                        <strong>Email:</strong> {user.email}<br />
                        <strong>Name:</strong> {user.firstName} {user.lastName}<br />
                        <strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={fetchUsers}
                className="px-6 py-3 bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-all duration-300"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Refresh Users
              </button>
              <button
                onClick={resetUsers}
                className="px-6 py-3 bg-red-600 text-white font-light rounded-lg hover:bg-red-700 transition-all duration-300"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Reset All Users
              </button>

            <button
              onClick={() => window.location.href = '/signup'}
              className="px-6 py-3 bg-green-600 text-white font-light rounded-lg hover:bg-green-700 transition-all duration-300"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Go to Sign Up
            </button>
            </div>

            <div className="mt-6 text-white/60 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
              <p><strong>Note:</strong> This page is for development/debugging only.</p>
              <p>Resetting users will remove all accounts except the demo account (test@axiom.app).</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}