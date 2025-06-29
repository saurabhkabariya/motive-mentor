"use client";
import { useEffect } from 'react';

export default function RandomAdsInserter() {
  useEffect(() => {
    // Function to create ad container with the exact ID required by the ad provider
    const createAdContainer = () => {
      const container = document.createElement('div');
      container.id = 'container-c15e52fecd46f66a1527e583531cbb4a';
      container.style.margin = '20px auto';
      container.style.maxWidth = '100%';
      container.style.padding = '10px';
      container.style.backgroundColor = '#f9f9f9';
      container.style.borderRadius = '8px';
      return container;
    };
    
    // Insert ads after some main content elements
    const insertAds = () => {
      try {
        // Find potential spots to insert ads
        const potentialSpots = [
          ...document.querySelectorAll('section, article, .card, .my-4, .my-6, .my-8'),
        ].filter(el => el.offsetHeight > 200); // Only target larger elements
        
        // Select 1-2 random spots
        const numSpots = Math.min(2, Math.floor(potentialSpots.length / 3));
        const selectedIndexes = new Set();
        
        while (selectedIndexes.size < numSpots && potentialSpots.length > 0) {
          const randomIndex = Math.floor(Math.random() * potentialSpots.length);
          selectedIndexes.add(randomIndex);
        }
        
        // Insert ad containers at the selected spots
        selectedIndexes.forEach(index => {
          if (potentialSpots[index]) {
            const spot = potentialSpots[index];
            const adContainer = createAdContainer();
            spot.parentNode.insertBefore(adContainer, spot.nextSibling);
          }
        });
        
        // We don't need to add the script here as it's already added in layout.js
        // This prevents duplicate script loading
      } catch (error) {
        console.error('Error inserting random ads:', error);
      }
    };
    
    // Wait for the page to fully load before inserting ads
    if (document.readyState === 'complete') {
      insertAds();
    } else {
      window.addEventListener('load', insertAds);
    }
    
    return () => {
      window.removeEventListener('load', insertAds);
    };
  }, []);
  
  return null; // This component doesn't render anything
}
