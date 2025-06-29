"use client";

import { getStoredItem, setStoredItem } from './storage';

/**
 * Stub function to maintain API compatibility - all operations now use localStorage
 * @param {Function} operation - The operation to execute (ignored)
 * @param {Function} onSuccess - Callback to execute on success
 * @param {Function} onError - Callback to execute on error (not used)
 */
export async function executeFirestoreOperation(operation, onSuccess, onError) {
  try {
    // Simulate success with a dummy result
    const result = {};
    if (onSuccess) {
      onSuccess(result);
    }
    return { success: true, data: result };
  } catch (error) {
    console.error("Operation failed:", error);
    if (onError) {
      onError(error);
    }
    return { success: false, error };
  }
}

/**
 * Stub function to maintain API compatibility
 * @param {Error} error - The error to check
 * @returns {boolean} - Always false since we don't use Firestore
 */
export function isPermissionError(error) {
  return false;
}

/**
 * Stub function to maintain API compatibility
 * @returns {Promise<boolean>} - Always returns true
 */
export async function testUserPermissions(db, userId, onPermissionDenied) {
  return true;
}

/**
 * Stub function that redirects to localStorage instead of Firestore
 * @param {Function} writeOperation - The write operation (ignored)
 * @param {object} db - Firestore database instance (ignored)
 * @param {string} userId - User ID
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback (not used)
 * @param {Function} onPermissionDenied - Specific callback for permission errors (not used)
 */
export async function safeFirestoreWrite(
  writeOperation,
  db,
  userId,
  onSuccess,
  onError,
  onPermissionDenied
) {
  // Always succeed since we're just using localStorage
  if (onSuccess) {
    onSuccess();
  }
  
  return { success: true };
}

/**
 * Helper function to mimic Firestore's arrayUnion behavior
 * @param {Array} array - The original array
 * @param  {...any} elements - Elements to add
 * @returns {Array} New array with elements added
 */
export function arrayUnion(array = [], ...elements) {
  return [...array, ...elements];
}

/**
 * Helper function to mimic Firestore's arrayRemove behavior
 * @param {Array} array - The original array
 * @param  {...any} elements - Elements to remove
 * @returns {Array} New array with elements removed
 */
export function arrayRemove(array = [], ...elements) {
  return array.filter(item => !elements.includes(item));
}
