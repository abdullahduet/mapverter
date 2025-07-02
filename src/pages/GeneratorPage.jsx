import React, { useState, useEffect } from 'react';
import SEOHead from '../components/common/SEOHead';
import ColumnDefinitionForm from '../components/csv/ColumnDefinitionForm';
import CSVPreview from '../components/csv/CSVPreview';
import TemplateSelector from '../features/generator/TemplateSelector';
import LoadingScreen from '../components/common/LoadingScreen';
import Button from '../components/common/Button';
import { useCSVGenerator } from '../hooks/useCSVGenerator';
import { dataTypes } from '../utils/csvUtils';
import '../styles/GeneratorPage.css';

const GeneratorPage = () => {
  const { generateCSV, generatingStatus, error } = useCSVGenerator();

  const [columns, setColumns] = useState([
    { name: 'id', type: 'id', options: {} },
    { name: 'name', type: 'fullName', options: { gender: 'both' } },
    { name: 'dateOfBirth', type: 'date', options: { startDate: '1989-06-29' } }
  ]);

  const [rowCount, setRowCount] = useState(10);
  const [basicRowCount, setBasicRowCount] = useState(100); // New state for basic tab row count
  const [columnCount, setColumnCount] = useState(3); // New state for column count
  const [generatedData, setGeneratedData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('quickDownload'); // 'quickDownload', 'customDesign' or 'preview'

  // Update columnCount when columns change
  useEffect(() => {
    console.log('Columns updated columns.length:', columns.length);
    setColumnCount(columns.length);
  }, [columns.length]);

  // Handle column updates
  const handleColumnUpdate = (index, updatedColumn) => {
    const newColumns = [...columns];
    newColumns[index] = updatedColumn;
    setColumns(newColumns);
  };

  // Add a new column
  const handleAddColumn = () => {
    setColumns([...columns, { name: `column_${columnCount + 1}`, type: 'string', options: { minLength: 5, maxLength: 20 } }]);
  };

  // Add multiple columns
  const handleAddMultipleColumns = (count) => {
    const newColumns = [...columns];
    const currentCount = columns.length;

    for (let i = 0; i < count; i++) {
      newColumns.push({
        name: `column_${currentCount + i + 1}`,
        type: 'string',
        options: { minLength: 5, maxLength: 20 }
      });
    }

    setColumns(newColumns);
  };

  // Handle column count change
  const handleColumnCountChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value <= 100) {
      const currentCount = columns.length;

      if (value > currentCount) {
        // Add more columns
        handleAddMultipleColumns(value - currentCount);
      } else if (value < currentCount) {
        // Remove excess columns, keeping the first 'value' columns
        setColumns(columns.slice(0, value));
      }

      setColumnCount(e.target.value);
    }
  };

  // Handle basic row count change
  const handleBasicRowCountChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value <= 10000) {
      setBasicRowCount(e.target.value);
    }
  };

  // Remove a column
  const handleRemoveColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  // Handle row count change
  const handleRowCountChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value <= 10000) {
      setRowCount(e.target.value);
    }
  };

  // Generate CSV data
  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const data = await generateCSV({ columns, rowCount });
      setGeneratedData(data);
      setActiveTab('preview');
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Load a template
  const handleLoadTemplate = (template) => {
    setColumns(template.columns);
    setRowCount(template.rowCount || 10);
    setColumnCount(template.columns.length);
  };

  // Download generated CSV
  const handleDownload = () => {
    if (!generatedData) return;

    // Convert data to CSV
    const headers = columns.map(col => col.name).join(',');
    const rows = generatedData.map(row =>
      columns.map(col => {
        const value = row[col.name];
        // Quote strings that contain commas
        return typeof value === 'string' && value.includes(',')
          ? `"${value}"`
          : value;
      }).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-data.csv';

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Validate configuration
  const isValidConfiguration = () => {
    return columns.every(col => col.name.trim() !== '' && col.type) && rowCount > 0;
  };

  // Reset the form
  const handleReset = () => {
    setColumns([
      { name: 'id', type: 'id', options: {} },
      { name: 'name', type: 'fullName', options: { gender: 'both' } },
      { name: 'dateOfBirth', type: 'date', options: { startDate: '1989-06-29' } }
    ]);
    setRowCount(10);
    setColumnCount(3);
    setGeneratedData(null);
    setActiveTab('customDesign');
  };

  // Show loading screen while generating
  if (isGenerating) {
    return <LoadingScreen message="Generating CSV data..." />;
  }

  return (
    <>
      <SEOHead
        title="CSV Generator - Create Custom CSV Files with Sample Data"
        description="Generate custom CSV files with defined structures and realistic sample data for testing, development, and demonstrations."
        keywords="csv generator, csv creator, sample data, test data, data generation"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 style={{ color: 'var(--color-gray-800)' }} className="text-3xl font-bold text-primary dark:text-primary-300 mb-6">CSV Generator</h1>

          {/* Tabs */}
          <div className="flex border-b border-border dark:border-gray-700 mb-6">
            <button
              style={{ marginRight: '0.6rem' }}
              className={`py-2 px-4 font-medium ${activeTab === 'quickDownload'
                ? 'text-primary dark:text-primary-300 border-b-2 border-primary dark:border-primary-300'
                : 'text-text-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300'
              }`}
              onClick={() => setActiveTab('quickDownload')}
            >
              Quick Download
            </button>

            <button
              style={{ marginRight: '0.6rem' }}
              className={`py-2 px-4 font-medium ${activeTab === 'customDesign'
                ? 'text-primary dark:text-primary-300 border-b-2 border-primary dark:border-primary-300'
                : 'text-text-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300'
              }`}
              onClick={() => setActiveTab('customDesign')}
            >
              Custom Design
            </button>

            <button
              className={`py-2 px-4 font-medium ${activeTab === 'preview'
                ? 'text-primary dark:text-primary-300 border-b-2 border-primary dark:border-primary-300'
                : 'text-text-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300'
              }`}
              onClick={() => setActiveTab('preview')}
              disabled={!generatedData}
            >
              Preview Data
            </button>
          </div>

          {activeTab === 'quickDownload' && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-text-900 dark:text-gray-100">
                  Sample CSV Files – Free Download
                </h2>
                
                <div className="mb-6">
                  <label htmlFor="basicRowCount" className="block text-sm font-medium mb-1 text-text-900 dark:text-gray-300">
                    Number of Rows
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      id="basicRowCount"
                      min="0"
                      max="10000"
                      value={basicRowCount}
                      onChange={handleBasicRowCountChange}
                      className="w-40 p-2 border border-border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-text-900 dark:text-gray-100"
                    />
                    <span className="text-sm text-text-500 dark:text-gray-400">
                      (Maximum: 10,000 rows)
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-500 dark:text-gray-400">
                    Select the number of rows you want in your CSV file.
                  </p>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2 text-text-900 dark:text-gray-300">
                    Click a template to download:
                  </label>
                  <TemplateSelector
                    onSelectTemplate={handleLoadTemplate}
                    basic={true}
                    rowCount={basicRowCount}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'customDesign' && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-text-900 dark:text-gray-100">
                  Load Template
                </h2>

                <TemplateSelector
                  onSelectTemplate={handleLoadTemplate}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-text-900 dark:text-gray-100">
                  Define CSV Structure
                </h2>

                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="rowCount" className="block text-sm font-medium mb-1 text-text-900 dark:text-gray-300">
                      Number of Rows
                    </label>
                    <input
                      type="number"
                      id="rowCount"
                      min="0"
                      max="10000"
                      value={rowCount}
                      onChange={handleRowCountChange}
                      className="w-full p-2 border border-border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-text-900 dark:text-gray-100"
                    />
                    <p className="mt-1 text-sm text-text-500 dark:text-gray-400">
                      Maximum: 10,000 rows
                    </p>
                  </div>

                  <div>
                    <label htmlFor="columnCount" className="block text-sm font-medium mb-1 text-text-900 dark:text-gray-300">
                      Number of Columns
                    </label>
                    <input
                      type="number"
                      id="columnCount"
                      min="0"
                      max="100"
                      value={columnCount}
                      onChange={handleColumnCountChange}
                      className="w-full p-2 border border-border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-text-900 dark:text-gray-100"
                    />
                    <p className="mt-1 text-sm text-text-500 dark:text-gray-400">
                      Maximum: 100 columns
                    </p>
                  </div>
                </div>

                <h3 className="font-medium mb-3 text-text-900 dark:text-gray-300">Column Definitions</h3>

                <div className="space-y-4 mb-6">
                  {columns.map((column, index) => (
                    <ColumnDefinitionForm
                      key={index}
                      column={column}
                      index={index}
                      onUpdate={(updatedColumn) => handleColumnUpdate(index, updatedColumn)}
                      onRemove={() => handleRemoveColumn(index)}
                      isRemovable={columns.length > 1}
                      dataTypes={dataTypes}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleAddColumn}
                  >
                    Add Column
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleReset}
                  >
                    Reset Form
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border dark:border-gray-600">
                  <Button
                    variant="primary"
                    onClick={handleGenerate}
                    disabled={!isValidConfiguration()}
                    className="w-full disabled:opacity-50"
                  >
                    Generate CSV Data
                  </Button>

                  {error && (
                    <div className="mt-4 p-3 bg-error/10 dark:bg-error-900/30 border border-error dark:border-error-800 rounded text-error dark:text-error-300 text-sm">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'preview' && generatedData && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-text-900 dark:text-gray-100">Generated Data</h2>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('customDesign')}
                  >
                    Edit Structure
                  </Button>

                  <Button
                    variant="primary"
                    onClick={handleDownload}
                  >
                    Download CSV
                  </Button>
                </div>
              </div>

              <CSVPreview
                data={generatedData}
                columns={columns.map(col => col.name)}
                title="Generated CSV"
                maxRows={20}
                showStats={true}
              />

              <div className="mt-6 text-center text-text-600 dark:text-gray-400">
                <p>
                  Showing 20 of {generatedData.length} rows. Download the CSV to access all data.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GeneratorPage;