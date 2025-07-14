import React, { useState, useEffect } from 'react';
import SEOHead from '../components/common/SEOHead';

const CookiePolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always true, can't be disabled
    functional: true,
    analytics: true
  });

  // Load cookie preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('mapverter-cookie-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setCookiePreferences(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing saved cookie preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage
  const saveCookiePreferences = () => {
    localStorage.setItem('mapverter-cookie-preferences', JSON.stringify(cookiePreferences));
    setShowCookieSettings(false);
    
    // Show success message or reload page to apply changes
    alert('Cookie preferences saved successfully!');
  };

  // Handle preference changes
  const handlePreferenceChange = (type, value) => {
    if (type === 'necessary') return; // Can't change necessary cookies
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Open cookie settings modal
  const openCookieSettings = () => {
    setShowCookieSettings(true);
  };

  // Close cookie settings modal
  const closeCookieSettings = () => {
    setShowCookieSettings(false);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const cookieTypes = [
    {
      id: 'necessary',
      name: 'Necessary Cookies',
      icon: '🔒',
      description: 'Essential for the website to function properly',
      examples: [
        'Authentication tokens to keep you logged in',
        'Security cookies to prevent attacks',
        'Form data to remember your inputs',
        'Language and region preferences'
      ],
      canDisable: false,
      retention: 'Session or up to 1 year'
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      icon: '⚙️',
      description: 'Enhance your experience by remembering your preferences',
      examples: [
        'Dark/light theme preference',
        'Dashboard layout settings',
        'File format preferences',
        'Recently used templates'
      ],
      canDisable: true,
      retention: 'Up to 2 years'
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      icon: '📊',
      description: 'Help us understand how you use our platform to improve it',
      examples: [
        'Google Analytics tracking',
        'Page view statistics',
        'Feature usage data',
        'Performance metrics'
      ],
      canDisable: true,
      retention: 'Up to 26 months'
    }
  ];

  const browserInstructions = [
    {
      browser: 'Google Chrome',
      steps: [
        'Click the three dots menu → Settings',
        'Go to Privacy and security → Cookies and other site data',
        'Choose your preferred setting'
      ]
    },
    {
      browser: 'Mozilla Firefox',
      steps: [
        'Click the menu button → Settings',
        'Select Privacy & Security',
        'Under Cookies and Site Data, click Manage Data'
      ]
    },
    {
      browser: 'Safari',
      steps: [
        'Go to Safari → Preferences',
        'Click Privacy tab',
        'Choose your cookie preferences'
      ]
    },
    {
      browser: 'Microsoft Edge',
      steps: [
        'Click the three dots menu → Settings',
        'Go to Cookies and site permissions',
        'Select Cookies and site data'
      ]
    }
  ];

  return (
    <>
      <SEOHead
        title="Cookie Policy - How Mapverter Uses Cookies"
        description="Learn about how Mapverter uses cookies to improve your experience, remember your preferences, and provide analytics. Control your cookie settings."
        keywords="cookie policy, privacy, data protection, cookies, GDPR, CCPA, user privacy"
      />

      <main className="pt-24">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-blue-50 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Cookie Policy
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl mx-auto">
                We use cookies to make Mapverter work better for you. Here's what they do, 
                why we use them, and how you can control them.
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

              {/* What Are Cookies */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  🍪 What Are Cookies?
                </h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Cookies are small text files stored on your device when you visit websites. Think of them as 
                    digital notes that help websites remember things about you - like your preferences or login status.
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    They're completely safe and can't access your personal files or install software. 
                    Most cookies are helpful - they're what keep you logged in and remember your settings.
                  </p>
                </div>
              </div>

              {/* Types of Cookies */}
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
                  How We Use Cookies
                </h2>
                
                <div className="space-y-6">
                  {cookieTypes.map((cookie) => (
                    <div key={cookie.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(cookie.id)}
                        className="w-full p-6 text-left bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        aria-expanded={expandedSection === cookie.id}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl" role="img" aria-label={cookie.name}>
                              {cookie.icon}
                            </span>
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                {cookie.name}
                              </h3>
                              <p className="text-neutral-600 dark:text-neutral-400">
                                {cookie.description}
                              </p>
                            </div>
                          </div>
                          <svg 
                            className={`w-5 h-5 text-neutral-500 transition-transform ${
                              expandedSection === cookie.id ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      
                      {expandedSection === cookie.id && (
                        <div className="p-6 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                                What we use these for:
                              </h4>
                              <ul className="space-y-2">
                                {cookie.examples.map((example, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-neutral-700 dark:text-neutral-300">{example}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <span className="font-medium text-neutral-900 dark:text-neutral-100">Can you disable these?</span>
                                <p className={`${cookie.canDisable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {cookie.canDisable ? 'Yes, optional' : 'No, required for basic functionality'}
                                </p>
                              </div>
                              
                              <div>
                                <span className="font-medium text-neutral-900 dark:text-neutral-100">How long do they last?</span>
                                <p className="text-neutral-700 dark:text-neutral-300">{cookie.retention}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Control Cookies */}
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
                  Managing Your Cookie Preferences
                </h2>
                
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    🎛️ Cookie Settings on Mapverter
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                    You can control optional cookies directly on our website:
                  </p>
                  <button 
                    onClick={openCookieSettings}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Open Cookie Settings
                  </button>
                </div>

                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                  🌐 Browser Cookie Controls
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {browserInstructions.map((browser, index) => (
                    <div key={index} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                        {browser.browser}
                      </h4>
                      <ol className="space-y-2">
                        {browser.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start space-x-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full flex items-center justify-center font-medium">
                              {stepIndex + 1}
                            </span>
                            <span className="text-neutral-700 dark:text-neutral-300">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Rights */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  🛡️ Your Privacy Rights
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Under GDPR (EU residents):</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Right to access your data</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Right to delete your data</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Right to opt-out of processing</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Right to data portability</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Under CCPA (California residents):</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Right to know what data we collect</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Right to delete personal information</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Right to opt-out of sale</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">Right to non-discrimination</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Third-Party Services */}
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
                          We use Google Analytics to understand how visitors use our website. 
                          This helps us improve the user experience.
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
                </div>
              </div>

              {/* Contact */}
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  Questions About Cookies?
                </h2>
                <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                  If you have questions about our use of cookies or want to exercise your privacy rights, 
                  we're here to help.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Us
                  </a>
                  
                  <a
                    href="mailto:privacy@mapverter.com"
                    className="inline-flex items-center px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 font-medium rounded-lg transition-colors focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
                  >
                    privacy@mapverter.com
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Cookie Settings Modal */}
        {showCookieSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      Cookie Preferences
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Choose which cookies you'd like to allow. Changes will take effect immediately.
                    </p>
                  </div>
                  <button
                    onClick={closeCookieSettings}
                    className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
                    aria-label="Close cookie settings"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Cookie Settings */}
                <div className="space-y-6">
                  {cookieTypes.map((cookie) => (
                    <div key={cookie.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <span className="text-xl mt-1" role="img" aria-label={cookie.name}>
                            {cookie.icon}
                          </span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                              {cookie.name}
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                              {cookie.description}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-500">
                              Retention: {cookie.retention}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={cookiePreferences[cookie.id]}
                              onChange={(e) => handlePreferenceChange(cookie.id, e.target.checked)}
                              disabled={!cookie.canDisable}
                              className="sr-only peer"
                            />
                            <div className={`relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 ${
                              cookiePreferences[cookie.id] ? 'peer-checked:bg-blue-600' : ''
                            } ${!cookie.canDisable ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      {!cookie.canDisable && (
                        <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                          Required for basic website functionality
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Modal Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={saveCookiePreferences}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={closeCookieSettings}
                    className="px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium rounded-lg transition-colors focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default CookiePolicy;