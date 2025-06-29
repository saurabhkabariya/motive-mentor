"use client";
import { useEffect, useRef } from 'react';
import { useTheme } from '@/app/themecontext';
import Script from 'next/script';

export default function SimpleAdBanner({ className = "" }) {
  const { darkMode } = useTheme();
  const containerRef = useRef(null);
  
  return (
    <div 
      className={`ad-container w-full mx-auto my-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow-sm ${className}`}
      style={{ maxWidth: '100%', minHeight: '100px' }}
    >
      <div id="container-c15e52fecd46f66a1527e583531cbb4a" ref={containerRef}></div>
      <Script
        id={`ad-script-${Math.random().toString(36).substring(2, 9)}`}
        strategy="afterInteractive"
        async="async"
        data-cfasync="false"
        src="//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js"
      />
    </div>
  );
}
