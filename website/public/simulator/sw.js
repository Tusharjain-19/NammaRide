const CACHE_NAME = 'nammaride-offline-v1.6.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/base.css',
  './css/layout.css',
  './css/sections.css',
  './css/metro-route.css',
  './css/components.css',
  './js/main.js',
  './js/data/stations.js',
  './js/data/stationsMeta.js',
  './js/data/stationPlaces.js',
  './js/data/stationGates.js',
  './js/data/timings.js',
  './js/data/safety.js',
  './js/data/stationBoardImages.js',
  './js/ui/dropdown.js',
  './js/ui/route.js',
  './js/ui/sections.js',
  './js/utils/fuzzySearch.js',
  './js/utils/i18n.js',
  './js/utils/storageManager.js',
  './assets/images/train.jpg',
  './assets/images/station.jpg',
  './assets/images/logo.png',
  './assets/images/logo_app.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[NammaRide SW v1.5.3] Pre-caching core offline assets');
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

  // Network-First for HTML, JS, CSS to guarantee fresh code without stale cache
  const isCodeAsset = url.pathname.endsWith('.html') || 
                      url.pathname.endsWith('.js') || 
                      url.pathname.endsWith('.css') ||
                      url.pathname === '/' ||
                      url.pathname.endsWith('/simulator/');

  if (isCodeAsset) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-First for static images and fonts
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
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
      });
    })
  );
});
