"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Suspense } from 'react';

/**
 * A utility component that preloads pages that are likely to be visited next
 * based on the current page the user is on
 */
export function PagePreloaderClient() {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Define pages that should be preloaded based on current page
    const preloadMap = {
      '/': ['/goals', '/dailyquotes', '/books'],
      '/goals': ['/chat', '/'],
      '/books': ['/dailyquotes', '/'],
      '/dailyquotes': ['/saved-quotes', '/'],
      '/saved-quotes': ['/dailyquotes', '/'],
      '/chat': ['/goals', '/'],
      '/dailywordgame': ['/dailyquotes', '/'],
    };
    
    // Get pages to preload based on current path
    const pagesToPreload = preloadMap[pathname] || ['/'];
    
    // Preload each page
    const preloadTimeout = setTimeout(() => {
      pagesToPreload.forEach(path => {
        // Using router.prefetch is the official Next.js way, but it's not exposed in app router
        // Instead we can manually trigger a fetch for the page data
        fetch(`${path}`).catch(() => {
          // Ignore errors during preloading
        });
      });
    }, 1000); // Delay preloading to avoid affecting current page load
    
    return () => clearTimeout(preloadTimeout);
  }, [pathname, router]);
  
  // This component doesn't render anything
  return null;
}

// Server component wrapper with Suspense
export default function PagePreloader() {
  return (
    <Suspense fallback={null}>
      <PagePreloaderClient />
    </Suspense>
  );
}
