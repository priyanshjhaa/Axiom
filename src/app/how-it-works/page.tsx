import Layout from '@/components/Layout';

export default function HowItWorks() {
  return (
    <Layout currentPage="how-it-works">
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-8 sm:mb-12 leading-tight font-light px-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            How It Works
          </h2>

          <div className="space-y-6 sm:space-y-8 px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-left">
              <div className="text-2xl sm:text-3xl text-white font-light min-w-fit">1</div>
              <div>
                <h3 className="text-lg sm:text-xl text-white mb-2 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Describe Your Project</h3>
                <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                  Write a simple description of the work you need to propose for. No technical knowledge required.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-left">
              <div className="text-2xl sm:text-3xl text-white font-light min-w-fit">2</div>
              <div>
                <h3 className="text-lg sm:text-xl text-white mb-2 font-light" style={{ fontFamily: 'var(--font-inter)' }}>AI Generates Proposal</h3>
                <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                  Our AI analyzes your description and creates a professional proposal with scope, timeline, and pricing.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-left">
              <div className="text-2xl sm:text-3xl text-white font-light min-w-fit">3</div>
              <div>
                <h3 className="text-lg sm:text-xl text-white mb-2 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Create Invoice</h3>
                <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                  Generate a matching invoice with payment links that clients can use to pay instantly.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-left">
              <div className="text-2xl sm:text-3xl text-white font-light min-w-fit">4</div>
              <div>
                <h3 className="text-lg sm:text-xl text-white mb-2 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Get Paid</h3>
                <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                  Share documents with clients and get paid quickly through integrated payment systems.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <a
              href="/"
              className="inline-block px-8 py-3 bg-white text-black font-light rounded-full hover:bg-white/90 transition-all duration-300"
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