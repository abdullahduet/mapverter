import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';
import LoadingScreen from '../common/LoadingScreen';

// Throttle function to limit how often a function can be called
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;

  return function (...args) {
    const context = this;

    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);

      lastFunc = setTimeout(function () {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

const EditableCSVTable = ({
  data,
  headers,
  onDataChange,
  onHeaderChange,
  selectedCells = [],
  onCellSelect,
  maxHeight = '600px',
  highlightedCell = null,
  forceStrict = false,
  setHighlightedCell
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editingHeader, setEditingHeader] = useState(null);
  const [cellValue, setCellValue] = useState('');
  const [headerValue, setHeaderValue] = useState('');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuTarget, setContextMenuTarget] = useState(null);
  const [visibleRowsRange, setVisibleRowsRange] = useState({ start: 0, end: 100 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [lastSelectedCell, setLastSelectedCell] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [lastSelectedRow, setLastSelectedRow] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [lastSelectedColumn, setLastSelectedColumn] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTextWrapping, setIsTextWrapping] = useState(true); // Default to text wrapping on

  const tableRef = useRef(null);
  const tableBodyRef = useRef(null);
  const inputRef = useRef(null);
  const headerInputRef = useRef(null);
  const cellRefs = useRef({});
  const isUpdatingCells = useRef(false);

  // Fixed dimensions for Excel-like look and feel - using useMemo to prevent recalculations
  const dimensions = useMemo(() => ({
    ROW_HEIGHT: 35, // Fixed height for each row
    ROW_HEADER_WIDTH: 50, // Width for row number column
    COLUMN_WIDTH: 150, // Fixed width for data columns
    HEADER_HEIGHT: 35, // Height for header row
    ROWS_BUFFER: 50 // Reduced buffer size to improve performance
  }), []);

  // Destructure for easier access
  const { ROW_HEIGHT, ROW_HEADER_WIDTH, COLUMN_WIDTH, HEADER_HEIGHT, ROWS_BUFFER } = dimensions;

  // const ROW_HEADER_WIDTH = 50; // Width for row number column
  // const COLUMN_WIDTH = 150; // Fixed width for data columns
  // const HEADER_HEIGHT = 35; // Height for header row
  // const ROWS_BUFFER = 100; // Number of rows to render before/after visible area
  // const ROW_HEIGHT = 35; // Fixed height for each row

  // Calculate visible rows based on scroll position - optimized
  const updateVisibleRows = useCallback(() => {
    if (!tableBodyRef.current) return;

    const scrollTop = tableBodyRef.current.scrollTop;
    const viewportHeight = tableBodyRef.current.clientHeight;

    const startRow = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - ROWS_BUFFER);
    const visibleRows = Math.ceil(viewportHeight / ROW_HEIGHT) + ROWS_BUFFER * 2;
    const endRow = Math.min(data.length, startRow + visibleRows + ROWS_BUFFER);
    // Only update state if the visible range has actually changed
    5, 10; 3, 20
    if (!(visibleRowsRange.start <= startRow && visibleRowsRange.end >= endRow)) {
      console.log('updateVisibleRows updated');
      setVisibleRowsRange({ start: startRow, end: endRow });
    }
  }, [data.length, ROW_HEIGHT, ROWS_BUFFER]);

  // Throttled version of updateVisibleRows to avoid too many updates
  const throttledUpdateVisibleRows = useMemo(
    () => throttle(updateVisibleRows, 100),
    [updateVisibleRows]
  );

  // Setup scroll event listener for virtualization with safeguards against recursive updates
  useEffect(() => {
    const tableBody = tableBodyRef.current;
    if (!tableBody) return;

    // Track if we're currently handling a scroll event
    let isHandlingScroll = false;

    // Create a safer scroll handler that prevents recursive updates
    const safeScrollHandler = () => {
      if (isHandlingScroll) return;

      isHandlingScroll = true;
      try {
        throttledUpdateVisibleRows();
      } finally {
        // Always reset the flag to allow future scroll events
        isHandlingScroll = false;
      }
    };

    // Initial update without triggering a scroll event
    updateVisibleRows();

    // Add event listeners
    tableBody.addEventListener('scroll', safeScrollHandler, { passive: true });

    // Debounced resize handler to prevent multiple updates during resize
    const debouncedResize = throttle(() => {
      updateVisibleRows();
    }, 100);

    window.addEventListener('resize', debouncedResize, { passive: true });

    return () => {
      tableBody.removeEventListener('scroll', safeScrollHandler);
      window.removeEventListener('resize', debouncedResize);
    };
  }, [updateVisibleRows, throttledUpdateVisibleRows]);

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

  // useEffect(() => {
  //   // Listen for custom events from FindReplacePanel
  //   const handleHighlightAndScroll = (event) => {
  //     const { rowIndex, colIndex } = event.detail;

  //     // Set highlighted cell state
  //     setHighlightedCell({ rowIndex, colIndex });

  //     // Scroll to the cell with a slight delay to ensure DOM update
  //     setTimeout(() => {
  //       const cellKey = `cell-${rowIndex}-${colIndex}`;
  //       const cellElement = cellRefs.current[cellKey];

  //       if (cellElement && tableBodyRef.current) {
  //         // First ensure the row is within the visible range
  //         const currentVisibleStart = visibleRowsRange.start;
  //         const currentVisibleEnd = visibleRowsRange.end;

  //         if (rowIndex < currentVisibleStart || rowIndex >= currentVisibleEnd) {
  //           // Update visible rows range if cell is outside current view
  //           const newStart = Math.max(0, rowIndex - Math.floor(ROWS_BUFFER / 2));
  //           setVisibleRowsRange({
  //             start: newStart,
  //             end: Math.min(data.length, newStart + ROWS_BUFFER * 2)
  //           });
  //         }

  //         // Explicitly scroll to make cell visible with behavior smooth
  //         cellElement.scrollIntoView({
  //           behavior: 'smooth',
  //           block: 'center',
  //           inline: 'center'
  //         });

  //         // Add a temporary highlight effect
  //         cellElement.classList.add('animate-pulse');
  //         setTimeout(() => {
  //           cellElement.classList.remove('animate-pulse');
  //         }, 1000);
  //       }
  //     }, 50);
  //   };

  //   // Register event listener
  //   document.addEventListener('highlightAndScrollToCell', handleHighlightAndScroll);

  //   return () => {
  //     document.removeEventListener('highlightAndScrollToCell', handleHighlightAndScroll);
  //   };
  // }, [data.length, visibleRowsRange, setHighlightedCell]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  useEffect(() => {
    if (editingHeader && headerInputRef.current) {
      headerInputRef.current.focus();
    }
  }, [editingHeader]);

  // Focus on highlighted cell when it changes
  useEffect(() => {
    if (highlightedCell) {
      const { rowIndex, colIndex } = highlightedCell;
      const cellKey = `cell-${rowIndex}-${colIndex}`;

      // Scroll into view if needed
      if (cellRefs.current[cellKey] && tableBodyRef.current) {
        const cellElement = cellRefs.current[cellKey];

        // Calculate if cell is outside visible area
        const cellRect = cellElement.getBoundingClientRect();
        const tableRect = tableBodyRef.current.getBoundingClientRect();

        if (
          cellRect.top < tableRect.top ||
          cellRect.bottom > tableRect.bottom ||
          cellRect.left < tableRect.left ||
          cellRect.right > tableRect.right
        ) {
          cellElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
      }
    }
  }, [highlightedCell]);

  // Handle click outside to cancel editing and selection
  useEffect(() => {
    const handleClickOutside = (event) => {
      // console.log('Global handleClickOutside: event.target: ', event.target, ', event.button: ', event.button, ', tableBodyRef.current: ', tableBodyRef.current);
      if (
        (editingCell || editingHeader) &&
        tableBodyRef.current &&
        !tableBodyRef.current.contains(event.target)
      ) {
        finishEditing();
      }

      if (showContextMenu && event.button !== 2) {
        setShowContextMenu(false);
      }
    };

    // Global mouseup listener to end selection
    const handleMouseUp = () => {
      // console.log('Global handleMouseUp: isSelecting: ', isSelecting);
      if (isSelecting) {
        setIsSelecting(false);
      }
    };

    // Prevent default selection behavior during table operations
    // const handleSelectStart = (e) => {
    //   // Only prevent selection if we're in the table and not editing
    //   console.log('handleSelectStart: e.button: ', e.button, ', e.detail: ', e.detail, ', e.ctrlKey: ', e.ctrlKey, ', e.metaKey: ', e.metaKey, ', e.shiftKey: ', e.shiftKey, ', editingCell: ', editingCell, ', editingHeader: ', editingHeader, ', isSelecting: ', isSelecting);
    //   if (isSelecting && !editingCell && !editingHeader) {
    //     e.preventDefault();
    //   }
    // };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mouseup', handleMouseUp);
    // document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mouseup', handleMouseUp);
      // document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [editingCell, editingHeader, showContextMenu, isSelecting]);

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
    // console.log('handleKeyPress: e.button: ', e.button, ', e.detail: ', e.detail, ', e.key: ', e.key);
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
    // console.log('handleKeyDown: rowIndex: ', rowIndex, ', colIndex: ', colIndex);
    // console.log('handleKeyDown: e.button: ', e.button, ', e.detail: ', e.detail, ', editingCell: ', editingCell, ', e.key: ', e.key);
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
          // e.preventDefault();
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
    // e.preventDefault(); if we do prevent default then input default selection will not work like all text select, double click to select
    e.stopPropagation();
    setShowContextMenu(false);
    console.log('handleCellMouseDown: e.button: ', e.button, ', e.detail: ', e.detail, ', e.ctrlKey: ', e.ctrlKey, ', e.metaKey: ', e.metaKey, ', e.shiftKey: ', e.shiftKey);

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
        // Give the UI a chance to show the loading state
        setTimeout(() => setIsProcessing(false), (selectionSize / 1000) * (selectionSize / 5000) * (selectionSize / 5000));
      }
      const newSelection = [];
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          newSelection.push({ rowIndex: r, colIndex: c });
        }
      }

      onCellSelect(newSelection);
    } else {
      // Check if the cell is already selected and if it's a single selection
      // const cellExists = selectedCells.some(
      //   cell => cell.rowIndex === rowIndex && cell.colIndex === colIndex
      // );

      // If this is an exact single cell selection, toggle it off when clicked again
      // if (cellExists && selectedCells.length === 1) {
      //   onCellSelect([]);
      //   setLastSelectedCell(null);
      // } else {
      // Start a new selection
      setIsSelecting(true);
      setSelectionStart({ rowIndex, colIndex });
      setLastSelectedCell({ rowIndex, colIndex });
      onCellSelect([{ rowIndex, colIndex }]);
      // }
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
          // Give the UI a chance to show the loading state
          setTimeout(() => setIsProcessing(false), (selectionSize / 1000) * (selectionSize / 5000) * (selectionSize / 5000));
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
    console.log('handleCellMouseUp: isSelecting: ', isSelecting);
    if (isSelecting) {
      setIsSelecting(false);
      setSelectionStart(null);
    }
  };

  // Handle double click to edit
  const handleCellDoubleClick = (rowIndex, colIndex) => {
    console.log('handleCellDoubleClick: rowIndex: ', rowIndex, ', colIndex: ', colIndex);
    if (selectedCells.length === 0) {
      setLastSelectedCell({ rowIndex, colIndex });
      onCellSelect([{ rowIndex, colIndex }]);
    }
    startEditing(rowIndex, colIndex);
  };

  // Handle row selection by clicking row header
  const handleRowClick = (rowIndex, e) => {
    // Prevent default selection behavior
    e.preventDefault();
    let newSelectedRows;

    // Handle multi-select with modifier keys
    if (e.ctrlKey || e.metaKey) {
      // Toggle this row in selection (add if not present, remove if present)
      if (selectedRows.includes(rowIndex)) {
        newSelectedRows = selectedRows.filter(index => index !== rowIndex);
        // setSelectedRows(selectedRows.filter(index => index !== rowIndex));
      } else {
        newSelectedRows = [...selectedRows, rowIndex];
        // setSelectedRows([...selectedRows, rowIndex]);
      }
      setLastSelectedRow(rowIndex);
    } else if (e.shiftKey && lastSelectedRow !== null) {
      // Range selection from last selected row to current row
      const start = Math.min(lastSelectedRow, rowIndex);
      const end = Math.max(lastSelectedRow, rowIndex);

      // Limit the size of the selection to prevent performance issues
      const selectionSize = (end - start + 1) * headers.length;
      if (selectionSize > 5000) {
        setIsProcessing(true);
        // Give the UI a chance to show the loading state
        setTimeout(() => setIsProcessing(false), (selectionSize / 1000) * (selectionSize / 5000) * (selectionSize / 5000));
      }

      // Create array of all row indices in the range
      newSelectedRows = Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      );

      // setSelectedRows(rangeSelection);
    } else {
      newSelectedRows = [rowIndex];
      // Simple single row selection
      // setSelectedRows([rowIndex]);
      setLastSelectedRow(rowIndex);
    }

    setSelectedRows(newSelectedRows);
    // Convert row selection to cell selection for the table
    const cellSelection = [];
    // const rowIndices = e.shiftKey && lastSelectedRow !== null 
    //   ? Array.from(
    //       { length: Math.abs(rowIndex - lastSelectedRow) + 1 }, 
    //       (_, i) => Math.min(rowIndex, lastSelectedRow) + i
    //     ) 
    //   : [rowIndex];

    // For each selected row, add all cells in that row to the selection
    newSelectedRows.forEach(row => {
      for (let col = 0; col < headers.length; col++) {
        cellSelection.push({ rowIndex: row, colIndex: col });
      }
    });

    onCellSelect(cellSelection);
  };

  // Column selection handler
  const handleColumnHeaderClick = (colIndex, e) => {
    // Prevent default browser selection behavior
    e.preventDefault();
    // console.log('handleColumnHeaderClick: e.button: ', e.button, ', e.detail: ', e.detail, ', colIndex: ', colIndex);

    // Handle multi-select with modifier keys
    let newSelectedColumns;
    if (e.detail === 2) {
      startEditingHeader(colIndex);
      return;
    } else if (e.ctrlKey || e.metaKey) {
      // Toggle this column in selection
      if (selectedColumns.includes(colIndex)) {
        newSelectedColumns = selectedColumns.filter(index => index !== colIndex);
        // setSelectedColumns(selectedColumns.filter(index => index !== colIndex));
      } else {
        newSelectedColumns = [...selectedColumns, colIndex];
        // setSelectedColumns([...selectedColumns, colIndex]);
      }
      setLastSelectedColumn(colIndex);
    } else if (e.shiftKey && lastSelectedColumn !== null) {
      // Range selection from last selected column to current column
      const start = Math.min(lastSelectedColumn, colIndex);
      const end = Math.max(lastSelectedColumn, colIndex);

      // Limit the size of the selection to prevent performance issues
      const selectionSize = (end - start + 1) * data.length;
      if (selectionSize > 5000) {
        setIsProcessing(true);
        // Give the UI a chance to show the loading state
        setTimeout(() => setIsProcessing(false), (selectionSize / 1000) * (selectionSize / 5000) * (selectionSize / 5000));
      }

      // Create array of all column indices in the range
      newSelectedColumns = Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      );

      // setSelectedColumns(rangeSelection);
    } else {
      // Simple single column selection
      newSelectedColumns = [colIndex];
      // setSelectedColumns([colIndex]);
      setLastSelectedColumn(colIndex);
    }
    setSelectedColumns(newSelectedColumns);

    // Convert column selection to cell selection for the table
    const cellSelection = [];
    // const colIndices = e.shiftKey && lastSelectedColumn !== null 
    //   ? Array.from(
    //       { length: Math.abs(colIndex - lastSelectedColumn) + 1 }, 
    //       (_, i) => Math.min(colIndex, lastSelectedColumn) + i
    //     ) 
    //   : [colIndex];

    // For each selected column, add all cells in that column to the selection
    newSelectedColumns.forEach(col => {
      for (let row = 0; row < data.length; row++) {
        cellSelection.push({ rowIndex: row, colIndex: col });
      }
    });

    onCellSelect(cellSelection);
  };

  // Handle select all table by clicking top-left '#' cell
  const handleSelectAllClick = (e) => {
    // Prevent default selection behavior
    e.preventDefault();

    // Limit the size of the selection to prevent performance issues
    const selectionSize = headers.length * data.length;
    if (selectionSize > 5000) {
      setIsProcessing(true);
      // Give the UI a chance to show the loading state
      setTimeout(() => setIsProcessing(false), (selectionSize / 1000) * (selectionSize / 5000) * (selectionSize / 5000));
    }
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
    // console.log('handleContextMenu: rowIndex: ', rowIndex, ', colIndex: ', colIndex, ', e.button: ', e.button, ', e.detail: ', e.detail);
    // Prevent default browser selection behavior
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

  // const updateCornerCellWidth = () => {
  //   const dataSize = headers.length * data.length;
  //   // Give the UI a chance to show the loading state
  //   requestAnimationFrame(() => {
  //     setTimeout(() => {
  //       const cornerCellWidth = document.getElementById('cornerCell').offsetWidth;
  //       const borderElement = document.getElementById('leftColumnRightBorder');
  //       borderElement.style.left = `${cornerCellWidth}px`;
  //       // const cornerCellRect = document.getElementById('cornerCell').getBoundingClientRect();
  //       console.log('[updateCornerCellWidth] cornerCellWidth: ', cornerCellWidth);
  //       setIsProcessing(false);
  //     }, (dataSize / 1000) * (dataSize / 5000) * (dataSize / 5000));
  //   });
  // };

  // Add a new row
  const addRow = () => {
    // setIsProcessing(true);
    const newData = [...data];
    const newRow = new Array(headers.length).fill('');
    newData.push(newRow);
    onDataChange(newData);

    // Update visible rows to include new row
    updateVisibleRows();
    // updateCornerCellWidth();
  };

  // Add a new column
  const addColumn = () => {
    // setIsProcessing(true);
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    onHeaderChange(newHeaders);

    const newData = data.map(row => {
      const newRow = [...row];
      newRow.push('');
      return newRow;
    });

    onDataChange(newData);
    // updateCornerCellWidth();
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
          className="w-full h-full border-none p-1 focus:outline-none resize-none"
          style={{
            minHeight: '100%',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            overflow: 'hidden'
          }}
          autoFocus
        />
      );
    }

    // Safely access cell data with proper null checks
    const cellContent = data[rowIndex] && data[rowIndex][colIndex] !== undefined
      ? data[rowIndex][colIndex]
      : '';

    return (
      <div
        className={`p-1 h-full w-full select-none ${isTextWrapping ? 'whitespace-normal break-words' : 'truncate'}`}
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
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
          className="w-full border-none p-1 focus:outline-none bg-primary-100"
          autoFocus
        />
      );
    }

    return (
      <div className="truncate font-semibold px-2 py-1 select-none">
        {headers[index]}
      </div>
    );
  };

  // Styles for fixed dimensions - UPDATED for proper sticky header
  const tableStyles = {
    container: {
      height: maxHeight,
      contain: 'strict', // Add CSS containment for better performance
      ...(forceStrict ? { willChange: 'transform' } : {}), // Hint to browser to optimize for changes
    },
    headerRow: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
    },
    cornerCell: {
      width: `${ROW_HEADER_WIDTH}px`,
      height: `${HEADER_HEIGHT}px`,
      fontWeight: 'bold',
      ...(forceStrict ? { transform: translateZ(0) } : {}), // Hardware acceleration
    },
    headerCell: {
      minWidth: `${COLUMN_WIDTH}px`,
      width: `${COLUMN_WIDTH}px`,
      maxWidth: `${COLUMN_WIDTH}px`,
      height: `${HEADER_HEIGHT}px`,
      ...(forceStrict ? { transform: translateZ(0) } : {}), // Hardware acceleration
    },
    rowCell: {
      width: `${ROW_HEADER_WIDTH}px`,
      height: `${ROW_HEIGHT}px`,
      borderBottom: '1px solid #ddd',
      borderRight: '1px solid #ddd',
      fontWeight: 'bold',
      cursor: 'pointer',
      userSelect: 'none',
      ...(forceStrict ? { transform: translateZ(0) } : {}), // Hardware acceleration
    },
    dataCell: {
      minWidth: `${COLUMN_WIDTH}px`,
      width: `${COLUMN_WIDTH}px`,
      maxWidth: `${COLUMN_WIDTH}px`,
      height: `${ROW_HEIGHT}px`,
    },
  };

  // Render only the visible portion of the table for performance
  const renderVisibleRows = () => {
    const rows = [];

    for (let rowIndex = visibleRowsRange.start; rowIndex < visibleRowsRange.end && rowIndex < data.length; rowIndex++) {
      rows.push(
        <tr key={`row-${rowIndex}`}>
          {/* Row header */}
          <td
            style={{
              ...tableStyles.rowCell,
              ...(selectedRows.includes(rowIndex) ? { backgroundColor: '#e9ecef' } : {})
            }}
            className="editable-row-header"
            onClick={(e) => handleRowClick(rowIndex, e)}
            onMouseDown={(e) => {
              if (e.button !== 2) { // Not right click
                e.preventDefault(); // Prevent text selection
              }
            }}
          >
            {rowIndex + 1}
          </td>

          {/* Row cells */}
          {headers.map((_, colIndex) => {
            const isSelected = isCellSelected(rowIndex, colIndex);
            const isHighlighted = isCellHighlighted(rowIndex, colIndex);
            const evenRow = rowIndex % 2 === 0;

            return (
              <td
                key={`cell-${rowIndex}-${colIndex}`}
                ref={(ref) => setCellRef(rowIndex, colIndex, ref)}
                data-row-index={rowIndex}
                data-col-index={colIndex}
                style={{
                  ...tableStyles.dataCell,
                  ...(evenRow ? {} : { backgroundColor: '#f9f9f9' })
                }}
                className={`editable-data-cell${isSelected ? ' selected' : ''} ${isHighlighted ? ' highlighted' : ''}`}
                onMouseDown={(e) => handleCellMouseDown(rowIndex, colIndex, e)}
                onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                onMouseUp={() => handleCellMouseUp(rowIndex, colIndex)}
                onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                tabIndex="0"
              >
                {renderCell(rowIndex, colIndex)}
              </td>
            );
          })}
        </tr>
      );
    }

    return rows;
  };

  // Calculate spacer heights
  const topSpacerHeight = visibleRowsRange.start * ROW_HEIGHT;
  const bottomSpacerHeight = Math.max(0, (data.length - visibleRowsRange.end) * ROW_HEIGHT);

  return (
    <div className="flex flex-col relative">
      {isProcessing && (
        <div className="absolute inset-0 z-50 bg-white/75 flex items-center justify-center">
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
        <div className="text-sm text-text-600">
          {selectedCells.length > 0
            ? `${selectedCells.length} cell${selectedCells.length > 1 ? 's' : ''} selected`
            : 'Click to select cell. Double-click to edit. Drag to select multiple cells.'}
        </div>
      </div>

      <div
        ref={tableBodyRef}
        style={tableStyles.container}
        className="editable-table-container"
      >

        <table
          ref={tableRef}
          className="editable-table"
        >
          <thead>
            <tr
              style={tableStyles.headerRow}
              className="editable-header"
            >
              {/* Corner cell - select all */}
              <th
                style={tableStyles.cornerCell}
                className="editable-corner-cell"
                onClick={(e) => handleSelectAllClick(e)}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent text selection
                }}
              >
                #
              </th>

              {/* Column headers */}
              {headers.map((header, index) => {

                const isColumnSelected = selectedColumns.includes(index);

                return (
                  <th
                    key={index}
                    style={{
                      ...tableStyles.headerCell,
                      ...(isColumnSelected ? { backgroundColor: '#e9ecef' } : {})
                    }}
                    onClick={(e) => handleColumnHeaderClick(index, e)}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent text selection
                    }}
                  >
                    {renderHeader(index)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {/* Top spacer for virtualization - fixed height to prevent layout shifts */}
            {topSpacerHeight > 0 && (
              <tr>
                <td
                  colSpan={headers.length + 1}
                  style={{
                    height: `${topSpacerHeight}px`,
                    padding: 0,
                    border: 'none',
                    backgroundColor: 'transparent'
                  }}
                />
              </tr>
            )}

            {/* Visible rows */}
            {renderVisibleRows()}

            {/* Bottom spacer for virtualization - fixed height to prevent layout shifts */}
            {bottomSpacerHeight > 0 && (
              <tr>
                <td
                  colSpan={headers.length + 1}
                  style={{
                    height: `${bottomSpacerHeight}px`,
                    padding: 0,
                    border: 'none',
                    backgroundColor: 'transparent'
                  }}
                />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed bg-white rounded-md shadow-lg z-50 border border-border"
          style={{
            top: `${contextMenuPosition.y}px`,
            left: `${contextMenuPosition.x}px`
          }}
        >
          <ul className="py-1">
            <li
              className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
              onClick={() => handleContextMenuAction('copy')}
            >
              Copy
            </li>
            <li
              className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
              onClick={() => handleContextMenuAction('paste')}
            >
              Paste
            </li>
            <li
              className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
              onClick={() => handleContextMenuAction('delete')}
            >
              Delete
            </li>
            <li className="border-t border-border my-1"></li>
            <li
              className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
              onClick={() => handleContextMenuAction('uppercase')}
            >
              To Uppercase
            </li>
            <li
              className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
              onClick={() => handleContextMenuAction('lowercase')}
            >
              To Lowercase
            </li>
            <li className="border-t border-border my-1"></li>
            <li
              className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
              onClick={() => handleContextMenuAction('toggleWrap')}
            >
              {isTextWrapping ? "Disable Text Wrap" : "Enable Text Wrap"}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

EditableCSVTable.propTypes = {
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

export default React.memo(EditableCSVTable);