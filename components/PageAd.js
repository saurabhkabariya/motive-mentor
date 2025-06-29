"use client";
import { useEffect } from 'react';

export default function PageAd({ className = "" }) {
  useEffect(() => {
    // Create div for ad container with the exact ID required by the ad provider
    const container = document.createElement('div');
    container.id = "container-c15e52fecd46f66a1527e583531cbb4a";
    container.style.maxWidth = '100%';
    container.style.margin = '1rem auto';
    container.style.overflow = 'hidden';
    
    // Add class if provided
    if (className) {
      className.split(' ').forEach(cls => {
        if (cls) container.classList.add(cls);
      });
    }
    
    // Append container to DOM
    document.body.appendChild(container);
    
    // Cleanup
    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, [className]);
  
  // Component doesn't render anything visible, it just injects the ad container
  return null;
}
