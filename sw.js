/**
 * Service Worker for TIS Lab Computer PWA
 * Fast, reliable caching with Network-First strategy for HTML and smooth auto-updates
 */

// NOTE: CACHE_NAME is auto-updated by deploy.js on every deployment
const CACHE_NAME = "tislab-v2.1.20260925_072703";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/variables.css",
  "./css/layout.css",
  "./css/components.css",
  "./css/idcard.css",
  "./css/student-modal.css",
  "./js/config.js",
  "./js/data.js",
  "./js/exam_papers.js",
  "./js/auth.js",
  "./js/api.js",
  "./js/charts.js",
  "./js/services/telegram.js",
  "./js/components/sidebar.js",
  "./js/components/header.js",
  "./js/components/modals.js",
  "./js/views/login.js",
  "./js/views/student_portal.js",
  "./js/views/dashboard.js",
  "./js/views/register.js",
  "./js/views/directory.js",
  "./js/views/dropped.js",
  "./js/views/graduated.js",
  "./js/views/attendance.js",
  "./js/views/timetable.js",
  "./js/views/duration.js",
  "./js/views/exams.js",
  "./js/views/fees.js",
  "./js/views/certificates.js",
  "./js/views/resources.js",
  "./js/views/teachers.js",
  "./js/views/classes.js",
  "./js/views/subjects.js",
  "./js/views/rankings.js",
  "./js/views/idcards.js",
  "./js/views/documents.js",
  "./js/views/reports.js",
  "./js/views/settings.js",
  "./js/app.js",
  "./assets/images/default-male.svg",
  "./assets/images/default-female.svg"
];

// 1. Install: Pre-cache core application shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log("[Service Worker] Caching app shell assets into:", CACHE_NAME);
      // Cache assets individually to ensure one missing asset does not fail the whole cache
      await Promise.all(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[Service Worker] Skipping uncacheable asset: ${url}`, err);
          })
        )
      );
    })
  );
  // Force active immediately
  self.skipWaiting();
});

// 2. Activate: Purge older caches and claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Purging outdated cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(async () => {
      await self.clients.claim();
      // Notify all open tabs that a fresh version has activated
      const allClients = await self.clients.matchAll({ type: "window" });
      for (const client of allClients) {
        client.postMessage({ type: "SW_ACTIVATED", cacheName: CACHE_NAME });
      }
    })
  );
});

// 3. Message handler
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// 4. Fetch: Smart network-first for HTML, robust cache/revalidate for assets
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests or external APIs/Realtime Database
  if (
    request.method !== "GET" ||
    url.origin.includes("firebasedatabase.app") ||
    url.origin.includes("api.telegram.org") ||
    (url.origin.includes("googleapis.com") && url.pathname.includes("/v1/"))
  ) {
    return;
  }

  const isHtmlNavigation =
    request.mode === "navigate" ||
    (request.headers.get("accept") && request.headers.get("accept").includes("text/html"));

  // NETWORK-FIRST for HTML navigation (guarantees newest UI/layout on refresh when online)
  if (isHtmlNavigation) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Fallback to cache if offline
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match("./index.html");
        })
    );
    return;
  }

  const isCodeAsset = url.pathname.endsWith(".js") || url.pathname.endsWith(".css");

  // NETWORK-FIRST for code assets (JS and CSS) so edits show up immediately on refresh
  if (isCodeAsset) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match(request, { ignoreSearch: true });
        })
    );
    return;
  }

  // STALE-WHILE-REVALIDATE for media/fonts (images, svgs, icons)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});
