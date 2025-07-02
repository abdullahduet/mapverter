import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { throttle } from 'lodash';

/**
 * Fixed DataGrid component addressing horizontal scroll synchronization
 * and cell sizing issues.
 */
const DataGrid = ({
  data = [],
  columns = [],
  frozenColumns = 1,
  headerHeight = 38,
  rowHeight = 30,
  defaultColWidth = 120,
  height = 600,
  width = 800,
  onCellChange = () => {},
  showRowNumbers = true,
}) => {
  // Core refs
  const gridContainerRef = useRef(null);
  const mainViewportRef = useRef(null);
  const headerScrollRef = useRef(null);
  const frozenColumnsRef = useRef(null);
  
  // State for viewport and scrolling
  const [scrollPosition, setScrollPosition] = useState({ top: 0, left: 0 });
  const [viewport, setViewport] = useState({
    startRow: 0,
    endRow: 0,
    startCol: 0,
    endCol: 0,
    visibleRows: 0,
    visibleCols: 0
  });
  const [isScrolling, setIsScrolling] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  
  // Column configuration with row number column if enabled
  const effectiveColumns = useMemo(() => {
    if (!showRowNumbers) return columns;
    
    return [
      { 
        field: '__rowNumber', 
        header: '', 
        width: 60,
        isRowNumberColumn: true
      },
      ...columns
    ];
  }, [columns, showRowNumbers]);

  // Column widths calculation
  const columnWidths = useMemo(() => {
    return effectiveColumns.map(col => col.width || defaultColWidth);
  }, [effectiveColumns, defaultColWidth]);

  // Total dimensions of the virtual grid
  const totalWidth = useMemo(() => {
    return columnWidths.reduce((sum, width) => sum + width, 0);
  }, [columnWidths]);

  const totalHeight = useMemo(() => {
    return data.length * rowHeight;
  }, [data.length, rowHeight]);

  // Calculate frozen columns width
  const frozenColumnsWidth = useMemo(() => {
    let width = 0;
    const actualFrozenCols = Math.min(frozenColumns, columnWidths.length);
    for (let i = 0; i < actualFrozenCols; i++) {
      width += columnWidths[i];
    }
    return width;
  }, [columnWidths, frozenColumns]);

  // Compute visible viewport dimensions
  const calculateViewport = useCallback(() => {
    if (!mainViewportRef.current) return;
    
    const { clientHeight, clientWidth } = mainViewportRef.current;
    const { top, left } = scrollPosition;
    
    // Calculate visible rows with buffer
    const visibleRows = Math.ceil(clientHeight / rowHeight) + 2;
    const startRow = Math.max(0, Math.floor(top / rowHeight));
    const endRow = Math.min(data.length - 1, startRow + visibleRows);
    
    // Calculate visible columns with buffer
    const visibleWidth = clientWidth;
    let startCol = frozenColumns; // Start after frozen columns
    let endCol = frozenColumns;
    let accumulatedWidth = 0;
    
    for (let i = frozenColumns; i < columnWidths.length; i++) {
      if (accumulatedWidth > left) {
        startCol = Math.max(frozenColumns, i - 1);
        break;
      }
      accumulatedWidth += columnWidths[i];
    }
    
    accumulatedWidth = 0;
    for (let i = frozenColumns; i < columnWidths.length; i++) {
      accumulatedWidth += columnWidths[i];
      endCol = i;
      if (accumulatedWidth > left + visibleWidth) {
        break;
      }
    }
    
    // Add buffer for smoother scrolling
    startCol = Math.max(frozenColumns, startCol - 1);
    endCol = Math.min(columnWidths.length - 1, endCol + 1);
    
    setViewport({
      startRow,
      endRow,
      startCol,
      endCol,
      visibleRows,
      visibleCols: endCol - startCol + 1
    });
  }, [scrollPosition, data.length, rowHeight, columnWidths, frozenColumns]);

  // Handle scroll events with manual synchronization
  const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;
    const scrollLeft = e.target.scrollLeft;
    
    // Update scroll position state
    setScrollPosition({
      top: scrollTop,
      left: scrollLeft
    });
    
    // Manually sync header scrolling - CRITICAL FIX
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = scrollLeft;
    }
    
    // Manually sync frozen columns scrolling - CRITICAL FIX
    if (frozenColumnsRef.current) {
      frozenColumnsRef.current.scrollTop = scrollTop;
    }
    
    setIsScrolling(true);
  }, []);

  // Throttled scroll handler for performance
  const throttledScrollHandler = useMemo(
    () => throttle(handleScroll, 16), // ~60fps
    [handleScroll]
  );

  // Update viewport when scroll position changes
  useEffect(() => {
    calculateViewport();
  }, [calculateViewport, scrollPosition]);

  // Reset scrolling state after a delay
  useEffect(() => {
    if (isScrolling) {
      const timer = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isScrolling]);

  // Initial viewport calculation and resize handling
  useEffect(() => {
    calculateViewport();
    
    const resizeObserver = new ResizeObserver(() => {
      calculateViewport();
    });
    
    if (gridContainerRef.current) {
      resizeObserver.observe(gridContainerRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateViewport]);

  // Cell interaction handlers
  const handleCellClick = useCallback((rowIndex, colIndex) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    setEditingCell(null);
  }, []);

  const handleCellDoubleClick = useCallback((rowIndex, colIndex) => {
    // Don't allow editing row number column
    const column = effectiveColumns[colIndex];
    if (column && column.isRowNumberColumn) return;
    
    setSelectedCell({ row: rowIndex, col: colIndex });
    setEditingCell({ row: rowIndex, col: colIndex });
    
    const columnField = column.field;
    setEditValue(data[rowIndex][columnField] || "");
  }, [data, effectiveColumns]);

  const handleEditChange = useCallback((e) => {
    setEditValue(e.target.value);
  }, []);

  const handleEditComplete = useCallback(() => {
    if (editingCell) {
      const { row, col } = editingCell;
      const column = effectiveColumns[col];
      
      if (!column.isRowNumberColumn) {
        onCellChange(row, column.field, editValue);
      }
      
      setEditingCell(null);
    }
  }, [editingCell, editValue, effectiveColumns, onCellChange]);

  // Calculate cell position for rendering
  const getCellPosition = useCallback((rowIndex, colIndex) => {
    let left = 0;
    
    for (let i = 0; i < colIndex; i++) {
      left += columnWidths[i];
    }
    
    return {
      left,
      top: rowIndex * rowHeight,
      width: columnWidths[colIndex],
      height: rowHeight
    };
  }, [columnWidths, rowHeight]);

  // Get absolute column position
  const getColumnPosition = useCallback((colIndex) => {
    let left = 0;
    for (let i = 0; i < colIndex; i++) {
      left += columnWidths[i];
    }
    return left;
  }, [columnWidths]);

  // Render main grid cells
  const renderCells = useCallback(() => {
    const cells = [];
    
    // Skip detailed rendering during fast scrolling for performance
    if (isScrolling && data.length > 1000) {
      return cells;
    }
    
    for (let rowIdx = viewport.startRow; rowIdx <= viewport.endRow; rowIdx++) {
      const rowData = data[rowIdx];
      if (!rowData) continue;
      
      for (let colIdx = viewport.startCol; colIdx <= viewport.endCol; colIdx++) {
        const column = effectiveColumns[colIdx];
        if (!column) continue;
        
        // Skip frozen columns as they're rendered separately
        if (colIdx < frozenColumns) continue;
        
        const value = column.isRowNumberColumn 
          ? (rowIdx + 1) // Row number (1-based)
          : rowData[column.field];
          
        const isSelected = selectedCell && 
                          selectedCell.row === rowIdx && 
                          selectedCell.col === colIdx;
                          
        const isEditing = editingCell && 
                         editingCell.row === rowIdx && 
                         editingCell.col === colIdx;
        
        // Calculate absolute positions - CRITICAL FIX
        const colPosition = getColumnPosition(colIdx);
        
        cells.push(
          <div
            key={`cell-${rowIdx}-${colIdx}`}
            className="datagrid-cell"
            style={{
              position: 'absolute',
              top: rowIdx * rowHeight, // Absolute position based on row
              left: colPosition - scrollPosition.left, // Adjusted for scrolling
              width: columnWidths[colIdx],
              height: rowHeight,
              borderRight: '1px solid #e0e0e0',
              borderBottom: '1px solid #e0e0e0',
              padding: '0 8px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: isSelected ? '#e6f7ff' : 'white',
              outline: isSelected ? '2px solid #1890ff' : 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              userSelect: 'none'
            }}
            onClick={() => handleCellClick(rowIdx, colIdx)}
            onDoubleClick={() => handleCellDoubleClick(rowIdx, colIdx)}
          >
            {isEditing ? (
              <input
                style={{
                  width: '100%',
                  height: '80%',
                  border: 'none',
                  padding: '0 4px',
                  outline: 'none'
                }}
                value={editValue}
                onChange={handleEditChange}
                onBlur={handleEditComplete}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEditComplete();
                  } else if (e.key === 'Escape') {
                    setEditingCell(null);
                  }
                }}
                autoFocus
              />
            ) : (
              value !== undefined && value !== null ? value : ''
            )}
          </div>
        );
      }
    }
    
    return cells;
  }, [
    viewport, 
    data, 
    effectiveColumns, 
    frozenColumns,
    isScrolling,
    scrollPosition,
    selectedCell, 
    editingCell, 
    editValue,
    columnWidths,
    rowHeight,
    getColumnPosition,
    handleCellClick, 
    handleCellDoubleClick, 
    handleEditChange, 
    handleEditComplete
  ]);

  // Render frozen columns (including row numbers)
  const renderFrozenColumns = useCallback(() => {
    const frozenCells = [];
    
    // Skip rendering if no frozen columns
    if (frozenColumns === 0) return frozenCells;
    
    // Only render rows in current viewport
    for (let rowIdx = viewport.startRow; rowIdx <= viewport.endRow; rowIdx++) {
      const rowData = data[rowIdx];
      if (!rowData) continue;
      
      // Only render columns that should be frozen
      for (let colIdx = 0; colIdx < Math.min(frozenColumns, effectiveColumns.length); colIdx++) {
        const column = effectiveColumns[colIdx];
        if (!column) continue;
        
        const value = column.isRowNumberColumn 
          ? (rowIdx + 1) // Row number (1-based)
          : rowData[column.field];
        
        const isSelected = selectedCell && 
                          selectedCell.row === rowIdx && 
                          selectedCell.col === colIdx;
                          
        const isEditing = editingCell && 
                         editingCell.row === rowIdx && 
                         editingCell.col === colIdx;
        
        // Calculate position within frozen area
        const colPosition = getColumnPosition(colIdx);
        
        frozenCells.push(
          <div
            key={`frozen-cell-${rowIdx}-${colIdx}`}
            className="datagrid-frozen-cell"
            style={{
              position: 'absolute',
              top: rowIdx * rowHeight - scrollPosition.top, // CRITICAL FIX - adjustment for scrolling
              left: colPosition,
              width: columnWidths[colIdx],
              height: rowHeight,
              borderRight: colIdx === frozenColumns - 1 
                ? '2px solid #d9d9d9' // Bold border for last frozen column
                : '1px solid #e0e0e0',
              borderBottom: '1px solid #e0e0e0',
              padding: '0 8px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: column.isRowNumberColumn 
                ? '#f5f5f5' // Light gray for row numbers
                : isSelected ? '#e6f7ff' : 'white',
              fontWeight: column.isRowNumberColumn ? 'bold' : 'normal',
              textAlign: column.isRowNumberColumn ? 'center' : 'left',
              outline: isSelected ? '2px solid #1890ff' : 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              userSelect: 'none'
            }}
            onClick={() => handleCellClick(rowIdx, colIdx)}
            onDoubleClick={() => handleCellDoubleClick(rowIdx, colIdx)}
          >
            {isEditing ? (
              <input
                style={{
                  width: '100%',
                  height: '80%',
                  border: 'none',
                  padding: '0 4px',
                  outline: 'none'
                }}
                value={editValue}
                onChange={handleEditChange}
                onBlur={handleEditComplete}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEditComplete();
                  } else if (e.key === 'Escape') {
                    setEditingCell(null);
                  }
                }}
                autoFocus
              />
            ) : (
              value !== undefined && value !== null ? value : ''
            )}
          </div>
        );
      }
    }
    
    return frozenCells;
  }, [
    viewport, 
    data, 
    effectiveColumns, 
    frozenColumns,
    scrollPosition,
    selectedCell, 
    editingCell, 
    editValue,
    columnWidths,
    rowHeight,
    getColumnPosition,
    handleCellClick, 
    handleCellDoubleClick, 
    handleEditChange, 
    handleEditComplete
  ]);

  // Render header cells
  const renderHeaderCells = useCallback(() => {
    const headerCells = [];
    
    // Render all column headers
    for (let colIdx = 0; colIdx < effectiveColumns.length; colIdx++) {
      const column = effectiveColumns[colIdx];
      if (!column) continue;
      
      // Calculate absolute column position
      const colPosition = getColumnPosition(colIdx);
      
      headerCells.push(
        <div
          key={`header-${colIdx}`}
          className="datagrid-header-cell"
          style={{
            position: 'absolute',
            top: 0,
            left: colPosition,
            width: columnWidths[colIdx],
            height: headerHeight,
            borderRight: colIdx === frozenColumns - 1 
              ? '2px solid #d9d9d9' // Bold border for last frozen column
              : '1px solid #e0e0e0',
            borderBottom: '2px solid #d9d9d9',
            padding: '0 8px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            userSelect: 'none'
          }}
        >
          {column.header || column.field}
        </div>
      );
    }
    
    return headerCells;
  }, [effectiveColumns, headerHeight, frozenColumns, columnWidths, getColumnPosition]);

  // Create a properly synchronized layout
  return (
    <div
      ref={gridContainerRef}
      className="datagrid-container"
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        border: '1px solid #d9d9d9',
        userSelect: 'none'
      }}
      tabIndex={0}
    >
      {/* Header row with scrolling synchronized to main content */}
      <div
        className="datagrid-header"
        style={{
          position: 'absolute',
          top: 0,
          left: frozenColumnsWidth,
          right: 0,
          height: headerHeight,
          zIndex: 30,
          overflow: 'hidden'
        }}
      >
        <div
          ref={headerScrollRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: totalWidth - frozenColumnsWidth,
            overflow: 'hidden'
          }}
        >
          {/* Non-frozen header cells */}
          {effectiveColumns.slice(frozenColumns).map((column, i) => {
            const colIdx = i + frozenColumns;
            const colPosition = getColumnPosition(colIdx);
            
            return (
              <div
                key={`scrollable-header-${colIdx}`}
                className="datagrid-header-cell"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: colPosition - getColumnPosition(frozenColumns),
                  width: columnWidths[colIdx],
                  height: headerHeight,
                  borderRight: '1px solid #e0e0e0',
                  borderBottom: '2px solid #d9d9d9',
                  padding: '0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {column.header || column.field}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Frozen corner (intersection of header and frozen columns) */}
      <div
        className="datagrid-corner"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: frozenColumnsWidth,
          height: headerHeight,
          zIndex: 40,
          backgroundColor: '#f5f5f5',
          borderRight: '2px solid #d9d9d9',
          borderBottom: '2px solid #d9d9d9',
          overflow: 'hidden'
        }}
      >
        {/* Corner cells (first few columns in header) */}
        {effectiveColumns.slice(0, frozenColumns).map((column, colIdx) => {
          const colPosition = getColumnPosition(colIdx);
          
          return (
            <div
              key={`corner-${colIdx}`}
              className="datagrid-corner-cell"
              style={{
                position: 'absolute',
                top: 0,
                left: colPosition,
                width: columnWidths[colIdx],
                height: headerHeight,
                borderRight: colIdx === frozenColumns - 1 
                  ? '2px solid #d9d9d9'
                  : '1px solid #e0e0e0',
                borderBottom: '2px solid #d9d9d9',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {column.header || column.field}
            </div>
          );
        })}
      </div>
      
      {/* Main scrollable viewport */}
      <div
        ref={mainViewportRef}
        className="datagrid-viewport"
        style={{
          position: 'absolute',
          top: headerHeight,
          left: frozenColumnsWidth,
          right: 0,
          bottom: 0,
          overflow: 'auto',
          zIndex: 10
        }}
        onScroll={throttledScrollHandler}
      >
        {/* Content surface for virtual scrolling */}
        <div
          className="datagrid-content"
          style={{
            position: 'relative',
            width: Math.max(totalWidth - frozenColumnsWidth, 1),
            height: Math.max(totalHeight, 1),
            overflow: 'hidden'
          }}
        >
          {renderCells()}
        </div>
      </div>
      
      {/* Frozen columns container */}
      <div
        className="datagrid-frozen-columns"
        style={{
          position: 'absolute',
          top: headerHeight,
          left: 0,
          width: frozenColumnsWidth,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 20,
          borderRight: '2px solid #d9d9d9'
        }}
      >
        {/* Frozen columns viewport */}
        <div
          ref={frozenColumnsRef}
          className="datagrid-frozen-content"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: totalHeight,
            overflow: 'hidden'
          }}
        >
          {renderFrozenColumns()}
        </div>
      </div>
      
      {/* Scrollbar spacer */}
      <div
        className="datagrid-scrollbar-corner"
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 17, // Standard scrollbar width
          height: 17, // Standard scrollbar height
          backgroundColor: '#f5f5f5',
          zIndex: 5
        }}
      />
    </div>
  );
};

export default DataGrid;