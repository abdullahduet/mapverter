import React, { useState } from 'react';
import SEOHead from '../components/common/SEOHead';
import Button from '../components/common/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactReasons = [
    { value: '', label: 'Select a reason...' },
    { value: 'support', label: 'Technical Support' },
    { value: 'business', label: 'Business Inquiry' },
    { value: 'feedback', label: 'Product Feedback' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, send to your backend
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', reason: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email Support',
      description: 'Get help with technical issues',
      contact: 'support@mapverter.com',
      href: 'mailto:support@mapverter.com'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 8v10l4-2 4 2V8" />
        </svg>
      ),
      title: 'Business Inquiries',
      description: 'Partnership and enterprise solutions',
      contact: 'business@mapverter.com',
      href: 'mailto:business@mapverter.com'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      title: 'Connect on LinkedIn',
      description: 'Follow us for updates and insights',
      contact: 'linkedin.com/company/mapverter',
      href: 'https://linkedin.com/company/mapverter'
    }
  ];

  return (
    <>
      <SEOHead
        title="Contact Us - Get Support & Connect"
        description="Get in touch with the Mapverter team for support, business inquiries, or feedback. We're here to help with your data transformation needs."
        keywords="contact mapverter, support, business inquiry, help, customer service"
      />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl mx-auto">
                Have questions about Mapverter? Need technical support? Want to explore enterprise solutions? 
                We'd love to hear from you and help with your data transformation needs.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-16 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                
                {/* Contact Form */}
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {/* Name Field */}
                    <div>
                      <label 
                        htmlFor="name" 
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                      >
                        Name <span className="text-red-500" aria-label="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        aria-required="true"
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Your full name"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label 
                        htmlFor="email" 
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                      >
                        Email <span className="text-red-500" aria-label="required">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        aria-required="true"
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Reason Select */}
                    <div>
                      <label 
                        htmlFor="reason" 
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                      >
                        Reason for Contact
                      </label>
                      <select
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        {contactReasons.map((reason) => (
                          <option key={reason.value} value={reason.value}>
                            {reason.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message Field */}
                    <div>
                      <label 
                        htmlFor="message" 
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                      >
                        Message <span className="text-red-500" aria-label="required">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        aria-required="true"
                        rows={6}
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    {/* Submit Status Messages */}
                    {submitStatus === 'success' && (
                      <div 
                        role="alert"
                        className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200"
                      >
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Thank you! Your message has been sent successfully. We'll get back to you soon.
                        </div>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div 
                        role="alert"
                        className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200"
                      >
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Sorry, there was an error sending your message. Please try again or contact us directly.
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      isLoading={isSubmitting}
                      loadingText="Sending Message..."
                      className="bg-blue-811 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700"
                      disabled={!formData.name || !formData.email || !formData.message}
                    >
                      Send Message
                    </Button>
                  </form>
                </div>

                {/* Contact Information */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                      Other Ways to Reach Us
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                      Choose the method that works best for you. We typically respond within 24 hours during business days.
                    </p>
                  </div>

                  {/* Contact Methods */}
                  <div className="space-y-6">
                    {contactMethods.map((method, index) => (
                      <a
                        key={index}
                        href={method.href}
                        className="flex items-start p-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group"
                        target={method.href.startsWith('http') ? '_blank' : '_self'}
                        rel={method.href.startsWith('http') ? 'noopener noreferrer' : ''}
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                          {method.icon}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                            {method.title}
                          </h3>
                          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                            {method.description}
                          </p>
                          <p className="text-blue-600 dark:text-blue-400 font-medium">
                            {method.contact}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* FAQ Link */}
                  <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      Looking for Quick Answers?
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      Check out our documentation and FAQ section for instant solutions to common questions.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        View FAQ
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        Documentation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Response Time Section */}
        <section className="py-12 bg-neutral-50 dark:bg-neutral-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                What to Expect
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">Quick Response</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">We respond to most inquiries within 24 hours</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">Personalized Help</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Tailored solutions for your specific needs</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🚀</div>
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">Expert Support</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Get help from our data transformation experts</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;