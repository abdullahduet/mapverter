import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import Button from '../components/common/Button';

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const templateCategories = [
    { id: 'all', name: 'All Templates', icon: '📁' },
    { id: 'csv', name: 'CSV Templates', icon: '📊' },
    { id: 'json', name: 'JSON Templates', icon: '🔗' },
    { id: 'edi', name: 'EDI Templates', icon: '🏥' }
  ];

  const templates = [
    // CSV Templates
    {
      id: 'csv-employee-data',
      category: 'csv',
      name: 'Employee Data Generator',
      description: 'Generate realistic employee records with names, emails, departments, and salary information',
      difficulty: 'Beginner',
      estimatedTime: '2 min',
      fields: ['Name', 'Email', 'Department', 'Salary', 'Start Date'],
      useCase: 'HR systems, payroll testing',
      preview: 'John Smith,john@company.com,Engineering,75000,2023-01-15'
    },
    {
      id: 'csv-sales-data',
      category: 'csv',
      name: 'Sales Transaction Records',
      description: 'Create sales data with products, quantities, prices, and customer information',
      difficulty: 'Beginner',
      estimatedTime: '3 min',
      fields: ['Order ID', 'Customer', 'Product', 'Quantity', 'Price', 'Date'],
      useCase: 'E-commerce analytics, reporting',
      preview: 'ORD-001,Jane Doe,Laptop,1,1299.99,2024-01-20'
    },
    {
      id: 'csv-to-json-contacts',
      category: 'csv',
      name: 'Contact List Converter',
      description: 'Transform CSV contact lists into structured JSON format for APIs',
      difficulty: 'Intermediate',
      estimatedTime: '5 min',
      fields: ['Name', 'Phone', 'Email', 'Company'],
      useCase: 'CRM migration, API integration',
      preview: 'CSV → {"name": "John Smith", "phone": "+1234567890"...}'
    },

    // JSON Templates
    {
      id: 'json-api-response',
      category: 'json',
      name: 'REST API Response',
      description: 'Generate JSON responses for testing REST APIs with realistic data structures',
      difficulty: 'Intermediate',
      estimatedTime: '4 min',
      fields: ['ID', 'Status', 'Data', 'Timestamp', 'Meta'],
      useCase: 'API testing, mock data',
      preview: '{"status": "success", "data": {...}, "timestamp": "2024-01-20T10:30:00Z"}'
    },
    {
      id: 'json-product-catalog',
      category: 'json',
      name: 'Product Catalog',
      description: 'Create structured product data with categories, pricing, and inventory',
      difficulty: 'Beginner',
      estimatedTime: '3 min',
      fields: ['SKU', 'Name', 'Category', 'Price', 'Stock'],
      useCase: 'E-commerce platforms, inventory systems',
      preview: '{"sku": "PROD-001", "name": "Wireless Headphones", "price": 99.99}'
    },
    {
      id: 'json-to-csv-analytics',
      category: 'json',
      name: 'Analytics Data Flattener',
      description: 'Convert nested JSON analytics data into flat CSV format for reporting',
      difficulty: 'Advanced',
      estimatedTime: '8 min',
      fields: ['Event', 'User ID', 'Properties', 'Timestamp'],
      useCase: 'Data analysis, business intelligence',
      preview: 'JSON → event_name,user_id,page_url,timestamp'
    },

    // EDI Templates
    {
      id: 'edi-837p-claim',
      category: 'edi',
      name: 'EDI 837P Professional Claim',
      description: 'Generate healthcare professional claims in EDI 837P format',
      difficulty: 'Advanced',
      estimatedTime: '15 min',
      fields: ['Provider NPI', 'Patient Info', 'Services', 'Diagnosis'],
      useCase: 'Healthcare billing, insurance claims',
      preview: 'ST*837*0001~BHT*0019*00*1*20240120*1030~'
    },
    {
      id: 'edi-835-payment',
      category: 'edi',
      name: 'EDI 835 Payment Advice',
      description: 'Process healthcare payment remittance advice documents',
      difficulty: 'Advanced',
      estimatedTime: '12 min',
      fields: ['Payer', 'Payment Amount', 'Claim Adjustments'],
      useCase: 'Healthcare payments, reconciliation',
      preview: 'ST*835*0001~BPR*I*150000*C*ACH~'
    },
    {
      id: 'edi-to-json-converter',
      category: 'edi',
      name: 'EDI to JSON Converter',
      description: 'Transform EDI X12 documents into modern JSON format',
      difficulty: 'Expert',
      estimatedTime: '20 min',
      fields: ['Transaction Set', 'Segments', 'Elements'],
      useCase: 'Legacy system modernization',
      preview: 'EDI X12 → {"transactionSet": "837", "segments": [...]}'
    }
  ];

  // Filter templates based on category and search
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.useCase.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
      case 'Intermediate': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
      case 'Advanced': return 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20';
      case 'Expert': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const handleUseTemplate = (template) => {
    // Navigate to appropriate generator/mapper with template pre-loaded
    const baseRoutes = {
      csv: '/csv/generate',
      json: '/json/generate', 
      edi: '/edi/generate'
    };
    
    const targetRoute = baseRoutes[template.category] || '/csv/generate';
    
    // In a real app, you'd pass template data via URL params or state
    window.location.href = `${targetRoute}?template=${template.id}`;
  };

  const handlePreviewTemplate = (template) => {
    setPreviewTemplate(template);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  return (
    <>
      <SEOHead
        title="Data Mapping Templates - Ready-to-Use Conversion Setups"
        description="Browse our collection of pre-built data mapping templates for CSV, JSON, and EDI conversions. Quick-start your data transformation projects with proven templates."
        keywords="data mapping templates, csv templates, json templates, edi templates, data conversion, file transformation, mapverter templates"
      />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Ready-to-Use Templates
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl mx-auto mb-8">
                Skip the setup and start transforming your data immediately. Our templates provide 
                pre-configured mappings for common data conversion scenarios, tested by thousands of users.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/csv/generate">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto bg-blue-811 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    Browse Templates
                  </Button>
                </Link>
                <Link to="/custom-template">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Create Your Own Template
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What Are Templates Section */}
        <section className="py-16 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  What Are Data Mapping Templates?
                </h2>
                <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
                  Templates are pre-configured data transformation setups that define how information should be 
                  converted between different formats. Instead of mapping fields manually, you can use our 
                  tested templates to instantly transform your data.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Save Time</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Start with proven configurations instead of building from scratch</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✅</span>
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Reduce Errors</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Use field mappings tested by thousands of users</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Best Practices</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Follow industry standards and naming conventions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Browser */}
        <section className="py-16 bg-neutral-50 dark:bg-neutral-800">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-8">
                Browse Templates by Category
              </h2>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-2 overflow-x-auto">
                  {templateCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-600'
                      }`}
                    >
                      <span>{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Templates Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <article
                    key={template.id}
                    className="bg-white dark:bg-neutral-900 rounded-lg shadow-medium hover:shadow-lg transition-shadow border border-neutral-200 dark:border-neutral-700 flex flex-col"
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                            {template.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(template.difficulty)}`}>
                              {template.difficulty}
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              ⏱️ {template.estimatedTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-2">
                        {template.description}
                      </p>

                      {/* Use Case */}
                      <div className="mb-4">
                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Use Case:</span>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">{template.useCase}</p>
                      </div>

                      {/* Fields Preview */}
                      <div className="mb-4">
                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Fields:</span>
                        <div className="flex flex-wrap gap-1">
                          {template.fields.slice(0, 3).map((field, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded"
                            >
                              {field}
                            </span>
                          ))}
                          {template.fields.length > 3 && (
                            <span className="px-2 py-1 text-xs text-neutral-500 dark:text-neutral-400">
                              +{template.fields.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="mb-6 flex-1">
                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Preview:</span>
                        <div className="bg-neutral-50 dark:bg-neutral-800 rounded p-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 overflow-hidden">
                          {template.preview}
                        </div>
                      </div>

                      {/* Actions - Fixed at bottom */}
                      <div className="flex gap-2 mt-auto">
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleUseTemplate(template)}
                        >
                          Use Template
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3"
                          title="Preview Template"
                          onClick={() => handlePreviewTemplate(template)}
                        >
                          👁️
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* No Results */}
              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    No templates found
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Try adjusting your search terms or category filter.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Create Custom Template CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-811 to-green-700 dark:from-blue-900 dark:to-green-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need a Custom Template?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Create your own template and share it with the community.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/template-builder">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Create Template
                </Button>
              </Link>
              <Link to="/request-template">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Request Template
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-blue-100">
              Join our community of data transformation experts
            </p>
          </div>
        </section>

        {/* Preview Modal */}
        {previewTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {previewTemplate.name}
                  </h3>
                  <button
                    onClick={closePreview}
                    className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Description</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">{previewTemplate.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Use Case</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">{previewTemplate.useCase}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Fields Included</h4>
                    <div className="flex flex-wrap gap-2">
                      {previewTemplate.fields.map((field, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Sample Output</h4>
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded p-4 font-mono text-sm text-neutral-700 dark:text-neutral-300 overflow-auto">
                      {previewTemplate.preview}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleUseTemplate(previewTemplate);
                        closePreview();
                      }}
                      className="flex-1"
                    >
                      Use This Template
                    </Button>
                    <Button
                      variant="outline"
                      onClick={closePreview}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Templates;