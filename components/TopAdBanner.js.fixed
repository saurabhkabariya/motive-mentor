"use client";
import { useEffect } from 'react';
import { useTheme } from '@/app/themecontext';

export default function TopAdBanner() {
  const { darkMode } = useTheme();
  
  useEffect(() => {
    // Function to create and insert the top ad banner
    const createTopAdBanner = () => {
      // Create container for the ad with the exact ID required by the ad provider
      const container = document.createElement('div');
      container.id = "container-c15e52fecd46f66a1527e583531cbb4a";
      container.style.margin = '10px auto';
      container.style.maxWidth = '100%';
      container.style.textAlign = 'center';
      container.style.padding = '10px 0';
      
      // Create wrapper for the ad with proper dark/light mode styling
      const wrapper = document.createElement('div');
      wrapper.style.width = '100%';
      wrapper.style.backgroundColor = darkMode ? '#121212' : '#FFFFFF';
      wrapper.style.color = darkMode ? '#E0E0E0' : '#212121';
      wrapper.style.borderBottom = darkMode ? '1px solid #333333' : '1px solid #e5e5e5';
      wrapper.style.zIndex = '100';
      wrapper.style.borderRadius = '8px';
      wrapper.style.boxShadow = darkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)';
      wrapper.style.margin = '10px';
      wrapper.appendChild(container);
      
      // Insert at the top of the page
      const mainContent = document.querySelector('main');
      if (mainContent && mainContent.parentNode) {
        mainContent.parentNode.insertBefore(wrapper, mainContent);
      }
      
      // Return the wrapper for cleanup
      return wrapper;
    };
    
    // Create the banner immediately or wait for the page to be fully loaded
    let wrapper;
    if (document.readyState === 'complete') {
      wrapper = createTopAdBanner();
    } else {
      const loadHandler = () => {
        wrapper = createTopAdBanner();
      };
      window.addEventListener('load', loadHandler);
      
      // Clean up event listener if component unmounts before load
      return () => {
        window.removeEventListener('load', loadHandler);
        if (wrapper && wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper);
        }
      };
    }
    
    // Clean up when component unmounts or dark mode changes
    return () => {
      if (wrapper && wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    };
  }, [darkMode]); // Re-run when dark mode changes
  
  return null;
}
