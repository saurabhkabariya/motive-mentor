"use client";

// This utility helps safely stringify a value for localStorage
function safeStringify(value) {
  // If it's already a string, return it directly
  if (typeof value === 'string') {
    return value;
  }
  
  // Handle special cases
  if (value === undefined || value === null) {
    return null;
  }
  
  // For other types, use JSON.stringify
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error("Error stringifying value:", error);
    return null;
  }
}

// Patch localStorage to handle errors and edge cases
(function patchLocalStorage() {
  // Only run in browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  
  try {
    // Store the original getItem method
    const originalGetItem = localStorage.getItem;
    
    // Override the getItem method
    localStorage.getItem = function(key) {
      try {
        const value = originalGetItem.call(localStorage, key);
        
        // Return null for undefined or "undefined" values
        if (value === undefined || value === "undefined" || value === null) {
          return null;
        }
        
        return value;
      } catch (error) {
        console.error(`Error in patched localStorage.getItem for key "${key}":`, error);
        return null;
      }
    };
      // Store the original setItem method
    const originalSetItem = localStorage.setItem;
    
    // Override the setItem method
    localStorage.setItem = function(key, value) {
      try {
        // Don't store undefined values
        if (value === undefined) {
          console.warn(`Prevented storing undefined value for key: ${key}`);
          return;
        }
        
        // Don't store the string "undefined"
        if (value === "undefined") {
          console.warn(`Prevented storing "undefined" string for key: ${key}`);
          return;
        }
        
        // Special handling for known simple string values
        if (key === 'theme') {
          originalSetItem.call(localStorage, key, value);
          return;
        }
        
        // Continue with the original method
        originalSetItem.call(localStorage, key, value);
      } catch (error) {
        console.error(`Error in patched localStorage.setItem for key "${key}":`, error);
      }
    };
    
    console.log("LocalStorage patched to prevent value errors");
  } catch (error) {
    console.error("Failed to patch localStorage:", error);
  }
})();
