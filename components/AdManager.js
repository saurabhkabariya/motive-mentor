"use client";
import { useEffect } from 'react';

/**
 * AdManager Component
 * 
 * This component handles the global ad script loading and ensures
 * it's only loaded once regardless of how many ad containers are on the page.
 * This avoids duplicate script loading issues.
 */
export default function AdManager() {
  useEffect(() => {
    // Function to load the ad script
    const loadAdScript = () => {
      // Check if the script is already loaded
      if (document.querySelector('script[src="//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js"]')) {
        return;
      }
      
      // Create the script element
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = "//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js";
      
      // Add a custom attribute to mark it as loaded by AdManager
      script.setAttribute('data-ad-manager', 'true');
      
      // Add to document head
      document.head.appendChild(script);
      
      console.log('Ad script loaded by AdManager');
    };
    
    // Monitor DOM changes to handle dynamically created containers
    const observeDOMChanges = () => {
      // Create a MutationObserver to watch for new ad containers
      const observer = new MutationObserver((mutations) => {
        // Check if any containers were added
        const adContainerAdded = mutations.some(mutation => {
          return Array.from(mutation.addedNodes).some(node => {
            if (node.id && node.id.startsWith('container-c15e52fecd46f66a1527e583531cbb4a')) {
              return true;
            }
            return false;
          });
        });
        
        // If a new container was added, make sure the script is loaded
        if (adContainerAdded) {
          loadAdScript();
        }
      });
      
      // Start observing the document body for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
      });
      
      return observer;
    };
    
    // Load the ad script when the document is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      loadAdScript();
      const observer = observeDOMChanges();
      
      // Clean up
      return () => {
        observer.disconnect();
      };
    } else {
      // If document is not ready, wait for it
      const handleLoad = () => {
        loadAdScript();
        const observer = observeDOMChanges();
        
        // Update the cleanup function
        cleanup = () => {
          observer.disconnect();
        };
      };
      
      window.addEventListener('DOMContentLoaded', handleLoad);
      
      // Initial cleanup function
      let cleanup = () => {
        window.removeEventListener('DOMContentLoaded', handleLoad);
      };
      
      // Return the cleanup function
      return () => {
        cleanup();
      };
    }
  }, []);
  
  return null;
}
