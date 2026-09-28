// Xiaobai's service worker: reminder notifications, and offline use.
//
// Offline: the app's code, audio and data files are kept after first use;
// pages are always fetched fresh when online, with the latest copy kept for
// when there's no connection. Pages can ask for things to be fetched ahead
// ({ type: 'warm', urls }), e.g. the next lesson and its audio. Answers given
// offline are kept by the page itself and sent later (lib/pending-progress).

const VERSION = 'v1';
const STATIC = `xb-static-${VERSION}`;
const MEDIA = `xb-media-${VERSION}`;
const PAGES = `xb-pages-${VERSION}`;
const OFFLINE_PAGE = '/offline';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((c) => c.add(OFFLINE_PAGE))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keep = [STATIC, MEDIA, PAGES];
      for (const key of await caches.keys()) {
        if (key.startsWith('xb-') && !keep.includes(key)) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

const isStatic = (url) => url.pathname.startsWith('/_next/static/');
const isMedia = (url) =>
  /^\/(audio|strokes|find-data)\//.test(url.pathname) ||
  /^\/(icon|apple-icon)/.test(url.pathname) ||
  url.pathname === '/manifest.webmanifest';
// Never cache: the API, sign-in, and Next's data requests for client navigation.
const isUncached = (url, request) =>
  url.pathname.startsWith('/api/') ||
  url.pathname === '/login' ||
  request.headers.get('RSC') === '1' ||
  url.searchParams.has('_rsc');

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isUncached(url, request)) return;

  if (isStatic(url)) event.respondWith(cacheFirst(STATIC, request));
  else if (url.pathname === '/audio/index.json') event.respondWith(networkFirst(MEDIA, request));
  else if (url.pathname.startsWith('/find-data/')) event.respondWith(staleWhileRevalidate(request));
  else if (isMedia(url)) event.respondWith(media(request));
  else if (request.mode === 'navigate') event.respondWith(page(request));
});

/** Build output is content-hashed, so a cached copy is always right. */
async function cacheFirst(cacheName, request) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) {
    await cache.put(request, res.clone());
    trim(cache, 500);
  }
  return res;
}

/** Old builds' files pile up; drop the oldest beyond `max`. */
async function trim(cache, max) {
  const keys = await cache.keys();
  for (const key of keys.slice(0, Math.max(0, keys.length - max))) await cache.delete(key);
}

/** Small files that change between versions (the audio index). */
async function networkFirst(cacheName, request) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    return (await cache.match(request)) || new Response('', { status: 504 });
  }
}

/** Big data files that rarely change: answer from the copy, refresh behind. */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(MEDIA);
  const hit = await cache.match(request);
  const fresh = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => null);
  return hit || (await fresh) || new Response('', { status: 504 });
}

/**
 * Audio and data: keep the whole file, and answer range requests (which audio
 * elements make, and which can't be stored as-is) by slicing the stored copy.
 */
async function media(request) {
  const cache = await caches.open(MEDIA);
  const key = request.url;
  let full = await cache.match(key);
  if (!full) {
    try {
      const res = await fetch(key);
      if (!res.ok) return res;
      await cache.put(key, res.clone());
      full = res;
    } catch {
      return new Response('', { status: 504, statusText: 'Offline' });
    }
  }
  const range = request.headers.get('Range');
  if (!range) return full;
  const buf = await full.clone().arrayBuffer();
  const size = buf.byteLength;
  const [, startText, endText] = /bytes=(\d*)-(\d*)/.exec(range) || [];
  let start;
  let end;
  if (!startText && endText) {
    // "bytes=-500": the last 500 bytes.
    start = Math.max(0, size - Number(endText));
    end = size - 1;
  } else {
    start = startText ? Number(startText) : 0;
    end = endText ? Math.min(Number(endText), size - 1) : size - 1;
  }
  if (start >= size || start > end) {
    return new Response('', { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': full.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}

/** Pages: the network when there is one (so data is fresh), else the last copy. */
async function page(request) {
  const cache = await caches.open(PAGES);
  try {
    const res = await fetch(request);
    if (res.ok && !res.redirected && res.headers.get('Content-Type')?.includes('text/html')) {
      cache.put(pageKey(request.url), res.clone());
    }
    return res;
  } catch {
    return (
      (await cache.match(pageKey(request.url))) ||
      (await cache.match(OFFLINE_PAGE)) ||
      new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
    );
  }
}

/** One copy per page, whatever the query string (?view=…, ?extra=…). */
const pageKey = (href) => {
  const url = new URL(href);
  return `${url.origin}${url.pathname}`;
};

/** Fetch ahead: pages go in the page cache, everything else in media. */
async function warm(urls) {
  for (const href of urls) {
    const url = new URL(href, self.location.origin);
    if (url.origin !== self.location.origin) continue;
    try {
      if (isMedia(url)) {
        const cache = await caches.open(MEDIA);
        if (await cache.match(url.href)) continue;
        const res = await fetch(url.href);
        if (res.ok) await cache.put(url.href, res);
      } else {
        const res = await fetch(url.href, { credentials: 'same-origin' });
        if (res.ok && !res.redirected && res.headers.get('Content-Type')?.includes('text/html')) {
          await (await caches.open(PAGES)).put(pageKey(url.href), res.clone());
          const html = await res.text();
          // The page needs its build's code to run offline...
          await warmStatic(html);
          // ...and a saved lesson is one particular shuffle: fetch its audio.
          if (url.pathname.startsWith('/learn/')) await warmAudioIn(html);
        }
      }
    } catch {
      // Offline or failed: try again next time.
    }
  }
}

/** The JS and CSS a saved page loads (content-hashed, so kept for good). */
async function warmStatic(html) {
  const cache = await caches.open(STATIC);
  // (Inside the page's script data they end in an escaped quote, hence the \\.)
  const urls = new Set(html.match(/\/_next\/static\/[^"'\s\\)]+/g) || []);
  for (const path of urls) {
    const href = new URL(path, self.location.origin).href;
    if (await cache.match(href)) continue;
    try {
      const res = await fetch(href);
      if (res.ok) await cache.put(href, res);
    } catch {
      return;
    }
  }
}

/** Same rule as clipKey() in lib/audio-clips.ts: no spaces or punctuation. */
const clipKey = (text) => text.normalize('NFC').replace(/[\s\p{P}\p{S}]/gu, '');
const CJK = /[㐀-鿿]/;

/** Fetch the recordings for every Chinese text in a saved lesson page. */
async function warmAudioIn(html) {
  // The page carries its lesson as data: "hanzi":"…" and tiles' "text":"…".
  const texts = new Set();
  // (Inside the page's script data the quotes are escaped: \"hanzi\":\"…\".)
  for (const m of html.matchAll(/\\?"(?:hanzi|text)\\?":\\?"([^"\\]+)/g)) {
    if (CJK.test(m[1])) texts.add(m[1]);
  }
  if (texts.size === 0) return;
  const indexRes = await networkFirst(MEDIA, new Request('/audio/index.json'));
  if (!indexRes.ok) return;
  const { clips } = await indexRes.json();
  // A lone character may also have per-reading clips ("吗|ma").
  const files = [];
  for (const text of texts) {
    if (clips[clipKey(text)]) files.push(clips[clipKey(text)]);
    if ([...text].length === 1) {
      for (const [key, file] of Object.entries(clips))
        if (key.startsWith(`${text}|`)) files.push(file);
    }
  }
  const cache = await caches.open(MEDIA);
  for (const file of new Set(files)) {
    const href = new URL(
      `/audio/${file.split('/').map(encodeURIComponent).join('/')}`,
      self.location.origin,
    ).href;
    if (await cache.match(href)) continue;
    try {
      const res = await fetch(href);
      if (res.ok) await cache.put(href, res);
    } catch {
      return;
    }
  }
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'warm' && Array.isArray(event.data.urls)) {
    event.waitUntil(warm(event.data.urls.slice(0, 400)));
  }
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || '小白 Xiaobai', {
      body: data.body || 'Time for a little Chinese.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: data.url || '/' },
      tag: 'daily-reminder',
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const open = windows.find((w) => 'focus' in w && 'navigate' in w);
      if (open) {
        try {
          // navigate() only works on pages this worker controls; if it
          // can't, fall through and open the page instead.
          await open.navigate(url);
          return open.focus();
        } catch {
          /* fall through */
        }
      }
      return self.clients.openWindow(url);
    })(),
  );
});
