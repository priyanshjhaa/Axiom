import Layout from '@/components/Layout';

export default function Pricing() {
  return (
    <Layout currentPage="pricing">
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-8 sm:mb-12 leading-tight font-light px-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Pricing
          </h2>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-white/10 max-w-2xl mx-auto px-4">
            <h3 className="text-xl sm:text-2xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Free Tier</h3>
            <div className="text-3xl sm:text-4xl text-white mb-4 sm:mb-6 font-light" style={{ fontFamily: 'var(--font-playfair)' }}>$0<span className="text-sm sm:text-lg">/month</span></div>

            <ul className="text-white/90 space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-left max-w-md mx-auto text-sm sm:text-base" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
              <li>• 5 proposals per month</li>
              <li>• Basic templates</li>
              <li>• PDF export</li>
              <li>• Email support</li>
            </ul>

            <div className="text-white/80 mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: 'var(--font-inter)' }}>
              Premium plans coming soon with unlimited proposals, custom templates, and priority support.
            </div>

            <button className="px-8 sm:px-10 py-3 bg-white text-black font-light rounded-full hover:bg-white/90 transition-all duration-300 text-sm sm:text-base" style={{ fontFamily: 'var(--font-inter)' }}>
              Start Free
            </button>
          </div>

          <div className="mt-8">
            <a
              href="/"
              className="inline-block px-8 py-3 border border-white text-white font-light rounded-full hover:bg-white/10 transition-all duration-300"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}