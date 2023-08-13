// Définissez les noms de cache et les ressources à mettre en cache
const CACHE_NAME = "my-pwa-cache-v1";
const urlsToCache = [
  "/",
  // Ajoutez ici les autres ressources que vous souhaitez mettre en cache
];

// Installez le service worker et mettez en cache les ressources lors de son installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("Cache installation failed:", error);
      })
  );
});

// Interceptez les requêtes réseau et servez les ressources mises en cache si disponibles
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si la ressource est en cache, la renvoyer
      if (response) {
        return response;
      }

      // Sinon, effectuez la requête réseau et mettez en cache la réponse
      return fetch(event.request).then((response) => {
        // Assurez-vous que la réponse est valide
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clonez la réponse et ajoutez-la au cache
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Nettoyez les anciens caches lorsque le service worker est activé
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME;
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});
