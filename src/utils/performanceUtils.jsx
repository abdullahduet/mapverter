// utils/performanceUtils.js

/**
 * Debounces a function to limit how often it can be called
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @param {boolean} immediate - Whether to call the function immediately
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait, immediate = false) => {
    let timeout;
    
    return function(...args) {
      const context = this;
      
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      
      const callNow = immediate && !timeout;
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      
      if (callNow) func.apply(context, args);
    };
  };
  
  /**
   * Throttles a function to limit how often it can be called
   * 
   * @param {Function} func - The function to throttle
   * @param {number} limit - The time limit in milliseconds
   * @returns {Function} - The throttled function
   */
  export const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    
    return function(...args) {
      const context = this;
      
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
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
  
  /**
   * Request animation frame throttle - ensures smooth animations
   * 
   * @param {Function} callback - The function to call on animation frame
   * @returns {Function} - The throttled function
   */
  export const rafThrottle = (callback) => {
    let requestId = null;
    
    return function(...args) {
      const context = this;
      
      if (requestId === null) {
        requestId = requestAnimationFrame(() => {
          requestId = null;
          callback.apply(context, args);
        });
      }
    };
  };
  
  /**
   * Memoizes a function to cache results for better performance
   * 
   * @param {Function} func - The function to memoize
   * @returns {Function} - The memoized function
   */
  export const memoize = (func) => {
    const cache = new Map();
    
    return function(...args) {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = func.apply(this, args);
      cache.set(key, result);
      
      return result;
    };
  };
  
  /**
   * Creates a worker thread for expensive calculations
   * 
   * @param {Function} workerFunction - The function to run in the worker
   * @returns {Worker} - The web worker
   */
  export const createWorker = (workerFunction) => {
    const workerCode = `
      self.onmessage = function(e) {
        const result = (${workerFunction.toString()})(e.data);
        self.postMessage(result);
      }
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    
    return new Worker(url);
  };
  
  /**
   * Chunk processing for large datasets
   * 
   * @param {Array} array - The array to process
   * @param {Function} processor - The function to process each chunk
   * @param {number} chunkSize - The size of each chunk
   * @param {Function} onComplete - Called when all chunks are processed
   */
  export const processInChunks = (array, processor, chunkSize = 1000, onComplete) => {

    let index = 0;

    function doChunk() {
      if (index >= array.length) {
        if (onComplete) onComplete();
        return;
      }

      // If array contains indices, process single items
      if (array.every(item => typeof item === 'number')) {
        processor(index);
      } else {
        // Otherwise, process chunks of arrays
        const chunk = array.slice(index, index + chunkSize);
        processor(Math.floor(index / chunkSize));
      }

      index += (array.every(item => typeof item === 'number')) ? 1 : chunkSize;

      setTimeout(doChunk, 0);
    }

    doChunk();
  };
  
  /**
   * Cache-aware binary search for finding items in large sorted arrays
   * Optimized for searching with frequent queries in nearby range
   * 
   * @param {Array} array - The sorted array to search in
   * @param {*} value - The value to search for
   * @param {Function} comparator - Function to compare values (defaults to standard comparison)
   * @returns {number} - The index of the value or -1 if not found
   */
  export const fastBinarySearch = (() => {
    // Cache the last successful search
    let lastIndex = -1;
    let lastArray = null;
    let lastValue = null;
    
    return (array, value, comparator = (a, b) => a - b) => {
      // Check if we're searching for the same value in the same array
      if (array === lastArray && value === lastValue) {
        return lastIndex;
      }
      
      // Check if the value is at the last found index
      if (array === lastArray && lastIndex >= 0 && lastIndex < array.length) {
        const comp = comparator(array[lastIndex], value);
        if (comp === 0) {
          return lastIndex;
        }
        
        // Check adjacent indices first (spatial locality)
        if (lastIndex > 0) {
          const prevComp = comparator(array[lastIndex - 1], value);
          if (prevComp === 0) {
            lastIndex = lastIndex - 1;
            lastValue = value;
            return lastIndex;
          }
        }
        
        if (lastIndex < array.length - 1) {
          const nextComp = comparator(array[lastIndex + 1], value);
          if (nextComp === 0) {
            lastIndex = lastIndex + 1;
            lastValue = value;
            return lastIndex;
          }
        }
      }
      
      // Fall back to standard binary search
      let low = 0;
      let high = array.length - 1;
      
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const comp = comparator(array[mid], value);
        
        if (comp === 0) {
          // Cache this result
          lastArray = array;
          lastValue = value;
          lastIndex = mid;
          return mid;
        }
        
        if (comp < 0) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      
      // Not found
      lastArray = array;
      lastValue = value;
      lastIndex = -1;
      return -1;
    };
  })();
  
  /**
   * Optimize rendering by determining if a component needs to rerender
   * 
   * @param {Object} prevProps - Previous props
   * @param {Object} nextProps - Next props
   * @param {Array} keysToCheck - Props keys to check for changes
   * @returns {boolean} - True if component should rerender
   */
  export const shouldComponentUpdate = (prevProps, nextProps, keysToCheck) => {
    if (!keysToCheck) {
      // Check all keys if not specified
      const allKeys = new Set([
        ...Object.keys(prevProps),
        ...Object.keys(nextProps)
      ]);
      
      keysToCheck = Array.from(allKeys);
    }
    
    return keysToCheck.some(key => prevProps[key] !== nextProps[key]);
  };
  
  /**
   * Memory-efficient grid data structure using typed arrays
   * Optimized for numerical data in a large grid
   */
  export class TypedGrid {
    /**
     * Create a typed grid
     * 
     * @param {number} rows - Number of rows
     * @param {number} columns - Number of columns
     * @param {string} type - Type of array to use ('float32', 'float64', 'int32', etc.)
     */
    constructor(rows, columns, type = 'float64') {
      this.rows = rows;
      this.columns = columns;
      this.size = rows * columns;
      
      // Create appropriate typed array
      switch (type) {
        case 'float32':
          this.data = new Float32Array(this.size);
          break;
        case 'float64':
          this.data = new Float64Array(this.size);
          break;
        case 'int8':
          this.data = new Int8Array(this.size);
          break;
        case 'uint8':
          this.data = new Uint8Array(this.size);
          break;
        case 'int16':
          this.data = new Int16Array(this.size);
          break;
        case 'uint16':
          this.data = new Uint16Array(this.size);
          break;
        case 'int32':
          this.data = new Int32Array(this.size);
          break;
        case 'uint32':
          this.data = new Uint32Array(this.size);
          break;
        default:
          this.data = new Float64Array(this.size);
      }
    }
    
    /**
     * Get value at a specific position
     * 
     * @param {number} row - Row index
     * @param {number} column - Column index
     * @returns {number} - The value at the position
     */
    get(row, column) {
      return this.data[row * this.columns + column];
    }
    
    /**
     * Set value at a specific position
     * 
     * @param {number} row - Row index
     * @param {number} column - Column index
     * @param {number} value - Value to set
     */
    set(row, column, value) {
      this.data[row * this.columns + column] = value;
    }
    
    /**
     * Get a row as an array
     * 
     * @param {number} row - Row index
     * @returns {Array} - The row values
     */
    getRow(row) {
      const startIndex = row * this.columns;
      return Array.from(this.data.slice(startIndex, startIndex + this.columns));
    }
    
    /**
     * Get a column as an array
     * 
     * @param {number} column - Column index
     * @returns {Array} - The column values
     */
    getColumn(column) {
      const result = new Array(this.rows);
      for (let i = 0; i < this.rows; i++) {
        result[i] = this.data[i * this.columns + column];
      }
      return result;
    }
    
    /**
     * Fill the grid with a value
     * 
     * @param {number} value - Value to fill with
     */
    fill(value) {
      this.data.fill(value);
    }
    
    /**
     * Convert the grid to a 2D array
     * 
     * @returns {Array} - 2D array representation of the grid
     */
    toArray() {
      const result = new Array(this.rows);
      for (let i = 0; i < this.rows; i++) {
        result[i] = Array.from(
          this.data.slice(i * this.columns, (i + 1) * this.columns)
        );
      }
      return result;
    }
  }
  
  /**
   * LRU Cache for caching expensive calculations
   */
  export class LRUCache {
    /**
     * Create an LRU cache
     * 
     * @param {number} capacity - Maximum number of items to store
     */
    constructor(capacity) {
      this.capacity = capacity;
      this.cache = new Map();
      this.keys = [];
    }
    
    /**
     * Get a value from the cache
     * 
     * @param {*} key - Cache key
     * @returns {*} - Cached value or undefined if not found
     */
    get(key) {
      if (!this.cache.has(key)) return undefined;
      
      // Move the key to the end (most recently used)
      this.keys = this.keys.filter(k => k !== key);
      this.keys.push(key);
      
      return this.cache.get(key);
    }
    
    /**
     * Add a value to the cache
     * 
     * @param {*} key - Cache key
     * @param {*} value - Value to cache
     */
    put(key, value) {
      if (this.cache.has(key)) {
        // Update existing key
        this.cache.set(key, value);
        
        // Move to most recently used
        this.keys = this.keys.filter(k => k !== key);
        this.keys.push(key);
      } else {
        // Add new key
        this.cache.set(key, value);
        this.keys.push(key);
        
        // Evict least recently used if over capacity
        if (this.keys.length > this.capacity) {
          const lruKey = this.keys.shift();
          this.cache.delete(lruKey);
        }
      }
    }
    
    /**
     * Clear the cache
     */
    clear() {
      this.cache.clear();
      this.keys = [];
    }
  }