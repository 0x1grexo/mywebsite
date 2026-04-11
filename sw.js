const CACHE_NAME = 'gregor_opmann-portfolio-v3.6';

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
  './docs/loovtoo_raport.pdf',
  './images/klassi_naljamees.png',
  './docs/srcdoc.pdf',
  './android_app.apk',
  './images/android_app.png',
  './terminal.html',
  './images/webb.png',
  './images/webb-dark.png',
  './images/dark.paths.png',
  './images/profile.png',
  './images/pov-fedora.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
          })
        )
      ),
      self.clients.claim(),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
