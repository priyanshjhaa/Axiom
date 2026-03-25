'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Sending registration request:', formData);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      let data;
      try {
        const text = await response.text();
        console.log('Raw response text:', text);
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('Parsed response data:', data);

      if (response.ok) {
        // Registration successful, redirect to login
        router.push('/login?message=Registration successful! Please log in.');
      } else {
        // Registration failed
        console.error('Registration error response:', data);
        setErrors({ general: data.error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Frontend registration error:', error);
      setErrors({ general: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout currentPage="signup">
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full space-y-8">
          {/* Sign Up Card */}
          <div className="card-elevated">
            <div className="text-center mb-8">
              <h2 className="text-3xl mb-2">Join Axiom</h2>
              <p className="text-secondary">
                Create your account and start generating proposals
              </p>
            </div>

            {errors.general && (
              <div className="mb-4 p-3 bg-error rounded-lg">
                <p className="text-error text-sm text-center">
                  {errors.general}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p className="form-error">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className="form-error">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="form-error">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="form-error">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="form-error">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 bg-elevated border-default rounded focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <label htmlFor="terms" className="ml-3 text-sm text-secondary">
                  I agree to the{' '}
                  <a href="/terms" className="text-accent hover:underline">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-accent hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            {/* OAuth Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-default"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface text-tertiary">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="btn-secondary w-full flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* GitHub OAuth Button */}
            <button
              onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
              className="btn-secondary w-full flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              Continue with GitHub
            </button>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-secondary text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-accent hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center text-secondary hover:text-primary transition-colors text-sm"
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
