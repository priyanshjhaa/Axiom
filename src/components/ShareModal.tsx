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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet on Mobile, Modal on Desktop */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 animate-slide-up">
        <div className="bg-black border-t md:border border-white/20 rounded-t-3xl md:rounded-2xl p-6 max-w-lg mx-auto md:max-w-md">
          {/* Drag Handle - Mobile only */}
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6 md:hidden" />

          {/* Close button - Desktop only */}
          <button
            onClick={onClose}
            className="hidden md:block absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-6 text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-1">
              Share {type === 'proposal' ? 'Proposal' : 'Invoice'}
            </h3>
            <p className="text-white/50 text-sm">
              {loading ? 'Generating secure link...' : 'Share via any channel'}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Share URL */}
              <div className="mb-6">
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-transparent px-4 py-4 text-white text-sm focus:outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="h-12 px-5 bg-white text-black font-medium rounded-xl mr-2 hover:bg-white/90 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                {copied && (
                  <p className="text-green-400 text-sm mt-2 text-center">Link copied!</p>
                )}
              </div>

              {/* Share Options */}
              <div className="mb-6">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-3 font-semibold">
                  Share via
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {/* Email */}
                  <button
                    onClick={shareViaEmail}
                    className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <span className="text-white text-xs">Email</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={shareViaWhatsApp}
                    className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                  >
                    <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <span className="text-white text-xs">WhatsApp</span>
                  </button>

                  {/* Twitter/X */}
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(`Check out this ${type}: ${title}\n\n${shareUrl}`);
                      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
                    }}
                    className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    <span className="text-white text-xs">X</span>
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={copyToClipboard}
                    className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-white text-xs">Copy</span>
                  </button>
                </div>
              </div>

              {/* Security Note */}
              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="text-white text-sm font-medium">Secure Link</p>
                  <p className="text-white/50 text-xs">Expires in 7 days. Only share with your client.</p>
                </div>
              </div>

              {/* Cancel Button - Mobile only */}
              <button
                onClick={onClose}
                className="w-full h-12 mt-4 text-white/60 font-medium md:hidden"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
