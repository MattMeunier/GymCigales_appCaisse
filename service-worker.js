const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = ['/', '/index.html', '/styles.css', '/main.js']; // adapte à ton app

// Installation : mise en cache initiale
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
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
  self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  // Ignore les paramètres pour les fichiers HTML
  if (requestURL.pathname === '/' || requestURL.pathname === '/index.html') {
    event.respondWith(
      caches.match('/index.html').then(response => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  // Pour les autres fichiers, ignore les paramètres si présents
  const cleanRequest = event.request.url.split('?')[0];
  event.respondWith(
    caches.match(cleanRequest).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Communication avec les clients
self.addEventListener("message", event => {
  if (event.data === "clearStorage") {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage("clearLocalStorage");
      });
    });
  }
});
