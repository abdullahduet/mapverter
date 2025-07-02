import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

// The key component that controls Excel-like scrolling
const ScrollableContainer = ({
  children,
  rowHeight = 35,
  headerHeight = 35,
  maxVisibleRows = 15,
  className = '',
  style = {}
}) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  
  // Calculate container height to be exact multiple of rowHeight
  const containerHeight = maxVisibleRows * rowHeight + headerHeight;
  
  // Update total rows when children change
  useEffect(() => {
    // Count the number of rows in the table body
    if (containerRef.current) {
      const tbody = containerRef.current.querySelector('tbody');
      if (tbody) {
        setTotalRows(tbody.children.length);
      }
    }
  }, [children]);
  
  // Custom wheel event handler for Excel-like scrolling
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    // Determine scroll direction and calculate rows to scroll
    const direction = e.deltaY > 0 ? 1 : -1;
    
    // Excel typically scrolls 3 rows at a time with mouse wheel
    const rowsToScroll = 3 * direction;
    
    // Calculate the current row index
    const currentRow = Math.floor(scrollTop / rowHeight);
    
    // Calculate new row after scrolling
    let newRow = currentRow + rowsToScroll;
    
    // Enforce boundaries
    newRow = Math.max(0, Math.min(newRow, totalRows - maxVisibleRows));
    
    // Convert back to pixels
    const newScrollTop = newRow * rowHeight;
    
    // Update scroll position
    if (containerRef.current) {
      containerRef.current.scrollTop = newScrollTop;
      setScrollTop(newScrollTop);
    }
  }, [scrollTop, rowHeight, totalRows, maxVisibleRows]);
  
  // Handle native scroll events to sync state
  const handleScroll = useCallback((e) => {
    // Get scroll position
    const rawScrollTop = e.target.scrollTop;
    
    // Calculate the row index
    const rowIndex = Math.round(rawScrollTop / rowHeight);
    
    // Calculate the exact scroll position to align with row boundaries
    const alignedScrollTop = rowIndex * rowHeight;
    
    // Only update if we're not already at an aligned position
    if (Math.abs(rawScrollTop - alignedScrollTop) > 2) {
      // Use requestAnimationFrame to smooth out the alignment
      requestAnimationFrame(() => {
        e.target.scrollTop = alignedScrollTop;
        setScrollTop(alignedScrollTop);
      });
    } else {
      setScrollTop(rawScrollTop);
    }
  }, [rowHeight]);
  
  // Register event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('scroll', handleScroll);
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleWheel, handleScroll]);
  
  // Calculate the maximum scroll position to ensure bottom rows are fully visible
  const maxScrollHeight = Math.max(0, (totalRows - maxVisibleRows) * rowHeight);
  
  return (
    <div
      ref={containerRef}
      className={`excel-like-scroll-container ${className}`}
      style={{
        height: `${containerHeight}px`,
        maxHeight: `${containerHeight}px`,
        overflowY: 'scroll',
        overflowX: 'auto',
        position: 'relative',
        ...style
      }}
    >
      {/* A spacer to ensure proper scroll height */}
      <div
        style={{
          height: `${Math.max(containerHeight, totalRows * rowHeight + headerHeight)}px`,
          position: 'relative'
        }}
      >
        {/* Position the table with transforms to avoid repaints */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            transform: `translateY(${scrollTop}px)`
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

ScrollableContainer.propTypes = {
  children: PropTypes.node.isRequired,
  rowHeight: PropTypes.number,
  headerHeight: PropTypes.number,
  maxVisibleRows: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object
};

export default ScrollableContainer;