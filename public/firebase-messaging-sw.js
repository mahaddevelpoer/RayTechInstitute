// Firebase Cloud Messaging Service Worker
// Enables receiving background push notifications when the tab is closed or minimized

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyBKyaUYaCQcdyG1Pwt3P8BUmoES3O0lIDQ',
  authDomain: 'raytechinstitute.firebaseapp.com',
  projectId: 'raytechinstitute',
  storageBucket: 'raytechinstitute.firebasestorage.app',
  messagingSenderId: '569755120405',
  appId: '1:569755120405:web:4944f4e14cc29602e66f1c',
};

firebase.initializeApp(firebaseConfig);

let messaging;
try {
  messaging = firebase.messaging();

  messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background notification: ', payload);
    const notificationTitle = payload.notification?.title || payload.data?.title || 'RayTech Educational Update';
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || 'New educational material is available on RayTech Institute.',
      icon: payload.notification?.icon || '/apple-touch-icon.png',
      badge: '/favicon-32x32.png',
      data: {
        url: payload.data?.url || payload.fcmOptions?.link || '/',
      },
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (err) {
  console.log('Firebase messaging not initialized in SW:', err);
}

// Handle notification click to open relevant link
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
