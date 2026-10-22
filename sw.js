/* Kin Fit service worker: offline app shell.
   Bump CACHE whenever the ?v= numbers in index.html change, so users get the new files. */
const CACHE = 'kinfit-v34';
const V = '?v=34';
const SHELL = [
  './', './index.html', './manifest.webmanifest',
  `./styles.css${V}`, `./fonts/fonts.css${V}`,
  './fonts/outfit-latin.woff2', './fonts/outfit-latin-ext.woff2',
  './fonts/dela-gothic-one-latin.woff2', './fonts/dela-gothic-one-kin.woff2',
  `./engine.js${V}`, `./circuits.js${V}`, `./i18n-data.js${V}`, `./i18n.js${V}`, `./meals.js${V}`, `./ai.js${V}`, `./ai-core.mjs${V}`, `./stickers.js${V}`, `./config.js${V}`, `./cloud.js${V}`, `./app.js${V}`,
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png', './images/kinfit-silk.jpg', './images/kinfit-silk-mobile.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('kinfit-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // Pages: network first, revalidated past the browser's HTTP cache so a new version shows up at once;
  // cached copy only when offline, and never a 404 page in its place.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req, { cache: 'no-cache' }).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); } return res; }).catch(() => caches.match('./index.html')));
    return;
  }
  // Files: cache first (versioned URLs), then network, stored for next time.
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; })));
});
