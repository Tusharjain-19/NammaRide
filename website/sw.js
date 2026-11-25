const CACHE_NAME = 'nammaride-offline-v2.0.0';
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
  './js/data/scheduleData.js',
  './js/data/crowdHourly.js',
  './js/logic/scheduleEngine.js',
  './js/ui/dropdown.js',
  './js/ui/route.js',
  './js/ui/sections.js',
  './js/utils/helpers.js',
  './js/utils/fuzzySearch.js',
  './js/utils/i18n.js',
  './js/utils/storageManager.js',
  './assets/images/train.jpg',
  './assets/images/station.jpg',
  './assets/images/logo.png',
  './assets/images/logo_app.png',
  './assets/images/metro_train_marker.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[NammaRide SW v1.8.0] Partial pre-cache error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : Promise.resolve()))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (url.pathname.endsWith('live-overrides.json')) {
    event.respondWith(
      Promise.race([
        fetch(event.request).then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return res;
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500))
      ]).catch(() => caches.match(event.request))
    );
    return;
  }

  const isDataOrMedia =
    url.pathname.includes('/js/data/') ||
    url.pathname.includes('/assets/') ||
    url.pathname.endsWith('.json');

  if (isDataOrMedia) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  const isShellAsset =
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname === '/' ||
    url.pathname.endsWith('/simulator/');

  if (isShellAsset) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cachedResponse) => {
          const networkPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
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

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request))
  );
});
