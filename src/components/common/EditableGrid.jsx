import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';
import LoadingScreen from '../common/LoadingScreen';

// Throttle function to limit how often a function can be called
const throttle = (func, limit) => {
  let inThrottle;
  let lastFunc;
  let lastRan;

  return function (...args) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);

      lastFunc = setTimeout(() => {
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

  return function (...args) {
    const context = this;
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
};

const EditableGrid = ({
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
  console.log('Start EditableGrid');
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
  // const prevScrollTopRef = useRef(0);
  // const prevScrollLeftRef = useRef(0);
  const visibleRowsRangeRef = useRef({ start: 0, end: 50 });
  const visibleColsRangeRef = useRef({ start: 0, end: 20 });
  const resizeObserverRef = useRef(null);
  const forceUpdateTimeoutRef = useRef(null);
  const contextMenuRef = useRef(null);

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

  // Handle scroll events
  const handleScroll = useCallback((event) => {

    const scrollTop = event.target.scrollTop;
    const scrollLeft = event.target.scrollLeft;

    // Calculate row range
    const startRow = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - ROWS_BUFFER);
    const visibleRows = Math.ceil((containerSize.height) / ROW_HEIGHT) + ROWS_BUFFER * 2;
    const endRow = Math.min(data.length, startRow + visibleRows);

    // Calculate column range
    const startCol = Math.max(0, Math.floor(scrollLeft / COLUMN_WIDTH) - COLS_BUFFER);
    const visibleCols = Math.ceil((containerSize.width) / COLUMN_WIDTH) + COLS_BUFFER * 2;
    const endCol = Math.min(headers.length, startCol + visibleCols);

    // Only update if ranges have changed significantly
    const rowNearDataStart = startRow < ROWS_BUFFER && startRow < visibleRowsRangeRef.current.start;
    const rowNearDataEnd = endRow === data.length && endRow > visibleRowsRangeRef.current.end;
    const rowRangeChanged = rowNearDataStart || rowNearDataEnd || Math.abs(startRow - visibleRowsRangeRef.current.start) > ROWS_BUFFER || Math.abs(endRow - visibleRowsRangeRef.current.end) > ROWS_BUFFER;

    const colNearHeadersStart = startCol < COLS_BUFFER && startCol < visibleColsRangeRef.current.start;
    const colNearHeadersEnd = endCol === headers.length && endCol > visibleColsRangeRef.current.end;
    const colRangeChanged = colNearHeadersStart || colNearHeadersEnd || Math.abs(startCol - visibleColsRangeRef.current.start) > COLS_BUFFER || Math.abs(endCol - visibleColsRangeRef.current.end) > COLS_BUFFER;

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
          setVisibleRowsRange({ start: startRow, end: endRow });
        }
        if (colRangeChanged) {
          setVisibleColsRange({ start: startCol, end: endCol });
        }
      }, 16); // ~1 frame at 60fps
    }

    // Update scroll start/end indicators
    // const isAtBottom = scrollTop + containerSize.height >= totalHeight - 10;
    // const isAtTop = scrollTop <= 10;
    // const isAtLeft = scrollLeft <= 10;
    // const isAtRight = scrollLeft + containerSize.width >= totalWidth - 10;

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
    // prevScrollTopRef.current = scrollTop;
    // prevScrollLeftRef.current = scrollLeft;

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
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
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
      // contentRef.current.scrollTo({
      //   top: newScrollTop,
      //   left: newScrollLeft,
      //   behavior: 'smooth'
      // });
    }

    // Highlight the cell
    // const cellKey = `cell-${rowIndex}-${colIndex}`;
    // if (cellRefs.current[cellKey]) {
    //   cellRefs.current[cellKey].classList.add('pulse');
    //   setTimeout(() => {
    //     if (cellRefs.current[cellKey]) {
    //       cellRefs.current[cellKey].classList.remove('pulse');
    //     }
    //   }, 1000);
    // }
  }, [highlightedCell, ROW_HEIGHT, COLUMN_WIDTH, HEADER_HEIGHT, ROW_HEADER_WIDTH]);

  // Handle click outside to cancel editing and selection
  useEffect(() => {
    const handleClickOutside = (event) => {
      // gridContainerRef.current && !gridContainerRef.current.contains(event.target)
      if (((editingCell && (cellValue || (inputRef.current && inputRef.current.value))) || (editingHeader && (headerValue || (headerInputRef.current && headerInputRef.current.value))))) {
        finishEditing();
      }

      // Close context menu when clicking anywhere else
      if (showContextMenu && contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
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
    console.log('textarea finishEditing');
    console.log('textarea finishEditing: editingCell: ', editingCell);
    console.log('textarea finishEditing: editingHeader: ', editingHeader);
    console.log('textarea finishEditing: cellValue: ', cellValue);
    console.log('textarea finishEditing: headerValue: ', headerValue);
    if (editingCell) {
      const { rowIndex, colIndex } = editingCell;
      const newData = [...data];

      if (!newData[rowIndex]) {
        newData[rowIndex] = [];
      }

      newData[rowIndex][colIndex] = cellValue || (inputRef.current && inputRef.current.value);
      onDataChange(newData);
      setEditingCell(null);
    }

    if (editingHeader !== null) {
      const newHeaders = [...headers];
      newHeaders[editingHeader] = headerValue || (headerInputRef.current && headerInputRef.current.value);
      onHeaderChange(newHeaders);
      setEditingHeader(null);
    }
  };

  // Handle cell value change
  const handleCellChange = (e) => {
    e.stopPropagation();
    console.log('textarea handleCellChange: e.target.value: ', e.target.value);
    setCellValue(e.target.value);
  };

  // Handle header value change
  const handleHeaderChange = (e) => {
    e.stopPropagation();
    console.log('input handleHeaderChange: e.target.value: ', e.target.value);
    setHeaderValue(e.target.value);
  };

  // Handle key press in editable cells
  const handleKeyPress = (e) => {
    e.stopPropagation();
    console.log('textarea handleKeyPress: e.key: ', e.key);
    console.log('textarea handleKeyPress: cellValue: ', cellValue);
    let { rowIndex, colIndex } = editingCell || {};
    const cellKey = `cell-${rowIndex}-${colIndex}`;
    switch (e.key) {
      case 'Enter':
      case 'Tab':
        if (editingCell) {
          e.preventDefault();

          finishEditing();

          // Move to next cell or next row first cell
          if (colIndex < headers.length - 1) {
            colIndex += 1;
            startEditing(rowIndex, colIndex);
            setLastSelectedCell({ rowIndex, colIndex });
            onCellSelect([{ rowIndex, colIndex }]);
          } else if (rowIndex < data.length - 1) {
            rowIndex += 1;
            colIndex = 0;
            startEditing(rowIndex, colIndex);
            setLastSelectedCell({ rowIndex, colIndex });
            onCellSelect([{ rowIndex, colIndex }]);
          } else if (cellRefs.current[cellKey]) {
            cellRefs.current[cellKey].focus();
          }
        } else if (cellRefs.current[cellKey]) {
          cellRefs.current[cellKey].focus();
        }
        break;
      case 'Escape':
        setEditingCell(null);
        if (cellRefs.current[cellKey]) {
          cellRefs.current[cellKey].focus();
        }
        break;
      default:
        break;
    }
  };

  const scrollCellIntoView = (rowIndex, colIndex) => {
    if (!contentRef.current) return;

    // Calculate position of the cell
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
        newScrollTop = cellTop - clientHeight + ROW_HEIGHT + HEADER_HEIGHT;
      }

      if (isCellLeft) {
        newScrollLeft = cellLeft - ROW_HEADER_WIDTH;
      } else if (isCellRight) {
        newScrollLeft = cellLeft - clientWidth + COLUMN_WIDTH + ROW_HEADER_WIDTH;
      }

      // Scroll to position
      contentRef.current.scrollTo({
        top: newScrollTop,
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Navigate cells with arrow keys
  const handleKeyDown = (e, rowIdx, colIdx) => {
    console.log('TD handleKeyDown: e.key: ', e.key, ', e.shiftKey: ', e.shiftKey, ', e.ctrlKey: ', e.ctrlKey, ', e.metaKey: ', e.metaKey, ', e.button: ', e.button, ', e.detail: ', e.detail, ', editingCell: ', editingCell);
    if (editingCell) return; // Don't navigate while editing
    let { rowIndex, colIndex } = lastSelectedCell || { rowIndex: rowIdx, colIndex: colIdx };
    e.preventDefault();
    switch (e.key) {
      case 'ArrowUp':
        if (rowIndex > 0) {
          rowIndex -= 1;
          onCellSelect([{ rowIndex, colIndex }]);
          setLastSelectedCell({ rowIndex, colIndex });
          scrollCellIntoView(rowIndex, colIndex);
        }
        // else {
        //   rowIndex = data.length - 1;
        //   colIndex = colIndex < headers.length - 1 ? colIndex + 1 : 0;
        // }

        break;
      case 'ArrowDown':
        if (rowIndex < data.length - 1) {
          rowIndex += 1;
          onCellSelect([{ rowIndex, colIndex }]);
          setLastSelectedCell({ rowIndex, colIndex });
          scrollCellIntoView(rowIndex, colIndex);
        }
        // else {
        //   rowIndex = 0;
        //   colIndex = colIndex < headers.length - 1 ? colIndex + 1 : 0;
        // }
        break;
      case 'ArrowLeft':
        if (colIndex > 0) {
          colIndex -= 1;
          onCellSelect([{ rowIndex, colIndex }]);
          setLastSelectedCell({ rowIndex, colIndex });
          scrollCellIntoView(rowIndex, colIndex);
        }
        //  else {
        //   colIndex = headers.length - 1;
        //   rowIndex = rowIndex > 0 ? rowIndex - 1 : data.length - 1;
        // }
        break;
      case 'ArrowRight':
      case 'Tab':
        if (colIndex < headers.length - 1) {
          colIndex += 1;
          onCellSelect([{ rowIndex, colIndex }]);
          setLastSelectedCell({ rowIndex, colIndex });
          scrollCellIntoView(rowIndex, colIndex);
        } else if (e.key === 'Tab' && rowIndex < data.length - 1) {
          colIndex = 0;
          rowIndex = rowIndex + 1;
          onCellSelect([{ rowIndex, colIndex }]);
          setLastSelectedCell({ rowIndex, colIndex });
          scrollCellIntoView(rowIndex, colIndex);
        }

        break;
      case 'Enter':
        startEditing(rowIndex, colIndex);
        break;
      case 'C':
      case 'c':
        if (e.ctrlKey || e.metaKey) {
          handleCopy();
        }
        break;
      case 'V':
      case 'v':
        if (e.ctrlKey || e.metaKey) {
          handlePaste();
        }
        break;
      case 'Delete':
      case 'Backspace':
        handleDelete();
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
    console.log('TD handleCellMouseDown: e.button: ', e.button, ', e.detail: ', e.detail);
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
      console.log('TD handleCellMouseEnter');
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
    [isSelecting, selectionStart, onCellSelect, setLastSelectedCell]
  );

  // Handle mouse up to end selection
  const handleCellMouseUp = () => {
    console.log('TD handleCellMouseUp');
    if (isSelecting) {
      setIsSelecting(false);
      setSelectionStart(null);
    }
  };

  // Handle double click to edit
  const handleCellDoubleClick = (rowIndex, colIndex) => {
    console.log('TD handleCellDoubleClick');
    if (editingCell && editingCell.rowIndex === rowIndex && editingCell.colIndex === colIndex) {
      return;
    }
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
    console.log('TD handleColumnHeaderClick: e.detail: ', e.detail, ', editingHeader: ', editingHeader, ", colIndex: ", colIndex);
    console.log('TD handleColumnHeaderClick: e.button: ', e.button);

    if (editingHeader !== null && editingHeader === colIndex) {
      console.log('TD handleColumnHeaderClick: editingHeader: ', editingHeader);
      return;
    } else if (editingHeader !== null && editingHeader !== colIndex) {
      console.log('TD handleColumnHeaderClick: finishEditing: ', editingHeader, ', colIndex: ', colIndex);
      finishEditing();
    } else if (e.button === 2 || e.detail === 2) {
      startEditingHeader(colIndex);
      return;
    }

    // Handle multi-select with modifier keys
    let newSelectedColumns;
    if (e.ctrlKey || e.metaKey) {
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
    console.log('TD handleContextMenu');
    e.preventDefault();
    e.stopPropagation(); // Add this to prevent other handlers from firing

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
  const handleContextMenuAction = (e, action) => {
    e.stopPropagation();
    // Close the menu first to prevent visual issues
    setShowContextMenu(false);

    // Use setTimeout to ensure menu closing doesn't interfere with the action
    setTimeout(() => {
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
    }, 10);
  };

  // Copy selected cells
  const handleCopy = () => {
    if (selectedCells.length === 0) return;

    // Create a table structure for clipboard
    let minRow = selectedCells[0].rowIndex;
    let maxRow = minRow;
    let minCol = selectedCells[0].colIndex;
    let maxCol = minCol;

    let clipboardText = '';

    selectedCells.forEach(({ rowIndex, colIndex }) => {
      minRow = rowIndex < minRow ? rowIndex : minRow;
      maxRow = rowIndex > maxRow ? rowIndex : maxRow;
      minCol = colIndex < minCol ? colIndex : minCol;
      maxCol = colIndex > maxCol ? colIndex : maxCol;
    });
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        // tab seperated values
        clipboardText += c ? `\t${data[r][c]}` : data[r][c];
      }
      // no new line at the end of last row
      clipboardText += r === maxRow ? '' : '\n';
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
      const rows = text.split(/\r?\n/);
      const rowCount = rows.length;
      const isLargePaste = rowCount > 100;

      if (isLargePaste) {
        setIsProcessing(true);
      }

      // Use setTimeout to allow UI to update with loading state
      setTimeout(async () => {
        try {
          // Starting cell for paste
          let startRow = selectedCells[0].rowIndex;
          let startCol = selectedCells[0].colIndex;

          selectedCells.forEach(({ rowIndex, colIndex }) => {
            startRow = rowIndex < startRow ? rowIndex : startRow;
            startCol = colIndex < startCol ? colIndex : startCol;
          });

          // Create a copy of the current data
          const newData = [...data];
          const newHeaders = [...headers];

          // Select the pasted region
          const pastedSelection = [];

          rows.forEach((row, rowOffset) => {
            const targetRow = startRow + rowOffset;
            if (!newData[targetRow]) newData[targetRow] = [];
            // Try to detect if it's tab or comma separated
            const cols = row.includes('\t') ? row.split('\t') : row.split(',');
            cols.forEach((cellValue, colOffset) => {
              const targetCol = startCol + colOffset;
              newData[targetRow][targetCol] = cellValue || '';
              pastedSelection.push({ rowIndex: targetRow, colIndex: targetCol });
              // Add missing columns to headers
              newHeaders[targetCol] = newHeaders[targetCol] || `Column ${targetCol + 1}`;
            });
            return cols;
          });

          // Update data
          onHeaderChange(newHeaders);
          onDataChange(newData);
          onCellSelect(pastedSelection);
          // visibleRowsRangeRef.current = { start: startRow, end: startRow + ROWS_BUFFER };
          // visibleColsRangeRef.current = { start: startCol, end: startCol + COLS_BUFFER };
          // setVisibleRowsRange({ start: startRow, end: startRow + ROWS_BUFFER });
          // setVisibleColsRange({ start: startCol, end: startCol + COLS_BUFFER });
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
        switch (type) {
          case 'uppercase':
            selectedCells.forEach(({ rowIndex, colIndex }) => {
              if (newData[rowIndex] && newData[rowIndex][colIndex]) {
                newData[rowIndex][colIndex] = String(newData[rowIndex][colIndex]).toUpperCase();
              }
            });
            onDataChange(newData);
            break;
          case 'lowercase':
            selectedCells.forEach(({ rowIndex, colIndex }) => {
              if (newData[rowIndex] && newData[rowIndex][colIndex]) {
                newData[rowIndex][colIndex] = String(newData[rowIndex][colIndex]).toLowerCase();
              }
            });
            onDataChange(newData);
            break;
          default:
            break;
        }
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
    const isEditing = editingCell &&
      editingCell.rowIndex === rowIndex &&
      editingCell.colIndex === colIndex;

    if (isEditing) {
      return (
        <div
          className="cell-editor-container"
          onClick={(e) => e.stopPropagation()}
        >
          <textarea
            ref={inputRef}
            className="cell-editor"
            value={cellValue}
            onChange={handleCellChange}
            onKeyDown={handleKeyPress}
            onBlur={(e) => {
              e.stopPropagation();
              // Only finish editing if clicking outside the grid
              if (!gridContainerRef.current?.contains(e.relatedTarget)) {
                console.log('textarea onBlur inside');
                finishEditing();
              }
            }}
            onMouseDownCapture={e => e.stopPropagation()}
            onMouseUpCapture={e => e.stopPropagation()}
            onDoubleClickCapture={e => e.stopPropagation()}
            autoFocus
            style={{
              width: cellValue.length > 15 ?
                `${Math.min(Math.max(cellValue.length * 8, COLUMN_WIDTH), 500)}px` :
                '100%',
              height: '100%',
              whiteSpace: 'nowrap'
            }}
          />
        </div>
      );
    }

    // Safely access cell data with proper null checks
    const cellContent = data[rowIndex] && data[rowIndex][colIndex] ? data[rowIndex][colIndex] : '';

    return (
      <div className={`cell-content ${isTextWrapping ? 'wrap' : ''}`}>
        {cellContent}
      </div>
    );
  }, [editingCell, cellValue, handleCellChange, handleKeyPress, finishEditing, isTextWrapping, data]);


  const handleHeaderKeyPress = (e) => {
    e.stopPropagation();
    console.log('textarea handleHeaderKeyPress: e.key: ', e.key);
    console.log('textarea handleHeaderKeyPress: headerValue: ', headerValue);
    // headerRowRef
    switch (e.key) {
      case 'Enter':
      case 'Tab':
        if (editingHeader !== null) {
          e.preventDefault();

          finishEditing();

          // Move to next cell or next row first cell
          if (editingHeader < headers.length - 1) {
            startEditingHeader(editingHeader + 1);
          }
          // else if (cellRefs.current[cellKey]) {
          //   cellRefs.current[cellKey].focus();
          // }
        }
        // else if (headerRowRef.current) {
        //   headerRowRef.current.focus();
        // }
        break;
      case 'Escape':
        setEditingHeader(null);
        // if (cellRefs.current[cellKey]) {
        //   cellRefs.current[cellKey].focus();
        // }
        break;
      default:
        break;
    }
  };

  // Render header content
  const renderHeader = (index) => {
    const isEditing = editingHeader === index;

    if (isEditing) {
      return (
        <div
          className="cell-editor-container"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={headerInputRef}
            className="cell-editor"
            value={headerValue}
            onChange={handleHeaderChange}
            onKeyDown={handleHeaderKeyPress}
            onBlur={(e) => {
              e.stopPropagation();
              setEditingHeader(null);
              // Only finish editing if clicking outside the grid
              // if (!gridContainerRef.current?.contains(e.relatedTarget)) {
              //   console.log('input header onBlur inside');
              //   finishEditing();
              // }
            }}
            onMouseDownCapture={e => e.stopPropagation()}
            onMouseUpCapture={e => e.stopPropagation()}
            onDoubleClickCapture={e => e.stopPropagation()}
            autoFocus
          />
        </div>
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

    // Render visible rows
    for (let rowIndex = visibleRowsRange.start; rowIndex < visibleRowsRange.end && rowIndex < data.length; rowIndex++) {
      const cells = [];

      // Add row header (frozen column)
      cells.push(
        <td
          key={`row-header-${rowIndex}`}
          className={`spreadsheet-row-header ${selectedRows.includes(rowIndex) ? 'selected' : ''}`}
          onClick={(e) => handleRowClick(rowIndex, e)}
          style={{ width: ROW_HEADER_WIDTH }}
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
            className={`spreadsheet-data-cell${isSelected ? ' selected' : ''} ${isHighlighted ? ' highlighted' : ''}`}
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
        style={{ width: ROW_HEADER_WIDTH }}
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
          className={`spreadsheet-column-header ${isColumnSelected ? ' selected' : ''}`}
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
        tabIndex="0" // Add this to make the container focusable
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
        <div
          ref={contextMenuRef}
          className="spreadsheet-context-menu"
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`,
          }}
        >
          <ul>
            <li onClick={(e) => handleContextMenuAction(e, 'copy')}
            >
              Copy
            </li>
            <li onClick={(e) => handleContextMenuAction(e, 'paste')}
            >
              Paste
            </li>
            <li onClick={(e) => handleContextMenuAction(e, 'delete')}
            >
              Delete
            </li>
            <li className="separator"></li>
            <li onClick={(e) => handleContextMenuAction(e, 'uppercase')}
            >
              To Uppercase
            </li>
            <li
              onClick={(e) => handleContextMenuAction(e, 'lowercase')}
            >
              To Lowercase
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

EditableGrid.propTypes = {
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

export default React.memo(EditableGrid);