"use client";
import { useEffect } from 'react';
import { useTheme } from '@/app/themecontext';

export default function BottomAdContainer() {
  const { darkMode } = useTheme();
  
  useEffect(() => {
    // Create container with the exact ID required by the ad provider
    const container = document.createElement('div');
    container.id = "container-c15e52fecd46f66a1527e583531cbb4a";
    container.style.margin = '20px auto';
    container.style.maxWidth = '100%';
    container.style.padding = '10px';
    
    // Create a wrapper with proper dark/light mode styling
    const wrapper = document.createElement('div');
    wrapper.style.backgroundColor = darkMode ? '#121212' : '#FFFFFF';
    wrapper.style.color = darkMode ? '#E0E0E0' : '#212121';
    // wrapper.style.borderRadius = '8px';
    wrapper.style.boxShadow = darkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)';
    // wrapper.style.margin = '10px';
    wrapper.style.padding = '10px';
    wrapper.appendChild(container);
    
    // Find the footer element
    const footer = document.querySelector('footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(wrapper, footer);
    } else {
      // If footer not found, append to body
      document.body.appendChild(wrapper);
    }
    
    return () => {
      // Clean up
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    };
  }, [darkMode]); // Re-run when dark mode changes
  
  return null;
}
