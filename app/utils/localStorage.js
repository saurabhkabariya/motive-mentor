"use client";

/**
 * Safely get an item from localStorage with error handling
 * @param {string} key - The localStorage key to retrieve
 * @param {any} defaultValue - Default value if item doesn't exist or there's an error
 * @returns {any} The parsed value or defaultValue
 */
export function safeLocalStorageGet(key, defaultValue = null) {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    
    // Check if the item exists and is not "undefined"
    if (!item || item === "undefined") {
      return defaultValue;
    }
    
    // Try to parse the item
    try {
      return JSON.parse(item);
    } catch (parseError) {
      console.error(`Error parsing localStorage item '${key}':`, parseError);
      return item; // Return the unparsed string if it can't be parsed as JSON
    }
  } catch (error) {
    console.error(`Error accessing localStorage for key '${key}':`, error);
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage with error handling
 * @param {string} key - The localStorage key to set
 * @param {any} value - The value to store (will be JSON stringified)
 * @returns {boolean} Whether the operation was successful
 */
export function safeLocalStorageSet(key, value) {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    // Don't store undefined values
    if (value === undefined) {
      console.warn(`Attempted to store undefined value for key '${key}'`);
      return false;
    }
    
    // Convert non-string values to JSON string
    const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, valueToStore);
    return true;
  } catch (error) {
    console.error(`Error setting localStorage for key '${key}':`, error);
    return false;
  }
}

/**
 * Safely remove an item from localStorage with error handling
 * @param {string} key - The localStorage key to remove
 * @returns {boolean} Whether the operation was successful
 */
export function safeLocalStorageRemove(key) {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage for key '${key}':`, error);
    return false;
  }
}
