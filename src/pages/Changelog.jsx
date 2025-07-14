import React, { useState } from 'react';
import SEOHead from '../components/common/SEOHead';

const Changelog = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // 'success', 'error', or null
  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscriptionStatus('error');
      return;
    }
    
    if (!isValidEmail(email)) {
      setSubscriptionStatus('error');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionStatus(null);

    try {
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.ok) {
        setSubscriptionStatus('success');
        setEmail('');
      } else {
        setSubscriptionStatus('error');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscriptionStatus('error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const versions = [
    {
      version: 'v2.1.0',
      date: 'January 15, 2025',
      status: 'Latest',
      changes: {
        'New Features': [
          'Advanced CSV editor with spreadsheet-like interface and cell editing',
          'Batch file processing for converting multiple files simultaneously',
          'Enhanced EDI 837P and 835 transaction support with validation',
          'Real-time data preview during mapping operations',
          'Custom template builder with shareable templates'
        ],
        'Improvements': [
          'Significantly improved performance for large CSV files (10x faster)',
          'Better error handling with detailed validation messages',
          'Enhanced drag-and-drop file upload experience',
          'Improved mobile responsiveness across all tools',
          'Updated dark mode with better contrast ratios'
        ],
        'Bug Fixes': [
          'Fixed memory leak in large file processing',
          'Resolved CSV parser issues with special characters',
          'Fixed column alignment in data visualizer',
          'Corrected timezone handling in date fields'
        ]
      }
    },
    {
      version: 'v2.0.0',
      date: 'December 8, 2024',
      status: 'Major Release',
      changes: {
        'New Features': [
          'Complete UI redesign with modern, intuitive interface',
          'JSON schema validation and formatting tools',
          'Advanced data mapping with visual field connections',
          'Export to Excel, PDF, and XML formats',
          'Collaborative features for team workspace'
        ],
        'Improvements': [
          'Redesigned navigation with better categorization',
          'Enhanced search and filtering across all tools',
          'Improved accessibility with WCAG 2.1 AA compliance',
          'Better integration between conversion tools'
        ],
        'Breaking Changes': [
          'Updated API endpoints for better REST compliance',
          'Changed template format structure (migration guide available)',
          'Minimum browser requirements updated'
        ],
        'Bug Fixes': [
          'Fixed data loss issue during large conversions',
          'Resolved authentication timeout problems',
          'Fixed responsive layout issues on tablets'
        ]
      }
    },
    {
      version: 'v1.8.2',
      date: 'November 22, 2024',
      changes: {
        'Security': [
          'Updated dependencies to address security vulnerabilities',
          'Enhanced data encryption for file uploads',
          'Improved CORS policy implementation'
        ],
        'Bug Fixes': [
          'Fixed CSV header detection for files with unusual formatting',
          'Resolved download issues in Safari browser',
          'Fixed character encoding problems with international data'
        ]
      }
    },
    {
      version: 'v1.8.1',
      date: 'November 10, 2024',
      changes: {
        'Improvements': [
          'Faster CSV parsing for files over 100MB',
          'Better error messages for invalid file formats',
          'Enhanced tooltip descriptions for mapping fields'
        ],
        'Bug Fixes': [
          'Fixed date format conversion edge cases',
          'Resolved JSON validation false positives',
          'Fixed template sharing permissions'
        ]
      }
    },
    {
      version: 'v1.8.0',
      date: 'October 28, 2024',
      changes: {
        'New Features': [
          'Healthcare EDI transaction processing (837, 835, 276, 277)',
          'Advanced data validation rules with custom logic',
          'Template marketplace for sharing conversion setups',
          'API rate limiting and usage analytics'
        ],
        'Improvements': [
          'Enhanced data type detection accuracy',
          'Improved memory usage for large dataset processing',
          'Better progress indicators for long-running operations'
        ],
        'Bug Fixes': [
          'Fixed nested JSON conversion issues',
          'Resolved CSV delimiter auto-detection problems',
          'Fixed template export functionality'
        ]
      }
    },
    {
      version: 'v1.7.0',
      date: 'September 15, 2024',
      changes: {
        'New Features': [
          'Data visualization charts and graphs',
          'Automated data quality assessment',
          'Scheduled conversion jobs',
          'Integration with cloud storage providers'
        ],
        'Improvements': [
          'Reduced conversion time by 40% for JSON files',
          'Enhanced field mapping suggestions',
          'Improved undo/redo functionality'
        ],
        'Bug Fixes': [
          'Fixed Unicode character handling',
          'Resolved mapping preview inconsistencies',
          'Fixed export filename sanitization'
        ]
      }
    },
    {
      version: 'v1.6.0',
      date: 'August 20, 2024',
      changes: {
        'New Features': [
          'Dark mode theme support',
          'Advanced CSV filtering and sorting',
          'Data profiling and statistics',
          'Custom transformation functions'
        ],
        'Improvements': [
          'Streamlined onboarding experience',
          'Better keyboard navigation support',
          'Enhanced file format detection'
        ],
        'Bug Fixes': [
          'Fixed large file upload timeouts',
          'Resolved column mapping persistence issues',
          'Fixed print functionality for reports'
        ]
      }
    },
    {
      version: 'v1.5.0',
      date: 'July 5, 2024',
      changes: {
        'New Features': [
          'Initial release of Mapverter platform',
          'CSV to JSON conversion with field mapping',
          'Basic data validation and cleaning',
          'Template system for common conversions',
          'User authentication and file history'
        ]
      }
    }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'Latest':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`;
      case 'Major Release':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400`;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'New Features':
        return (
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'Improvements':
        return (
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'Bug Fixes':
        return (
          <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'Breaking Changes':
        return (
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'Security':
        return (
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <>
      <SEOHead
        title="Changelog - Mapverter Updates & Release Notes"
        description="Stay updated with the latest Mapverter features, improvements, and bug fixes. Track our progress in data transformation tools and platform enhancements."
        keywords="mapverter changelog, updates, release notes, new features, bug fixes, data conversion updates"
      />

      <main className="pt-24">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-blue-50 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Changelog
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl mx-auto">
                Track our progress as we continuously improve Mapverter. See what's new, what's been fixed, 
                and what's coming next in our data transformation platform.
              </p>
            </div>
          </div>
        </section>

        {/* Changelog Content */}
        <section className="py-16 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              
              {/* Newsletter Subscription */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-12 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h9M4 7h16M4 13h16" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      Stay Updated
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                      Get notified about new features, improvements, and important updates delivered to your inbox.
                    </p>
                    
                    {/* Success Message */}
                    {subscriptionStatus === 'success' && (
                      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-800 dark:text-green-200 font-medium">
                            Successfully subscribed! Check your email for confirmation.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {subscriptionStatus === 'error' && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="text-red-800 dark:text-red-200 font-medium">
                            Please enter a valid email address.
                          </span>
                        </div>
                      </div>
                    )}

                    {import.meta.env.isActiveArchiveNotice && (
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Email address for updates"
                        disabled={isSubscribing}
                        required
                      />
                      <button 
                        type="submit"
                        disabled={isSubscribing || !email.trim()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 flex items-center justify-center min-w-[100px]"
                      >
                        {isSubscribing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Subscribing...
                          </>
                        ) : (
                          'Subscribe'
                        )}
                      </button>
                    </form>
                    )}
                  </div>
                </div>
              </div>

              {/* Version Timeline */}
              <div className="space-y-12">
                {versions.map((version, index) => (
                  <article key={version.version} className="relative">
                    {/* Timeline Line */}
                    {index < versions.length - 1 && (
                      <div className="absolute left-4 top-16 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-700" aria-hidden="true"></div>
                    )}
                    
                    {/* Version Header */}
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center z-10">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <div className="flex items-center space-x-3">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                              {version.version}
                            </h2>
                            {version.status && (
                              <span className={getStatusBadge(version.status)} aria-label={`Version status: ${version.status}`}>
                                {version.status}
                              </span>
                            )}
                          </div>
                          <time className="text-sm font-medium text-neutral-600 dark:text-neutral-400" dateTime={version.date}>
                            {version.date}
                          </time>
                        </div>
                      </div>
                    </div>

                    {/* Changes Content */}
                    <div className="ml-12">
                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                        <div className="grid gap-6">
                          {Object.entries(version.changes).map(([category, items]) => (
                            <div key={category}>
                              <div className="flex items-center space-x-2 mb-3">
                                {getCategoryIcon(category)}
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                  {category}
                                </h3>
                              </div>
                              
                              <ul className="space-y-2" role="list">
                                {items.map((item, itemIndex) => (
                                  <li key={itemIndex} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full mt-2"></div>
                                    <span className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                      {item}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Archive Notice */}
              {import.meta.env.isActiveArchiveNotice && (
                <div className="mt-16 p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Looking for Older Versions?
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Complete release history and detailed migration guides are available in our documentation.
                  </p>
                  <button className="inline-flex items-center px-4 py-2 bg-neutral-600 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Full Documentation
                  </button>
                </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="py-16 bg-gradient-to-r from-blue-811 to-green-700 dark:from-blue-900 dark:to-green-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Have Feedback or Suggestions?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Help us improve Mapverter by sharing your ideas, reporting bugs, or requesting new features.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-600"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </a>
              <a
                href="https://github.com/abdullahduet/mapverter/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-600"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub Issues
              </a>
            </div>

            <p className="mt-6 text-sm text-blue-100">
              Follow us on social media for real-time updates and announcements
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Changelog;