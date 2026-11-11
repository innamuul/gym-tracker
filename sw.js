/* Gym Tracker offline support.
   - App files (same origin): network first with a 4 s timeout, then the cached copy. Online you always get the newest
     version; at the gym with no signal the app still opens.
   - Fonts and exercise GIFs (CDNs): cache first, they never change. GIFs are cached on your phone as you view them
     (and the app pre-loads the ones in your routines); nothing is copied into the repo.
   Bump SHELL when the file list changes shape; ?v= bumps in index.html are picked up automatically. */
const SHELL = 'gym-shell-1', MEDIA = 'gym-media-1', MEDIA_MAX = 400;
const CDN = /^https:\/\/(cdn\.jsdelivr\.net|raw\.githubusercontent\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//;

self.addEventListener('install', ev => {
  ev.waitUntil((async () => {
    const c = await caches.open(SHELL);
    const html = await (await fetch('./', { cache: 'no-cache' })).text();
    const urls = ['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-180.png', 'data/extra/kegel.svg', 'data/extra/kegel-quick.svg', 'data/extra/plank-0.jpg', 'data/extra/plank-1.jpg'];
    html.replace(/(?:src|href)="([^"#:]+)"/g, (m, u) => { if (!urls.includes(u)) urls.push(u); });
    await Promise.all(urls.map(u => c.add(u).catch(() => { })));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', ev => {
  ev.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== SHELL && k !== MEDIA) await caches.delete(k);
    await self.clients.claim();
  })());
});

const timeout = (p, ms) => new Promise((res, rej) => { const t = setTimeout(() => rej(new Error('timeout')), ms); p.then(v => { clearTimeout(t); res(v); }, e => { clearTimeout(t); rej(e); }); });

async function networkFirst(req) {
  const c = await caches.open(SHELL);
  try {
    const r = await timeout(fetch(req), 4000);
    if (r.ok) c.put(req, r.clone());
    return r;
  } catch (e) {
    const hit = await c.match(req) || (req.mode === 'navigate' && await c.match('./')) || await c.match(req, { ignoreSearch: true });
    if (hit) return hit;
    throw e;
  }
}

async function cacheFirst(req) {
  const c = await caches.open(MEDIA), hit = await c.match(req);
  if (hit) return hit;
  const r = await fetch(req);
  if (r.ok || r.type === 'opaque') {
    await c.put(req, r.clone());
    c.keys().then(ks => { if (ks.length > MEDIA_MAX) ks.slice(0, ks.length - MEDIA_MAX).forEach(k => c.delete(k)); });
  }
  return r;
}

self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.method !== 'GET') return; // Google Sheet sync and backups go straight to the network
  const url = new URL(req.url);
  if (url.origin === location.origin) ev.respondWith(networkFirst(req));
  else if (CDN.test(req.url)) ev.respondWith(cacheFirst(req));
});
