/* Optional offline shell. The game does not require a service worker. */
'use strict';
var CACHE = 'sunday-sudoku-__BUILD_ID__';
var FILES = ['./', './index.html', './icon.svg', './apple-touch-icon.png'];
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) { return cache.addAll(FILES); }));
});
self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) { return key.indexOf('sunday-sudoku-') === 0 && key !== CACHE; }).map(function (key) { return caches.delete(key); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(function (response) {
      if (!response.ok) throw new Error('Offline');
      return response;
    }).catch(function () { return caches.match('./index.html'); }));
  } else {
    event.respondWith(caches.match(event.request).then(function (cached) { return cached || fetch(event.request); }));
  }
});
