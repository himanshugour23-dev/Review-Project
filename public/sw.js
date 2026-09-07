
self.addEventListener("install", (event) => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Take control of all clients immediately
  self.clients.claim();
});

