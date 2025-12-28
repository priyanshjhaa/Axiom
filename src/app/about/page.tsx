import Layout from '@/components/Layout';

export default function About() {
  return (
    <Layout currentPage="about">
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-6 sm:mb-8 leading-tight font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
            About AXIOM
          </h2>

          <div className="text-left space-y-4 sm:space-y-6 max-w-2xl sm:max-w-3xl mx-auto">
            <p className="text-base sm:text-lg text-white/90 leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
              AXIOM is revolutionizing how freelancers and businesses create professional documents.
              We believe that great proposals shouldn't require hours of formatting and writing.
            </p>

            <p className="text-base sm:text-lg text-white/90 leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
              Simply describe your project in natural language, and our AI will generate a polished,
              professional proposal complete with scope, timeline, and pricing. Then create a matching
              invoice with integrated payment links.
            </p>

            <p className="text-base sm:text-lg text-white/90 leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
              Focus on what matters most - your clients and your work - while we handle the documentation.
            </p>
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