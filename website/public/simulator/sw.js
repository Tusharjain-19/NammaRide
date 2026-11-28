/* @copyright 2026 Tushar Jain — NammaRide (https://www.nammaride.site/) — Personal & Non-Commercial Use Only */
const CACHE_NAME = 'nammaride-offline-v2.0.0-pwa1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './manifest.json',
  './css/base.css',
  './css/layout.css',
  './css/sections.css',
  './css/metro-route.css',
  './css/components.css',
  './js/libs/lucide.min.js',
  './js/libs/tailwind.min.js',
  './js/main.js',
  './js/pwa/installPrompt.js',
  './js/data/stations.js',
  './js/data/stationsMeta.js',
  './js/data/stationPlaces.js',
  './js/data/stationGates.js',
  './js/data/timings.js',
  './js/data/safety.js',
  './js/data/stationBoardImages.js',
  './js/data/scheduleData.js',
  './js/data/crowdHourly.js',
  './js/logic/scheduleEngine.js',
  './js/logic/pricing.js',
  './js/logic/trainTrackerEngine.js',
  './js/logic/notificationEngine.js',
  './js/logic/gpsValidator.js',
  './js/ui/dropdown.js',
  './js/ui/route.js',
  './js/ui/sections.js',
  './js/ui/boardingHud.js',
  './js/ui/ticketModals.js',
  './js/utils/helpers.js',
  './js/utils/fuzzySearch.js',
  './js/utils/i18n.js',
  './js/utils/storageManager.js',
  './assets/images/train.jpg',
  './assets/images/station.jpg',
  './assets/images/logo.png',
  './assets/images/logo_app.png',
  './assets/images/metro_train_marker.png',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',
  './assets/icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[NammaRide SW] Partial pre-cache error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => (key.startsWith('nammaride-') && key !== CACHE_NAME ? caches.delete(key) : Promise.resolve()))
      )
    )
  );
  self.clients.claim();
});

function networkWithTimeout(request, timeoutMs) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs))
  ]);
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Never intercept or cache cross-origin APIs / external tiles / third-party resources
  if (url.origin !== self.location.origin) return;

  // Navigation requests (e.g. /app/, /app/stations, /app/timings):
  // Network-First so fresh app HTML is preferred, falling back to cached app shell offline (no 404).
  if (event.request.mode === 'navigate') {
    event.respondWith(
      networkWithTimeout(event.request, 3000)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html', { ignoreSearch: true }))
    );
    return;
  }

  // Time-sensitive live overrides & JSON data: Network-First with fast timeout + cache fallback
  if (url.pathname.endsWith('live-overrides.json') || url.pathname.endsWith('.json')) {
    event.respondWith(
      networkWithTimeout(event.request, 2500)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return res;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true }))
    );
    return;
  }

  // Static data modules & lightweight icons/images: Cache-First (skip huge non-essential media)
  const isDataOrMedia =
    url.pathname.includes('/js/data/') ||
    url.pathname.includes('/assets/');

  if (isDataOrMedia) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          const contentLen = Number(networkResponse.headers.get('content-length') || 0);
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic' &&
            contentLen < 1500000
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // App shell (HTML, JS, CSS, Manifest): Stale-While-Revalidate without duplicating query-busted entries
  const isShellAsset =
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.webmanifest');

  if (isShellAsset) {
    const cleanUrl = url.origin + url.pathname;
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(cleanUrl).then((cachedResponse) => {
          const networkPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                cache.put(cleanUrl, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);

          return cachedResponse || networkPromise;
        })
      )
    );
    return;
  }

  // Default fallback: network with cache fallback (do not bloat cache with unknown paths)
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || './';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && (client.url.includes('/app/') || client.url.includes('/simulator/')) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
      return undefined;
    })
  );
});
