"use client";
import { useEffect } from 'react';

export default function GlobalAdScript() {
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[src="//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js"]')) {
      console.log('Ad script already exists, skipping addition');
      return;
    }
    
    console.log('Adding global ad script to document head');
    
    // Create the ad script with the exact attributes required by the ad provider
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = "//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js";
    
    // Add the script to the document head
    document.head.appendChild(script);
    
    // No cleanup - we want the script to persist across page navigations
  }, []);
  
  // This component doesn't render anything visible
  return null;
}
