import React, { useState } from 'react';
import SEOHead from '../components/common/SEOHead';

const TermsOfService = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: '✅',
      content: (
        <div className="space-y-4">
          <p>By accessing or using Mapverter ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.</p>
          <p>These Terms apply to all visitors, users, and others who access or use the Service. By using our Service, you represent that you are at least 18 years old or have reached the age of majority in your jurisdiction.</p>
          <p>We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page and updating the "effective date" at the top. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.</p>
        </div>
      )
    },
    {
      id: 'services',
      title: 'Description of Services',
      icon: '🔄',
      content: (
        <div className="space-y-4">
          <p>Mapverter provides web-based data transformation tools that allow users to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Convert files between different formats (CSV, JSON, EDI, XML, etc.)</li>
            <li>Map and transform data structures</li>
            <li>Validate data integrity and format compliance</li>
            <li>Generate sample data for testing purposes</li>
            <li>Visualize data through charts and graphs</li>
          </ul>
          <p>Our Service is provided through a web interface accessible via standard web browsers. Some features may require user registration and account creation.</p>
          <p>We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice, though we will make reasonable efforts to provide advance notice of significant changes.</p>
        </div>
      )
    },
    {
      id: 'responsibilities',
      title: 'User Responsibilities',
      icon: '📋',
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Account Security</h4>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>
          
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Acceptable Use</h4>
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Upload malicious files, viruses, or harmful code</li>
            <li>Process illegal, copyrighted, or confidential data without authorization</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Use the Service for commercial purposes beyond reasonable fair use</li>
          </ul>
          
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Data Responsibility</h4>
          <p>You retain full responsibility for the content of files you upload and process. You represent that you have the right to upload and process all data you submit to our Service.</p>
        </div>
      )
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: '©️',
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Our Rights</h4>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Mapverter and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used without our prior written consent.</p>
          
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Your Content</h4>
          <p>You retain ownership of any intellectual property rights in content you upload to the Service. By uploading content, you grant us a limited, non-exclusive, royalty-free license to process, store, and display your content solely for the purpose of providing the Service.</p>
          
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Feedback</h4>
          <p>Any feedback, comments, or suggestions you provide regarding the Service may be used by us without restriction or compensation to you.</p>
        </div>
      )
    },
    {
      id: 'limitation',
      title: 'Limitation of Liability',
      icon: '⚖️',
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">IMPORTANT LEGAL NOTICE</p>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">Please read this section carefully as it limits our liability to you.</p>
          </div>
          
          <p>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL MAPVERTER, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.</p>
          
          <p>Our total liability to you for any claim arising out of or relating to these Terms or the Service shall not exceed the amount you paid us in the twelve (12) months preceding the claim, or $100, whichever is greater.</p>
          
          <p>Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so the above limitation may not apply to you.</p>
        </div>
      )
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: '🚪',
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Termination by You</h4>
          <p>You may stop using the Service at any time. If you have an account, you may delete it through your account settings or by contacting us.</p>
          
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Termination by Us</h4>
          <p>We may terminate or suspend your account and access to the Service immediately, without prior notice, if you:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Breach these Terms</li>
            <li>Use the Service in a manner that could damage or impair the Service</li>
            <li>Engage in fraudulent or illegal activities</li>
            <li>Fail to pay fees (if applicable)</li>
          </ul>
          
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Effect of Termination</h4>
          <p>Upon termination, your right to use the Service will cease immediately. All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.</p>
        </div>
      )
    },
    {
      id: 'disclaimer',
      title: 'Service Disclaimer',
      icon: '⚠️',
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="font-semibold text-red-800 dark:text-red-200 mb-2">SERVICE PROVIDED "AS IS"</p>
            <p className="text-red-700 dark:text-red-300 text-sm">The following disclaimers apply to your use of our Service.</p>
          </div>
          
          <p>THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. MAPVERTER MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE SERVICE OR THE INFORMATION, CONTENT, OR MATERIALS INCLUDED THEREIN.</p>
          
          <p>WE EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE</li>
            <li>WARRANTIES THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE</li>
            <li>WARRANTIES REGARDING THE ACCURACY, RELIABILITY, OR COMPLETENESS OF CONTENT</li>
            <li>WARRANTIES THAT THE SERVICE WILL MEET YOUR REQUIREMENTS</li>
          </ul>
          
          <p>You acknowledge that computer and telecommunications systems are not fault-free and occasional periods of downtime occur. We do not guarantee that the Service will be available at all times.</p>
        </div>
      )
    },
    {
      id: 'governing-law',
      title: 'Governing Law & Disputes',
      icon: '🏛️',
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Governing Law</h4>
          <p>These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.</p>
          
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Jurisdiction</h4>
          <p>Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in Delaware, and you hereby consent to personal jurisdiction and venue therein.</p>
          
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Dispute Resolution</h4>
          <p>Before filing any lawsuit, you agree to first contact us to attempt to resolve any dispute informally. If we cannot resolve the dispute within 60 days, either party may then pursue formal legal remedies.</p>
          
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Class Action Waiver</h4>
          <p>You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.</p>
        </div>
      )
    }
  ];

  return (
    <>
      <SEOHead
        title="Terms of Service - Mapverter Legal Terms & Conditions"
        description="Read Mapverter's Terms of Service including user responsibilities, service description, intellectual property rights, and legal disclaimers."
        keywords="terms of service, legal terms, user agreement, terms and conditions, service agreement"
      />

      <main className="pt-24">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-blue-50 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Terms of Service
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl mx-auto">
                These terms govern your use of Mapverter. Please read them carefully before using our services.
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
                Effective Date: January 15, 2025
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">

              {/* Important Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  📄 Important Notice
                </h2>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  By using Mapverter, you agree to these Terms of Service. These are legally binding terms that govern your relationship with us. 
                  If you don't agree with these terms, please don't use our service.
                </p>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4">
                  We've written these terms in plain language to make them as clear as possible, while still maintaining their legal effectiveness.
                </p>
              </div>

              {/* Terms Sections */}
              <div className="space-y-6">
                {sections.map((section) => (
                  <div key={section.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full p-6 text-left bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                      aria-expanded={expandedSection === section.id}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl" role="img" aria-label={section.title}>
                            {section.icon}
                          </span>
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            {section.title}
                          </h3>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-neutral-500 transition-transform ${
                            expandedSection === section.id ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    {expandedSection === section.id && (
                      <div className="p-6 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
                        <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300">
                          {section.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Additional Terms */}
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  Additional Legal Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Severability</h3>
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                      If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Entire Agreement</h3>
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                      These Terms constitute the complete agreement between you and Mapverter regarding the Service.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Waiver</h3>
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                      Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Assignment</h3>
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                      You may not assign these Terms without our written consent. We may assign these Terms without restriction.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  Questions About These Terms?
                </h2>
                <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                  If you have questions about these Terms of Service, please contact us. We're here to help clarify any concerns.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Legal Team
                  </a>
                  
                  <a
                    href="mailto:legal@mapverter.com"
                    className="inline-flex items-center px-6 py-3 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 font-medium rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
                  >
                    legal@mapverter.com
                  </a>
                </div>
              </div>

              {/* Archive Notice */}
              {import.meta.env.isActiveArchiveNotice && (
                <div className="text-center p-6 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Previous Versions
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  You can view previous versions of our Terms of Service in our legal archive.
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-neutral-600 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  View Archive
                </button>
              </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default TermsOfService;