/* 
  Minimal Service Worker
  Purpose: PWA installability ONLY
  No offline support
  No caching
  No background sync
  No notifications
*/

self.addEventListener("install", (event) => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Take control of all clients immediately
  self.clients.claim();
});

/*
  IMPORTANT:
  - No fetch event listener
  - Browser handles everything normally
  - App behaves exactly like a website
  - But remains installable as a PWA
*/
