'use client';

import { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (signatureData: { type: 'drawn' | 'typed'; data: string }) => void;
  title?: string;
  loading?: boolean;
}

export default function SignatureModal({ isOpen, onClose, onSubmit, title = 'Add Your Signature', loading = false }: SignatureModalProps) {
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState('Dancing Script');
  const sigCanvas = useRef<SignatureCanvas>(null);

  // Clear signature when modal opens
  useEffect(() => {
    if (isOpen && sigCanvas.current) {
      sigCanvas.current.clear();
      setTypedName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDrawSubmit = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataURL = sigCanvas.current.toDataURL();
      onSubmit({ type: 'drawn', data: dataURL });
      handleClose();
    }
  };

  const handleTypeSubmit = () => {
    if (typedName.trim()) {
      onSubmit({ type: 'typed', data: `${typedName}|${selectedFont}` });
      handleClose();
    }
  };

  const handleClose = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setTypedName('');
    onClose();
  };

  const fonts = [
    { name: 'Dancing Script', style: 'var(--font-dancing-script)', label: 'Elegant' },
    { name: 'Great Vibes', style: 'var(--font-great-vibes)', label: 'Classic' },
    { name: 'Herr Von Muellerhoff', style: 'var(--font-herr-von-muellerhoff)', label: 'Modern' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 max-w-lg w-full border border-white/30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl text-white font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
            {title}
          </h3>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition-colors bg-white/10 rounded-full p-2 hover:bg-white/20"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setMode('draw')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-light transition-all ${
              mode === 'draw'
                ? 'bg-white text-black shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Draw
          </button>
          <button
            onClick={() => setMode('type')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-light transition-all ${
              mode === 'type'
                ? 'bg-white text-black shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Type
          </button>
        </div>

        {mode === 'draw' ? (
          <div className="space-y-6">
            <div>
              <p className="text-white/80 text-sm mb-3" style={{ fontFamily: 'var(--font-inter)' }}>
                Draw your signature below
              </p>
              <div className="border-2 border-dashed border-white/30 rounded-2xl p-1 bg-white shadow-xl">
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    className: 'w-full h-48 cursor-pointer rounded-xl',
                  }}
                  penColor="black"
                  backgroundColor="#ffffff"
                />
              </div>
            </div>

            <button
              onClick={() => sigCanvas.current?.clear()}
              className="w-full py-3 text-white/70 hover:text-white transition-colors flex items-center justify-center gap-2 hover:bg-white/5 rounded-xl"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear & Start Over
            </button>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition-all text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDrawSubmit}
                disabled={loading || sigCanvas.current?.isEmpty()}
                className="flex-1 px-6 py-3 bg-white text-black rounded-xl hover:bg-white/90 transition-all text-sm font-light shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {loading ? 'Signing...' : '✓ Sign Proposal'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-white/80 mb-3" style={{ fontFamily: 'var(--font-inter)' }}>
                Your Full Name
              </label>
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 bg-white/10 text-white placeholder-white/40"
                style={{ fontFamily: 'var(--font-inter)' }}
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-3" style={{ fontFamily: 'var(--font-inter)' }}>
                Choose Signature Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                {fonts.map((font) => (
                  <button
                    key={font.name}
                    onClick={() => setSelectedFont(font.name)}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      selectedFont === font.name
                        ? 'border-white bg-white/20 shadow-lg'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                    }`}
                  >
                    <p className="text-xs text-white/60 mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                      {font.label}
                    </p>
                    <div className="h-12 flex items-center justify-center">
                      <span
                        className="text-white text-2xl"
                        style={{
                          fontFamily: font.style,
                        }}
                      >
                        {typedName || 'Aa'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            {typedName && (
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <p className="text-xs text-white/60 mb-3 uppercase tracking-wider" style={{ fontFamily: 'var(--font-inter)' }}>
                  Live Preview
                </p>
                <div className="bg-white rounded-xl p-4 flex items-center justify-center min-h-[80px]">
                  <p
                    className="text-black text-4xl"
                    style={{
                      fontFamily: fonts.find((f) => f.name === selectedFont)?.style,
                    }}
                  >
                    {typedName}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition-all text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleTypeSubmit}
                disabled={loading || !typedName.trim()}
                className="flex-1 px-6 py-3 bg-white text-black rounded-xl hover:bg-white/90 transition-all text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {loading ? 'Signing...' : '✓ Sign Proposal'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
