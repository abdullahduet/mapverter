import React, { useState, useEffect } from 'react';
import SEOHead from '../components/common/SEOHead';
import Button from '../components/common/Button';

const CSVGeneratorPage = () => {
  const [activeTab, setActiveTab] = useState('quick');
  const [customFields, setCustomFields] = useState([
    { id: 1, name: 'Name', type: 'fullName', config: {} }
  ]);
  const [rowCount, setRowCount] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [showTooltip, setShowTooltip] = useState(null);

  const quickTemplates = [
    {
      id: 'employees',
      name: 'Employee Data',
      description: 'Names, emails, departments, and salary info',
      icon: '👥',
      fields: ['Name', 'Email', 'Department', 'Salary', 'Start Date'],
      popular: true
    },
    {
      id: 'customers',
      name: 'Customer List',
      description: 'Customer contact information and details',
      icon: '📋',
      fields: ['Name', 'Email', 'Phone', 'Company', 'Location'],
      popular: true
    },
    {
      id: 'products',
      name: 'Product Catalog',
      description: 'Product names, prices, and inventory',
      icon: '📦',
      fields: ['Product', 'SKU', 'Price', 'Category', 'Stock'],
      popular: false
    },
    {
      id: 'sales',
      name: 'Sales Data',
      description: 'Transaction records and sales metrics',
      icon: '📊',
      fields: ['Order ID', 'Customer', 'Product', 'Amount', 'Date'],
      popular: true
    },
    {
      id: 'events',
      name: 'Event Log',
      description: 'Event tracking and user activities',
      icon: '📅',
      fields: ['Timestamp', 'User', 'Action', 'Details', 'IP Address'],
      popular: false
    },
    {
      id: 'inventory',
      name: 'Inventory',
      description: 'Stock levels and warehouse data',
      icon: '📋',
      fields: ['Item', 'Location', 'Quantity', 'Cost', 'Supplier'],
      popular: false
    }
  ];

  const fieldTypes = {
    'Personal Data': [
      { value: 'fullName', label: 'Full Name', example: 'John Smith' },
      { value: 'firstName', label: 'First Name', example: 'John' },
      { value: 'lastName', label: 'Last Name', example: 'Smith' },
      { value: 'email', label: 'Email Address', example: 'john@example.com' },
      { value: 'phone', label: 'Phone Number', example: '+1-555-0123' },
    ],
    'Business Data': [
      { value: 'company', label: 'Company Name', example: 'Acme Corp' },
      { value: 'jobTitle', label: 'Job Title', example: 'Software Engineer' },
      { value: 'price', label: 'Price', example: '$99.99' },
      { value: 'productName', label: 'Product Name', example: 'Widget Pro' },
    ],
    'Location Data': [
      { value: 'address', label: 'Street Address', example: '123 Main St' },
      { value: 'city', label: 'City', example: 'New York' },
      { value: 'state', label: 'State', example: 'NY' },
      { value: 'zipCode', label: 'ZIP Code', example: '10001' },
      { value: 'country', label: 'Country', example: 'United States' },
    ],
    'Basic Types': [
      { value: 'number', label: 'Random Number', example: '42' },
      { value: 'date', label: 'Date', example: '2025-01-15' },
      { value: 'boolean', label: 'True/False', example: 'true' },
      { value: 'uuid', label: 'UUID', example: 'a1b2c3d4...' },
    ]
  };

  const addField = () => {
    const newId = Math.max(...customFields.map(f => f.id)) + 1;
    setCustomFields([...customFields, {
      id: newId,
      name: `Field ${newId}`,
      type: 'fullName',
      config: {}
    }]);
  };

  const removeField = (id) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const updateField = (id, updates) => {
    setCustomFields(customFields.map(f => 
      f.id === id ? { ...f, ...updates } : f
    ));
  };

  const generateQuickCSV = async (template) => {
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create CSV content
      const headers = template.fields.join(',');
      const rows = Array(rowCount).fill().map((_, i) => 
        template.fields.map(field => `Sample ${field} ${i + 1}`).join(',')
      );
      const csvContent = [headers, ...rows].join('\n');
      
      // Download file
      downloadCSV(csvContent, `${template.name.toLowerCase().replace(' ', '-')}-${rowCount}-rows.csv`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCustomCSV = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const headers = customFields.map(f => f.name).join(',');
      const rows = Array(rowCount).fill().map((_, i) => 
        customFields.map(field => `Sample ${field.name} ${i + 1}`).join(',')
      );
      const csvContent = [headers, ...rows].join('\n');
      
      downloadCSV(csvContent, `custom-data-${rowCount}-rows.csv`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const generatePreview = () => {
    const headers = customFields.map(f => f.name);
    const sampleRows = Array(5).fill().map((_, i) => 
      customFields.map(field => `Sample ${field.name} ${i + 1}`)
    );
    setPreviewData([headers, ...sampleRows]);
  };

  useEffect(() => {
    if (activeTab === 'custom') {
      generatePreview();
    }
  }, [customFields, activeTab]);

  const Tooltip = ({ children, content, id }) => (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(id)}
        onMouseLeave={() => setShowTooltip(null)}
        className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        {children}
      </button>
      {showTooltip === id && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm rounded-lg whitespace-nowrap z-10">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100"></div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <SEOHead
        title="CSV Generator - Create Sample Data Files Instantly"
        description="Generate realistic CSV data files for testing and development. Choose from templates or create custom data structures with our easy-to-use CSV generator."
        keywords="csv generator, sample data, test data, csv creator, data generation, fake data, mock data"
      />

      <main className="pt-24">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-neutral-900 dark:to-neutral-800 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                CSV Generator
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl mx-auto mb-8">
                Create realistic sample data files instantly. Perfect for testing applications, 
                training datasets, or populating databases with meaningful data.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Realistic sample data
                </div>
                <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Instant download
                </div>
                <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No signup required
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Row Count Selector */}
        <section className="py-8 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <label className="text-neutral-700 dark:text-neutral-300 font-medium">
                  Number of rows:
                </label>
                <select
                  value={rowCount}
                  onChange={(e) => setRowCount(Number(e.target.value))}
                  className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={50}>50 rows</option>
                  <option value={100}>100 rows</option>
                  <option value={500}>500 rows</option>
                  <option value={1000}>1,000 rows</option>
                  <option value={5000}>5,000 rows</option>
                  <option value={10000}>10,000 rows</option>
                </select>
                <Tooltip content="More rows = larger file size. Start with 100 for testing." id="rows-tooltip">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Tooltip>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="py-8 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 mb-8">
                <button
                  onClick={() => setActiveTab('quick')}
                  className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors text-center ${
                    activeTab === 'quick'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick Download
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors text-center ${
                    activeTab === 'custom'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Custom Design
                  </span>
                </button>
              </div>

              {/* Quick Download Tab */}
              {activeTab === 'quick' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      Choose a Template
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Select from pre-built data templates and download instantly
                    </p>
                  </div>

                  {/* Popular Templates */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center">
                      <span className="text-yellow-500 mr-2">⭐</span>
                      Popular Templates
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {quickTemplates.filter(t => t.popular).map((template) => (
                        <div key={template.id} className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="text-2xl">{template.icon}</div>
                            <Tooltip content={`Download ${template.name} with ${rowCount} rows`} id={`download-${template.id}`}>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => generateQuickCSV(template)}
                                disabled={isGenerating}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                {isGenerating ? '⏳' : '⬇️'}
                              </Button>
                            </Tooltip>
                          </div>
                          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                            {template.name}
                          </h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {template.fields.slice(0, 3).map((field, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded">
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
                      ))}
                    </div>
                  </div>

                  {/* All Templates */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                      All Templates
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {quickTemplates.filter(t => !t.popular).map((template) => (
                        <div key={template.id} className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="text-2xl">{template.icon}</div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateQuickCSV(template)}
                              disabled={isGenerating}
                            >
                              {isGenerating ? '⏳' : '⬇️'}
                            </Button>
                          </div>
                          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                            {template.name}
                          </h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {template.fields.slice(0, 3).map((field, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded">
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
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Design Tab */}
              {activeTab === 'custom' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      Design Your Data
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Create custom fields and generate exactly the data you need
                    </p>
                  </div>

                  {/* Custom Fields */}
                  <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        Data Fields
                      </h3>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={addField}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Field
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {customFields.map((field, index) => (
                        <div key={field.id} className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Field Name
                              </label>
                              <input
                                type="text"
                                value={field.name}
                                onChange={(e) => updateField(field.id, { name: e.target.value })}
                                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter field name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Data Type
                              </label>
                              <select
                                value={field.type}
                                onChange={(e) => updateField(field.id, { type: e.target.value })}
                                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                {Object.entries(fieldTypes).map(([category, types]) => (
                                  <optgroup key={category} label={category}>
                                    {types.map((type) => (
                                      <option key={type.value} value={type.value}>
                                        {type.label}
                                      </option>
                                    ))}
                                  </optgroup>
                                ))}
                              </select>
                            </div>

                            <div className="flex items-center gap-2">
                              <Tooltip content={`Example: ${fieldTypes[Object.keys(fieldTypes).find(cat => 
                                fieldTypes[cat].some(t => t.value === field.type)
                              )]?.find(t => t.value === field.type)?.example || 'Sample data'}`} id={`example-${field.id}`}>
                                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </Tooltip>
                              {customFields.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeField(field.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <Button
                        variant="primary"
                        onClick={generateCustomCSV}
                        disabled={isGenerating || customFields.length === 0}
                        isLoading={isGenerating}
                        loadingText="Generating..."
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Generate & Download CSV
                      </Button>
                    </div>
                  </div>

                  {/* Preview */}
                  {previewData.length > 0 && (
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                        Preview (First 5 rows)
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-neutral-300 dark:border-neutral-600">
                              {previewData[0]?.map((header, index) => (
                                <th key={index} className="text-left py-2 px-3 font-medium text-neutral-900 dark:text-neutral-100">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.slice(1).map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-b border-neutral-200 dark:border-neutral-700">
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="py-2 px-3 text-neutral-700 dark:text-neutral-300">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-811 to-green-700 dark:from-blue-900 dark:to-green-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need More Advanced Features?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Explore our other data tools for mapping, validation, and conversion.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/csv/map" className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                Try CSV Mapper
              </a>
              <a href="/csv/validate" className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                Try CSV Validator
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default CSVGeneratorPage;