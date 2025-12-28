import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout currentPage="home">
      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 md:pt-24">
        {/* Hero Section */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 sm:mb-6 leading-tight font-light px-2" style={{ fontFamily: 'var(--font-playfair)', letterSpacing: '0.05em' }}>
            Transform Job Descriptions
            <br className="hidden sm:block" />
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mt-2 sm:mt-4 block">
              Into Professional Documents
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-12 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
            Describe your project in simple terms and generate professional proposals
            and invoices with payment links in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button className="px-8 py-3 sm:px-10 bg-white text-black font-light rounded-full hover:bg-white/90 transition-all duration-300 text-sm sm:text-base" style={{ fontFamily: 'var(--font-inter)' }}>
              Get Started
            </button>
            <button className="px-8 py-3 sm:px-10 border border-white text-white font-light rounded-full hover:bg-white/10 transition-all duration-300 text-sm sm:text-base" style={{ fontFamily: 'var(--font-inter)' }}>
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}