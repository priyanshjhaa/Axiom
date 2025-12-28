import Layout from '@/components/Layout';

export default function Features() {
  return (
    <Layout currentPage="features">
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-8 sm:mb-12 leading-tight font-light px-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Features
          </h2>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>AI-Powered Generation</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                Advanced AI understands your project needs and creates tailored, professional proposals that impress clients.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Instant Invoicing</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                Generate matching invoices with integrated payment links from Stripe and other payment processors.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>Professional Templates</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                Choose from beautifully designed templates that make your business look professional and established.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-light" style={{ fontFamily: 'var(--font-inter)' }}>PDF Export</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
                Export your proposals and invoices as high-quality PDFs perfect for email attachments or printing.
              </p>
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