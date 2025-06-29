"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function FirebaseErrorHandler({ isVisible, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);
  
  if (!isVisible || dismissed) return null;
  
  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };
  
  return (
    <div className="fixed inset-x-0 bottom-0 pb-4 sm:pb-6 sm:inset-x-auto sm:right-0 sm:w-full sm:max-w-sm px-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-red-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Firebase Permission Error
              </p>
              <p className="mt-1 text-sm text-gray-500">
                We couldn't save your quote to the cloud due to permission issues. Your quote has been saved locally instead.
              </p>
              <div className="mt-3 flex space-x-3">
                <Link
                  href="/firebase-help"
                  className="inline-flex text-xs px-2 py-1.5 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Fix Permissions
                </Link>
                <button
                  onClick={handleDismiss}
                  className="inline-flex text-xs px-2 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
