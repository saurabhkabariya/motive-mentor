// This is the service worker file that will handle background notifications
self.addEventListener('install', event => {
  console.log('Service Worker installed');
  // Skip waiting forces the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated');
  // Claim clients so that the service worker is in control of pages as soon as it's active
  event.waitUntil(clients.claim());
});

// Listen for push notifications
self.addEventListener('push', event => {
  try {
    // Try to parse the data as JSON, but handle the case where it's not JSON
    let data;
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'Motive Mentor',
        message: event.data ? event.data.text() : 'New notification'
      };
    }
    
    const options = {
      body: data.message || data.body || 'You have a new notification',
      icon: data.icon || '/favicon.ico',
      badge: '/favicon.ico',
      data: {
        url: data.url || '/',
        goalId: data.goalId,
        type: data.type
      },
      actions: [],
      // Add vibration pattern for mobile devices
      vibrate: [100, 50, 100],
      // Make it require interaction on desktop to not disappear automatically
      requireInteraction: data.requireInteraction || false
    };
    
    // Add specific actions based on notification type
    if (data.type === 'deadline' || data.type === 'overdue') {
      options.actions.push({
        action: 'view',
        title: 'View Goal'
      });
    }
    
    if (data.type === 'streak') {
      options.actions.push({
        action: 'check-in',
        title: 'Check In'
      });
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Motive Mentor', options)
    );
  } catch (error) {
    console.error('Error handling push event:', error);
    // Show a fallback notification
    event.waitUntil(
      self.registration.showNotification('Motive Mentor', {
        body: 'You have a new notification',
        icon: '/favicon.ico'
      })
    );
  }
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Get the notification data
  const data = event.notification.data || {};
  const url = data.url || '/goals';
  const goalId = data.goalId;
  const notificationType = data.type;
  
  // Handle notification action clicks
  let targetUrl = url;
  if (event.action === 'view' && goalId) {
    targetUrl = `/goals?id=${goalId}`;
  } else if (event.action === 'check-in') {
    targetUrl = '/goals?action=checkin';
  }
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({
      type: "window"
    }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          
          // Post a message to the client to handle the notification click
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            data: {
              url: targetUrl,
              goalId: goalId,
              notificationType: notificationType,
              action: event.action
            }
          });
          
          // If we're already on the right domain, navigate using the client
          if (new URL(client.url).origin === new URL(targetUrl).origin) {
            if ('navigate' in client) {
              return client.navigate(targetUrl);
            }
            return client;
          }
        }
      }
      
      // If no existing client or we need to navigate to a different domain
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Handle incoming messages from the application
self.addEventListener('message', event => {
  const data = event.data;
  
  if (data.type === 'SCHEDULE_NOTIFICATION') {
    // Schedule a notification to be shown later
    const { title, options, delay } = data;
    
    setTimeout(() => {
      self.registration.showNotification(title, options);
    }, delay);
    
    // Respond to confirm receipt
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({ success: true });
    }
  }
});

// Listen for network requests that might need special handling
self.addEventListener('fetch', event => {
  // Just pass through for now - we're not caching anything
  // but this could be expanded later for offline support
});
