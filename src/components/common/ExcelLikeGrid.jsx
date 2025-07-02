import React, { useState, useEffect, useRef } from 'react';
import VirtualDataGrid from './VirtualDataGrid';

const ExcelLikeGrid = ({ data, onDataChange }) => {
  // Transform data into the format expected by VirtualDataGrid
  const [gridData, setGridData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const gridRef = useRef(null);
  
  // Process data on initial load
  useEffect(() => {
    if (data && data.length > 0) {
      const headers = Object.keys(data[0]);
      headers.push('column1', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7', 'column8', 'column9', 'column10');
      
      // Create column definitions
      const columns = headers.map((header, index) => ({
        field: header,
        header: header,
        width: index === 0 ? 60 : 150 // Make first column (row numbers) narrower
      }));
      
      setGridData({
        rows: data,
        columns: columns
      });
    } else {
      // Create default empty grid
      const defaultColumns = [
        { field: 'rowNum', header: '#', width: 60 },
        ...Array(10).fill(0).map((_, i) => ({
          field: `col${i}`,
          header: String.fromCharCode(65 + i), // A, B, C, etc.
          width: 150
        }))
      ];
      
      // Create empty rows
      const defaultRows = Array(100).fill(0).map((_, i) => {
        const row = { rowNum: i + 1 };
        defaultColumns.forEach(col => {
          if (col.field !== 'rowNum') {
            row[col.field] = '';
          }
        });
        return row;
      });
      
      setGridData({
        rows: defaultRows,
        columns: defaultColumns
      });
    }
  }, [data]);
  
  // Handle cell click
  const handleCellClick = (rowIndex, colIndex, value) => {
    setSelectedCell({ rowIndex, colIndex });
    
    // Double click to edit (simulated with timeout)
    if (selectedCell && 
        selectedCell.rowIndex === rowIndex && 
        selectedCell.colIndex === colIndex) {
      setEditingCell({ rowIndex, colIndex });
      setEditValue(value || '');
    }
  };
  
  // Handle cell editing
  const handleCellEdit = (e) => {
    setEditValue(e.target.value);
  };
  
  // Finish editing
  const finishEditing = () => {
    if (!editingCell) return;
    
    const { rowIndex, colIndex } = editingCell;
    const fieldName = gridData.columns[colIndex].field;
    
    // Update data
    const newRows = [...gridData.rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      [fieldName]: editValue
    };
    
    setGridData({
      ...gridData,
      rows: newRows
    });
    
    // Notify parent component
    if (onDataChange) {
      onDataChange(newRows);
    }
    
    // Clear editing state
    setEditingCell(null);
    setEditValue('');
  };
  
  // Handle key press in editor
  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     finishEditing();
  //   } else if (e.key === 'Escape') {
  //     e.preventDefault();
  //     setEditingCell(null);
  //     setEditValue('');
  //   }
  // };
  
  // Custom cell renderer
  const renderCell = (value, rowIndex, colIndex, rowData) => {
    const isEditing = 
      editingCell && 
      editingCell.rowIndex === rowIndex && 
      editingCell.colIndex === colIndex;
    
    if (isEditing) {
      return (
        <input
          type="text"
          value={editValue}
          onChange={handleCellEdit}
          onBlur={finishEditing}
          onKeyDown={handleKeyDown}
          className="cell-editor"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            padding: '0 7px',
            fontSize: '14px'
          }}
          autoFocus
        />
      );
    }
    
    const isSelected = 
      selectedCell && 
      selectedCell.rowIndex === rowIndex && 
      selectedCell.colIndex === colIndex;
    
    return (
      <div
        className={`cell-content ${isSelected ? 'selected-cell' : ''}`}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          outline: isSelected ? '2px solid #4299e1' : 'none',
          backgroundColor: isSelected ? 'rgba(66, 153, 225, 0.1)' : 'transparent'
        }}
        onDoubleClick={() => {
          setEditingCell({ rowIndex, colIndex });
          setEditValue(value || '');
        }}
      >
        {colIndex === 0 ? rowIndex + 1 : value}
      </div>
    );
  };
  
  // Focus handler for grid
  const handleGridFocus = () => {
    // When grid gets focus, restore latest selection
    if (selectedCell) {
      // Scroll to the selected cell if needed
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!selectedCell) return;
    
    const { rowIndex, colIndex } = selectedCell;
    
    // If currently editing, don't navigate
    if (editingCell) return;
    
    switch (e.key) {
      case 'ArrowUp':
        if (rowIndex > 0) {
          setSelectedCell({ rowIndex: rowIndex - 1, colIndex });
        }
        break;
      case 'ArrowDown':
        if (rowIndex < gridData.rows.length - 1) {
          setSelectedCell({ rowIndex: rowIndex + 1, colIndex });
        }
        break;
      case 'ArrowLeft':
        if (colIndex > 0) {
          setSelectedCell({ rowIndex, colIndex: colIndex - 1 });
        }
        break;
      case 'ArrowRight':
        if (colIndex < gridData.columns.length - 1) {
          setSelectedCell({ rowIndex, colIndex: colIndex + 1 });
        }
        break;
      case 'Enter':
        setEditingCell({ rowIndex, colIndex });
        setEditValue(
          gridData.rows[rowIndex][gridData.columns[colIndex].field] || ''
        );
        break;
      case 'F2':
        setEditingCell({ rowIndex, colIndex });
        setEditValue(
          gridData.rows[rowIndex][gridData.columns[colIndex].field] || ''
        );
        break;
      default:
        // If typing a printable character, start editing and use it
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          setEditingCell({ rowIndex, colIndex });
          setEditValue(e.key);
        }
        break;
    }
  };
  
  return (
    <div 
      className="excel-like-grid"
      tabIndex={0}
      onFocus={handleGridFocus}
      onKeyDown={handleKeyDown}
      ref={gridRef}
      style={{
        width: '100%',
        height: '600px', // Adjust as needed
        outline: 'none'
      }}
    >
      {gridData.rows && gridData.columns && (
        <VirtualDataGrid
          data={gridData.rows}
          columns={gridData.columns}
          rowHeight={36}
          headerHeight={40}
          frozenColumns={1}
          onCellChange={handleCellClick}
          cellRenderer={renderCell}
        />
      )}
    </div>
  );
};

export default ExcelLikeGrid;