"use client";
import { useEffect, useRef } from 'react';

export default function RawAdBanner({ className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Create script element
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = "//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js";
      
      // Add script to the page
      document.body.appendChild(script);
      
      // Cleanup on unmount
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div className={`my-4 ${className}`}>
      <div id="container-c15e52fecd46f66a1527e583531cbb4a" ref={containerRef}></div>
    </div>
  );
}
