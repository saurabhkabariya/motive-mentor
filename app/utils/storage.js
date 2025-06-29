"use client";

/**
 * A safe JSON parser that will never throw errors
 * @param {string} jsonString - The JSON string to parse
 * @param {any} defaultValue - The default value to return if parsing fails
 * @returns {any} The parsed JSON or defaultValue
 */
export function safeJsonParse(jsonString, defaultValue = null) {
  // Handle null, undefined, or empty strings
  if (!jsonString || jsonString === "undefined") {
    return defaultValue;
  }
  
  // Check if the string is already a non-object value (simple string like "light" or "dark")
  // Simple strings that aren't JSON format should just be returned as is
  if (typeof jsonString === 'string') {
    // If it doesn't start with { or [ it's likely not a JSON object/array
    const trimmed = jsonString.trim();
    if (
      !(trimmed.startsWith('{') && trimmed.endsWith('}')) &&
      !(trimmed.startsWith('[') && trimmed.endsWith(']')) &&
      !(trimmed.startsWith('"') && trimmed.endsWith('"')) &&
      !/^\d+$/.test(trimmed) && // Not a number string
      trimmed !== 'true' &&
      trimmed !== 'false' &&
      trimmed !== 'null'
    ) {
      return jsonString; // Return simple strings as is
    }
  }
  
  // Try to parse the JSON
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("JSON Parse Error:", error);
    console.debug("Failed to parse JSON:", jsonString);
    return jsonString; // Return the original string if parsing fails
  }
}

/**
 * Safely get an item from localStorage with error handling and proper JSON parsing
 * @param {string} key - The localStorage key to retrieve
 * @param {any} defaultValue - Default value if item doesn't exist or there's an error
 * @returns {any} The parsed value or defaultValue
 */
export function getStoredItem(key, defaultValue = null) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    
    // Special handling for known string values
    if (key === 'theme') {
      // For theme, we know it's a simple string like "light" or "dark"
      return item || defaultValue;
    }
    
    return safeJsonParse(item, defaultValue);
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
export function setStoredItem(key, value) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return false;
  }
    try {
    // Don't store undefined values
    if (value === undefined) {
      console.warn(`Attempted to store undefined value for key '${key}'`);
      return false;
    }
    
    // Special handling for known string keys
    if (key === 'theme') {
      // For theme, we know it should be a simple string "light" or "dark"
      localStorage.setItem(key, value);
      return true;
    }
    
    // Convert to JSON string unless it's already a string
    const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
    
    // Check if it's trying to store "undefined" string
    if (valueToStore === "undefined") {
      console.warn(`Attempted to store "undefined" string for key '${key}'`);
      return false;
    }
    
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
export function removeStoredItem(key) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
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
