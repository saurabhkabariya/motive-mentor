"use client";
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/app/themecontext';
import FallbackAd from './FallbackAd';

export default function IsolatedAdBanner({ className = "" }) {
  const { darkMode } = useTheme();
  const iframeRef = useRef(null);
  const [adStatus, setAdStatus] = useState('loading');
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    // Generate a unique ID for this ad instance
    const adId = Math.random().toString(36).substring(2, 10);
    
    // Safety timeout to detect if ad loading is taking too long
    const safetyTimeout = setTimeout(() => {
      if (adStatus === 'loading') {
        console.log('Ad loading timeout');
        setAdStatus('error');
      }
    }, 5000);
    
    // Process messages from the iframe
    const handleMessage = (event) => {
      if (!event.data || typeof event.data !== 'object' || !event.data.type) {
        return;
      }
      
      if (event.data.type === 'AD_ERROR') {
        console.log('Ad error received from iframe:', event.data.message);
        setAdStatus('error');
        
        // Retry once
        if (retryCount < 1) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1500);
        }
      } else if (event.data.type === 'AD_LOADED') {
        console.log('Ad loaded in iframe');
        setAdStatus('loaded');
        
        // Check if ad content actually rendered (delayed check)
        setTimeout(() => {
          if (!iframeRef.current) return;
          
          try {
            const iframeWindow = iframeRef.current.contentWindow;
            if (!iframeWindow || !iframeWindow.document) return;
            
            const container = iframeWindow.document.getElementById(`container-c15e52fecd46f66a1527e583531cbb4a-${adId}`);
            if (container && container.children.length === 0) {
              console.log('Ad did not render content in iframe');
              setAdStatus('error');
            }
          } catch (error) {
            console.error('Error checking iframe content:', error);
          }
        }, 3000);
      }
    };
    
    // Add message listener
    window.addEventListener('message', handleMessage);
    
    // Initialize the iframe with ad content if it exists
    const initializeIframe = () => {
      if (!iframeRef.current) return;
      
      try {
        // Create HTML content for the iframe that loads the ad script
        const iframeContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body {
                margin: 0;
                padding: 0;
                background-color: ${darkMode ? '#1f2937' : '#f3f4f6'};
                color: ${darkMode ? '#e5e7eb' : '#111827'};
                font-family: Arial, sans-serif;
                overflow: hidden;
              }
              #ad-container {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .error-message {
                font-size: 12px;
                color: ${darkMode ? '#9ca3af' : '#6b7280'};
                text-align: center;
              }
            </style>
            <script>
              // Create a custom error handler
              window.onerror = function(message, source, lineno, colno, error) {
                // Tell the parent frame about the error
                window.parent.postMessage({
                  type: 'AD_ERROR',
                  message: message
                }, '*');
                return true; // Prevent default error handling
              };
              
              // Tell the parent when we're done loading
              window.onload = function() {
                window.parent.postMessage({
                  type: 'AD_LOADED'
                }, '*');
              };
            </script>
          </head>
          <body>
            <div id="ad-container">
              <div id="container-c15e52fecd46f66a1527e583531cbb4a-${adId}"></div>
            </div>
            <script async="async" data-cfasync="false" src="//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js"></script>
          </body>
          </html>
        `;
        
        // Get the iframe window
        const iframeWindow = iframeRef.current.contentWindow;
        if (!iframeWindow) {
          throw new Error('Could not access iframe window');
        }
        
        // Write content to the iframe
        const iframeDoc = iframeWindow.document;
        iframeDoc.open();
        iframeDoc.write(iframeContent);
        iframeDoc.close();
      } catch (error) {
        console.error('Error initializing iframe:', error);
        setAdStatus('error');
      }
    };
    
    // Initialize the iframe after a short delay to ensure it's mounted
    const initTimeout = setTimeout(() => {
      initializeIframe();
    }, 100);
    
    // Cleanup function
    return () => {
      clearTimeout(safetyTimeout);
      clearTimeout(initTimeout);
      window.removeEventListener('message', handleMessage);
    };
  }, [darkMode, retryCount, adStatus]);
  
  // If the ad failed to load after retry, show the fallback ad
  if (adStatus === 'error' && retryCount >= 1) {
    return <FallbackAd className={className} />;
  }
  
  return (
    <div 
      className={`isolated-ad-container w-full mx-auto my-4 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow-sm ${className}`}
      style={{ maxWidth: '100%', minHeight: '90px', position: 'relative' }}
    >
      <iframe 
        ref={iframeRef}
        className="w-full"
        style={{ 
          border: 'none', 
          height: '90px',
          width: '100%',
          overflow: 'hidden'
        }}
        title="Advertisement"
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
      
      {adStatus === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`animate-pulse h-3 w-1/2 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
        </div>
      )}
    </div>
  );
}