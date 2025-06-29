"use client";
import { useEffect, useRef } from 'react';
import { useTheme } from '@/app/themecontext';

export default function DirectAdBanner({ className = "" }) {
  const { darkMode } = useTheme();
  const adContainerRef = useRef(null);
  
  return (
    <div 
      className={`ad-container w-full mx-auto my-4 p-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow-sm ${className}`}
      style={{ maxWidth: '100%', minHeight: '100px' }}
      ref={adContainerRef}
    >
      <div 
        id="container-c15e52fecd46f66a1527e583531cbb4a"
        className="flex justify-center items-center w-full"
      >
        {/* The ad will be injected here by the external script */}
      </div>
    </div>
  );
}
