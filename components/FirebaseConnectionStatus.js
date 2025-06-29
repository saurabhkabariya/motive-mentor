"use client";

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

/**
 * A hook to detect Firebase connectivity issues
 * @returns {{isConnected: boolean, lastError: Error|null}}
 */
export function useFirebaseConnection() {
  const [isConnected, setIsConnected] = useState(true);
  const [lastError, setLastError] = useState(null);
  const [checkedConnection, setCheckedConnection] = useState(false);

  useEffect(() => {
    // Don't run on server
    if (typeof window === 'undefined') return;

    let timeoutId;
    let unsubscribe;

    const checkConnection = async () => {      try {
        // Try to connect to Firebase Auth (lightweight operation)
        const auth = getAuth();
        
        // Set up a timeout for the connection check
        const connectionPromise = new Promise((resolve, reject) => {
          unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
              // Connection successful (whether user is signed in or not)
              resolve(true);
            },
            (error) => {
              reject(error);
            }
          );
          
          // Timeout after 10 seconds
          timeoutId = setTimeout(() => {
            reject(new Error('Firebase connection timeout'));
          }, 10000);
        });
        
        await connectionPromise;
        setIsConnected(true);
        setLastError(null);
      } catch (error) {
        console.error('Firebase connection error:', error);
        setIsConnected(false);
        setLastError(error);
      } finally {
        clearTimeout(timeoutId);
        if (unsubscribe) unsubscribe();
        setCheckedConnection(true);
      }
    };

    checkConnection();

    // Recheck connection when window is online again
    const handleOnline = () => {
      setIsConnected(true);
      checkConnection();
    };

    window.addEventListener('online', handleOnline);
    
    return () => {
      clearTimeout(timeoutId);
      if (unsubscribe) unsubscribe();
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return { isConnected, lastError, checkedConnection };
}

/**
 * Provides a UI component for Firebase connection issues
 */
export default function FirebaseConnectionStatus() {
  const { isConnected, lastError, checkedConnection } = useFirebaseConnection();

  // Only show when we've confirmed there's a connection issue
  if (isConnected || !checkedConnection) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <h3 className="font-bold text-lg mb-2">Connection Error</h3>
      <p className="mb-2">
        We're having trouble connecting to our services. Some features may be unavailable.
      </p>
      <p className="text-sm opacity-80">
        {lastError?.message || 'Please check your internet connection and try again.'}
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-3 bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-100 transition-colors font-medium"
      >
        Retry
      </button>
    </div>
  );
}
