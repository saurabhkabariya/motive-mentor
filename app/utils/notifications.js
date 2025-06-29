"use client";

/**
 * Request permission to show browser notifications
 * @returns {boolean} - Whether permission is granted
 */
export function requestNotificationPermission() {
  // Check if the browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return false;
  }
  
  // Check if permission is already granted
  if (Notification.permission === "granted") {
    return true;
  }
  
  // Otherwise, ask the user for permission
  if (Notification.permission !== "denied") {
    try {
      Notification.requestPermission().then(function (permission) {
        // Store the permission in localStorage for reference
        localStorage.setItem('notificationPermission', permission);
        
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          return true;
        }
      });
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  }
  
  return Notification.permission === "granted";
}

/**
 * Check if notifications are supported and enabled
 * @returns {boolean} - Whether notifications can be used
 */
export function canUseNotifications() {
  return (
    "Notification" in window && 
    Notification.permission === "granted"
  );
}

/**
 * Show a browser notification with fallback handling
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 * @returns {Notification|null} - The notification object or null
 */
export function showBrowserNotification(title, options = {}) {
  // Check browser support
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return null;
  }
  
  // Check permission
  if (Notification.permission === "granted") {
    try {
      // Create the notification
      const notification = new Notification(title, {
        body: options.body || "",
        icon: options.icon || "/favicon.ico",
        ...options
      });
      
      // Add click event if provided
      if (options.onClick) {
        notification.onclick = options.onClick;
      } else {
        // Default click behavior - focus the window
        notification.onclick = function() {
          window.focus();
          if (options.url) {
            window.location.href = options.url;
          }
          notification.close();
        };
      }
      
      // Add close event if provided
      if (options.onClose) {
        notification.onclose = options.onClose;
      }
      
      // Auto-close after timeout if specified
      if (options.timeout && typeof options.timeout === 'number') {
        setTimeout(() => {
          notification.close();
        }, options.timeout);
      }
      
      return notification;
    } catch (error) {
      console.error("Error showing notification:", error);
      return null;
    }
  } else if (Notification.permission !== "denied") {
    // We need to ask permission
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        return showBrowserNotification(title, options);
      }
      return null;
    });
  }
  
  return null;
}

/**
 * Schedule a notification to be shown later
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 * @param {number} delayMs - Delay in milliseconds
 * @returns {number} - Timer ID for cancellation
 */
export function scheduleNotification(title, options = {}, delayMs) {
  return setTimeout(() => {
    showBrowserNotification(title, options);
  }, delayMs);
}

/**
 * Try to use the Push API for more reliable notifications
 * Requires service worker support
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 * @returns {Promise<boolean>} - Whether the push was successful
 */
export async function tryPushNotification(title, options = {}) {
  // Check if Push API and service worker are supported
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    
    // Fall back to regular notifications
    showBrowserNotification(title, options);
    return false;
  }
  
  try {
    // Get registration
    const registration = await navigator.serviceWorker.ready;
    
    // Check if we have permission
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return false;
    }
    
    // Show notification via service worker
    await registration.showNotification(title, {
      body: options.body || "",
      icon: options.icon || "/favicon.ico",
      data: options.data || {},
      ...options
    });
    
    return true;
  } catch (error) {
    console.error('Error showing push notification:', error);
    
    // Fall back to regular notifications
    showBrowserNotification(title, options);
    return false;
  }
}
