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
  '/components/VideoGenerator.tsx',
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
  // Serve cached content when offline
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      }
    )
  );
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
