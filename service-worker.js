const CACHE_NAME = 'game-sprite-ai-cache-v2'; // Bump version to ensure new worker is installed
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/services/geminiService.ts',
  '/components/SpriteGenerator.tsx',
  '/components/ImageEditor.tsx',
  '/components/ImageGenerator.tsx',
  '/components/ChatBot.tsx',
  '/components/ImageAnalyzer.tsx',
  '/components/Icon.tsx',
  '/components/common/ImageUploader.tsx',
  '/components/common/Spinner.tsx',
  '/components/common/Button.tsx'
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching assets');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache assets during install:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  // This is now a "network-only" strategy.
  // We are not attempting to serve from cache, effectively disabling offline mode for pages.
  // The browser will handle fetching from the network as usual.
  // We keep the fetch listener in case we want to add more complex logic later,
  // but for now, it doesn't intercept with a cache-first strategy.
  event.respondWith(fetch(event.request));
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});