'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function CreateProposal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    projectTitle: '',
    projectDescription: '',
    budget: '',
    timeline: '',
    startDate: '',
    deliverables: '',
  });

  if (status === 'loading') {
    return (
      <Layout currentPage="create-proposal">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Client email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Invalid email format';
    }
    if (!formData.projectTitle.trim()) newErrors.projectTitle = 'Project title is required';
    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Project description is required';
    }
    if (!formData.budget.trim()) newErrors.budget = 'Budget is required';
    if (!formData.timeline.trim()) newErrors.timeline = 'Timeline is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userEmail: session.user?.email,
        }),
      });

      const data = await response.json();

      console.log('API Response:', data);
      console.log('Response status:', response.status);

      if (response.ok) {
        console.log('Redirecting to:', `/proposals/${data.proposalId}`);
        router.push(`/proposals/${data.proposalId}`);
      } else {
        setErrors({ general: data.error || 'Failed to generate proposal' });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout currentPage="create-proposal">
      <div className="min-h-screen px-4 py-20 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-4xl sm:text-5xl text-white mb-2 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
              Create Proposal
            </h1>
            <p className="text-white/80 text-lg" style={{ fontFamily: 'var(--font-inter)' }}>
              Transform your project details into a professional proposal
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-200 text-sm text-center" style={{ fontFamily: 'var(--font-inter)' }}>
                  {errors.general}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Client Information Section */}
              <div>
                <h2 className="text-2xl text-white mb-6 font-light flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <div className="w-10 h-10 bg-purple-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  Client Information
                </h2>

                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="clientName" className="block text-sm font-light text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                        Client Name *
                      </label>
                      <input
                        id="clientName"
                        name="clientName"
                        type="text"
                        required
                        value={formData.clientName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${
                          errors.clientName ? 'border-red-500' : 'border-white/20'
                        }`}
                        style={{ fontFamily: 'var(--font-inter)' }}
                        placeholder="Enter client name"
                      />
                      {errors.clientName && (
                        <p className="mt-1 text-xs text-red-400" style={{ fontFamily: 'var(--font-inter)' }}>
                          {errors.clientName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="clientEmail" className="block text-sm font-light text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                        Client Email *
                      </label>
                      <input
                        id="clientEmail"
                        name="clientEmail"
                        type="email"
                        required
                        value={formData.clientEmail}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${
                          errors.clientEmail ? 'border-red-500' : 'border-white/20'
                        }`}
                        style={{ fontFamily: 'var(--font-inter)' }}
                        placeholder="client@example.com"
                      />
                      {errors.clientEmail && (
                        <p className="mt-1 text-xs text-red-400" style={{ fontFamily: 'var(--font-inter)' }}>
                          {errors.clientEmail}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="clientCompany" className="block text-sm font-light text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                      Company Name
                    </label>
                    <input
                      id="clientCompany"
                      name="clientCompany"
                      type="text"
                      value={formData.clientCompany}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'var(--font-inter)' }}
                      placeholder="Enter company name (optional)"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details Section */}
              <div>
                <h2 className="text-2xl text-white mb-6 font-light flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Project Details
                </h2>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="projectTitle" className="block text-sm font-light text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                      Project Title *
                    </label>
                    <input
                      id="projectTitle"
                      name="projectTitle"
                      type="text"
                      required
                      value={formData.projectTitle}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 ${
                        errors.projectTitle ? 'border-red-500' : 'border-white/20'
                      }`}
                      style={{ fontFamily: 'var(--font-inter)' }}
                      placeholder="E.g., E-commerce Website Development"
                    />
                    {errors.projectTitle && (
                      <p className="mt-1 text-xs text-red-400" style={{ fontFamily: 'var(--font-inter)' }}>
                        {errors.projectTitle}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="projectDescription" className="block text-sm font-light text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                      Project Description *
                    </label>
                    <textarea
                      id="projectDescription"
                      name="projectDescription"
                      required
                      value={formData.projectDescription}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 ${
                        errors.projectDescription ? 'border-red-500' : 'border-white/20'
                      }`}
                      style={{ fontFamily: 'var(--font-inter)' }}
                      placeholder="Describe the project in detail. Include requirements, goals, scope, and any specific details about what needs to be delivered..."
                    />
                    {errors.projectDescription && (
                      <p className="mt-1 text-xs text-red-400" style={{ fontFamily: 'var(--font-inter)' }}>
                        {errors.projectDescription}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="deliverables" className="block text-sm font-light text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                      Key Deliverables
                    </label>
                    <textarea
                      id="deliverables"
                      name="deliverables"
                      value={formData.deliverables}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'var(--font-inter)' }}
                      placeholder="List the main deliverables (one per line)&#10;- Website design&#10;- Mobile responsive layout&#10;- CMS integration"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Timeline Section */}
              <div>
                <h2 className="text-2xl text-white mb-6 font-light flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <div className="w-10 h-10 bg-green-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  Pricing & Timeline
                </h2>

                <div className="grid sm:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-light text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                      Budget ($) *
                    </label>
                    <input
                      id="budget"
                      name="budget"
                      type="text"
                      required
                      value={formData.budget}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 ${
                        errors.budget ? 'border-red-500' : 'border-white/20'
                      }`}
                      style={{ fontFamily: 'var(--font-inter)' }}
                      placeholder="5000"
                    />
                    {errors.budget && (
                      <p className="mt-1 text-xs text-red-400" style={{ fontFamily: 'var(--font-inter)' }}>
                        {errors.budget}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="timeline" className="block text-sm font-light text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                      Timeline *
                    </label>
                    <input
                      id="timeline"
                      name="timeline"
                      type="text"
                      required
                      value={formData.timeline}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 ${
                        errors.timeline ? 'border-red-500' : 'border-white/20'
                      }`}
                      style={{ fontFamily: 'var(--font-inter)' }}
                      placeholder="4 weeks"
                    />
                    {errors.timeline && (
                      <p className="mt-1 text-xs text-red-400" style={{ fontFamily: 'var(--font-inter)' }}>
                        {errors.timeline}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="startDate" className="block text-sm font-light text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                      Start Date
                    </label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-light rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Proposal...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Professional Proposal
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
