import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import '../../styles/GridStyles.css';

const ExcelGrid = ({
  data,
  headers,
  onCellSelect,
  selectedCells = [],
  highlightedCell = null,
  onDataChange,
  onHeaderChange,
  maxHeight = 600,
  maxWidth = '100%',
  rowHeight = 35,
  headerHeight = 35,
  columnWidth = 120,
  firstColumnWidth = 60,
  onEditCell,
  renderCell,
  renderHeader,
  selectedColumns,
  selectedRows
}) => {
  // DOM Refs
  const gridRef = useRef(null);
  const viewportRef = useRef(null);
  const horizontalScrollRef = useRef(null);
  const verticalScrollRef = useRef(null);
  const contentRef = useRef(null);
  const headerRowRef = useRef(null);
  const firstColumnRef = useRef(null);
  const cornerCellRef = useRef(null);

  // Grid state
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [visibleRows, setVisibleRows] = useState({ start: 0, end: 0 });
  const [visibleColumns, setVisibleColumns] = useState({ start: 0, end: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null);
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({
    viewportWidth: 0,
    viewportHeight: 0,
    contentWidth: 0,
    contentHeight: 0
  });

  // Calculate total dimensions
  const totalWidth = firstColumnWidth + (headers.length * columnWidth);
  const totalHeight = headerHeight + (data.length * rowHeight);

  // Number of buffer rows/columns to render beyond visible area
  const BUFFER_ROWS = 5;
  const BUFFER_COLUMNS = 3;

  // Physics constants
  const SCROLL_DECAY = 0.92;
  const SCROLL_SNAP_THRESHOLD = 0.5;
  const WHEEL_SENSITIVITY = 3;

  // Initialize grid dimensions
  useEffect(() => {
    updateDimensions();
    // Initial calculation of visible rows and columns
    calculateVisibleRange();
    
    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
      calculateVisibleRange();
    });
    
    if (gridRef.current) {
      resizeObserver.observe(gridRef.current);
    }
    
    return () => {
      if (gridRef.current) {
        resizeObserver.unobserve(gridRef.current);
      }
    };
  }, []);

  // Update when data or headers change
  useEffect(() => {
    updateDimensions();
    calculateVisibleRange();
  }, [data.length, headers.length]);

  // Update dimensions of the grid
  const updateDimensions = () => {
    if (!viewportRef.current) return;
    
    const viewportRect = viewportRef.current.getBoundingClientRect();
    
    setDimensions({
      viewportWidth: viewportRect.width,
      viewportHeight: viewportRect.height,
      contentWidth: totalWidth,
      contentHeight: totalHeight
    });
  };

  // Calculate which rows and columns are visible
  const calculateVisibleRange = () => {
    if (!dimensions.viewportHeight || !dimensions.viewportWidth) return;
    
    // Calculate visible rows
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - BUFFER_ROWS);
    const endRow = Math.min(
      data.length, 
      Math.ceil((scrollTop + dimensions.viewportHeight) / rowHeight) + BUFFER_ROWS
    );
    
    // Calculate visible columns
    const firstColWidth = firstColumnWidth;
    const startCol = Math.max(0, Math.floor((scrollLeft - firstColWidth) / columnWidth) - BUFFER_COLUMNS);
    const endCol = Math.min(
      headers.length,
      Math.ceil((scrollLeft + dimensions.viewportWidth - firstColWidth) / columnWidth) + BUFFER_COLUMNS
    );
    
    setVisibleRows({ start: startRow, end: endRow });
    setVisibleColumns({ start: startCol, end: endCol });
  };

  // Handle scroll events
  const handleScroll = useCallback((e) => {
    e.preventDefault();
    setIsScrolling(true);
    
    // Get current time for velocity calculation
    const now = Date.now();
    const deltaTime = now - lastScrollTime;
    setLastScrollTime(now);
    
    let newScrollTop = scrollTop;
    let newScrollLeft = scrollLeft;
    
    // Extract scroll delta
    let deltaX = 0;
    let deltaY = 0;
    
    // Mouse wheel event
    if (e.type === 'wheel') {
      // Determine scroll direction
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        deltaX = e.deltaX;
        setScrollDirection('horizontal');
      } else {
        deltaY = e.deltaY;
        setScrollDirection('vertical');
      }
      
      // Apply the Excel-like scroll physics: scroll by number of rows
      if (deltaY !== 0) {
        // Excel-like behavior: scroll by rows, not pixels
        const direction = deltaY > 0 ? 1 : -1;
        
        // Excel typically scrolls 3 rows for each wheel event
        newScrollTop = scrollTop + (direction * WHEEL_SENSITIVITY * rowHeight);
      }
      
      if (deltaX !== 0) {
        // For horizontal scrolling, use similar snapping behavior
        const direction = deltaX > 0 ? 1 : -1;
        
        // Columns can vary in width, but we'll use columnWidth as standard
        newScrollLeft = scrollLeft + (direction * WHEEL_SENSITIVITY * columnWidth / 3);
      }
    } 
    // Touch or trackpad gesture
    else if (e.type === 'touchmove' && e.touches && e.touches.length) {
      const touch = e.touches[0];
      if (e._lastTouch) {
        deltaX = e._lastTouch.clientX - touch.clientX;
        deltaY = e._lastTouch.clientY - touch.clientY;
        
        newScrollLeft = scrollLeft + deltaX;
        newScrollTop = scrollTop + deltaY;
      }
      e._lastTouch = touch;
    }
    // Custom scrollbar events
    else if (e.target === verticalScrollRef.current) {
      const scrollbarHeight = verticalScrollRef.current.clientHeight;
      const scrollThumbHeight = scrollbarHeight * (dimensions.viewportHeight / dimensions.contentHeight);
      const scrollTrackHeight = scrollbarHeight - scrollThumbHeight;
      
      const scrollPercent = e.nativeEvent.offsetY / scrollTrackHeight;
      newScrollTop = scrollPercent * (dimensions.contentHeight - dimensions.viewportHeight);
    }
    else if (e.target === horizontalScrollRef.current) {
      const scrollbarWidth = horizontalScrollRef.current.clientWidth;
      const scrollThumbWidth = scrollbarWidth * (dimensions.viewportWidth / dimensions.contentWidth);
      const scrollTrackWidth = scrollbarWidth - scrollThumbWidth;
      
      const scrollPercent = e.nativeEvent.offsetX / scrollTrackWidth;
      newScrollLeft = scrollPercent * (dimensions.contentWidth - dimensions.viewportWidth);
    }
    
    // Calculate velocity for inertia
    if (deltaTime > 0) {
      setScrollVelocity({
        x: deltaX / deltaTime,
        y: deltaY / deltaTime
      });
    }
    
    // Enforce boundaries
    newScrollTop = Math.max(0, Math.min(newScrollTop, dimensions.contentHeight - dimensions.viewportHeight));
    newScrollLeft = Math.max(0, Math.min(newScrollLeft, dimensions.contentWidth - dimensions.viewportWidth));
    
    // Snap to row/column boundaries
    if (Math.abs(deltaY) > 0 && Math.abs(deltaY) < rowHeight * SCROLL_SNAP_THRESHOLD) {
      // Snap to row boundaries
      const rowIndex = Math.round(newScrollTop / rowHeight);
      newScrollTop = rowIndex * rowHeight;
    }
    
    if (Math.abs(deltaX) > 0 && Math.abs(deltaX) < columnWidth * SCROLL_SNAP_THRESHOLD) {
      // Snap to column boundaries
      const colOffset = newScrollLeft % columnWidth;
      if (colOffset < columnWidth * SCROLL_SNAP_THRESHOLD) {
        newScrollLeft = newScrollLeft - colOffset;
      } else {
        newScrollLeft = newScrollLeft + (columnWidth - colOffset);
      }
    }
    
    updateScroll(newScrollTop, newScrollLeft);
  }, [scrollTop, scrollLeft, dimensions, lastScrollTime, rowHeight, columnWidth]);

  // Update scroll position and recalculate visible rows/columns
  const updateScroll = (newScrollTop, newScrollLeft) => {
    setScrollTop(newScrollTop);
    setScrollLeft(newScrollLeft);
    
    // Update scroll position in DOM
    if (contentRef.current) {
      contentRef.current.style.transform = `translate(-${newScrollLeft}px, -${newScrollTop}px)`;
    }
    
    if (headerRowRef.current) {
      headerRowRef.current.style.transform = `translateX(-${newScrollLeft}px)`;
    }
    
    if (firstColumnRef.current) {
      firstColumnRef.current.style.transform = `translateY(-${newScrollTop}px)`;
    }
    
    // Update scrollbar positions
    if (verticalScrollRef.current) {
      const scrollPercent = newScrollTop / (dimensions.contentHeight - dimensions.viewportHeight);
      const thumbHeight = dimensions.viewportHeight * (dimensions.viewportHeight / dimensions.contentHeight);
      const thumbPosition = scrollPercent * (dimensions.viewportHeight - thumbHeight);
      verticalScrollRef.current.querySelector('.excel-grid-scrollbar-thumb').style.top = `${thumbPosition}px`;
    }
    
    if (horizontalScrollRef.current) {
      const scrollPercent = newScrollLeft / (dimensions.contentWidth - dimensions.viewportWidth);
      const thumbWidth = dimensions.viewportWidth * (dimensions.viewportWidth / dimensions.contentWidth);
      const thumbPosition = scrollPercent * (dimensions.viewportWidth - thumbWidth);
      horizontalScrollRef.current.querySelector('.excel-grid-scrollbar-thumb').style.left = `${thumbPosition}px`;
    }
    
    // Recalculate which rows/columns are visible
    calculateVisibleRange();
  };

  // Handle scroll animation (inertia)
  useEffect(() => {
    if (!isScrolling) return;
    
    let animationFrameId;
    let lastTimestamp;
    
    const animateScroll = (timestamp) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
        animationFrameId = requestAnimationFrame(animateScroll);
        return;
      }
      
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      // Apply decay to velocity
      const newVelocity = {
        x: scrollVelocity.x * SCROLL_DECAY,
        y: scrollVelocity.y * SCROLL_DECAY
      };
      
      // Stop animation when velocity is negligible
      if (Math.abs(newVelocity.x) < 0.01 && Math.abs(newVelocity.y) < 0.01) {
        setIsScrolling(false);
        
        // Final snap to grid
        const finalRowIndex = Math.round(scrollTop / rowHeight);
        const finalScrollTop = finalRowIndex * rowHeight;
        
        const columnSnappedScrollLeft = Math.round(scrollLeft / columnWidth) * columnWidth;
        
        updateScroll(finalScrollTop, columnSnappedScrollLeft);
        return;
      }
      
      setScrollVelocity(newVelocity);
      
      // Apply velocity to scroll position
      const deltaX = newVelocity.x * deltaTime;
      const deltaY = newVelocity.y * deltaTime;
      
      updateScroll(
        Math.max(0, Math.min(scrollTop + deltaY, dimensions.contentHeight - dimensions.viewportHeight)),
        Math.max(0, Math.min(scrollLeft + deltaX, dimensions.contentWidth - dimensions.viewportWidth))
      );
      
      animationFrameId = requestAnimationFrame(animateScroll);
    };
    
    animationFrameId = requestAnimationFrame(animateScroll);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isScrolling, scrollVelocity, scrollTop, scrollLeft, dimensions]);

  // Handle cell selection
  const handleCellMouseDown = (rowIndex, colIndex, e) => {
    // Implement cell selection logic
    // (Similar to the existing implementation but with the virtualized row/column indices)
    
    // For simplicity, we'll just select the clicked cell
    onCellSelect([{ rowIndex, colIndex }]);
    
    // Make sure the cell is fully visible
    ensureCellVisible(rowIndex, colIndex);
  };

  // Ensure a cell is fully visible in the viewport
  const ensureCellVisible = (rowIndex, colIndex) => {
    // Calculate cell position
    const cellTop = rowIndex * rowHeight + headerHeight;
    const cellLeft = colIndex * columnWidth + firstColumnWidth;
    const cellBottom = cellTop + rowHeight;
    const cellRight = cellLeft + columnWidth;
    
    // Determine if cell is not fully visible
    let newScrollTop = scrollTop;
    let newScrollLeft = scrollLeft;
    
    // Vertical scrolling needed?
    if (cellTop < scrollTop + headerHeight) {
      // Cell is above the visible area
      newScrollTop = cellTop - headerHeight;
    } else if (cellBottom > scrollTop + dimensions.viewportHeight) {
      // Cell is below the visible area
      newScrollTop = cellBottom - dimensions.viewportHeight;
    }
    
    // Horizontal scrolling needed?
    if (cellLeft < scrollLeft + firstColumnWidth) {
      // Cell is to the left of visible area
      newScrollLeft = cellLeft - firstColumnWidth;
    } else if (cellRight > scrollLeft + dimensions.viewportWidth) {
      // Cell is to the right of visible area
      newScrollLeft = cellRight - dimensions.viewportWidth;
    }
    
    // Apply scrolling changes if needed
    if (newScrollTop !== scrollTop || newScrollLeft !== scrollLeft) {
      updateScroll(newScrollTop, newScrollLeft);
    }
  };

  // Render the virtualized grid
  return (
    <div 
      ref={gridRef} 
      className="excel-grid-container" 
      style={{ height: maxHeight, width: maxWidth }}
    >
      {/* Main viewport */}
      <div 
        ref={viewportRef} 
        className="excel-grid-viewport"
        onWheel={handleScroll}
        onTouchMove={handleScroll}
        tabIndex={0} // Make div focusable for keyboard navigation
      >
        {/* Corner cell (top-left frozen area) */}
        <div 
          ref={cornerCellRef}
          className="excel-grid-corner"
          style={{ 
            width: firstColumnWidth, 
            height: headerHeight 
          }}
        >
          #
        </div>
        
        {/* Header row (frozen) */}
        <div 
          ref={headerRowRef}
          className="excel-grid-header-row"
          style={{ 
            height: headerHeight, 
            left: firstColumnWidth,
            width: headers.length * columnWidth
          }}
        >
          {headers.map((header, index) => (
            <div 
              key={`header-${index}`} 
              className={`excel-grid-header-cell ${selectedColumns.includes(index) ? 'selected' : ''}`}
              style={{ width: columnWidth, height: headerHeight }}
              onClick={() => {/* Handle header selection */}}
            >
              {renderHeader ? renderHeader(header, index) : header}
            </div>
          ))}
        </div>
        
        {/* First column (frozen) */}
        <div 
          ref={firstColumnRef}
          className="excel-grid-first-column"
          style={{ 
            width: firstColumnWidth, 
            top: headerHeight,
            height: data.length * rowHeight
          }}
        >
          {data.map((_, rowIndex) => (
            <div 
              key={`row-${rowIndex}`} 
              className={`excel-grid-row-header ${selectedRows.includes(rowIndex) ? 'selected' : ''}`}
              style={{ height: rowHeight, width: firstColumnWidth }}
              onClick={() => {/* Handle row selection */}}
            >
              {rowIndex + 1}
            </div>
          ))}
        </div>
        
        {/* Main grid content (virtualized) */}
        <div 
          ref={contentRef}
          className="excel-grid-content"
          style={{ 
            width: totalWidth, 
            height: totalHeight,
            top: headerHeight,
            left: firstColumnWidth
          }}
        >
          {/* Only render visible rows and columns */}
          {Array.from({ length: visibleRows.end - visibleRows.start }, (_, index) => {
            const rowIndex = visibleRows.start + index;
            return (
              <div 
                key={`row-${rowIndex}`} 
                className="excel-grid-row"
                style={{ 
                  height: rowHeight, 
                  top: rowIndex * rowHeight,
                  width: headers.length * columnWidth 
                }}
              >
                {Array.from({ length: visibleColumns.end - visibleColumns.start }, (_, colIndex) => {
                  const colIdx = visibleColumns.start + colIndex;
                  const isSelected = selectedCells.some(
                    cell => cell.rowIndex === rowIndex && cell.colIndex === colIdx
                  );
                  const isHighlighted = highlightedCell && 
                    highlightedCell.rowIndex === rowIndex && 
                    highlightedCell.colIndex === colIdx;
                  
                  return (
                    <div 
                      key={`cell-${rowIndex}-${colIdx}`} 
                      className={`excel-grid-cell ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                      style={{ 
                        width: columnWidth, 
                        height: rowHeight,
                        left: colIdx * columnWidth
                      }}
                      onMouseDown={(e) => handleCellMouseDown(rowIndex, colIdx, e)}
                      onDoubleClick={() => onEditCell && onEditCell(rowIndex, colIdx)}
                    >
                      {renderCell ? renderCell(rowIndex, colIdx, data[rowIndex]?.[colIdx]) : 
                        (data[rowIndex] && data[rowIndex][colIdx] !== undefined ? data[rowIndex][colIdx] : '')}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Custom scrollbars */}
        <div 
          ref={verticalScrollRef}
          className="excel-grid-scrollbar vertical"
          onMouseDown={handleScroll}
        >
          <div 
            className="excel-grid-scrollbar-thumb" 
            style={{ 
              height: `${(dimensions.viewportHeight / dimensions.contentHeight) * 100}%` 
            }}
          />
        </div>
        
        <div 
          ref={horizontalScrollRef}
          className="excel-grid-scrollbar horizontal"
          onMouseDown={handleScroll}
        >
          <div 
            className="excel-grid-scrollbar-thumb" 
            style={{ 
              width: `${(dimensions.viewportWidth / dimensions.contentWidth) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

ExcelGrid.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCellSelect: PropTypes.func.isRequired,
  selectedCells: PropTypes.arrayOf(
    PropTypes.shape({
      rowIndex: PropTypes.number.isRequired,
      colIndex: PropTypes.number.isRequired
    })
  ),
  highlightedCell: PropTypes.shape({
    rowIndex: PropTypes.number.isRequired,
    colIndex: PropTypes.number.isRequired
  }),
  onDataChange: PropTypes.func.isRequired,
  onHeaderChange: PropTypes.func.isRequired,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rowHeight: PropTypes.number,
  headerHeight: PropTypes.number,
  columnWidth: PropTypes.number,
  firstColumnWidth: PropTypes.number,
  onEditCell: PropTypes.func,
  renderCell: PropTypes.func,
  renderHeader: PropTypes.func,
  selectedColumns: PropTypes.arrayOf(PropTypes.number),
  selectedRows: PropTypes.arrayOf(PropTypes.number)
};

export default ExcelGrid;