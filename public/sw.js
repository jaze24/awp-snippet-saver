const DOCUMENT_CACHE = "document-cache";

self.addEventListener("install", (event) => {
  console.log("SW installed", event);
});

self.addEventListener("activate", (event) => {
  console.log("SW activated", event);
});

async function handleFetch(event) {
  // Serve HTML responses network-first
  if (event.request.destination === "document") {
    try {
      const documentCache = await caches.open(DOCUMENT_CACHE);
      const response = await fetch(event.request);
      if (response.status >= 200 && response.status < 400) {
        await documentCache.put(event.request, response.clone());
        return response;
      } else {
        return (
          (await documentCache.match(event.request)) ??
          new Response("Huh?", { status: 404 })
        );
      }
    } catch (error) {
      return (
        (await caches.match(event.request)) ??
        new Response("Huh?", { status: 404 })
      );
    }
  }

  return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  if (event.request.method.toLowerCase() !== "get") {
    return;
  }
  console.log(
    "Fetch: %s %s %s %o",
    event.request.method,
    event.request.url,
    event.request.destination,
    event.request
  );
  event.respondWith(handleFetch(event));
});
