'use client';

import { useState, useEffect } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'proposal' | 'invoice';
  id: string;
  title: string;
}

export default function ShareModal({ isOpen, onClose, type, id, title }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && !shareUrl) {
      generateShareLink();
    }
  }, [isOpen]);

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/${type}s/${id}/share`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setShareUrl(data.shareUrl);
      } else {
        alert('Failed to generate share link');
        onClose();
      }
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Failed to generate share link');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`${type === 'proposal' ? 'Proposal' : 'Invoice'}: ${title}`);
    const body = encodeURIComponent(`Please view the ${type} at the following link:\n\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`${type === 'proposal' ? 'Proposal' : 'Invoice'}: ${title}\n\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`Check out this ${type}: ${title}\n\n${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareViaLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/20">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-light text-white mb-2">
            Share {type === 'proposal' ? 'Proposal' : 'Invoice'}
          </h3>
          <p className="text-white/60 text-sm">
            {loading ? 'Generating secure link...' : 'Share via any channel'}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Share URL */}
            <div className="mb-6">
              <label className="text-white/60 text-sm mb-2 block">Shareable Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {copied ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-green-400 text-sm mt-2">Link copied to clipboard!</p>
              )}
            </div>

            {/* Share Options */}
            <div className="mb-6">
              <label className="text-white/60 text-sm mb-3 block">Share via</label>
              <div className="grid grid-cols-2 gap-3">
                {/* Email */}
                <button
                  onClick={shareViaEmail}
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Email</p>
                    <p className="text-white/50 text-xs">Send via email</p>
                  </div>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={shareViaWhatsApp}
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">WhatsApp</p>
                    <p className="text-white/50 text-xs">Send via WhatsApp</p>
                  </div>
                </button>

                {/* Twitter */}
                <button
                  onClick={shareViaTwitter}
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-sky-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Twitter</p>
                    <p className="text-white/50 text-xs">Share on Twitter</p>
                  </div>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={shareViaLinkedIn}
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">LinkedIn</p>
                    <p className="text-white/50 text-xs">Share on LinkedIn</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-white text-sm font-medium">Secure Link</p>
                <p className="text-white/50 text-xs">This link is secure and expires in 7 days. Only share it with your intended recipient.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
