// In VirtualGridPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import SEOHead from '../components/common/SEOHead';
import CSVDataImporter from '../components/csv/CSVDataImporter';
import CSVOperationsToolbar from '../components/csv/CSVOperationsToolbar';
import FindReplacePanel from '../components/csv/FindReplacePanel';
import Button from '../components/common/Button';
import ExcelLikeGrid from '../components/common/ExcelLikeGrid'; // Import our new component
import DataGrid from '../components/common/DataGrid';

const VirtualGridPage = () => {
  // State for CSV data
  const [data, setData] = useState([[]]);
  const [headers, setHeaders] = useState(['Column 1']);
  const [columns, setColumns] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [activePanel, setActivePanel] = useState(null);
  const [fileName, setFileName] = useState('data.csv');
  const [hasChanges, setHasChanges] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [highlightedCell, setHighlightedCell] = useState(null);
  
  // Update change status when data or headers change
  useEffect(() => {
    setHasChanges(true);
  }, [data, headers]);
  
  // Handle data import
  const handleDataImport = (importedData) => {
    if (!importedData || !importedData.headers || !importedData.data) return;
    
    const columns = [
      { field: 'id', header: 'ID', width: 80 },
      { field: 'name', header: 'Name', width: 150 },
      { field: 'age', header: 'Age', width: 80 },
      { field: 'email', header: 'Email', width: 200 },
    ];
    // Format data for our grid component
    const formattedData = importedData.data.map(row => {
      const rowObj = {};
      importedData.headers.forEach((header, index) => {
        rowObj[header] = row[index];
        columns.push({
          field: header,
          header: header,
          width: index === 0 ? 60 : 150
        });
      });
      return rowObj;
    });
    
    setColumns(columns);
    setHeaders(importedData.headers);
    setData(formattedData);
    setSelectedCells([]);
    setHasChanges(false);
  };
  
  // Handle data change from the grid
  const handleDataChange = useCallback((newData) => {
    setData(newData);
    setHasChanges(true);
  }, []);
  
  // Export as CSV
  const exportAsCSV = () => {
    // Convert data back to arrays for Papa.unparse
    const arrayData = data.map(row => {
      return headers.map(header => row[header]);
    });
    
    const csvContent = Papa.unparse({
      fields: headers,
      data: arrayData
    });
    
    downloadFile(csvContent, fileName, 'text/csv');
  };
  
  // Export as Excel
  const exportAsExcel = () => {
    // Convert data to array format for XLSX
    const arrayData = [headers, ...data.map(row => headers.map(header => row[header]))];
    
    const ws = XLSX.utils.aoa_to_sheet(arrayData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    // Convert to Blob
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace('.csv', '.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Export as JSON
  const exportAsJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, fileName.replace('.csv', '.json'), 'application/json');
  };
  
  // Generic download function
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Handle export based on format
  const handleExport = () => {
    if (data.length === 0 || headers.length === 0) {
      alert('No data to export');
      return;
    }
    
    switch (exportFormat) {
      case 'csv':
        exportAsCSV();
        break;
      case 'xlsx':
        exportAsExcel();
        break;
      case 'json':
        exportAsJSON();
        break;
      default:
        exportAsCSV();
    }
  };
  
  // Clear all data
  const handleClear = () => {
    if (hasChanges && !window.confirm('Clear all data? This cannot be undone.')) {
      return;
    }
    
    setData([]);
    setHeaders(['Column 1']);
    setSelectedCells([]);
    setActivePanel(null);
    setHasChanges(false);
  };
  
  // Rename file
  const handleRenameFile = () => {
    const newName = prompt('Enter a new filename:', fileName);
    if (newName) {
      setFileName(newName.endsWith('.csv') ? newName : `${newName}.csv`);
    }
  };

  const handleCellChange = (rowIndex, field, value) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [field]: value };
      return newData;
    });
  };
  
  return (
    <>
      <SEOHead 
        title="Advanced CSV Editor"
        description="Edit CSV data with powerful features including find and replace, text transformations, and more."
        keywords="csv editor, csv manipulation, find and replace, text transform, csv converter"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Advanced CSV Editor</h1>
            <p className="text-text-600">
              Import, edit, transform, and export CSV data with powerful features
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button
                variant="outline"
                onClick={handleRenameFile}
                size="sm"
                className="ml-2"
              >
                Rename
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-3">
            <CSVOperationsToolbar
              selectedCells={selectedCells}
              data={data}
              headers={headers}
              onDataChange={handleDataChange}
              onHeaderChange={setHeaders}
              setActivePanel={setActivePanel}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <div className="relative inline-block">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 border border-border rounded bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel</option>
                <option value="json">JSON</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            
            <Button 
              variant="primary"
              onClick={handleExport}
              disabled={data.length === 0 || headers.length === 0}
            >
              Export
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        </div>
        
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3"> */}
            {/* Replace iamGrid with our new ExcelLikeGrid component */}
            {/* <div className="border-border rounded overflow-hidden" style={{ height: '600px' }}>
              <ExcelLikeGrid
                data={data}
                onDataChange={handleDataChange}
                selectedCells={selectedCells}
                onCellSelect={setSelectedCells}
                highlightedCell={highlightedCell}
                setHighlightedCell={setHighlightedCell}
              />
            </div>
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            {/* Replace iamGrid with our new ExcelLikeGrid component */}
            <div className="border-border rounded overflow-hidden" style={{ height: '600px' }}>
              <DataGrid
                data={data}
                columns={columns}
                frozenColumns={1}
                frozenRows={0}
                height={600}
                width={800}
                onCellChange={handleCellChange}
              />
            </div>
          </div>
          
          <div>
            {activePanel === 'findReplace' ? (
              <div className="mb-4">
                <FindReplacePanel
                  data={data}
                  headers={headers}
                  selectedCells={selectedCells}
                  onDataChange={handleDataChange}
                  onCellSelect={setSelectedCells}
                />
                <div className="mt-2 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivePanel(null)}
                  >
                    Hide Panel
                  </Button>
                </div>
              </div>
            ) : (
              <CSVDataImporter onDataImport={handleDataImport} />
            )}
          </div>
        </div>
        
        <div className="mt-6 text-sm text-text-600">
          <h3 className="font-medium mb-2">Keyboard Shortcuts:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            <li><strong>Ctrl/Cmd+C:</strong> Copy selected cells</li>
            <li><strong>Ctrl/Cmd+V:</strong> Paste at selected cell</li>
            <li><strong>Delete:</strong> Clear selected cells</li>
            <li><strong>Tab:</strong> Move to next cell</li>
            <li><strong>Arrow Keys:</strong> Navigate between cells</li>
            <li><strong>Enter/F2:</strong> Edit selected cell</li>
            <li><strong>Esc:</strong> Cancel editing</li>
            <li><strong>Double Click:</strong> Edit cell</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default VirtualGridPage;