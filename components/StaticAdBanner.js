"use client";
import { useEffect } from 'react';

export default function StaticAdBanner({ className = "" }) {
  useEffect(() => {
    // Make sure we don't duplicate the script
    const existingScript = document.querySelector('script[src="//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js"]');
    
    if (!existingScript) {
      // Create the ad script exactly as provided
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = "//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js";
      
      // Add to the document
      document.head.appendChild(script);
    }
  }, []);
  
  return (
    <div className={className}>
      {/* This is the exact div structure required by the ad provider */}
      <div id="container-c15e52fecd46f66a1527e583531cbb4a"></div>
    </div>
  );
}
