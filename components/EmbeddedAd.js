"use client";
import { useEffect } from 'react';

export default function EmbeddedAd() {
  useEffect(() => {
    // Wait for DOM to be ready
    const adContainer = document.createElement('div');
    adContainer.id = 'container-c15e52fecd46f66a1527e583531cbb4a';
    adContainer.style.margin = '20px auto';
    adContainer.style.maxWidth = '100%';
    
    // Create ad script
    const adScript = document.createElement('script');
    adScript.async = true;
    adScript.setAttribute('data-cfasync', 'false');
    adScript.src = '//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js';
    
    // Add to DOM at the desired position
    document.querySelector('main')?.appendChild(adContainer);
    document.querySelector('main')?.appendChild(adScript);
    
    return () => {
      // Clean up
      if (document.querySelector('main')?.contains(adContainer)) {
        document.querySelector('main')?.removeChild(adContainer);
      }
      if (document.querySelector('main')?.contains(adScript)) {
        document.querySelector('main')?.removeChild(adScript);
      }
    };
  }, []);
  
  return null;
}
