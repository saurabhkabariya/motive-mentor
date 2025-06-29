"use client";
import { useEffect } from 'react';
import { requestNotificationPermission } from '@/app/utils/notifications';

export default function NotificationInitializer() {
  useEffect(() => {
    // Register service worker for notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
          
          // Request notification permission
          requestNotificationPermission();
          
          // Listen for messages from service worker (e.g., notification clicks)
          navigator.serviceWorker.addEventListener('message', event => {
            const { type, data } = event.data;
            
            if (type === 'NOTIFICATION_CLICK') {
              // Handle notification click, e.g., navigate to the relevant page
              console.log('Notification clicked:', data);
              
              // Example: Navigate to goals page if appropriate
              if (data.goalId && window.location.pathname !== '/goals') {
                window.location.href = '/goals';
              }
            }
          });
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
          
          // Still try to request notification permission even if SW fails
          requestNotificationPermission();
        });
    } else {
      // Service workers not supported, but still try to use notifications
      requestNotificationPermission();
    }
    
    // Check if we need to reload notification permission
    // (sometimes users change settings outside the app)
    if ("Notification" in window) {
      const checkPermission = () => {
        // Store the current value
        const currentPermission = localStorage.getItem('notificationPermission');
        
        // Get the new value
        const newPermission = Notification.permission;
        
        // If they're different, update localStorage
        if (currentPermission !== newPermission) {
          localStorage.setItem('notificationPermission', newPermission);
          
          // If permission was granted, we might want to register for push
          if (newPermission === 'granted') {
            console.log('Notification permission granted');
          }
        }
      };
      
      // Check when the app loads
      checkPermission();
      
      // Also check when the window gets focus
      window.addEventListener('focus', checkPermission);
      
      // Clean up
      return () => {
        window.removeEventListener('focus', checkPermission);
      };
    }
  }, []);

  // This component doesn't render anything
  return null;
}
