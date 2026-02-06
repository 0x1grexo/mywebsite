const CACHE_NAME = 'gregor_opmann-portfolio-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './images/favicon.png',
  './images/apple-touch-icon.png',
  './images/android-chrome-192x192.png',
  './images/android-chrome-512x512.png',
  './images/pc-build.png',
  './images/solar_powered_mini_fan.png',
  './images/line_follower.png',
  './images/neofetch.png',
  './images/game.png',
  './sounds/yougotmail.mp3',
  './docs/loovtoo_kiituskiri.pdf',
  './game.zip',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching files');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});