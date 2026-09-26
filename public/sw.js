// Xiaobai's service worker. Deliberately small: it shows reminder
// notifications and opens the app when one is tapped. It doesn't cache pages,
// so you never see stale study data.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || '小白 Xiaobai', {
      body: data.body || 'Time for a little Chinese.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: data.url || '/' },
      tag: 'daily-reminder',
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const open = windows.find((w) => 'focus' in w && 'navigate' in w);
      if (open) {
        try {
          // navigate() only works on pages this worker controls; if it
          // can't, fall through and open the page instead.
          await open.navigate(url);
          return open.focus();
        } catch {
          /* fall through */
        }
      }
      return self.clients.openWindow(url);
    })(),
  );
});
