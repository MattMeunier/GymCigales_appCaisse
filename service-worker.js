const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = ['/', '/index.html', '/styles.css', '/main.js']; // adapte à ton app

// Installation : mise en cache initiale
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activation : nettoyage conditionnel
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});


self.addEventListener("message", event => {
  if (event.data === "clearStorage") {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage("clearLocalStorage");
      });
    });
  }
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => caches.delete(key)));
    })
  );
});
