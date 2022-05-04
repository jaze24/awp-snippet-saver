const DOCUMENT_CACHE = "document-cache";

self.addEventListener("install", (event) => {
  console.log("SW installed", event);
});

self.addEventListener("activate", (event) => {
  console.log("SW activated", event);
});

self.addEventListener("fetch", (event) => {
  console.log(
    "Fetch: %s %s %s %o",
    event.request.method,
    event.request.url,
    event.request.destination,
    event.request
  );

  // We only want to handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // HTML --------------------------------------------------
  // Cache-first, fallback to network (and then cache it)
  if (isHtmlRequest(event.request)) {
    event.respondWith(
      (async function () {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        const networkResponse = await fetch(event.request);
        if (networkResponse.ok) {
          const clonedResponse = networkResponse.clone();
          event.waitUntil(
            (async function () {
              const documentCache = await caches.open(DOCUMENT_CACHE);
              return documentCache.put(event.request, clonedResponse);
            })()
          );
        }
        return networkResponse;
      })()
    );
  }
});

function isHtmlRequest(request) {
  return request.destination === "document";
}
