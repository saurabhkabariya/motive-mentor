"use client";
import { useEffect, useState } from 'react';
import { useTheme } from '@/app/themecontext';

export default function FallbackAd({ className = "" }) {
  const { darkMode } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simple timeout to simulate ad loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    // Use a different ad network as a fallback
    try {
      const script = document.createElement("script");
      script.src = "https://groleegni.net/401/9084854";
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        clearTimeout(timer);
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } catch (error) {
      console.error("Fallback ad script failed to load:", error);
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Sample fallback ad content - this could be a static banner or affiliate link
  return (
    <div 
      className={`fallback-ad w-full mx-auto my-4 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow-sm ${className}`}
      style={{ maxWidth: '100%', minHeight: '90px' }}
    >
      {isLoaded ? (
        <div className="w-full h-full flex items-center justify-center p-3">
          <a 
            href="https://amzn.to/3vHmYGZ" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`text-center w-full ${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:underline`}
          >
            <p className="font-medium">Recommended: Atomic Habits by James Clear</p>
            <p className="text-sm">Build better habits, break bad ones, transform your life</p>
          </a>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className={`animate-pulse h-3 w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
        </div>
      )}
    </div>
  );
}
