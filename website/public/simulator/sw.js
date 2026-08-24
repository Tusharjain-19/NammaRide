const CACHE_NAME = 'nammaride-offline-v1.1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/layout.css',
  './css/sections.css',
  './js/main.js',
  './js/data/stations.js',
  './js/data/stationsMeta.js',
  './js/data/stationPlaces.js',
  './js/data/timings.js',
  './js/data/safety.js',
  './js/data/stationBoardImages.js',
  './js/ui/dropdown.js',
  './js/ui/route.js',
  './js/ui/sections.js',
  './js/utils/fuzzySearch.js',
  './js/utils/i18n.js',
  './assets/images/train.jpg',
  './assets/images/station.jpg',
  './assets/images/logo.png',
  './assets/images/logo_app.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[NammaRide SW] Pre-caching core offline assets');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[NammaRide SW] Partial pre-cache error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[NammaRide SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Serve cached content first, fallback to network and update cache
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update for fresh assets
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {/* Offline mode */});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // If offline and request is for an HTML page, return index.html
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
