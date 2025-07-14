import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import Button from '../components/common/Button';

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set([0])); // First item open by default
  const faqRefs = useRef([]);

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const scrollToQuestion = (index) => {
    // Open the item if it's closed
    if (!openItems.has(index)) {
      toggleItem(index);
    }
    
    // Scroll to the question with a small delay to allow accordion to open
    setTimeout(() => {
      faqRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const faqData = [
    {
      question: "What is Mapverter?",
      answer: "Mapverter is a powerful data transformation platform that helps you convert, map, validate, and visualize data between different formats like CSV, JSON, and EDI. Whether you're a developer building applications, a business analyst preparing reports, or a healthcare professional processing claims, Mapverter makes complex data transformations simple and accessible through an intuitive web interface."
    },
    {
      question: "What is CSV and how does Mapverter support it?",
      answer: "CSV (Comma-Separated Values) is a simple file format used to store tabular data, like spreadsheets. Each line represents a row, and commas separate the columns. Mapverter provides comprehensive CSV support including: generating custom CSV files with realistic test data, converting CSV to other formats (JSON, XML, Excel), validating CSV data integrity, and visual editing with Excel-like interface. You can also map CSV fields to different structures and apply transformations."
    },
    {
      question: "How do I convert CSV to JSON with Mapverter?",
      answer: "Converting CSV to JSON is simple: 1) Upload your CSV file or paste the data, 2) Preview your data to ensure it's parsed correctly, 3) Choose JSON as your target format, 4) Optionally customize the JSON structure (nested objects, arrays, etc.), 5) Download your converted JSON file. The conversion automatically handles data types, special characters, and maintains data integrity throughout the process."
    },
    {
      question: "What is JSON and how does Mapverter support it?",
      answer: "JSON (JavaScript Object Notation) is a lightweight, text-based data format widely used for APIs and modern web applications. It supports nested structures, arrays, and various data types. Mapverter offers JSON formatting and beautification, validation against schemas, conversion to CSV, XML, and other formats, generation of sample JSON data, and flattening of nested JSON structures for analysis."
    },
    {
      question: "Can non-developers use Mapverter effectively?",
      answer: "Absolutely! Mapverter is designed for both technical and non-technical users. Business analysts, data entry specialists, and other professionals can use our visual interface without any coding knowledge. Features include drag-and-drop file uploads, point-and-click field mapping, pre-built templates for common scenarios, Excel-like data editing, and step-by-step wizards that guide you through complex transformations."
    },
    {
      question: "What is EDI and how does Mapverter support it?",
      answer: "EDI (Electronic Data Interchange) is a standardized format for exchanging business documents electronically, commonly used in healthcare, logistics, and retail. Mapverter supports EDI X12 and EDIFACT standards, including healthcare transactions like 837 (claims) and 835 (payments). We provide EDI parsing and validation, conversion to modern formats like JSON and CSV, template generation for common EDI documents, and compliance checking for industry standards."
    },
    {
      question: "Do you store or keep our uploaded files?",
      answer: "No, Mapverter prioritizes your data privacy and security. All file processing happens locally in your browser - your data never leaves your device. We don't store, save, or transmit your files to our servers. Once you close your browser tab, all data is permanently deleted. This ensures complete privacy and compliance with data protection regulations like GDPR and HIPAA."
    },
    // {
    //   question: "Is there an API for developers?",
    //   answer: "Yes! Mapverter offers a RESTful API for developers who want to integrate data transformation capabilities into their applications. The API supports batch processing, custom transformations, template management, and all major conversion formats. API access includes comprehensive documentation, code examples in multiple languages, rate limiting for different usage tiers, and webhook support for async processing of large files."
    // },
    {
      question: "Do you support custom templates and can I create my own?",
      answer: "Yes, custom templates are a core feature. You can create, save, and share templates for recurring data transformations. This includes field mapping configurations, transformation rules, validation criteria, and output formatting preferences. Templates can be private to your account or shared with your team. We also offer a template marketplace where the community shares proven configurations."
    },
    {
      question: "What file formats does Mapverter support?",
      answer: "Mapverter supports a wide range of formats: CSV, TSV, and other delimited files; JSON and JSON Lines; XML documents; Excel files (.xlsx, .xls); EDI X12 and EDIFACT; Fixed-width text files; YAML documents; and SQL INSERT statements. We're continuously adding support for new formats based on user requests."
    },
    {
      question: "Is Mapverter free to use? What are the pricing options?",
      answer: "Mapverter offers a generous free tier that includes basic conversions, template usage, and files up to 10MB. For larger files, advanced features, API access, and team collaboration, we offer affordable premium plans starting at $9/month. Enterprise plans include custom integrations, dedicated support, and on-premise deployment options. No credit card required for the free tier."
    },
    {
      question: "How do I get help if I'm stuck or need support?",
      answer: "We provide multiple support channels: comprehensive documentation with step-by-step guides, video tutorials for common tasks, live chat support during business hours, email support (support@mapverter.com) with 24-hour response time, community forum for user discussions, and for enterprise customers, dedicated phone support and training sessions."
    }
  ];

  return (
    <>
      <SEOHead
        title="Frequently Asked Questions - Mapverter Help & Support"
        description="Find answers to common questions about Mapverter's data transformation tools, CSV/JSON/EDI support, pricing, and features. Get help with file conversion and mapping."
        keywords="mapverter faq, data conversion help, csv to json, edi support, file transformation questions, mapverter support"
      />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl mx-auto">
                Find answers to common questions about Mapverter's features, supported formats, 
                and how to make the most of our data transformation tools.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              
              {/* Quick Navigation */}
              <div className="mb-12 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Quick Navigation
                </h2>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  {faqData.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToQuestion(index)}
                      className="text-left text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      {item.question}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="space-y-4">
                {faqData.map((item, index) => (
                  <div
                    key={index}
                    ref={(el) => (faqRefs.current[index] = el)}
                    className="bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
                      aria-expanded={openItems.has(index)}
                      aria-controls={`faq-content-${index}`}
                    >
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 pr-4">
                        {item.question}
                      </h3>
                      <svg
                        className={`w-5 h-5 text-neutral-500 dark:text-neutral-400 transition-transform duration-200 ${
                          openItems.has(index) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {openItems.has(index) && (
                      <div
                        id={`faq-content-${index}`}
                        className="px-6 pb-4 text-neutral-600 dark:text-neutral-400 leading-relaxed"
                        role="region"
                        aria-labelledby={`faq-question-${index}`}
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Still Need Help Section */}
              <div className="mt-16 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-8 text-center">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  Still Need Help?
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
                  Can't find the answer you're looking for? Our support team is here to help with 
                  any questions about data transformation, technical issues, or feature requests.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/contact">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto bg-blue-811 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Contact Support
                    </Button>
                  </Link>
                  <a
                    href="mailto:support@mapverter.com"
                    className="inline-block"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Email Us Directly
                    </Button>
                  </a>
                </div>
                
                <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                  Average response time: 24 hours
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Resources Section */}
        <section className="py-16 bg-neutral-50 dark:bg-neutral-800">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-12">
                Popular Resources
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-medium border border-neutral-200 dark:border-neutral-700">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Getting Started Guide
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                    Step-by-step tutorial for your first data transformation
                  </p>
                  <Link to="/guide">
                    <Button variant="outline" size="sm">
                      Read Guide
                    </Button>
                  </Link>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-medium border border-neutral-200 dark:border-neutral-700">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Ready-Made Templates
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                    Browse our collection of pre-built conversion templates
                  </p>
                  <Link to="/templates">
                    <Button variant="outline" size="sm">
                      Browse Templates
                    </Button>
                  </Link>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-medium border border-neutral-200 dark:border-neutral-700">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Community Forum
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                    Connect with other users and share transformation tips
                  </p>
                  <Button variant="outline" size="sm">
                    Join Community
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default FAQ;