import React, { useState, useEffect, useRef, useCallback } from 'react';
import _ from 'lodash';

const VirtualDataGrid = ({
  data = [],
  columns = [],
  rowHeight = 36,
  headerHeight = 40,
  frozenColumns = 1,
  visibleRows = 10,
  visibleColumns = 10,
  onCellChange,
  cellRenderer
}) => {
  // Refs
  const gridContainerRef = useRef(null);
  const mainGridRef = useRef(null);
  const headerRef = useRef(null);
  const frozenColumnsRef = useRef(null);
  
  // State
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [viewport, setViewport] = useState({
    startRow: 0,
    endRow: Math.min(visibleRows + 10, data.length),
    startCol: 0,
    endCol: Math.min(visibleColumns + 5, columns.length),
    width: 0,
    height: 0
  });
  const [isScrolling, setIsScrolling] = useState(false);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  
  // Measurements and calculations
  const totalHeight = data.length * rowHeight;
  const totalWidth = columns.reduce((sum, col) => sum + (col.width || 100), 0);
  const frozenWidth = columns
    .slice(0, frozenColumns)
    .reduce((sum, col) => sum + (col.width || 100), 0);
    
  // Initialize viewport on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (gridContainerRef.current) {
        const rect = gridContainerRef.current.getBoundingClientRect();
        
        // Calculate how many rows/columns can fit in the viewport
        const visibleRowCount = Math.ceil(rect.height / rowHeight) + 2; // Add buffer
        const newEndRow = Math.min(viewport.startRow + visibleRowCount, data.length);
        
        // For columns, need to consider widths of each column
        let visibleWidth = 0;
        let colIndex = viewport.startCol;
        let visibleColumnCount = 0;
        
        while (visibleWidth < rect.width && colIndex < columns.length) {
          visibleWidth += (columns[colIndex]?.width || 100);
          colIndex++;
          visibleColumnCount++;
        }
        
        visibleColumnCount += 2; // Add buffer
        const newEndCol = Math.min(viewport.startCol + visibleColumnCount, columns.length);
        
        setViewport(prev => ({
          ...prev,
          endRow: newEndRow,
          endCol: newEndCol,
          width: rect.width,
          height: rect.height
        }));
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [viewport.startRow, viewport.startCol, data.length, columns, rowHeight]);
  
  // Handle scroll events with throttling for performance
  const handleScroll = useCallback(_.throttle((e) => {
    if (isProgrammaticScroll) {
      setIsProgrammaticScroll(false);
      return;
    }
    
    const { scrollTop, scrollLeft } = e.target;
    setScrollTop(scrollTop);
    setScrollLeft(scrollLeft);
    
    // Sync other scrollable areas
    if (headerRef.current) {
      headerRef.current.scrollLeft = scrollLeft;
    }
    
    if (frozenColumnsRef.current) {
      frozenColumnsRef.current.scrollTop = scrollTop;
    }
    
    // Calculate visible range based on scroll position
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 5);
    const endRow = Math.min(
      data.length, 
      Math.ceil((scrollTop + viewport.height) / rowHeight) + 5
    );
    
    // For columns, we need to account for variable column widths
    let currentWidth = 0;
    let startCol = 0;
    
    // Find the first visible column
    for (let i = 0; i < columns.length; i++) {
      if (currentWidth > scrollLeft - (columns[i]?.width || 100)) {
        startCol = Math.max(0, i - 1);
        break;
      }
      currentWidth += (columns[i]?.width || 100);
    }
    
    // Find the last visible column
    let endCol = startCol;
    let visibleWidth = 0;
    
    while (visibleWidth < viewport.width + 200 && endCol < columns.length) {
      visibleWidth += (columns[endCol]?.width || 100);
      endCol++;
    }
    
    endCol = Math.min(columns.length, endCol + 2);
    
    // Update viewport
    setViewport(prev => ({
      ...prev,
      startRow,
      endRow,
      startCol: Math.max(frozenColumns, startCol),
      endCol
    }));
    
    setIsScrolling(true);
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, 16), [data.length, columns, rowHeight, viewport.height, viewport.width, frozenColumns]);
  
  // Timeout ref for tracking scroll state
  const scrollTimeoutRef = useRef(null);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle scroll snapping (Excel-like behavior)
  const handleScrollEnd = () => {
    if (mainGridRef.current) {
      const { scrollTop } = mainGridRef.current;
      const rowIndex = Math.round(scrollTop / rowHeight);
      const snappedScrollTop = rowIndex * rowHeight;
      
      // Only snap if we're close to a row boundary
      if (Math.abs(scrollTop - snappedScrollTop) < 10) {
        setIsProgrammaticScroll(true);
        
        // Use smooth scrolling for better UX
        mainGridRef.current.scrollTo({
          top: snappedScrollTop,
          behavior: 'smooth'
        });
        
        // Make sure frozen columns stay in sync
        if (frozenColumnsRef.current) {
          frozenColumnsRef.current.scrollTo({
            top: snappedScrollTop,
            behavior: 'smooth'
          });
        }
      }
    }
  };
  
  // Render grid cells
  const renderCells = useCallback(() => {
    // Skip rendering if we don't have data yet
    if (!data.length || !columns.length) return null;
    
    const rows = [];
    
    // Only render rows in the current viewport
    for (let rowIndex = viewport.startRow; rowIndex < viewport.endRow; rowIndex++) {
      if (rowIndex >= data.length) break;
      
      const rowData = data[rowIndex];
      const cells = [];
      
      // Only render columns in the current viewport (plus frozen columns)
      const renderedColumns = [
        ...columns.slice(0, frozenColumns), // Always render frozen columns
        ...columns.slice(
          Math.max(frozenColumns, viewport.startCol),
          viewport.endCol
        )
      ];
      console.log('columns: ', columns, ', renderedColumns:', renderedColumns);
      
      renderedColumns.forEach((column, idx) => {
        const columnIndex = idx < frozenColumns 
          ? idx 
          : viewport.startCol + (idx - frozenColumns);
        
        const value = rowData[column.field];
        const isFrozen = columnIndex < frozenColumns;
        
        // Position absolutely based on row and column indices
        let left = 0;
        for (let i = 0; i < columnIndex; i++) {
          left += (columns[i]?.width || 100);
        }
        
        const width = column.width || 100;
        
        // Add cell to the current row
        cells.push(
          <div
            key={`cell-${rowIndex}-${columnIndex}`}
            className={`grid-cell ${isFrozen ? 'frozen-cell' : ''}`}
            style={{
              position: 'absolute',
              left: isFrozen ? left : left - frozenWidth,
              top: 0,
              width: width,
              height: rowHeight,
              borderRight: '1px solid #e2e8f0',
              borderBottom: '1px solid #e2e8f0',
              padding: '0 8px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              zIndex: isFrozen ? 2 : 1
            }}
            onClick={() => onCellChange && onCellChange(rowIndex, columnIndex, value)}
          >
            {cellRenderer 
              ? cellRenderer(value, rowIndex, columnIndex, rowData) 
              : value}
          </div>
        );
      });
      
      // Create a row container and add all cells
      rows.push(
        <div
          key={`row-${rowIndex}`}
          className="grid-row"
          style={{
            position: 'absolute',
            top: (rowIndex - viewport.startRow) * rowHeight,
            left: 0,
            height: rowHeight,
            width: '100%'
          }}
        >
          {cells}
        </div>
      );
    }
    
    return rows;
  }, [
    data, 
    columns, 
    viewport.startRow, 
    viewport.endRow, 
    viewport.startCol, 
    viewport.endCol, 
    frozenColumns, 
    rowHeight, 
    onCellChange, 
    cellRenderer,
    frozenWidth
  ]);
  
  // Render header cells
  const renderHeaderCells = useCallback(() => {
    const headerCells = [];
    
    // Render all headers for proper width calculation
    columns.forEach((column, columnIndex) => {
      const isFrozen = columnIndex < frozenColumns;
      
      // Calculate position
      let left = 0;
      for (let i = 0; i < columnIndex; i++) {
        left += (columns[i]?.width || 100);
      }
      
      const width = column.width || 100;
      
      headerCells.push(
        <div
          key={`header-${columnIndex}`}
          className={`header-cell ${isFrozen ? 'frozen-header-cell' : ''}`}
          style={{
            position: 'absolute',
            left: isFrozen ? left : left - frozenWidth,
            top: 0,
            width: width,
            height: headerHeight,
            borderRight: '1px solid #cbd5e0',
            borderBottom: '2px solid #cbd5e0',
            padding: '0 8px',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            backgroundColor: '#f1f5f9',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            zIndex: isFrozen ? 12 : 11
          }}
        >
          {column.header || column.field}
        </div>
      );
    });
    
    return headerCells;
  }, [columns, frozenColumns, headerHeight, frozenWidth]);
  
  // Main render
  return (
    <div 
      ref={gridContainerRef}
      className="virtual-data-grid"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        border: '1px solid #cbd5e0',
        fontFamily: 'sans-serif',
        fontSize: '14px'
      }}
    >
      {/* Header Area */}
      <div 
        className="grid-header"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: headerHeight,
          zIndex: 10,
          overflow: 'hidden'
        }}
      >
        {/* Frozen Header Area */}
        <div
          className="frozen-header-area"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: frozenWidth,
            height: headerHeight,
            zIndex: 13,
            overflow: 'hidden',
            boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
          }}
        >
          {columns.slice(0, frozenColumns).map((column, idx) => {
            let left = 0;
            for (let i = 0; i < idx; i++) {
              left += (columns[i]?.width || 100);
            }
            
            return (
              <div
                key={`frozen-header-${idx}`}
                className="frozen-header-cell"
                style={{
                  position: 'absolute',
                  left: left,
                  top: 0,
                  width: column.width || 100,
                  height: headerHeight,
                  borderRight: '1px solid #cbd5e0',
                  borderBottom: '2px solid #cbd5e0',
                  padding: '0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600,
                  backgroundColor: '#f1f5f9',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {column.header || column.field}
              </div>
            );
          })}
        </div>
        
        {/* Scrollable Header Area */}
        <div
          ref={headerRef}
          className="scrollable-header-area"
          style={{
            position: 'absolute',
            top: 0,
            left: frozenWidth,
            right: 0,
            height: headerHeight,
            overflowX: 'hidden',
            overflowY: 'hidden'
          }}
        >
          <div
            style={{
              position: 'relative',
              width: totalWidth - frozenWidth,
              height: headerHeight
            }}
          >
            {columns.slice(frozenColumns).map((column, idx) => {
              let left = 0;
              for (let i = 0; i < idx; i++) {
                left += (columns[i + frozenColumns]?.width || 100);
              }
              
              return (
                <div
                  key={`scrollable-header-${idx}`}
                  className="header-cell"
                  style={{
                    position: 'absolute',
                    left: left,
                    top: 0,
                    width: column.width || 100,
                    height: headerHeight,
                    borderRight: '1px solid #cbd5e0',
                    borderBottom: '2px solid #cbd5e0',
                    padding: '0 8px',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 600,
                    backgroundColor: '#f1f5f9',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {column.header || column.field}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Frozen Columns Area */}
      <div
        ref={frozenColumnsRef}
        className="frozen-columns-area"
        style={{
          position: 'absolute',
          top: headerHeight,
          left: 0,
          width: frozenWidth,
          bottom: 0,
          overflowY: 'hidden',
          overflowX: 'hidden',
          zIndex: 5,
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
        }}
      >
        <div
          style={{
            position: 'relative',
            width: frozenWidth,
            height: totalHeight
          }}
        >
          {data.map((rowData, rowIndex) => {
            if (rowIndex < viewport.startRow || rowIndex >= viewport.endRow) {
              return null;
            }
            
            return columns.slice(0, frozenColumns).map((column, colIdx) => {
              let left = 0;
              for (let i = 0; i < colIdx; i++) {
                left += (columns[i]?.width || 100);
              }
              
              const value = rowData[column.field];
              
              return (
                <div
                  key={`frozen-cell-${rowIndex}-${colIdx}`}
                  className="frozen-cell"
                  style={{
                    position: 'absolute',
                    left: left,
                    top: (rowIndex - viewport.startRow) * rowHeight,
                    width: column.width || 100,
                    height: rowHeight,
                    borderRight: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '0 8px',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  onClick={() => onCellChange && onCellChange(rowIndex, colIdx, value)}
                >
                  {cellRenderer 
                    ? cellRenderer(value, rowIndex, colIdx, rowData) 
                    : value}
                </div>
              );
            });
          })}
        </div>
      </div>
      
      {/* Main Grid Area */}
      <div
        ref={mainGridRef}
        className="main-grid-area"
        style={{
          position: 'absolute',
          top: headerHeight,
          left: frozenWidth,
          right: 0,
          bottom: 0,
          overflowX: 'auto',
          overflowY: 'auto',
          zIndex: 1
        }}
        onScroll={handleScroll}
        onScrollEnd={handleScrollEnd}
      >
        <div
          style={{
            position: 'relative',
            width: totalWidth - frozenWidth,
            height: totalHeight
          }}
        >
          {renderCells()}
        </div>
      </div>
      
      {/* Corner Element (for frozen header and frozen columns intersection) */}
      <div
        className="corner-element"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: frozenWidth,
          height: headerHeight,
          backgroundColor: '#f1f5f9',
          borderRight: '1px solid #cbd5e0',
          borderBottom: '2px solid #cbd5e0',
          zIndex: 15
        }}
      >
        {/* Frozen Header Contents */}
        {columns.slice(0, frozenColumns).map((column, idx) => {
          let left = 0;
          for (let i = 0; i < idx; i++) {
            left += (columns[i]?.width || 100);
          }
          
          return (
            <div
              key={`corner-header-${idx}`}
              className="corner-header-cell"
              style={{
                position: 'absolute',
                left: left,
                top: 0,
                width: column.width || 100,
                height: headerHeight,
                borderRight: '1px solid #cbd5e0',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
                backgroundColor: '#f1f5f9',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {column.header || column.field}
            </div>
          );
        })}
      </div>
      
      {/* Grid Overlay for Special States (like loading) */}
      {isScrolling && (
        <div
          className="grid-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            zIndex: 20,
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
};

export default VirtualDataGrid;