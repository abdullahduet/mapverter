import React, { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import SEOHead from '../components/common/SEOHead';
import ExcelGrid from '../components/common/ExcelGrid';
// import EditableCSVTable from '../components/csv/EditableCSVTable';
import CSVDataImporter from '../components/csv/CSVDataImporter';
import CSVOperationsToolbar from '../components/csv/CSVOperationsToolbar';
import FindReplacePanel from '../components/csv/FindReplacePanel';
import Button from '../components/common/Button';
import LoadingScreen from '../components/common/LoadingScreen';

const EnhancedCSVEditorPage = () => {
  // State for CSV data
  const [data, setData] = useState([[]]);
  const [headers, setHeaders] = useState(['Column 1']);
  const [selectedCells, setSelectedCells] = useState([]);
  const [activePanel, setActivePanel] = useState(null);
  const [fileName, setFileName] = useState('data.csv');
  const [hasChanges, setHasChanges] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [highlightedCell, setHighlightedCell] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [editCellValue, setEditCellValue] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  
  // Refs for table containers
  // const tableContainerRef = useRef(null);
  // Calculate grid dimensions based on available space
  const gridHeight = 600; // Fixed height for Excel-like grid

  // Update change status when data or headers change
  useEffect(() => {
    setHasChanges(true);
  }, [data, headers]);

  // Setup listener for highlighting cells from find/replace operations
  useEffect(() => {
    const handleHighlightCell = (event) => {
      const { rowIndex, colIndex } = event.detail;
      setHighlightedCell({ rowIndex, colIndex });
    };
    
    document.addEventListener('highlightCell', handleHighlightCell);
    
    return () => {
      document.removeEventListener('highlightCell', handleHighlightCell);
    };
  }, []);

  // Function to ensure a cell is fully visible in the viewport
  // const ensureCellIsVisible = (rowIndex, colIndex) => {
  //   if (!tableContainerRef.current) return;
    
  //   const cellElement = document.querySelector(`[data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`);
    
  //   if (cellElement) {
  //     // Use scrollIntoView with block: "nearest" to avoid unnecessary scrolling and ensure entire row/column is visible
  //     cellElement.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'nearest',
  //       inline: 'nearest'
  //     });
  //   }
  // };

  // Handle data import
  const handleDataImport = (importedData) => {
    if (!importedData || !importedData.headers || !importedData.data) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      try {
        // Ensure all rows have the same length
        const normalizedData = importedData.data.map(row => {
          // Create a row with all columns, filling with empty strings as needed
          const normalizedRow = [];
          for (let i = 0; i < importedData.headers.length; i++) {
            normalizedRow[i] = row[i] !== undefined ? row[i] : '';
          }
          return normalizedRow;
        });
        
        setHeaders(importedData.headers);
        setData(normalizedData);
        setSelectedCells([]);
        setHasChanges(false);
      } finally {
        setIsProcessing(false);
      }
    }, 10);
  };
  
  // Handle data change - optimized with useCallback
  const handleDataChange = useCallback((newData) => {
    setData(newData);
  }, []);
  
  // Handle header change - optimized with useCallback
  const handleHeaderChange = useCallback((newHeaders) => {
    setHeaders(newHeaders);
  }, []);
  
  // Handle cell selection
  // Update the handleCellSelect function for better debugging and performance
  const handleCellSelect = useCallback((cells) => {
    console.log("Selection requested:", cells.length, "cells");

    // If selecting the same single cell that's already selected, clear selection
    if (cells.length === 1 && selectedCells.length === 1) {
      const newCell = cells[0];
      const existingCell = selectedCells[0];
      
      if (newCell.rowIndex === existingCell.rowIndex && 
          newCell.colIndex === existingCell.colIndex) {
        console.log("Toggling off single cell selection");
        setSelectedCells([]);
        setHighlightedCell(null);
        return;
      }
    }
    
    setSelectedCells(cells);
    
    // If a single cell is selected, also set it as the highlighted cell
    if (cells.length === 1) {
      setHighlightedCell(cells[0]);
    } else if (cells.length > 1) {
      // With multiple cells selected, maintain the last highlighted cell if it's part of the selection
      const isCurrentHighlightInSelection = cells.some(
        cell => highlightedCell && 
               cell.rowIndex === highlightedCell.rowIndex && 
               cell.colIndex === highlightedCell.colIndex
      );
      if (!isCurrentHighlightInSelection) {
        // If current highlight not in selection, highlight the first cell of the selection
        setHighlightedCell(cells[0]);
      }
    }
    
    // Extract unique rows and columns from selection
    if (cells.length > 0) {
      const rows = [...new Set(cells.map(cell => cell.rowIndex))].sort((a, b) => a - b);
      const cols = [...new Set(cells.map(cell => cell.colIndex))].sort((a, b) => a - b);
      
      // Check for complete row/column selections
      const completeRows = rows.filter(rowIndex => {
        return cells.filter(cell => cell.rowIndex === rowIndex).length === headers.length;
      });
      
      const completeColumns = cols.filter(colIndex => {
        return cells.filter(cell => cell.colIndex === colIndex).length === data.length;
      });
      
      setSelectedRows(completeRows);
      setSelectedColumns(completeColumns);
    } else {
      setSelectedRows([]);
      setSelectedColumns([]);
    }
  }, [selectedCells, highlightedCell, headers.length, data.length]);

  // Handle cell editing
  const handleEditCell = (rowIndex, colIndex) => {
    setEditingCell({ rowIndex, colIndex });
    setEditCellValue(data[rowIndex]?.[colIndex] || '');
  };
  
  // Save cell edit
  const handleSaveCellEdit = (value) => {
    if (editingCell) {
      const { rowIndex, colIndex } = editingCell;
      const newData = [...data];
      
      if (!newData[rowIndex]) {
        newData[rowIndex] = new Array(headers.length).fill('');
      }
      
      newData[rowIndex][colIndex] = value;
      setData(newData);
      setEditingCell(null);
    }
  };
  
  // Handle export
  const handleExport = () => {
    if (data.length === 0 || headers.length === 0) {
      alert('No data to export');
      return;
    }
    
    // Show processing indicator for large datasets
    if (data.length > 1000) {
      setIsProcessing(true);
    }
    
    setTimeout(() => {
      try {
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
      } finally {
        setIsProcessing(false);
      }
    }, 10);
  };
  
  // Export as CSV
  const exportAsCSV = () => {
    // Ensure the data has all required columns
    const normalizedData = data.map(row => {
      // Ensure row length matches headers
      const normalizedRow = [];
      for (let i = 0; i < headers.length; i++) {
        normalizedRow[i] = row[i] !== undefined ? row[i] : '';
      }
      return normalizedRow;
    });
    
    const csvContent = Papa.unparse({
      fields: headers,
      data: normalizedData
    });
    
    downloadFile(csvContent, fileName, 'text/csv');
  };
  
  // Export as Excel
  const exportAsExcel = () => {
    // Ensure the data has all required columns
    const normalizedData = data.map(row => {
      // Create a row with all columns, filling with empty strings as needed
      const normalizedRow = [];
      for (let i = 0; i < headers.length; i++) {
        normalizedRow[i] = row[i] !== undefined ? row[i] : '';
      }
      return normalizedRow;
    });
    
    const ws = XLSX.utils.aoa_to_sheet([headers, ...normalizedData]);
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
    URL.revokeObjectURL(url);
  };
  
  // Export as JSON
  const exportAsJSON = () => {
    // Convert data to array of objects with headers as keys
    const jsonData = data.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    
    const jsonContent = JSON.stringify(jsonData, null, 2);
    
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
    URL.revokeObjectURL(url);
  };
  
  // Clear all data
  const handleClear = () => {
    if (hasChanges && !window.confirm('Clear all data? This cannot be undone.')) {
      return;
    }
    
    setData([[]]);
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

  // Render custom cell content
  const renderCell = (rowIndex, colIndex, value) => {
    if (editingCell && 
        editingCell.rowIndex === rowIndex && 
        editingCell.colIndex === colIndex) {
      return (
        <input
          className="excel-grid-cell-editor"
          type="text"
          value={editCellValue}
          onChange={(e) => setEditCellValue(e.target.value)}
          onBlur={() => handleSaveCellEdit(editCellValue)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSaveCellEdit(editCellValue);
            } else if (e.key === 'Escape') {
              setEditingCell(null);
            }
          }}
          autoFocus
        />
      );
    }
    
    return (
      <div className="truncate w-full">
        {value !== undefined ? value : ''}
      </div>
    );
  };
  
  // Add a new row
  const handleAddRow = () => {
    const newData = [...data];
    const newRow = new Array(headers.length).fill('');
    newData.push(newRow);
    handleDataChange(newData);
  };
  
  // Add a new column
  const handleAddColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    handleHeaderChange(newHeaders);
    
    const newData = data.map(row => {
      const newRow = [...row];
      newRow.push('');
      return newRow;
    });
    
    handleDataChange(newData);
  };
  
  return (
    <>
      <SEOHead 
        title="Advanced CSV Editor"
        description="Edit CSV data with powerful features including find and replace, text transformations, and more."
        keywords="csv editor, csv manipulation, find and replace, text transform, csv converter"
      />
      
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-white/75 flex items-center justify-center">
          <LoadingScreen message="Processing data..." spinnerSize="lg" />
        </div>
      )}
      
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
              onHeaderChange={handleHeaderChange}
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            {/* <EditableCSVTable
              data={data}
              headers={headers}
              onDataChange={handleDataChange}
              onHeaderChange={handleHeaderChange}
              selectedCells={selectedCells}
              onCellSelect={handleCellSelect}
              highlightedCell={highlightedCell}
              setHighlightedCell={setHighlightedCell}
              maxHeight={`${calculateTableHeight()}px`} // Use calculated height based on row count
            /> */}
            {/* Excel-like grid with virtualization and custom scrolling */}
            <ExcelGrid
              data={data}
              headers={headers}
              onDataChange={handleDataChange}
              onHeaderChange={handleHeaderChange}
              selectedCells={selectedCells}
              onCellSelect={handleCellSelect}
              highlightedCell={highlightedCell}
              maxHeight={gridHeight}
              rowHeight={35}
              headerHeight={35}
              columnWidth={120}
              firstColumnWidth={60}
              onEditCell={handleEditCell}
              renderCell={renderCell}
              selectedRows={selectedRows}
              selectedColumns={selectedColumns}
            />
          </div>
          
          <div>
            {activePanel === 'findReplace' ? (
              <div className="mb-4">
                <FindReplacePanel
                  data={data}
                  headers={headers}
                  selectedCells={selectedCells}
                  onDataChange={handleDataChange}
                  onCellSelect={handleCellSelect}
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
            <li><strong>Shift+Click:</strong> Select range</li>
            <li><strong>Ctrl/Cmd+Click:</strong> Select multiple cells</li>
            <li><strong>Enter/Double Click:</strong> Edit cell</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default EnhancedCSVEditorPage;
