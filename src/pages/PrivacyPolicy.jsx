import React, { useState } from 'react';
import SEOHead from '../components/common/SEOHead';

const PrivacyPolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const dataTypes = [
    {
      id: 'account',
      title: 'Account Information',
      icon: '👤',
      description: 'Data you provide when creating an account',
      items: [
        'Email address',
        'Name (if provided)',
        'Password (encrypted)',
        'Profile preferences'
      ],
      purpose: 'Account management, authentication, and personalized experience',
      retention: 'Until account deletion'
    },
    {
      id: 'files',
      title: 'Uploaded Files',
      icon: '📁',
      description: 'Files you upload for conversion or processing',
      items: [
        'File content and structure',
        'File metadata (name, size, type)',
        'Processing results',
        'Conversion history'
      ],
      purpose: 'Provide data conversion services and improve our tools',
      retention: '30 days, then automatically deleted'
    },
    {
      id: 'usage',
      title: 'Usage Data',
      icon: '📊',
      description: 'How you interact with our platform',
      items: [
        'Pages visited and features used',
        'Time spent on different sections',
        'Error logs and performance data',
        'Device and browser information'
      ],
      purpose: 'Improve user experience and fix technical issues',
      retention: '2 years for analytics, 1 year for logs'
    },
    {
      id: 'communication',
      title: 'Communication Data',
      icon: '📧',
      description: 'When you contact us for support',
      items: [
        'Support messages and responses',
        'Feedback and suggestions',
        'Newsletter subscriptions',
        'Communication preferences'
      ],
      purpose: 'Provide customer support and send updates',
      retention: '3 years for support, until unsubscribe for newsletters'
    }
  ];

  const userRights = [
    {
      right: 'Access Your Data',
      description: 'Get a copy of all personal data we have about you',
      how: 'Request through our contact form or email privacy@mapverter.com'
    },
    {
      right: 'Correct Your Data',
      description: 'Update or fix any incorrect personal information',
      how: 'Update in your account settings or contact support'
    },
    {
      right: 'Delete Your Data',
      description: 'Request complete removal of your personal data',
      how: 'Delete your account or email us with a deletion request'
    },
    {
      right: 'Data Portability',
      description: 'Download your data in a common format',
      how: 'Available in account settings under "Export Data"'
    },
    {
      right: 'Opt-Out',
      description: 'Stop processing of your data for marketing',
      how: 'Unsubscribe links in emails or account preferences'
    },
    {
      right: 'Object to Processing',
      description: 'Request we stop using your data for specific purposes',
      how: 'Contact us with your specific objection'
    }
  ];

  return (
    <>
      <SEOHead
        title="Privacy Policy - How Mapverter Protects Your Data"
        description="Learn how Mapverter collects, uses, and protects your personal data. Understand your privacy rights under GDPR and CCPA."
        keywords="privacy policy, data protection, GDPR, CCPA, personal data, user rights, data security"
      />

      <main className="pt-24">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-blue-50 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl mx-auto">
                Your privacy matters to us. Here's how we collect, use, and protect your data 
                when you use Mapverter.
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
                Last updated: January 15, 2025
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">

              {/* Quick Summary */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  📋 Quick Summary
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">What we collect:</h3>
                    <ul className="text-neutral-700 dark:text-neutral-300 space-y-1">
                      <li>• Files you upload (deleted after 30 days)</li>
                      <li>• Email address (if you sign up)</li>
                      <li>• Usage data to improve our service</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">What we don't do:</h3>
                    <ul className="text-neutral-700 dark:text-neutral-300 space-y-1">
                      <li>• Sell your personal data</li>
                      <li>• Share files with third parties</li>
                      <li>• Store files permanently</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data We Collect */}
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
                  What Data We Collect
                </h2>
                
                <div className="space-y-6">
                  {dataTypes.map((dataType) => (
                    <div key={dataType.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(dataType.id)}
                        className="w-full p-6 text-left bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        aria-expanded={expandedSection === dataType.id}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl" role="img" aria-label={dataType.title}>
                              {dataType.icon}
                            </span>
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                {dataType.title}
                              </h3>
                              <p className="text-neutral-600 dark:text-neutral-400">
                                {dataType.description}
                              </p>
                            </div>
                          </div>
                          <svg 
                            className={`w-5 h-5 text-neutral-500 transition-transform ${
                              expandedSection === dataType.id ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      
                      {expandedSection === dataType.id && (
                        <div className="p-6 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
                          <div className="grid md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                                Specific data:
                              </h4>
                              <ul className="space-y-2">
                                {dataType.items.map((item, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                                Why we collect it:
                              </h4>
                              <p className="text-neutral-700 dark:text-neutral-300">{dataType.purpose}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                                How long we keep it:
                              </h4>
                              <p className="text-neutral-700 dark:text-neutral-300">{dataType.retention}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* How We Use Your Data */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  🎯 How We Use Your Data
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Primary purposes:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Process and convert your files</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Provide customer support</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Maintain and improve our services</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Send important updates about our service</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">We never use your data to:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Sell to other companies</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Train AI models on your content</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Share with competitors</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Send spam or unwanted marketing</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Third-Party Sharing */}
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  Third-Party Services
                </h2>
                
                <div className="space-y-4">
                  <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">GA</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Google Analytics</h3>
                        <p className="text-neutral-700 dark:text-neutral-300 mb-2">
                          We use Google Analytics to understand how people use our website. This helps us improve the user experience.
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                          <strong>Data shared:</strong> Anonymous usage statistics, page views, general location (country/region)
                        </p>
                        <a 
                          href="https://policies.google.com/privacy" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          Google's Privacy Policy →
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">☁️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Cloud Storage (AWS)</h3>
                        <p className="text-neutral-700 dark:text-neutral-300 mb-2">
                          Your uploaded files are temporarily stored on Amazon Web Services for processing.
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                          <strong>Data shared:</strong> Uploaded files (encrypted and automatically deleted after 30 days)
                        </p>
                        <a 
                          href="https://aws.amazon.com/privacy/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          AWS Privacy Policy →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                    <strong>Important:</strong> We never share your uploaded files or their content with third parties for any purpose other than the technical processing required to provide our service.
                  </p>
                </div>
              </div>

              {/* Data Security */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-8 border border-purple-200 dark:border-purple-800">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  🔒 How We Protect Your Data
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Technical measures:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">SSL encryption for all data in transit</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">AES-256 encryption for stored files</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Regular security audits and updates</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Secure cloud infrastructure (AWS)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Organizational measures:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Limited employee access to personal data</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Background checks for staff with data access</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Regular privacy training for employees</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Incident response procedures</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Your Rights */}
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  Your Privacy Rights
                </h2>
                
                <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                  Under GDPR (if you're in the EU) and CCPA (if you're in California), you have specific rights regarding your personal data:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {userRights.map((right, index) => (
                    <div key={index} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        {right.right}
                      </h3>
                      <p className="text-neutral-700 dark:text-neutral-300 mb-3">
                        {right.description}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        <strong>How:</strong> {right.how}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                    <strong>Response time:</strong> We'll respond to your privacy requests within 30 days (GDPR) or 45 days (CCPA). 
                    Some requests may require identity verification for security.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  Privacy Questions & Concerns
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Contact our privacy team:</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href="mailto:privacy@mapverter.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                          privacy@mapverter.com
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                          Contact form
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Mailing address:</h3>
                    <address className="text-neutral-700 dark:text-neutral-300 not-italic">
                      Mapverter Privacy Team<br />
                      123 Data Street<br />
                      Tech City, TC 12345<br />
                      United States
                    </address>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Privacy Team
                  </a>
                  
                  <a
                    href="/cookie-policy"
                    className="inline-flex items-center px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 font-medium rounded-lg transition-colors focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
                  >
                    View Cookie Policy
                  </a>
                </div>
              </div>

              {/* Updates to Policy */}
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  Updates to This Policy
                </h2>
                <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                  We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. 
                  When we make significant changes, we'll notify you by:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-neutral-700 dark:text-neutral-300">Email notification (if you have an account)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-neutral-700 dark:text-neutral-300">Notice on our website</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-neutral-700 dark:text-neutral-300">Updated "last modified" date at the top</span>
                  </li>
                </ul>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Your continued use of Mapverter after policy updates means you accept the changes.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default PrivacyPolicy;