'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout currentPage="login">
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full space-y-8">
          {/* Login Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl text-white mb-2 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                Welcome Back
              </h2>
              <p className="text-white/80 text-sm sm:text-base" style={{ fontFamily: 'var(--font-inter)' }}>
                Sign in to your AXIOM account
              </p>

              {/* Verification Test */}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={async () => {
                    const userEmail = prompt('Enter your registered email:');
                    const userPassword = prompt('Enter your password:');

                    if (userEmail && userPassword) {
                      try {
                        const response = await fetch('/api/auth/verify', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: userEmail, password: userPassword })
                        });
                        const data = await response.json();
                        console.log('Verification result:', data);
                        alert(`Verification: ${data.success ? 'SUCCESS ✅' : 'FAILED ❌'}\n${data.error || JSON.stringify(data)}`);
                      } catch (error) {
                        console.error('Verification error:', error);
                        alert('Verification failed. Check console.');
                      }
                    }
                  }}
                  className="text-blue-300 underline text-xs hover:text-blue-200"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Test Credentials (Debug)
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-200 text-sm text-center" style={{ fontFamily: 'var(--font-inter)' }}>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-light text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'var(--font-inter)' }}
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-light text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'var(--font-inter)' }}
                  placeholder="Enter your password"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <a href="/forgot-password" className="text-sm text-white/80 hover:text-white transition-colors duration-300" style={{ fontFamily: 'var(--font-inter)' }}>
                  Forgot your password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-white text-black font-light rounded-lg hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* OAuth Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/60" style={{ fontFamily: 'var(--font-inter)' }}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full py-3 px-4 bg-white text-black font-light rounded-lg hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 flex items-center justify-center gap-3"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-white/80 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                Don't have an account?{' '}
                <Link href="/signup" className="text-white hover:text-white/80 font-light transition-colors duration-300">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 text-sm font-light"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}