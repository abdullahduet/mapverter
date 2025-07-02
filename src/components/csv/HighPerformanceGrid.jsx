import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';
import LoadingScreen from '../common/LoadingScreen';

/**
 * HighPerformanceGrid - An Excel-like data grid with virtualization and frozen panes
 * 
 * Features:
 * - Virtualized rendering for handling large datasets
 * - Excel-like frozen panes (header row and first column)
 * - Cell selection and multi-selection
 * - Keyboard navigation
 * - Context menu
 * - Copy/paste support
 * - Optimized scroll performance
 */

// Throttle function to limit how often a function can be called
const throttle = (func, limit) => {
  let inThrottle;
  let lastFunc;
  let lastRan;
  
  return function(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

// Debounce function for expensive operations
const debounce = (func, wait) => {
  let timeout;
  
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
};

const HighPerformanceGrid = ({
  data,
  headers,
  onDataChange,
  onHeaderChange,
  selectedCells = [],
  onCellSelect,
  maxHeight = '600px',
  highlightedCell = null,
  setHighlightedCell
}) => {
  // State variables
  const [editingCell, setEditingCell] = useState(null);
  const [editingHeader, setEditingHeader] = useState(null);
  const [cellValue, setCellValue] = useState('');
  const [headerValue, setHeaderValue] = useState('');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuTarget, setContextMenuTarget] = useState(null);
  const [visibleRowsRange, setVisibleRowsRange] = useState({ start: 0, end: 50 });
  const [visibleColsRange, setVisibleColsRange] = useState({ start: 0, end: 20 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [lastSelectedCell, setLastSelectedCell] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [lastSelectedRow, setLastSelectedRow] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [lastSelectedColumn, setLastSelectedColumn] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTextWrapping, setIsTextWrapping] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isScrolling, setIsScrolling] = useState(false);

  // Refs
  const gridContainerRef = useRef(null);
  const contentRef = useRef(null);
  const headerRowRef = useRef(null);
  const leftColumnRef = useRef(null);
  const cornerCellRef = useRef(null);
  const inputRef = useRef(null);
  const headerInputRef = useRef(null);
  const cellRefs = useRef({});
  const isUpdatingCells = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const isHandlingScroll = useRef(false);
  const prevScrollTopRef = useRef(0);
  const prevScrollLeftRef = useRef(0);
  const visibleRowsRangeRef = useRef({ start: 0, end: 50 });
  const visibleColsRangeRef = useRef({ start: 0, end: 20 });
  const resizeObserverRef = useRef(null);
  const forceUpdateTimeoutRef = useRef(null);

  // Constants for dimensions - using useMemo to prevent recalculations
  const GRID_DIMENSIONS = useMemo(() => ({
    ROW_HEIGHT: 26, // Google Sheets-like row height
    ROW_HEADER_WIDTH: 50, // Width for row number column
    COLUMN_WIDTH: 120, // Default column width
    HEADER_HEIGHT: 26, // Header row height
    ROWS_BUFFER: 30, // Number of rows to render before/after visible area
    COLS_BUFFER: 10, // Number of columns to render before/after visible area
    FROZEN_ROWS: 1, // Number of frozen rows (header)
    FROZEN_COLS: 1  // Number of frozen columns (row numbers)
  }), []);

  // Destructure for easier access
  const {
    ROW_HEIGHT,
    ROW_HEADER_WIDTH,
    COLUMN_WIDTH,
    HEADER_HEIGHT,
    ROWS_BUFFER,
    COLS_BUFFER,
    FROZEN_ROWS,
    FROZEN_COLS
  } = GRID_DIMENSIONS;

  // Calculate total content width and height
  const totalWidth = useMemo(() => 
    ROW_HEADER_WIDTH + (headers.length * COLUMN_WIDTH), 
    [ROW_HEADER_WIDTH, headers.length, COLUMN_WIDTH]
  );

  const totalHeight = useMemo(() => 
    HEADER_HEIGHT + (data.length * ROW_HEIGHT), 
    [HEADER_HEIGHT, data.length, ROW_HEIGHT]
  );

  // Initialize container dimensions on first render
  useEffect(() => {
    const updateContainerSize = () => {
      if (gridContainerRef.current) {
        const { clientWidth, clientHeight } = gridContainerRef.current;
        setContainerSize({ width: clientWidth, height: clientHeight });
      }
    };

    updateContainerSize();

    // Setup ResizeObserver for container size changes
    if (!resizeObserverRef.current && gridContainerRef.current) {
      resizeObserverRef.current = new ResizeObserver(debounce(updateContainerSize, 100));
      resizeObserverRef.current.observe(gridContainerRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, []);

  // Update visible rows and columns based on container size and data changes
  // useEffect(() => {
  //   if (containerSize.width === 0 || containerSize.height === 0) return;

  //   // Calculate visible ranges based on container size
  //   const visibleRows = Math.ceil((containerSize.height - HEADER_HEIGHT) / ROW_HEIGHT) + ROWS_BUFFER * 2;
  //   const endRow = Math.min(data.length, visibleRows);
    
  //   const visibleCols = Math.ceil((containerSize.width - ROW_HEADER_WIDTH) / COLUMN_WIDTH) + COLS_BUFFER * 2;
  //   const endCol = Math.min(headers.length, visibleCols);

  //   // Only update if necessary
  //   if (visibleRowsRange.end !== endRow) {
  //     setVisibleRowsRange(prev => ({ start: prev.start, end: endRow }));
  //     visibleRowsRangeRef.current = { start: visibleRowsRange.start, end: endRow };
  //   }

  //   if (visibleColsRange.end !== endCol) {
  //     setVisibleColsRange(prev => ({ start: prev.start, end: endCol }));
  //     visibleColsRangeRef.current = { start: visibleColsRange.start, end: endCol };
  //   }
  // }, [
  //   containerSize, 
  //   data.length, 
  //   headers.length,
  //   ROW_HEIGHT,
  //   COLUMN_WIDTH,
  //   HEADER_HEIGHT,
  //   ROW_HEADER_WIDTH,
  //   ROWS_BUFFER,
  //   COLS_BUFFER,
  //   visibleRowsRange.end,
  //   visibleColsRange.end
  // ]);

  // Calculate visible rows and columns based on scroll position
  // const calculateVisibleRange = useCallback((scrollTop, scrollLeft) => {
  //   // if (isHandlingScroll.current) return null;

  //   // Calculate row range
  //   const startRow = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - ROWS_BUFFER);
  //   const visibleRows = Math.ceil((containerSize.height) / ROW_HEIGHT) + ROWS_BUFFER * 2;
  //   const endRow = Math.min(data.length, startRow + visibleRows);

  //   // Calculate column range 57, 140; 58, 141;
  //   const startCol = Math.max(0, Math.floor(scrollLeft / COLUMN_WIDTH) - COLS_BUFFER);
  //   const visibleCols = Math.ceil((containerSize.width) / COLUMN_WIDTH) + COLS_BUFFER * 2;
  //   const endCol = Math.min(headers.length, startCol + visibleCols);

  //   return {
  //     rows: { start: startRow, end: endRow },
  //     cols: { start: startCol, end: endCol }
  //   };
  // }, [
  //   ROW_HEIGHT,
  //   COLUMN_WIDTH,
  //   ROWS_BUFFER,
  //   COLS_BUFFER,
  //   containerSize,
  //   data.length,
  //   headers.length
  // ]);

  // Handle scroll events
  const handleScroll = useCallback((e) => {
    console.log('handleScroll called: isHandlingScroll.current: ', isHandlingScroll.current);
    if (isHandlingScroll.current) return;
    isHandlingScroll.current = true;

    try {
      const target = e.target;
      const scrollTop = target.scrollTop;
      const scrollLeft = target.scrollLeft;

      // Synchronize header row with horizontal scroll
      // if (headerRowRef.current) {
      //   headerRowRef.current.style.transform = `translateX(-${scrollLeft}px)`;
      // }

      // Synchronize left column with vertical scroll
      // if (leftColumnRef.current) {
      //   leftColumnRef.current.style.transform = `translateY(-${scrollTop}px)`;
      // }

      // Prevent rapid re-renders during scroll by using throttling
      // const newRanges = calculateVisibleRange(scrollTop, scrollLeft);
      // Calculate row range
      const startRow = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - ROWS_BUFFER);
      const visibleRows = Math.ceil((containerSize.height) / ROW_HEIGHT) + ROWS_BUFFER * 2;
      const endRow = Math.min(data.length, startRow + visibleRows);

      // Calculate column range 57, 140; 58, 141;
      const startCol = Math.max(0, Math.floor(scrollLeft / COLUMN_WIDTH) - COLS_BUFFER);
      const visibleCols = Math.ceil((containerSize.width) / COLUMN_WIDTH) + COLS_BUFFER * 2;
      const endCol = Math.min(headers.length, startCol + visibleCols);
      // if (!newRanges) return;

      // const { rows, cols } = newRanges;

      // Only update if ranges have changed significantly
      const rowNearDataStart = startRow < ROWS_BUFFER && startRow < visibleRowsRangeRef.current.start;
      const rowNearDataEnd = endRow === data.length && endRow > visibleRowsRangeRef.current.end;
      const rowRangeChanged = rowNearDataStart || rowNearDataEnd || Math.abs(startRow - visibleRowsRangeRef.current.start) > 30 || Math.abs(endRow - visibleRowsRangeRef.current.end) > 30;
        // rows.start < visibleRowsRangeRef.current.start || 
        // rows.end > visibleRowsRangeRef.current.end;
        
      const colRangeChanged = 
      startCol !== visibleColsRangeRef.current.start || 
      endCol !== visibleColsRangeRef.current.end;

      console.log('handleScroll called: rowRangeChanged: ', rowRangeChanged, ', visibleRowsRange: ', visibleRowsRange, ', visibleRowsRangeRef: ', visibleRowsRangeRef.current, ', startRow: ', startRow, ', endRow: ', endRow, ', ', Math.abs(startRow - visibleRowsRangeRef.current.start), Math.abs(endRow - visibleRowsRangeRef.current.end));
      // Update the ref immediately to avoid lag
      if (rowRangeChanged) {
        visibleRowsRangeRef.current = { start: startRow, end: endRow };
      }

      if (colRangeChanged) {
        visibleColsRangeRef.current = { start: startCol, end: endCol };
      }

      
      // Batch state updates for better performance
      if (rowRangeChanged || colRangeChanged) {
        // Delay the state update slightly to avoid scroll jank
        clearTimeout(forceUpdateTimeoutRef.current);
        forceUpdateTimeoutRef.current = setTimeout(() => {
          if (rowRangeChanged) {
            // console.log('handleScroll called: rowRangeChanged: ', rowRangeChanged);
            setVisibleRowsRange({ start: startRow, end: endRow });
          }
          if (colRangeChanged) {
            // console.log('handleScroll called: colRangeChanged: ', colRangeChanged);
            setVisibleColsRange({ start: startCol, end: endCol });
          }
        }, 16); // ~1 frame at 60fps
      }

      // Update scroll start/end indicators
      const isAtBottom = scrollTop + containerSize.height >= totalHeight - 10;
      const isAtTop = scrollTop <= 10;
      const isAtLeft = scrollLeft <= 10;
      const isAtRight = scrollLeft + containerSize.width >= totalWidth - 10;

      // Track scrolling state
      if (!isScrolling) {
        setIsScrolling(true);
      }

      // Set timeout to detect when scrolling stops
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      // Store previous scroll position
      prevScrollTopRef.current = scrollTop;
      prevScrollLeftRef.current = scrollLeft;

    } finally {
      isHandlingScroll.current = false;
    }
  }, [
    ROW_HEIGHT,
    COLUMN_WIDTH,
    ROWS_BUFFER,
    COLS_BUFFER,
    containerSize,
    totalHeight,
    totalWidth,
    visibleRowsRangeRef,
    visibleColsRangeRef,
    isScrolling,
    data.length,
    headers.length,
  ]);

  // Throttle scroll handler to improve performance
  const throttledHandleScroll = useMemo(
    () => throttle(handleScroll, 16),
    [handleScroll]
  );

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  useEffect(() => {
    if (editingHeader && headerInputRef.current) {
      headerInputRef.current.focus();
      headerInputRef.current.select();
    }
  }, [editingHeader]);

  // Scroll to highlighted cell
  useEffect(() => {
    if (!highlightedCell || !contentRef.current) return;

    const { rowIndex, colIndex } = highlightedCell;
    
    // Calculate position of the highlighted cell
    const cellTop = rowIndex * ROW_HEIGHT;
    const cellLeft = colIndex * COLUMN_WIDTH;
    
    // Get current scroll position and container dimensions
    const { scrollTop, scrollLeft, clientHeight, clientWidth } = contentRef.current;
    
    // Determine if the cell is outside the visible area
    const isCellAbove = cellTop < scrollTop + HEADER_HEIGHT;
    const isCellBelow = cellTop + ROW_HEIGHT > scrollTop + clientHeight;
    const isCellLeft = cellLeft < scrollLeft + ROW_HEADER_WIDTH;
    const isCellRight = cellLeft + COLUMN_WIDTH > scrollLeft + clientWidth;
    
    // Scroll to make the cell visible
    if (isCellAbove || isCellBelow || isCellLeft || isCellRight) {
      // Determine scroll position
      let newScrollTop = scrollTop;
      let newScrollLeft = scrollLeft;
      
      if (isCellAbove) {
        newScrollTop = cellTop - HEADER_HEIGHT;
      } else if (isCellBelow) {
        newScrollTop = cellTop - clientHeight + ROW_HEIGHT;
      }
      
      if (isCellLeft) {
        newScrollLeft = cellLeft - ROW_HEADER_WIDTH;
      } else if (isCellRight) {
        newScrollLeft = cellLeft - clientWidth + COLUMN_WIDTH;
      }
      
      // Scroll to position
      contentRef.current.scrollTo({
        top: newScrollTop,
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
    
    // Highlight the cell
    const cellKey = `cell-${rowIndex}-${colIndex}`;
    if (cellRefs.current[cellKey]) {
      cellRefs.current[cellKey].classList.add('pulse');
      setTimeout(() => {
        if (cellRefs.current[cellKey]) {
          cellRefs.current[cellKey].classList.remove('pulse');
        }
      }, 1000);
    }
  }, [highlightedCell, ROW_HEIGHT, COLUMN_WIDTH, HEADER_HEIGHT, ROW_HEADER_WIDTH]);

  // Handle click outside to cancel editing and selection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if ((editingCell || editingHeader) && 
          gridContainerRef.current && 
          !gridContainerRef.current.contains(event.target)) {
        finishEditing();
      }

      if (showContextMenu && event.button !== 2) {
        setShowContextMenu(false);
      }
    };

    // Global mouseup listener to end selection
    const handleMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [editingCell, editingHeader, showContextMenu, isSelecting]);

  // Add this effect to synchronize cell selection with row/column selection
  useEffect(() => {
    // Use a ref to track if we're inside this effect to prevent potential infinite loops
    if (isUpdatingCells.current) return;
    isUpdatingCells.current = true;

    try {
      if (selectedCells.length > 0) {
        // Extract unique row and column indices from cell selection
        const rows = [...new Set(selectedCells.map(cell => cell.rowIndex))].sort((a, b) => a - b);
        const cols = [...new Set(selectedCells.map(cell => cell.colIndex))].sort((a, b) => a - b);

        // Create stable string representations for comparison
        const rowsToSelect = rows.filter(rowIndex =>
          selectedCells.filter(cell => cell.rowIndex === rowIndex).length === headers.length
        );

        const columnsToSelect = cols.filter(colIndex =>
          selectedCells.filter(cell => cell.colIndex === colIndex).length === data.length
        );

        const currentRowsString = JSON.stringify([...selectedRows].sort());
        const newRowsString = JSON.stringify([...rowsToSelect].sort());

        const currentColumnsString = JSON.stringify([...selectedColumns].sort());
        const newColumnsString = JSON.stringify([...columnsToSelect].sort());

        // Only update if there's an actual change
        if (currentRowsString !== newRowsString) {
          setSelectedRows(rowsToSelect);
        }

        if (currentColumnsString !== newColumnsString) {
          setSelectedColumns(columnsToSelect);
        }
      } else if (selectedRows.length > 0 || selectedColumns.length > 0) {
        // Clear selections only if they're not already empty
        if (selectedRows.length > 0) setSelectedRows([]);
        if (selectedColumns.length > 0) setSelectedColumns([]);
      }
    } finally {
      // Reset the update flag
      isUpdatingCells.current = false;
    }
  }, [selectedCells, headers.length, data.length]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clear any pending timeouts
      clearTimeout(scrollTimeoutRef.current);
      clearTimeout(forceUpdateTimeoutRef.current);
      
      // Disconnect resize observer
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // Start editing a cell on double click
  const startEditing = (rowIndex, colIndex) => {
    setEditingCell({ rowIndex, colIndex });
    setCellValue(data[rowIndex]?.[colIndex] || '');
  };

  // Start editing a header
  const startEditingHeader = (index) => {
    setEditingHeader(index);
    setHeaderValue(headers[index] || '');
  };

  // Finish editing and save changes
  const finishEditing = () => {
    if (editingCell) {
      const { rowIndex, colIndex } = editingCell;
      const newData = [...data];

      if (!newData[rowIndex]) {
        newData[rowIndex] = new Array(headers.length).fill('');
      }

      newData[rowIndex][colIndex] = cellValue;
      onDataChange(newData);
      setEditingCell(null);
    }

    if (editingHeader) {
      const newHeaders = [...headers];
      newHeaders[editingHeader] = headerValue;
      onHeaderChange(newHeaders);
      setEditingHeader(null);
    }
  };

  // Handle cell value change
  const handleCellChange = (e) => {
    setCellValue(e.target.value);
  };

  // Handle header value change
  const handleHeaderChange = (e) => {
    setHeaderValue(e.target.value);
  };

  // Handle key press in editable cells
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditingHeader(null);
    } else if (e.key === 'Tab') {
      if (editingCell) {
        e.preventDefault();
        const { rowIndex, colIndex } = editingCell;
        finishEditing();

        // Move to next cell or next row first cell
        if (colIndex < headers.length - 1) {
          startEditing(rowIndex, colIndex + 1);
        } else if (rowIndex < data.length - 1) {
          startEditing(rowIndex + 1, 0);
        }
      }
    }
  };

  // Navigate cells with arrow keys
  const handleKeyDown = (e, rowIndex, colIndex) => {
    if (editingCell) return; // Don't navigate while editing

    switch (e.key) {
      case 'ArrowUp':
        if (rowIndex > 0) {
          e.preventDefault();
          onCellSelect([{ rowIndex: rowIndex - 1, colIndex }]);
        }
        break;
      case 'ArrowDown':
        if (rowIndex < data.length - 1) {
          e.preventDefault();
          onCellSelect([{ rowIndex: rowIndex + 1, colIndex }]);
        }
        break;
      case 'ArrowLeft':
        if (colIndex > 0) {
          e.preventDefault();
          onCellSelect([{ rowIndex, colIndex: colIndex - 1 }]);
        }
        break;
      case 'ArrowRight':
        if (colIndex < headers.length - 1) {
          e.preventDefault();
          onCellSelect([{ rowIndex, colIndex: colIndex + 1 }]);
          setLastSelectedCell({ rowIndex, colIndex: colIndex + 1 });
        }
        break;
      case 'Enter':
        e.preventDefault();
        startEditing(rowIndex, colIndex);
        break;
      default:
        break;
    }
  };

  // Check if a cell is currently selected - memoized for performance
  const isCellSelected = useCallback((rowIndex, colIndex) => {
    return selectedCells.some(
      cell => cell.rowIndex === rowIndex && cell.colIndex === colIndex
    );
  }, [selectedCells]);

  // Start cell selection process on mouse down
  const handleCellMouseDown = (rowIndex, colIndex, e) => {
    e.stopPropagation();
    setShowContextMenu(false);

    // Don't handle right-clicks here
    if (e.button === 2 || e.detail === 2) return;
    if (editingCell && editingCell.rowIndex === rowIndex && editingCell.colIndex === colIndex) {
      return;
    } else if (editingCell && (editingCell.rowIndex !== rowIndex || editingCell.colIndex !== colIndex)) {
      finishEditing();
    }

    // Handle selection based on modifiers
    if (e.ctrlKey || e.metaKey) {
      // Toggle individual cell with Ctrl/Cmd key
      const cellExists = selectedCells.some(
        cell => cell.rowIndex === rowIndex && cell.colIndex === colIndex
      );

      if (cellExists) {
        // Remove from selection if already selected
        onCellSelect(
          selectedCells.filter(
            cell => !(cell.rowIndex === rowIndex && cell.colIndex === colIndex)
          )
        );
      } else {
        // Add to selection
        onCellSelect([...selectedCells, { rowIndex, colIndex }]);
      }
      setLastSelectedCell({ rowIndex, colIndex });
    } else if (e.shiftKey && lastSelectedCell) {
      // Range selection with Shift key from last selection to this cell
      const startRow = Math.min(lastSelectedCell.rowIndex, rowIndex);
      const endRow = Math.max(lastSelectedCell.rowIndex, rowIndex);
      const startCol = Math.min(lastSelectedCell.colIndex, colIndex);
      const endCol = Math.max(lastSelectedCell.colIndex, colIndex);

      // Limit the size of the selection to prevent performance issues
      const selectionSize = (endRow - startRow + 1) * (endCol - startCol + 1);
      if (selectionSize > 5000) {
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 100);
      }
      const newSelection = [];
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          newSelection.push({ rowIndex: r, colIndex: c });
        }
      }

      onCellSelect(newSelection);
    } else {
      // Start a new selection
      setIsSelecting(true);
      setSelectionStart({ rowIndex, colIndex });
      setLastSelectedCell({ rowIndex, colIndex });
      onCellSelect([{ rowIndex, colIndex }]);
    }
  };

  // Handle cell mouse enter during drag selection
  const handleCellMouseEnter = useCallback(
    throttle((rowIndex, colIndex) => {
      if (isSelecting && selectionStart) {
        // Create a range selection from start to current
        const startRow = Math.min(selectionStart.rowIndex, rowIndex);
        const endRow = Math.max(selectionStart.rowIndex, rowIndex);
        const startCol = Math.min(selectionStart.colIndex, colIndex);
        const endCol = Math.max(selectionStart.colIndex, colIndex);

        // Limit the size of the selection to prevent performance issues
        const selectionSize = (endRow - startRow + 1) * (endCol - startCol + 1);
        if (selectionSize > 5000) {
          setIsProcessing(true);
          setTimeout(() => setIsProcessing(false), 100);
        }
        const newSelection = [];
        for (let r = startRow; r <= endRow; r++) {
          for (let c = startCol; c <= endCol; c++) {
            newSelection.push({ rowIndex: r, colIndex: c });
          }
        }

        onCellSelect(newSelection);
        setLastSelectedCell({ rowIndex, colIndex });
      }
    }, 50),
    [isSelecting, selectionStart, onCellSelect]
  );

  // Handle mouse up to end selection
  const handleCellMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
      setSelectionStart(null);
    }
  };

  // Handle double click to edit
  const handleCellDoubleClick = (rowIndex, colIndex) => {
    if (selectedCells.length === 0) {
      setLastSelectedCell({ rowIndex, colIndex });
      onCellSelect([{ rowIndex, colIndex }]);
    }
    startEditing(rowIndex, colIndex);
  };

  // Handle row selection by clicking row header
  const handleRowClick = (rowIndex, e) => {
    e.preventDefault();
    let newSelectedRows;

    // Handle multi-select with modifier keys
    if (e.ctrlKey || e.metaKey) {
      // Toggle this row in selection
      if (selectedRows.includes(rowIndex)) {
        newSelectedRows = selectedRows.filter(index => index !== rowIndex);
      } else {
        newSelectedRows = [...selectedRows, rowIndex];
      }
      setLastSelectedRow(rowIndex);
    } else if (e.shiftKey && lastSelectedRow !== null) {
      // Range selection from last selected row to current row
      const start = Math.min(lastSelectedRow, rowIndex);
      const end = Math.max(lastSelectedRow, rowIndex);

      // Create array of all row indices in the range
      newSelectedRows = Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      );
    } else {
      // Simple single row selection
      newSelectedRows = [rowIndex];
      setLastSelectedRow(rowIndex);
    }

    setSelectedRows(newSelectedRows);

    // Convert row selection to cell selection for the table
    const cellSelection = [];
    newSelectedRows.forEach(row => {
      for (let col = 0; col < headers.length; col++) {
        cellSelection.push({ rowIndex: row, colIndex: col });
      }
    });

    onCellSelect(cellSelection);
  };

  // Column selection handler
  const handleColumnHeaderClick = (colIndex, e) => {
    e.preventDefault();

    // Handle multi-select with modifier keys
    let newSelectedColumns;
    if (e.detail === 2) {
      startEditingHeader(colIndex);
      return;
    } else if (e.ctrlKey || e.metaKey) {
      // Toggle this column in selection
      if (selectedColumns.includes(colIndex)) {
        newSelectedColumns = selectedColumns.filter(index => index !== colIndex);
      } else {
        newSelectedColumns = [...selectedColumns, colIndex];
      }
      setLastSelectedColumn(colIndex);
    } else if (e.shiftKey && lastSelectedColumn !== null) {
      // Range selection from last selected column to current column
      const start = Math.min(lastSelectedColumn, colIndex);
      const end = Math.max(lastSelectedColumn, colIndex);

      // Create array of all column indices in the range
      newSelectedColumns = Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      );
    } else {
      // Simple single column selection
      newSelectedColumns = [colIndex];
      setLastSelectedColumn(colIndex);
    }
    setSelectedColumns(newSelectedColumns);

    // Convert column selection to cell selection for the table
    const cellSelection = [];
    newSelectedColumns.forEach(col => {
      for (let row = 0; row < data.length; row++) {
        cellSelection.push({ rowIndex: row, colIndex: col });
      }
    });

    onCellSelect(cellSelection);
  };

  // Handle select all table by clicking top-left '#' cell
  const handleSelectAllClick = (e) => {
    e.preventDefault();

    // Create selection of all cells
    const allCells = [];
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      for (let colIndex = 0; colIndex < headers.length; colIndex++) {
        allCells.push({ rowIndex, colIndex });
      }
    }
    onCellSelect(allCells);
    setLastSelectedCell({ rowIndex: 0, colIndex: 0 });
  };

  // Handle context menu
  const handleContextMenu = (e, rowIndex, colIndex) => {
    e.preventDefault();

    // If right-clicking on an unselected cell, select it first
    if (!isCellSelected(rowIndex, colIndex)) {
      onCellSelect([{ rowIndex, colIndex }]);
      setLastSelectedCell({ rowIndex, colIndex });
    }

    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuTarget({ rowIndex, colIndex });
    setShowContextMenu(true);
  };

  // Context menu actions
  const handleContextMenuAction = (action) => {
    setShowContextMenu(false);

    switch (action) {
      case 'copy':
        handleCopy();
        break;
      case 'paste':
        handlePaste();
        break;
      case 'delete':
        handleDelete();
        break;
      case 'uppercase':
        handleTransform('uppercase');
        break;
      case 'lowercase':
        handleTransform('lowercase');
        break;
      case 'toggleWrap':
        setIsTextWrapping(!isTextWrapping);
        break;
      default:
        break;
    }
  };

  // Copy selected cells
  const handleCopy = () => {
    if (selectedCells.length === 0) return;

    // Create a table structure for clipboard
    const minRow = Math.min(...selectedCells.map(c => c.rowIndex));
    const maxRow = Math.max(...selectedCells.map(c => c.rowIndex));
    const minCol = Math.min(...selectedCells.map(c => c.colIndex));
    const maxCol = Math.max(...selectedCells.map(c => c.colIndex));

    let clipboardText = '';

    for (let r = minRow; r <= maxRow; r++) {
      const rowValues = [];
      for (let c = minCol; c <= maxCol; c++) {
        // Check if this cell is in selection
        const isSelected = selectedCells.some(
          cell => cell.rowIndex === r && cell.colIndex === c
        );

        if (isSelected && data[r] && data[r][c] !== undefined) {
          rowValues.push(data[r][c]);
        } else {
          rowValues.push('');
        }
      }

      clipboardText += rowValues.join('\t') + '\n';
    }

    navigator.clipboard.writeText(clipboardText).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  // Paste into table
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || selectedCells.length === 0) return;

      // Show processing indicator for large pastes
      const rowCount = text.split(/\r?\n/).length;
      const isLargePaste = rowCount > 100;

      if (isLargePaste) {
        setIsProcessing(true);
      }

      // Use setTimeout to allow UI to update with loading state
      setTimeout(async () => {
        try {
          // Starting cell for paste
          const startRow = Math.min(...selectedCells.map(c => c.rowIndex));
          const startCol = Math.min(...selectedCells.map(c => c.colIndex));

          // Parse clipboard data (tab or comma separated)
          const rows = text.split(/\r?\n/).filter(row => row.trim());
          let parsedRows = rows.map(row => {
            // Try to detect if it's tab or comma separated
            if (row.includes('\t')) {
              return row.split('\t');
            } else {
              return row.split(',');
            }
          });

          // Create a copy of the current data
          const newData = [...data];

          // Ensure all rows exist
          while (newData.length < startRow + parsedRows.length) {
            newData.push(new Array(headers.length).fill(''));
          }

          // Paste data starting from selected cell
          parsedRows.forEach((rowData, rowOffset) => {
            rowData.forEach((cellValue, colOffset) => {
              const targetRow = startRow + rowOffset;
              const targetCol = startCol + colOffset;

              // Skip if column is outside range
              if (targetCol >= headers.length) return;

              // Insert value
              if (!newData[targetRow]) {
                newData[targetRow] = new Array(headers.length).fill('');
              }

              newData[targetRow][targetCol] = cellValue;
            });
          });

          // Update data
          onDataChange(newData);

          // Select the pasted region
          const pastedSelection = [];
          for (let r = startRow; r < startRow + parsedRows.length; r++) {
            for (let c = startCol; c < startCol + (parsedRows[0]?.length || 0); c++) {
              if (c < headers.length) {
                pastedSelection.push({ rowIndex: r, colIndex: c });
              }
            }
          }
          onCellSelect(pastedSelection);
        } finally {
          if (isLargePaste) {
            setIsProcessing(false);
          }
        }
      }, 0);

    } catch (err) {
      console.error('Failed to paste: ', err);
      setIsProcessing(false);
    }
  };

  // Delete selected cells
  const handleDelete = () => {
    if (selectedCells.length === 0) return;

    // Show processing indicator for large deletes
    const isLargeDelete = selectedCells.length > 1000;

    if (isLargeDelete) {
      setIsProcessing(true);
    }

    // Use setTimeout to allow UI to update with loading state
    setTimeout(() => {
      try {
        const newData = [...data];

        selectedCells.forEach(({ rowIndex, colIndex }) => {
          if (newData[rowIndex] && colIndex < headers.length) {
            newData[rowIndex][colIndex] = '';
          }
        });

        onDataChange(newData);
      } finally {
        if (isLargeDelete) {
          setIsProcessing(false);
        }
      }
    }, 0);
  };

  // Transform text in selected cells
  const handleTransform = (type) => {
    if (selectedCells.length === 0) return;

    // Show processing indicator for large transformations
    const isLargeOperation = selectedCells.length > 1000;

    if (isLargeOperation) {
      setIsProcessing(true);
    }

    // Use setTimeout to allow UI to update with loading state
    setTimeout(() => {
      try {
        const newData = [...data];

        selectedCells.forEach(({ rowIndex, colIndex }) => {
          if (newData[rowIndex] && newData[rowIndex][colIndex] !== undefined) {
            const currentValue = String(newData[rowIndex][colIndex]);

            if (type === 'uppercase') {
              newData[rowIndex][colIndex] = currentValue.toUpperCase();
            } else if (type === 'lowercase') {
              newData[rowIndex][colIndex] = currentValue.toLowerCase();
            }
          }
        });

        onDataChange(newData);
      } finally {
        if (isLargeOperation) {
          setIsProcessing(false);
        }
      }
    }, 0);
  };

  // Add a new row
  const addRow = () => {
    const newData = [...data];
    const newRow = new Array(headers.length).fill('');
    newData.push(newRow);
    onDataChange(newData);
  };

  // Add a new column
  const addColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    onHeaderChange(newHeaders);

    const newData = data.map(row => {
      const newRow = [...row];
      newRow.push('');
      return newRow;
    });

    onDataChange(newData);
  };

  // Check if a cell is highlighted (for find/replace)
  const isCellHighlighted = useCallback((rowIndex, colIndex) => {
    return highlightedCell &&
      highlightedCell.rowIndex === rowIndex &&
      highlightedCell.colIndex === colIndex;
  }, [highlightedCell]);

  // Set a cell reference
  const setCellRef = (rowIndex, colIndex, ref) => {
    const key = `cell-${rowIndex}-${colIndex}`;
    cellRefs.current[key] = ref;
  };

  // Memoized cell renderer to prevent unnecessary re-renders
  const renderCell = useCallback((rowIndex, colIndex) => {
    const isEditing =
      editingCell &&
      editingCell.rowIndex === rowIndex &&
      editingCell.colIndex === colIndex;

    if (isEditing) {
      return (
        <textarea
          ref={inputRef}
          value={cellValue}
          onChange={handleCellChange}
          onKeyDown={handleKeyPress}
          onBlur={finishEditing}
          className="cell-editor"
          autoFocus
        />
      );
    }

    // Safely access cell data with proper null checks
    const cellContent = data[rowIndex] && data[rowIndex][colIndex] !== undefined
      ? data[rowIndex][colIndex]
      : '';

    return (
      <div className={`cell-content ${isTextWrapping ? 'wrap' : ''}`}>
        {cellContent}
      </div>
    );
  }, [editingCell, cellValue, handleCellChange, handleKeyPress, finishEditing, isTextWrapping, data]);

  // Render header content
  const renderHeader = (index) => {
    const isEditing = editingHeader === index;

    if (isEditing) {
      return (
        <input
          ref={headerInputRef}
          type="text"
          value={headerValue}
          onChange={handleHeaderChange}
          onKeyDown={handleKeyPress}
          onBlur={finishEditing}
          className="cell-editor"
          autoFocus
        />
      );
    }

    return headers[index];
  };

  // Calculate top and left spacer dimensions
  const topSpacerHeight = visibleRowsRange.start * ROW_HEIGHT;
  const bottomSpacerHeight = Math.max(0, (data.length - visibleRowsRange.end) * ROW_HEIGHT);
  const leftSpacerWidth = visibleColsRange.start * COLUMN_WIDTH;
  const rightSpacerWidth = Math.max(0, (headers.length - visibleColsRange.end) * COLUMN_WIDTH);

  // Render visible cells
  const renderVisibleRows = () => {
    const rows = [];
    console.log('[renderVisibleRows] visibleRowsRange: ', visibleRowsRange, ', visibleRowsRangeRef: ', visibleRowsRangeRef.current);
    // console.log('[renderVisibleRows] visibleColsRange: ', visibleColsRange);
    // Add top spacer if needed
    if (visibleRowsRange.start > 0) {
      rows.push(
        <tr key="top-spacer" className="spacer-row">
          <td 
            colSpan={headers.length + 1} 
            style={{ 
              height: topSpacerHeight,
              padding: 0,
              border: 'none'
            }}
          />
        </tr>
      );
    }

    // console.log('[renderVisibleRows] visibleRowsRange: ', visibleRowsRange, ', data.length: ', data.length);
    // console.log('[renderVisibleRows] visibleColsRange: ', visibleColsRange, ', headers.length: ', headers.length);
    // Render visible rows
    for (let rowIndex = visibleRowsRange.start; rowIndex < visibleRowsRange.end && rowIndex < data.length; rowIndex++) {
      const cells = [];
      
      // Add row header (frozen column)
      cells.push(
        <td
          key={`row-header-${rowIndex}`}
          className={`spreadsheet-row-header ${selectedRows.includes(rowIndex) ? 'selected' : ''}`}
          onClick={(e) => handleRowClick(rowIndex, e)}
        >
          {rowIndex + 1}
        </td>
      );
      
      // Add left spacer if needed
      if (visibleColsRange.start > 0) {
        cells.push(
          <td
            key={`left-spacer-${rowIndex}`}
            style={{
              width: leftSpacerWidth,
              padding: 0,
              border: 'none'
            }}
          />
        );
      }
      
      // Add visible cells
      for (let colIndex = visibleColsRange.start; colIndex < visibleColsRange.end && colIndex < headers.length; colIndex++) {
        const isSelected = isCellSelected(rowIndex, colIndex);
        const isHighlighted = isCellHighlighted(rowIndex, colIndex);
        
        cells.push(
          <td
            key={`cell-${rowIndex}-${colIndex}`}
            ref={(ref) => setCellRef(rowIndex, colIndex, ref)}
            className={`spreadsheet-data-cell ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
            onMouseDown={(e) => handleCellMouseDown(rowIndex, colIndex, e)}
            onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
            onMouseUp={handleCellMouseUp}
            onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
            onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
            tabIndex="0"
          >
            {renderCell(rowIndex, colIndex)}
          </td>
        );
      }
      
      // Add right spacer if needed
      if (visibleColsRange.end < headers.length) {
        cells.push(
          <td
            key={`right-spacer-${rowIndex}`}
            style={{
              width: rightSpacerWidth,
              padding: 0,
              border: 'none'
            }}
          />
        );
      }
      
      rows.push(<tr key={`row-${rowIndex}`} className="spreadsheet-row">{cells}</tr>);
    }
    
    // Add bottom spacer if needed
    if (visibleRowsRange.end < data.length) {
      rows.push(
        <tr key="bottom-spacer" className="spacer-row">
          <td 
            colSpan={headers.length + 1} 
            style={{ 
              height: bottomSpacerHeight,
              padding: 0,
              border: 'none'
            }}
          />
        </tr>
      );
    }
    
    return rows;
  };

  // Render header row
  const renderHeaderRow = () => {
    const cells = [];
    
    // Add corner cell
    cells.push(
      <th
        key="corner-cell"
        ref={cornerCellRef}
        className="spreadsheet-corner-cell"
        onClick={(e) => handleSelectAllClick(e)}
      >
        #
      </th>
    );
    
    // Add left spacer if needed
    if (visibleColsRange.start > 0) {
      cells.push(
        <th
          key="header-left-spacer"
          style={{
            width: leftSpacerWidth,
            padding: 0,
            border: 'none'
          }}
        />
      );
    }
    
    // Add visible header cells
    for (let colIndex = visibleColsRange.start; colIndex < visibleColsRange.end && colIndex < headers.length; colIndex++) {
      const isColumnSelected = selectedColumns.includes(colIndex);
      
      cells.push(
        <th
          key={`header-${colIndex}`}
          className={`spreadsheet-column-header ${isColumnSelected ? 'selected' : ''}`}
          onClick={(e) => handleColumnHeaderClick(colIndex, e)}
        >
          {renderHeader(colIndex)}
        </th>
      );
    }
    
    // Add right spacer if needed
    if (visibleColsRange.end < headers.length) {
      cells.push(
        <th
          key="header-right-spacer"
          style={{
            width: rightSpacerWidth,
            padding: 0,
            border: 'none'
          }}
        />
      );
    }
    
    return <tr ref={headerRowRef} className="spreadsheet-header">{cells}</tr>;
  };

  return (
    <div className="flex flex-col relative">
      {isProcessing && (
        <div className="loading-overlay">
          <LoadingScreen message="Processing data..." spinnerSize="lg" />
        </div>
      )}
      
      <div className="mb-2 flex justify-between items-center">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={addRow}
            className="mr-2"
          >
            Add Row
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={addColumn}
          >
            Add Column
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTextWrapping(!isTextWrapping)}
            className="ml-2"
          >
            {isTextWrapping ? "Disable Text Wrap" : "Enable Text Wrap"}
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          {selectedCells.length > 0
            ? `${selectedCells.length} cell${selectedCells.length > 1 ? 's' : ''} selected`
            : 'Click to select cell. Double-click to edit. Drag to select multiple cells.'}
        </div>
      </div>

      {/* Main spreadsheet container */}
      <div 
        ref={gridContainerRef}
        className="spreadsheet-container"
        style={{ height: maxHeight }}
      >
        {/* Scrollable content area */}
        <div
          ref={contentRef}
          className="absolute inset-0 overflow-auto overscroll-none"
          onScroll={throttledHandleScroll}
        >
          <table
            className="spreadsheet-table"
            style={{
              width: totalWidth,
              height: totalHeight
            }}
          >
            <thead>
              {renderHeaderRow()}
            </thead>
            <tbody>
              {renderVisibleRows()}
            </tbody>
          </table>
        </div>
        
        {/* Frozen panes border highlights */}
        <div className="frozen-border-horizontal"></div>
        <div className="frozen-border-vertical"></div>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div className="spreadsheet-context-menu">
          <ul>
            <li onClick={() => handleContextMenuAction('copy')}>
              Copy
            </li>
            <li onClick={() => handleContextMenuAction('paste')}>
              Paste
            </li>
            <li onClick={() => handleContextMenuAction('delete')}>
              Delete
            </li>
            <li className="separator"></li>
            <li onClick={() => handleContextMenuAction('uppercase')}>
              To Uppercase
            </li>
            <li onClick={() => handleContextMenuAction('lowercase')}>
              To Lowercase
            </li>
            <li className="separator"></li>
            <li onClick={() => handleContextMenuAction('toggleWrap')}>
              {isTextWrapping ? "Disable Text Wrap" : "Enable Text Wrap"}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

HighPerformanceGrid.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)).isRequired,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDataChange: PropTypes.func.isRequired,
  onHeaderChange: PropTypes.func.isRequired,
  selectedCells: PropTypes.arrayOf(
    PropTypes.shape({
      rowIndex: PropTypes.number.isRequired,
      colIndex: PropTypes.number.isRequired
    })
  ),
  onCellSelect: PropTypes.func.isRequired,
  maxHeight: PropTypes.string,
  highlightedCell: PropTypes.shape({
    rowIndex: PropTypes.number.isRequired,
    colIndex: PropTypes.number.isRequired
  }),
  setHighlightedCell: PropTypes.func
};

export default React.memo(HighPerformanceGrid);