"use client";
import { useEffect } from 'react';

/**
 * AdDebugger Component
 * 
 * This utility component helps debug ad loading issues by:
 * 1. Counting the number of ad containers on the page
 * 2. Checking if the ad script is loaded properly
 * 3. Logging issues to the console
 */
export default function AdDebugger() {
  useEffect(() => {
    // Give the page time to fully load
    const timeout = setTimeout(() => {      console.log('======= AD DEBUGGER =======');
      
      // Check if ad script is loaded
      const scriptLoaded = !!document.querySelector('script[src="//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js"]');
      console.log('Ad Script Loaded:', scriptLoaded);
      
      // Count containers with the exact ID required by the ad provider
      const exactContainers = document.querySelectorAll('#container-c15e52fecd46f66a1527e583531cbb4a');
      console.log(`Found ${exactContainers.length} containers with the exact ID required by the ad provider`);
      
      // Check for any containers with similar IDs (which would be incorrect)
      const similarContainers = document.querySelectorAll('[id^="container-c15e52fecd46f66a1527e583531cbb4a"]:not([id="container-c15e52fecd46f66a1527e583531cbb4a"])');
      if (similarContainers.length > 0) {
        console.warn(`WARNING: Found ${similarContainers.length} containers with IDs that start with but don't exactly match the required ID`);
        console.warn('These containers will not work with the ad provider:');
        similarContainers.forEach(container => {
          console.warn(`- ${container.id}`);
        });      }
      
      // Check container visibility
      exactContainers.forEach((container, index) => {
        const rect = container.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        const isInViewport = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
        console.log(`Container ${index + 1}:`, 
          isVisible ? 'Visible' : 'Hidden',
          isInViewport ? 'In Viewport' : 'Outside Viewport',
          `Size: ${Math.round(rect.width)}x${Math.round(rect.height)}px`
        );
          // Check if container has content
        const hasContent = container.innerHTML.trim().length > 0 || container.children.length > 0;
        console.log(`Container ${index + 1} has content:`, hasContent);
      });
      
      console.log('=========================');
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return null; // This component doesn't render anything visible
}
