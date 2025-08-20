import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import TypeAnimation from '../components/common/TypeAnimation';
import Button from '../components/common/Button';

const Home = () => {
  return (
    <>
      <SEOHead
        title="Mapverter - Free Online Data Transformation Tools | Convert CSV, JSON, EDI & More"
        description="Transform your data for free with Mapverter's powerful online tools. Convert CSV to JSON, validate EDI files, generate test data, and more. No payment required, unlimited usage, works anywhere."
        keywords="free data converter, csv to json, edi converter, data transformation, online data tools, free csv converter, json validator, data mapping tools, file converter"
      />

      {/* Hero Section */}
      <section className="relative px-4 pt-32 pb-24 md:pt-40 md:pb-32 min-h-[90vh] bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5 dark:from-blue-400/10 dark:via-transparent dark:to-emerald-400/10"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Free Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-semibold mb-8 border border-emerald-200 dark:border-emerald-700/50">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% Free Forever • No Payment Required
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-8 leading-tight tracking-tight">
              Transform Your Data
              <br />
              <TypeAnimation
                sequences={[
                  "Instantly", 2500,
                  "Securely", 2000,
                  "For Free", 3000,
                  "Anywhere", 2500
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                className="text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent"
              />
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto font-medium">
              The most trusted free platform for data transformation. Convert, validate, and generate data across 
              <strong className="text-slate-900 dark:text-white font-semibold"> CSV, JSON, EDI, XML</strong> and more formats. 
              Used by professionals worldwide, completely free.
            </p>

            <div className="flex justify-center mb-12">
              <Link to="/convert">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-12 py-4 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  Start Converting Now
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mb-3 border border-emerald-200 dark:border-emerald-700/50">
                  <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Always Free</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-3 border border-blue-200 dark:border-blue-700/50">
                  <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Secure & Private</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/20 rounded-xl flex items-center justify-center mb-3 border border-violet-200 dark:border-violet-700/50">
                  <svg className="w-7 h-7 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lightning Fast</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/20 rounded-xl flex items-center justify-center mb-3 border border-amber-200 dark:border-amber-700/50">
                  <svg className="w-7 h-7 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Limits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Placement: Banner Ad Section */}
      <section className="py-8 bg-slate-100/50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Ad placeholder - 728x90 leaderboard */}
            <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-24 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              Advertisement Space (728x90)
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Everything You Need, Completely Free
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
              Professional-grade data transformation tools that work in your browser. 
              No downloads, no subscriptions, no hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Generate */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/10 dark:to-emerald-800/10 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-emerald-200/50 dark:border-emerald-700/30 group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Generate Test Data</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Create realistic sample data for testing and development. Choose from dozens of data types and formats.
              </p>
              <Link to="/generate" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                Try Generator
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Convert */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-800/10 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-blue-200/50 dark:border-blue-700/30 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Convert Formats</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Transform data between CSV, JSON, XML, EDI, and more. Smart field mapping and type detection included.
              </p>
              <Link to="/convert" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Start Converting
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Validate */}
            <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/10 dark:to-violet-800/10 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-violet-200/50 dark:border-violet-700/30 group">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Validate Data</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Ensure data integrity with comprehensive validation rules. Check formats, schemas, and business logic.
              </p>
              <Link to="/validate" className="inline-flex items-center text-violet-600 dark:text-violet-400 font-semibold hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
                Validate Now
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Map */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Map Fields</h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                Visual drag-and-drop interface to map fields between different data structures and formats.
              </p>
              <Link to="/map" className="inline-flex items-center text-orange-600 dark:text-orange-400 font-medium hover:text-orange-700 dark:hover:text-orange-300">
                Start Mapping
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Visualize */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Visualize Data</h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                Create interactive charts and graphs from your data. Perfect for analysis and presentations.
              </p>
              <Link to="/visualize" className="inline-flex items-center text-red-600 dark:text-red-400 font-medium hover:text-red-700 dark:hover:text-red-300">
                Create Charts
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* More Tools */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">More Tools Coming</h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                We're constantly adding new formats and features. Request tools you need and we'll build them.
              </p>
              <Link to="/roadmap" className="inline-flex items-center text-gray-600 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-300">
                See Roadmap
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Placement Suggestion: Rectangle ad could go here between features and formats */}

      {/* Ad Placement: Rectangle Ad Section */}
      <section className="py-8 bg-slate-100/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Ad placeholder - 300x250 rectangle */}
            <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-64 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              Advertisement Space (300x250)
            </div>
          </div>
        </div>
      </section>

      {/* Supported Formats Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Work With Any Data Format
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
              From simple CSV files to complex EDI transactions, we support the formats you use every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: 'CSV', desc: 'Comma-separated values', icon: '📊', popular: true },
              { name: 'JSON', desc: 'JavaScript Object Notation', icon: '🔧', popular: true },
              { name: 'EDI', desc: 'Electronic Data Interchange', icon: '🏥', popular: false },
              { name: 'XML', desc: 'Extensible Markup Language', icon: '📄', popular: false },
              { name: 'Excel', desc: 'Microsoft Excel files', icon: '📈', popular: true },
              { name: 'YAML', desc: 'YAML Ain\'t Markup Language', icon: '⚙️', popular: false },
              { name: 'SQL', desc: 'Structured Query Language', icon: '🗄️', popular: false },
              { name: 'More', desc: 'And many more formats', icon: '➕', popular: false }
            ].map((format) => (
              <div key={format.name} className="bg-white dark:bg-slate-900 rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 relative border border-slate-200 dark:border-slate-700 group">
                {format.popular && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Popular
                  </div>
                )}
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">{format.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{format.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{format.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Why Professionals Choose Mapverter
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Trusted by developers, analysts, and enterprises worldwide for reliable data transformation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-200 dark:border-emerald-700/50">
                <svg className="w-12 h-12 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">100% Free Forever</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                No hidden costs, no premium tiers, no usage limits. All features are completely free for everyone, always.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-200 dark:border-blue-700/50">
                <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Privacy First</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Your data never leaves your browser. All processing happens locally, ensuring complete privacy and security.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/20 dark:to-violet-800/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-violet-200 dark:border-violet-700/50">
                <svg className="w-12 h-12 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Works Anywhere</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                No downloads or installations required. Works in any modern browser on any device, anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Placement Suggestion: Leaderboard ad could go here */}

      {/* Quick Start Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Get Started in Seconds
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300">
              No account required. Just upload your data and start transforming.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                1
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Upload Your File</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Drag and drop your file or paste your data directly into the editor.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                2
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Choose Your Tool</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Select convert, validate, generate, or any other transformation you need.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                3
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Download Results</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Get your transformed data instantly. No waiting, no processing fees.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/convert">
              <Button
                variant="primary"
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-12 py-4"
              >
                Start Converting
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials/Use Cases Section */}
      {/* <section className="py-20 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Trusted by Professionals Worldwide
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              From startups to enterprises, see how teams use Mapverter to streamline their data workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Developers</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                "Perfect for API testing and data migration projects. Saves hours of manual work."
              </p>
              <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>• API response formatting</li>
                <li>• Database migration prep</li>
                <li>• Test data generation</li>
              </ul>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Data Analysts</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                "Essential tool for data preparation. Clean, reliable, and always available."
              </p>
              <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>• Report data preparation</li>
                <li>• Format standardization</li>
                <li>• Data quality checks</li>
              </ul>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-8">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Healthcare Teams</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                "Streamlines EDI processing and claims management. HIPAA-compliant and secure."
              </p>
              <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>• EDI 837/835 processing</li>
                <li>• Claims data validation</li>
                <li>• Format conversions</li>
              </ul>
            </div>
          </div>
        </div>
      </section> */}

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-emerald-600/90"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            Ready to Transform Your Data?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Transform your data instantly. No registration, no limits, completely free.
          </p>
          
          <div className="flex justify-center mb-12">
            <Link to="/convert">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-12 py-4 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Converting Now
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-blue-100 text-sm font-medium">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Always Free
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure & Private
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              No Installation
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Unlimited Usage
            </div>
          </div>
        </div>
      </section>

      {/* Ad Placement: Footer Banner Ad Section */}
      <section className="py-8 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Ad placeholder - 728x90 leaderboard */}
            <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-24 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              Advertisement Space (728x90)
            </div>
          </div>
        </div>
      </section>


    </>
  );
};

export default Home;