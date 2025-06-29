"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PSABanner from './PSABanner';

export default function PSAManager() {
  const pathname = usePathname();
  const [visiblePSAs, setVisiblePSAs] = useState([]);
  const [hasShownPSA, setHasShownPSA] = useState({});
  
  // Load PSA view history from localStorage
  useEffect(() => {
    const psaHistory = JSON.parse(localStorage.getItem('psaHistory') || '{}');
    setHasShownPSA(psaHistory);
  }, []);
  
  // Save PSA view history to localStorage
  const markPSAAsShown = (feature) => {
    const updatedHistory = { ...hasShownPSA, [feature]: true };
    setHasShownPSA(updatedHistory);
    localStorage.setItem('psaHistory', JSON.stringify(updatedHistory));
  };
  
  // Reset PSA history (for testing)
  const resetPSAHistory = () => {
    localStorage.removeItem('psaHistory');
    setHasShownPSA({});
  };
  
  // Determine which PSA to show based on current page
  useEffect(() => {
    let newPSAs = [];
    
    // If on goals page and hasn't seen the goals PSA
    if (pathname === '/goals' && !hasShownPSA['goals']) {
      newPSAs.push('goals');
      markPSAAsShown('goals');
    }
    
    // If on word game page and hasn't seen the word game PSA
    if (pathname === '/dailywordgame' && !hasShownPSA['wordgame']) {
      newPSAs.push('wordgame');
      markPSAAsShown('wordgame');
    }
    
    // If on chat/forum page and hasn't seen the forum PSA
    if (pathname === '/chat' && !hasShownPSA['forum']) {
      newPSAs.push('forum');
      markPSAAsShown('forum');
    }
    
    // If on saved quotes page and hasn't seen the quotes PSA
    if (pathname === '/saved-quotes' && !hasShownPSA['quotes']) {
      newPSAs.push('quotes');
      markPSAAsShown('quotes');
    }
    
    setVisiblePSAs(newPSAs);
  }, [pathname, hasShownPSA]);
  
  // Only show one PSA at a time
  if (visiblePSAs.length === 0) return null;
  
  return (
    <div className="container mx-auto px-4 pt-4 max-w-5xl">
      <PSABanner feature={visiblePSAs[0]} />
    </div>
  );
}
