/* Service worker de Rey Eterno.
   Sube el número de VERSION cuando quieras forzar que todos refresquen la caché. */
var VERSION = "rey-eterno-v3";
var BASE = [
  "./", "index.html", "manifest.webmanifest",
  "logo.png", "familia2.jpg", "motion.min.js", "reyconfig.js",
  "icon-192.png", "icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(VERSION).then(function (c) {
      /* allSettled: si falta un archivo no se cae la instalación */
      return Promise.allSettled(BASE.map(function (u) { return c.add(u); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function guardar(req, res) {
  if (res && res.ok && res.type === "basic") {
    var copia = res.clone();
    caches.open(VERSION).then(function (c) { c.put(req, copia); });
  }
  return res;
}

self.addEventListener("fetch", function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  if (url.origin !== location.origin) return;            /* Google Fonts, Maps, YouTube, etc. van directo */
  if (req.headers.has("range") || /\.(mp4|webm)$/i.test(url.pathname)) return; /* video: sin caché */

  /* Páginas y scripts: primero red (siempre lo más nuevo), caché si no hay internet */
  if (req.mode === "navigate" || /\.(html|js|json|webmanifest)$/i.test(url.pathname)) {
    e.respondWith(
      fetch(req).then(function (r) { return guardar(req, r); }).catch(function () {
        return caches.match(req).then(function (c) { return c || caches.match("index.html"); });
      })
    );
    return;
  }

  /* Imágenes y demás: caché al instante y se actualiza por detrás */
  e.respondWith(
    caches.match(req).then(function (c) {
      var red = fetch(req).then(function (r) { return guardar(req, r); }).catch(function () { return c; });
      return c || red;
    })
  );
});
