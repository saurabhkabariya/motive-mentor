"use client";

import { useEffect, Suspense, useState } from "react";
import Link from "next/link";

// Client component with theme
function ErrorContent({ error, reset }) {
  // Since we're outside ThemeProvider context, use a simple state for dark mode
  const [darkMode, setDarkMode] = useState(false);
  
  // Check for dark mode preference on client
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
  }, []);
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  // Ensure reset is a function
  const handleReset = () => {
    if (typeof reset === 'function') {
      reset();
    } else {
      // Fallback if reset is not a function
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className={`max-w-md w-full p-6 rounded-lg shadow-lg text-center bg-opacity-80 backdrop-blur-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-6">
          We're sorry, but something unexpected happened. Our team has been notified.
        </p>
        <div className="space-y-4">
          <button
            onClick={handleReset}
            className={`w-full px-4 py-2 rounded ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition duration-200`}
          >
            Try again
          </button>
          <Link
            href="/"
            className={`block w-full px-4 py-2 rounded ${darkMode ? "bg-gray-700 hover:bg-gray-800" : "bg-gray-200 hover:bg-gray-300"} transition duration-200`}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Fallback UI when the client component is loading
function ErrorFallback({ reset }) {
  // Ensure reset is a function
  const handleReset = () => {
    if (typeof reset === 'function') {
      reset();
    } else {
      // Fallback if reset is not a function
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="max-w-md w-full p-6 rounded-lg shadow-lg text-center bg-white">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-6">
          We're sorry, but something unexpected happened.
        </p>
        <div className="space-y-4">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 rounded bg-blue-500 text-white transition duration-200"
          >
            Try again
          </button>
          <Link
            href="/"
            className="block w-full px-4 py-2 rounded bg-gray-200 transition duration-200"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<ErrorFallback reset={reset} />}>
          <ErrorContent error={error} reset={reset} />
        </Suspense>
      </body>
    </html>
  );
}
