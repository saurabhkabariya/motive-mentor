"use client";
import { useEffect, useId, useRef } from 'react';

export default function AdBanner({ className = "" }) {
  const containerRef = useRef(null);
  const uniqueId = useId();
  const instanceId = `ad-instance-${uniqueId.replace(/:/g, '')}`;

  useEffect(() => {
    if (!containerRef.current) return;

    // Mark this container with a data attribute for tracking
    containerRef.current.setAttribute('data-ad-instance', instanceId);
    
    // Ensure the ad script is loaded only once
    if (!document.querySelector('script[src="//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = "//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js";
      document.head.appendChild(script);
      
      console.log(`[${instanceId}] Ad script added to document`);
    } else {
      console.log(`[${instanceId}] Ad script already exists in document`);
    }
  }, [instanceId]);

  return (
    <div className={className} ref={containerRef}>
      {/* This is the exact div structure required by the ad provider */}
      <div id="container-c15e52fecd46f66a1527e583531cbb4a"></div>
    </div>
  );
}