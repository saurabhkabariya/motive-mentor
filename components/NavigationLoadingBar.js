"use client";
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// This is the client component that uses hooks that need Suspense
export function NavigationLoadingBarClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prevPath, setPrevPath] = useState('');

  useEffect(() => {
    // Function to simulate progress
    let timer;
    let progressTimer;

    const startLoading = () => {
      setLoading(true);
      setProgress(0);
      
      // Quickly jump to 30% to give a sense of immediate progress
      timer = setTimeout(() => {
        setProgress(30);
        
        // Then slowly progress to 90% 
        progressTimer = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressTimer);
              return 90;
            }
            return prev + (Math.random() * 5);
          });
        }, 300);
      }, 50);
    };

    const completeLoading = () => {
      // Complete the loading animation
      setProgress(100);
      
      // After a short delay, hide the bar
      setTimeout(() => {
        setLoading(false);
        clearTimeout(timer);
        clearInterval(progressTimer);
      }, 300);
    };

    // If this is a navigation (not initial load)
    const currentPath = `${pathname}${searchParams}`;
    if (prevPath && prevPath !== currentPath) {
      startLoading();
      // Complete loading after a minimum time to ensure the bar is visible
      setTimeout(completeLoading, 500);
    }
    
    setPrevPath(currentPath);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [pathname, searchParams, prevPath]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50">
      <div 
        className="h-full bg-blue-500"
        style={{ 
          width: `${progress}%`,
          transition: 'width 0.3s ease-in-out'
        }}
      />
    </div>
  );
}

// This is the server component that wraps the client component
export default function NavigationLoadingBar() {
  return (
    <Suspense fallback={null}>
      <NavigationLoadingBarClient />
    </Suspense>
  );
}
