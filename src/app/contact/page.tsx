import Layout from '@/components/Layout';

export default function Contact() {
  return (
    <Layout currentPage="contact">
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-6 sm:mb-8 leading-tight font-light px-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Get in Touch
          </h2>

          <div className="space-y-4 sm:space-y-6 px-4">
            <p className="text-base sm:text-lg text-white/90 leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
              Have questions or feedback? We'd love to hear from you.
            </p>

            <div className="space-y-3 sm:space-y-4">
              <p className="text-white text-sm sm:text-base" style={{ fontFamily: 'var(--font-inter)' }}>
                Email: <span className="text-white/85">hello@axiom.app</span>
              </p>
              <p className="text-white text-sm sm:text-base" style={{ fontFamily: 'var(--font-inter)' }}>
                Support: <span className="text-white/85">support@axiom.app</span>
              </p>
            </div>

            <div className="mt-6 sm:mt-8">
              <button className="px-8 sm:px-10 py-3 bg-white text-black font-light rounded-full hover:bg-white/90 transition-all duration-300 text-sm sm:text-base" style={{ fontFamily: 'var(--font-inter)' }}>
                Contact Support
              </button>
            </div>
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