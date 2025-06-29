"use client";
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/app/themecontext';
import FallbackAd from './FallbackAd';

export default function MobileAdBanner({ className = "" }) {
  const { darkMode } = useTheme();
  const adContainerRef = useRef(null);
  const [adStatus, setAdStatus] = useState('loading');
  const [isMobile, setIsMobile] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Check if we're on mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }
  }, []);
  
  // If the ad failed to load after retry, show the fallback ad
  if (adStatus === 'error' && retryCount >= 1) {
    return <FallbackAd className={className} />;
  }
  
  return (
    <div 
      className={`mobile-ad-container w-full mx-auto my-3 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow-sm ${className}`}
      style={{ 
        maxWidth: '100%', 
        minHeight: isMobile ? '50px' : '90px', 
        position: 'relative',
        fontSize: isMobile ? '0.85rem' : '1rem'
      }}
    >
      <div 
        id="container-c15e52fecd46f66a1527e583531cbb4a"
        ref={adContainerRef} 
        className="w-full h-full"
      ></div>
      {adStatus === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`animate-pulse h-2 w-1/3 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
        </div>
      )}
    </div>
  );
}
