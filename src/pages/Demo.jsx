import React, { useState, useRef } from 'react';
import SEOHead from '../components/common/SEOHead';
import Button from '../components/common/Button';

const Demo = () => {
  const [conversionType, setConversionType] = useState('csv-to-json');
  const [inputData, setInputData] = useState('');
  const [outputData, setOutputData] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const conversionOptions = [
    { value: 'csv-to-json', label: 'CSV to JSON', inputType: 'csv', outputType: 'json' },
    { value: 'json-to-csv', label: 'JSON to CSV', inputType: 'json', outputType: 'csv' },
    { value: 'csv-to-xml', label: 'CSV to XML', inputType: 'csv', outputType: 'xml' },
    { value: 'json-to-xml', label: 'JSON to XML', inputType: 'json', outputType: 'xml' },
    { value: 'edi-to-json', label: 'EDI to JSON', inputType: 'edi', outputType: 'json' },
    { value: 'edi-to-csv', label: 'EDI to CSV', inputType: 'edi', outputType: 'csv' }
  ];

  const sampleData = {
    csv: `id,name,email,department,salary
1,John Smith,john@company.com,Engineering,75000
2,Jane Doe,jane@company.com,Marketing,65000
3,Bob Johnson,bob@company.com,Sales,58000
4,Alice Brown,alice@company.com,HR,62000`,
    json: `[
  {
    "id": 1,
    "name": "John Smith",
    "email": "john@company.com",
    "department": "Engineering",
    "salary": 75000
  },
  {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@company.com",
    "department": "Marketing",
    "salary": 65000
  }
]`,
    edi: `ST*837*0001~
BHT*0019*00*1*20240120*1030~
NM1*41*2*PROVIDER*****46*1234567890~
NM1*85*2*BILLING*****XX*987654321~
HL*1**20*1~
NM1*85*1*PATIENT*JOHN****MI*123456789~
CLM*P123*100***11:B:1*Y*A*Y*I~
SE*8*0001~`
  };

  const getCurrentOption = () => conversionOptions.find(opt => opt.value === conversionType);

  const loadSampleData = () => {
    const currentOption = getCurrentOption();
    const sample = sampleData[currentOption.inputType];
    setInputData(sample);
    setError('');
    setOutputData('');
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setInputData(e.target.result);
      setError('');
      setOutputData('');
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const convertData = async () => {
    if (!inputData.trim()) {
      setError('Please provide input data to convert');
      return;
    }

    setIsConverting(true);
    setError('');
    setOutputData('');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const currentOption = getCurrentOption();
      let result = '';

      // Mock conversion logic
      switch (conversionType) {
        case 'csv-to-json':
          result = convertCSVToJSON(inputData);
          break;
        case 'json-to-csv':
          result = convertJSONToCSV(inputData);
          break;
        case 'csv-to-xml':
          result = convertCSVToXML(inputData);
          break;
        case 'json-to-xml':
          result = convertJSONToXML(inputData);
          break;
        case 'edi-to-json':
          result = convertEDIToJSON(inputData);
          break;
        case 'edi-to-csv':
          result = convertEDIToCSV(inputData);
          break;
        default:
          throw new Error('Unsupported conversion type');
      }

      setOutputData(result);
    } catch (err) {
      setError(err.message || 'Conversion failed. Please check your input data.');
    } finally {
      setIsConverting(false);
    }
  };

  // Mock conversion functions
  const convertCSVToJSON = (csv) => {
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = isNaN(values[index]) ? values[index]?.trim() : Number(values[index]);
        return obj;
      }, {});
    });
    return JSON.stringify(data, null, 2);
  };

  const convertJSONToCSV = (json) => {
    const data = JSON.parse(json);
    if (!Array.isArray(data) || data.length === 0) throw new Error('Invalid JSON format');
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    data.forEach(row => {
      csvRows.push(headers.map(header => row[header]).join(','));
    });
    return csvRows.join('\n');
  };

  const convertCSVToXML = (csv) => {
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<records>\n';
    lines.slice(1).forEach(line => {
      const values = line.split(',');
      xml += '  <record>\n';
      headers.forEach((header, index) => {
        xml += `    <${header.trim()}>${values[index]?.trim() || ''}</${header.trim()}>\n`;
      });
      xml += '  </record>\n';
    });
    xml += '</records>';
    return xml;
  };

  const convertJSONToXML = (json) => {
    const data = JSON.parse(json);
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<records>\n';
    data.forEach(item => {
      xml += '  <record>\n';
      Object.entries(item).forEach(([key, value]) => {
        xml += `    <${key}>${value}</${key}>\n`;
      });
      xml += '  </record>\n';
    });
    xml += '</records>';
    return xml;
  };

  const convertEDIToJSON = (edi) => {
    const segments = edi.split('~').filter(seg => seg.trim());
    const result = segments.map(segment => {
      const elements = segment.split('*');
      return {
        segmentId: elements[0],
        elements: elements.slice(1)
      };
    });
    return JSON.stringify(result, null, 2);
  };

  const convertEDIToCSV = (edi) => {
    const segments = edi.split('~').filter(seg => seg.trim());
    const csvRows = ['Segment_ID,Element_1,Element_2,Element_3,Element_4,Element_5'];
    segments.forEach(segment => {
      const elements = segment.split('*');
      const row = [elements[0], ...elements.slice(1)].slice(0, 6);
      while (row.length < 6) row.push('');
      csvRows.push(row.join(','));
    });
    return csvRows.join('\n');
  };

  const resetDemo = () => {
    setInputData('');
    setOutputData('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadOutput = () => {
    const currentOption = getCurrentOption();
    const extension = currentOption.outputType;
    const blob = new Blob([outputData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_data.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SEOHead
        title="Live Demo - Try Mapverter's Data Transformation Tools"
        description="Experience Mapverter's data conversion capabilities with our interactive demo. Convert CSV to JSON, EDI to CSV, and more formats instantly."
        keywords="mapverter demo, data conversion demo, csv to json converter, live demo, file transformation"
      />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                Try Mapverter Live
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                Experience our data transformation tools with this interactive demo. 
                Upload your files or use sample data to see conversions in real-time.
              </p>
            </div>
          </div>
        </section>

        {/* Demo Interface */}
        <section className="py-12 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              
              {/* Controls */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <label htmlFor="conversion-type" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Select Conversion Type
                    </label>
                    <select
                      id="conversion-type"
                      value={conversionType}
                      onChange={(e) => {
                        setConversionType(e.target.value);
                        setInputData('');
                        setOutputData('');
                        setError('');
                      }}
                      className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {conversionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={loadSampleData}
                      className="whitespace-nowrap"
                    >
                      Load Sample
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetDemo}
                      className="whitespace-nowrap"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>

              {/* Two Panel Layout */}
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Input Panel */}
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Input ({getCurrentOption()?.inputType.toUpperCase()})
                    </h3>
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                        className="hidden"
                        accept=".csv,.json,.txt,.edi"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        📁 Upload
                      </Button>
                    </div>
                  </div>

                  {/* File Drop Zone */}
                  <div
                    className={`border-2 border-dashed rounded-lg transition-colors ${
                      dragActive
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-neutral-300 dark:border-neutral-600'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDrag}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                  >
                    <textarea
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      placeholder={`Paste your ${getCurrentOption()?.inputType.toUpperCase()} data here or drag & drop a file...`}
                      className="w-full h-80 p-4 bg-transparent border-none outline-none resize-none font-mono text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400"
                    />
                  </div>

                  {inputData && (
                    <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
                      {inputData.split('\n').length} lines, {inputData.length} characters
                    </div>
                  )}
                </div>

                {/* Output Panel */}
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Output ({getCurrentOption()?.outputType.toUpperCase()})
                    </h3>
                    {outputData && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadOutput}
                      >
                        💾 Download
                      </Button>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg">
                    {isConverting ? (
                      <div className="h-80 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                          <p className="text-neutral-600 dark:text-neutral-400">Converting your data...</p>
                        </div>
                      </div>
                    ) : outputData ? (
                      <textarea
                        value={outputData}
                        readOnly
                        className="w-full h-80 p-4 bg-transparent border-none outline-none resize-none font-mono text-sm text-neutral-900 dark:text-neutral-100"
                      />
                    ) : (
                      <div className="h-80 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📄</div>
                          <p>Converted data will appear here</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {outputData && (
                    <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
                      {outputData.split('\n').length} lines, {outputData.length} characters
                    </div>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center text-red-800 dark:text-red-200">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {/* Convert Button */}
              <div className="mt-8 text-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={convertData}
                  isLoading={isConverting}
                  disabled={!inputData.trim()}
                  className="bg-blue-811 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {isConverting ? 'Converting...' : 'Run Conversion'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-neutral-50 dark:bg-neutral-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Ready for More?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                This demo shows just a fraction of Mapverter's capabilities. 
                Get access to advanced features, custom templates, and enterprise tools.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="primary" size="lg" className="bg-blue-811 hover:bg-blue-900">
                  Start Free Trial
                </Button>
                <Button variant="outline" size="lg">
                  View All Features
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Demo;