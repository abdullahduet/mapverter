import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { calculateColumnStats } from '../../utils/csvUtils';

const CSVPreview = ({ 
  data = [], 
  columns = [],
  maxRows = 10,
  title = 'CSV Preview',
  onRowClick,
  highlightedRows = [],
  showStats = true
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  
  const rowsPerPage = maxRows;
  
  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row => 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);
  
  // Sort data based on sort configuration
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      
      // Handle different value types
      if (valueA === valueB) return 0;
      if (valueA === null || valueA === undefined) return 1;
      if (valueB === null || valueB === undefined) return -1;
      
      // Compare as numbers if both values are numeric
      if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
        return sortConfig.direction === 'ascending' 
          ? Number(valueA) - Number(valueB) 
          : Number(valueB) - Number(valueA);
      }
      
      // Compare as strings
      return sortConfig.direction === 'ascending' 
        ? String(valueA).localeCompare(String(valueB)) 
        : String(valueB).localeCompare(String(valueA));
    });
  }, [filteredData, sortConfig]);
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);
  
  // Calculate basic statistics
  const columnStats = useMemo(() => {
    return showStats ? calculateColumnStats(data, columns) : null;
  }, [data, columns, showStats]);
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sort direction indicator
  const getSortDirectionIndicator = (column) => {
    if (sortConfig.key !== column) return null;
    
    return sortConfig.direction === 'ascending' 
      ? '↑' 
      : '↓';
  };
  
  // Handle page change
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Get cell style based on value type
  const getCellStyle = (value) => {
    if (value === null || value === undefined || value === '') {
      return 'text-gray-400 dark:text-gray-500 italic';
    } else if (!isNaN(Number(value))) {
      return 'font-mono text-right';
    } else if (typeof value === 'boolean') {
      return 'text-center';
    } else {
      return '';
    }
  };
  
  // Format cell value for display
  const formatCellValue = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 dark:text-gray-500 italic">null</span>;
    } else if (value === '') {
      return <span className="text-gray-400 dark:text-gray-500 italic">empty</span>;
    } else if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    } else {
      return String(value);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-border dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold text-text-900 dark:text-gray-100">{title}</h3>
          
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search data..."
              className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-text-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
        </div>
        
        {data.length > 0 && (
          <div className="mt-2 text-sm text-text-600 dark:text-gray-400">
            {searchTerm && filteredData.length !== data.length 
              ? `Showing ${Math.min(paginatedData.length, rowsPerPage)} of ${filteredData.length} matching rows (filtered from ${data.length} total)`
              : `Showing ${Math.min(paginatedData.length, rowsPerPage)} of ${data.length} rows`
            }
          </div>
        )}
      </div>
      
      {data.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border dark:divide-gray-700">
              <thead className="bg-accent dark:bg-gray-700">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-text-900 dark:text-gray-300 tracking-wider cursor-pointer hover:bg-accent-200 dark:hover:bg-gray-600"
                      onClick={() => requestSort(column)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{column}</span>
                        <span>{getSortDirectionIndicator(column)}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-border dark:divide-gray-700">
                {paginatedData.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex}
                    className={`
                      ${highlightedRows.includes(startIndex + rowIndex) 
                        ? 'bg-primary/10 dark:bg-primary-900/20' 
                        : (rowIndex % 2 === 0 ? 'dark:bg-gray-800' : 'dark:bg-gray-750')}
                      ${onRowClick ? 'cursor-pointer hover:bg-accent/50 dark:hover:bg-gray-700' : ''}
                    `}
                    onClick={() => onRowClick && onRowClick(row, startIndex + rowIndex)}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-text-900 dark:text-gray-300 ${getCellStyle(row[column])}`}
                      >
                        {formatCellValue(row[column])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-border dark:border-gray-700">
              <div className="flex-1 flex justify-between items-center">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm rounded border ${
                    currentPage === 1 
                      ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                      : 'border-primary dark:border-primary-400 text-primary dark:text-primary-300 hover:bg-primary/5 dark:hover:bg-primary-900/20'
                  }`}
                >
                  Previous
                </button>
                
                <span className="text-sm text-text-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 text-sm rounded border ${
                    currentPage === totalPages 
                      ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                      : 'border-primary dark:border-primary-400 text-primary dark:text-primary-300 hover:bg-primary/5 dark:hover:bg-primary-900/20'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-8 text-center text-text-600 dark:text-gray-400">
          {searchTerm ? 'No matching data found' : 'No data available'}
        </div>
      )}
      
      {/* Statistics */}
      {showStats && data.length > 0 && columnStats && (
        <div className="p-4 border-t border-border dark:border-gray-700 bg-accent/30 dark:bg-gray-750/30">
          <h4 className="font-medium text-sm mb-3 text-text-900 dark:text-gray-300">Column Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.slice(0, 3).map((column, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded border border-border dark:border-gray-700 text-sm">
                <div className="font-medium mb-1 text-text-900 dark:text-gray-300">{column}</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="text-text-600 dark:text-gray-400">Type:</div>
                  <div className="text-text-900 dark:text-gray-300">{columnStats[column]?.type || 'Unknown'}</div>
                  
                  {columnStats[column]?.numericStats && (
                    <>
                      <div className="text-text-600 dark:text-gray-400">Min:</div>
                      <div className="text-text-900 dark:text-gray-300">{columnStats[column].numericStats.min}</div>
                      
                      <div className="text-text-600 dark:text-gray-400">Max:</div>
                      <div className="text-text-900 dark:text-gray-300">{columnStats[column].numericStats.max}</div>
                      
                      <div className="text-text-600 dark:text-gray-400">Average:</div>
                      <div className="text-text-900 dark:text-gray-300">{columnStats[column].numericStats.avg.toFixed(2)}</div>
                    </>
                  )}
                  
                  <div className="text-text-600 dark:text-gray-400">Unique:</div>
                  <div className="text-text-900 dark:text-gray-300">{columnStats[column]?.uniqueCount}</div>
                  
                  <div className="text-text-600 dark:text-gray-400">Empty:</div>
                  <div className="text-text-900 dark:text-gray-300">{columnStats[column]?.emptyCount}</div>
                </div>
              </div>
            ))}
          </div>
          
          {columns.length > 3 && (
            <div className="mt-2 text-xs text-text-600 dark:text-gray-400 text-center">
              Showing statistics for the first 3 columns. {columns.length - 3} more columns not shown.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

CSVPreview.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  maxRows: PropTypes.number,
  title: PropTypes.string,
  onRowClick: PropTypes.func,
  highlightedRows: PropTypes.array,
  showStats: PropTypes.bool
};

export default CSVPreview;