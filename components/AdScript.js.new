"use client";
import { useEffect } from 'react';

// This component adds a container before the footer
export default function AdScript() {
  useEffect(() => {
    // Function to create and add the ad container
    const addAdContainer = () => {
      // Create the ad container with the exact ID required by the ad provider
      const container = document.createElement('div');
      container.id = 'container-c15e52fecd46f66a1527e583531cbb4a';
      container.style.margin = '1rem auto';
      container.style.maxWidth = '100%';
      container.style.display = 'flex';
      container.style.justifyContent = 'center';
      
      // Add to DOM before the footer
      const footer = document.querySelector('footer');
      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(container, footer);
      } else {
        document.body.appendChild(container);
      }
    };
    
    // If the document is already loaded, add the container immediately
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      addAdContainer();
    } else {
      // Otherwise, wait for the document to be ready
      document.addEventListener('DOMContentLoaded', addAdContainer);
    }
    
    // Clean up on unmount
    return () => {
      document.removeEventListener('DOMContentLoaded', addAdContainer);
      const container = document.getElementById('container-c15e52fecd46f66a1527e583531cbb4a');
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);
  
  return null; // This component doesn't render anything visible
}
