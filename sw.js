/* Service worker de Rey Eterno
   - La página y los scripts se piden primero a internet (así siempre ves la versión nueva de GitHub)
     y, si no hay señal, se abren desde la copia guardada.
   - Imágenes y fuentes se muestran al instante desde la copia y se actualizan en segundo plano.
   - Videos, Facebook, Google Maps y formularios NO se tocan.
   Para forzar que todos descarguen todo de nuevo, cambia el número de VERSION. */
const VERSION = 'rey-eterno-v2';
const SHELL = VERSION + '-shell';
const RUNTIME = VERSION + '-runtime';
const MAX_RUNTIME = 80; // máximo de archivos guardados además de lo básico

// Lo básico para que la página abra sin internet (si algún archivo no existe, se omite sin problema)
const PRECACHE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'logo.png',
  'apple-touch-icon.png',
  'motion.min.js',
  'reyconfig.js',
  'familia2.jpg',
  'familia3.jpg',
  'familia.jpg'
];

const FUENTES = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    await Promise.all(PRECACHE.map(async (url) => {
      try { await cache.add(new Request(url, { cache: 'reload' })); } catch (e) { /* archivo opcional */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const nombres = await caches.keys();
    await Promise.all(nombres.filter((n) => !n.startsWith(VERSION)).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

function guardable(res) {
  return res && (res.status === 200 || res.type === 'opaque');
}

async function recortar(cache) {
  const llaves = await cache.keys();
  if (llaves.length > MAX_RUNTIME) {
    await Promise.all(llaves.slice(0, llaves.length - MAX_RUNTIME).map((k) => cache.delete(k)));
  }
}

// Primero internet (con tiempo límite); si falla, la copia guardada
async function redPrimero(request, cacheName, esperaMs) {
  const cache = await caches.open(cacheName);
  try {
    const res = await Promise.race([
      fetch(request),
      new Promise((_, rechazar) => setTimeout(() => rechazar(new Error('lento')), esperaMs))
    ]);
    if (guardable(res)) cache.put(request, res.clone());
    return res;
  } catch (e) {
    const copia = (await cache.match(request, { ignoreSearch: true })) ||
                  (await caches.match(request, { ignoreSearch: true }));
    if (copia) return copia;
    throw e;
  }
}

// Mostrar la copia al instante y actualizarla en segundo plano
async function copiaYActualiza(request, event) {
  const cache = await caches.open(RUNTIME);
  const copia = await cache.match(request);
  const actualiza = fetch(request).then((res) => {
    if (guardable(res)) { cache.put(request, res.clone()).then(() => recortar(cache)); }
    return res;
  }).catch(() => null);
  if (copia) { event.waitUntil(actualiza); return copia; }
  const res = await actualiza;
  return res || Response.error();
}

const SIN_CONEXION = '<!doctype html><html lang="es-MX"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>Sin conexión | Rey Eterno</title>' +
  '<body style="font-family:system-ui,sans-serif;background:#1b0f33;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:1.5rem">' +
  '<div><h1 style="font-size:1.8rem;margin:0 0 .6rem">Sin conexión</h1>' +
  '<p style="opacity:.85;margin:0 0 1.2rem">No pudimos cargar la página. Revisa tu internet e inténtalo de nuevo.</p>' +
  '<button onclick="location.reload()" style="font:600 1rem system-ui;padding:.8rem 1.6rem;border-radius:999px;border:0;background:#d2a64a;color:#1b0f33">Reintentar</button></div></body></html>';

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;                       // formularios y envíos: no se tocan
  if (request.headers.has('range')) return;                   // video/audio por partes: no se tocan

  const url = new URL(request.url);
  const mismoOrigen = url.origin === self.location.origin;
  const esFuente = FUENTES.includes(url.hostname);
  if (!mismoOrigen && !esFuente) return;                      // Facebook, Maps, etc.: no se tocan
  if (mismoOrigen && /\.(mp4|webm|mov|mp3|m4a|ics)$/i.test(url.pathname)) return;

  // Páginas
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        return await redPrimero(request, SHELL, 4000);
      } catch (e) {
        const inicio = (await caches.match('index.html')) || (await caches.match('./'));
        return inicio || new Response(SIN_CONEXION, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
    })());
    return;
  }

  // Scripts, estilos, manifest y datos: siempre intentar la versión nueva
  const dest = request.destination;
  if (mismoOrigen && (dest === 'script' || dest === 'style' || dest === 'manifest' || /\.(json|webmanifest|js|css)$/i.test(url.pathname))) {
    event.respondWith(redPrimero(request, SHELL, 4000).catch(() => Response.error()));
    return;
  }

  // Imágenes, fuentes y lo demás
  event.respondWith(copiaYActualiza(request, event));
});
