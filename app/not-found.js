"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useTheme } from "@/app/themecontext";

// Client component that uses the theme
function NotFoundContent() {
  const { darkMode } = useTheme();
  
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h1 className="text-6xl font-bold mb-8">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-center max-w-md mb-8">
        We couldn't find the page you were looking for. It might have been moved, deleted, or never existed.
      </p>
      <div className="space-y-4">
        <Link
          href="/"
          className={`block w-full text-center px-6 py-3 rounded-lg ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white font-medium transition duration-200`}
        >
          Return Home
        </Link>
        <Link 
          href="/dailyquotes"
          className={`block w-full text-center px-6 py-3 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-800" : "bg-gray-200 hover:bg-gray-300"} font-medium transition duration-200`}
        >
          Get a Motivational Quote
        </Link>
      </div>
    </div>
  );
}

// Fallback UI when the client component is loading
function NotFoundFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-gray-100">
      <h1 className="text-6xl font-bold mb-8">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-center max-w-md mb-8">
        We couldn't find the page you were looking for.
      </p>
      <div className="space-y-4">
        <Link
          href="/"
          className="block w-full text-center px-6 py-3 rounded-lg bg-blue-500 text-white font-medium"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

// Main NotFound component with Suspense boundary
export default function NotFound() {
  return (
    <Suspense fallback={<NotFoundFallback />}>
      <NotFoundContent />
    </Suspense>
  );
}
